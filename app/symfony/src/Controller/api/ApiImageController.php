<?php

namespace App\Controller\api;

use App\Entity\Image;
use App\Service\FileGetter;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;


class ApiImageController extends AbstractController
{
    private EntityManagerInterface $em;
    private Serializer $serializer;
    private FileUploader $uploader;
    private FileGetter $fileGetter;
    public function __construct(
        EntityManagerInterface $EntityManager,
        FileUploader $FileUploader,
        FileGetter $FileGetter,
    )
    {
        $this->em = $EntityManager;
        $this->serializer = new Serializer([new ObjectNormalizer()]);

        $this->uploader = $FileUploader;
        $this->fileGetter = $FileGetter;
    }


    // We use BinaryFileResponse so PHP doenst load the file into memory, which could cause it to run out of memory
    #[Route('/api/image/get/file/{id}', name: 'api_get_image_file', methods: ['GET'])]
    public function getFile($id): BinaryFileResponse | JsonResponse
    {
        // Get image object
        $image = $this->em->getRepository(Image::class)->find($id);
        if(!$image){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Image niet geregistreerd in de database."
            ]);
        }


        // Get image file
        $result = $this->fileGetter->searchFiles(
            $image->getFileName(),
            $image->getFilePathWithoutFileName()
        );

        if(count($result) == 0 || $result[0]->isFile() == false){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Image bestand niet gevonden."
            ]);
        }

        $fileMimeType = mime_content_type($image->getFilePath());

        // Create response
        $response = new BinaryFileResponse($image->getFilePath());
        $response->headers->set('Cache-Control', 'private');
        $response->headers->set('Content-Type', $fileMimeType);
        $response->headers->set('Content-Disposition', $response->headers->makeDisposition(
            ResponseHeaderBag::DISPOSITION_INLINE,
            $image->getName()
        ));

        return $response;
    }

    #[Route('/api/image/get/{id}', name: 'api_get_image', methods: ['GET'])]
    public function get($id): JsonResponse
    {
        $image = $this->em->getRepository(Image::class)->find($id);
        if(!$image){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Image niet geregistreerd in de database."
            ]);
        }

        return new JsonResponse([
            "status" => "success",
            "image" => [
                "id" => $image->getId(),
                "name" => $image->getName(),
            ]
        ]);
    }

    #[Route('/api/image/get-all', name: 'api_get_all_image', methods: ['GET'])]
    public function getAll(): JsonResponse
    {
        $allImages = $this->em->getRepository(Image::class)->findAll();

        $collectedImages = [];
        foreach($allImages as $image){
            array_push($collectedImages, [
                "id" => $image->getId(),
                "name" => $image->getName(),
            ]);
        }

        // RETURN IMAGES
        return new JsonResponse([
            "status" => "success",
            "images" => $this->serializer->normalize($collectedImages, 'json')
        ]);
    }

    #[Route('/api/image/upload', name: 'api_upload_image', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        $file = $request->files->get("file");

        // Check if file is image
        if ($file instanceof UploadedFile) {
            $mimeType = $file->getMimeType();

            // Check if the file's MIME type starts with 'image/'
            if (strpos($mimeType, 'image/') !== 0) {
                return new JsonResponse(["status" => "failed", "message" => "Alleen image bestanden zijn toegestaan."]);
            }
        }else{
            return new JsonResponse([
                "status" => "failed",
                "message" => "Alleen upload-bare bestanden zijn toegestaan."
            ]);
        }

        $originalFileName = $file->getClientOriginalName();
        $path = $this->getParameter('kernel.project_dir')."/media/images/";

        $safeFileName = $this->uploader->upload($file, $path);
        if($safeFileName == ""){
            return new JsonResponse([
                "status" => "failed", 
                "message" => "Unknown error in api_image_controller."
            ]);
        }


        $origFileNameWithoutExtension = pathinfo($originalFileName, PATHINFO_FILENAME); // <-- Smart simple way to remove extension
        $imagePath = $path.$safeFileName;
        $image = new Image();
        $image->setName($origFileNameWithoutExtension);
        $image->setFileName($safeFileName);
        $image->setFilePath($imagePath);

        $this->em->persist($image);
        $this->em->flush();

        return new JsonResponse(["status" => "success", "message" => "Image is ge-upload!"]);
    }

    #[Route('/api/image/delete/{id}', name: 'api_delete_image', methods: ['POST'])]
    public function delete($id): JsonResponse
    {

        $image = $this->em->getRepository(Image::class)->find($id);
        if(!$image){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Image niet geregistreerd in de database."
            ]);
        }

        $deleteResult = unlink($image->getFilePath());

        $this->em->remove($image);
        $this->em->flush();

        return new JsonResponse([
            "status" => "success",
            "message" => ($deleteResult ? "Image is verwijderd!" : "Image bestand niet kunnen verwijderen, image registratie is wel uit de database verwijderd.")
        ]);
    }

    #[Route('/api/image/update/{id}', name: 'api_update_image', methods: ['POST'])]
    public function update($id, Request $request): JsonResponse
    {

        $image = $this->em->getRepository(Image::class)->find($id);
        if(!$image){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Image niet geregistreerd in de database."
            ]);
        }

        $name = $request->request->get('name');
        if(!isset($name)){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Image naam niet ingevuld."
            ]);
        }

        $image->setName($name);

        $this->em->persist($image);
        $this->em->flush();

        return new JsonResponse([
            "status" => "success",
            "message" => "Image is ge-update!"
        ]);
    }


}
