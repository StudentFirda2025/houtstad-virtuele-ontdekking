<?php

namespace App\Controller\api;

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

use App\Entity\Video;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;


class ApiVideoController extends AbstractController
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
    #[Route('/api/video/get/file/{id}', name: 'api_get_video_file', methods: ['GET'])]
    public function getFile($id): BinaryFileResponse | JsonResponse
    {
        // Get video object
        $video = $this->em->getRepository(Video::class)->find($id);
        if(!$video){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Video niet geregistreerd in de database."
            ]);
        }


        // Get video file
        $result = $this->fileGetter->searchFiles(
            $video->getFileName(),
            $video->getFilePathWithoutFileName()
        );

        if(count($result) == 0 || $result[0]->isFile() == false){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Video bestand niet gevonden."
            ]);
        }

        $fileMimeType = mime_content_type($video->getFilePath());

        // Create response
        $response = new BinaryFileResponse($video->getFilePath());
        $response->headers->set('Cache-Control', 'private');
        $response->headers->set('Content-Type', $fileMimeType);
        $response->headers->set('Content-Disposition', $response->headers->makeDisposition(
            ResponseHeaderBag::DISPOSITION_INLINE,
            $video->getName()
        ));

        return $response;
    }

    #[Route('/api/video/get/{id}', name: 'api_get_video', methods: ['GET'])]
    public function get($id): JsonResponse
    {
        $video = $this->em->getRepository(Video::class)->find($id);
        if(!$video){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Video niet geregistreerd in de database."
            ]);
        }

        return new JsonResponse([
            "status" => "success",
            "video" => [
                "id" => $video->getId(),
                "name" => $video->getName(),
            ]
        ]);
    }

    #[Route('/api/video/get-all', name: 'api_get_all_video', methods: ['GET'])]
    public function getAll(): JsonResponse
    {
        $allVideos = $this->em->getRepository(Video::class)->findAll();

        $collectedVideos = [];
        foreach($allVideos as $video){
            array_push($collectedVideos, [
                "id" => $video->getId(),
                "name" => $video->getName(),
            ]);
        }

        // RETURN VIDEO
        return new JsonResponse([
            "status" => "success",
            "videos" => $this->serializer->normalize($collectedVideos, 'json')
        ]);
    }

    #[Route('/api/video/upload', name: 'api_upload_video', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        $file = $request->files->get("file");

        // Check if file is video
        if ($file instanceof UploadedFile) {
            $mimeType = $file->getMimeType();

            // Check if the file's MIME type starts with 'video/'
            if (strpos($mimeType, 'video/') !== 0) {
                return new JsonResponse(["status" => "failed", "message" => "Alleen video bestanden zijn toegestaan."]);
            }
        }else{
            return new JsonResponse([
                "status" => "failed",
                "message" => "Alleen upload-bare bestanden zijn toegestaan."
            ]);
        }

        $originalFileName = $file->getClientOriginalName();
        $path = $this->getParameter('kernel.project_dir')."/media/videos/";

        $safeFileName = $this->uploader->upload($file, $path);
        if($safeFileName == ""){
            return new JsonResponse([
                "status" => "failed", 
                "message" => "Unknown error in api_video_controller."
            ]);
        }


        $origFileNameWithoutExtension = pathinfo($originalFileName, PATHINFO_FILENAME); // <-- Smart simple way to remove extension
        $videoPath = $path.$safeFileName;
        $video = new Video();
        $video->setName($origFileNameWithoutExtension);
        $video->setFileName($safeFileName);
        $video->setFilePath($videoPath);

        $this->em->persist($video);
        $this->em->flush();

        return new JsonResponse(["status" => "success", "message" => "Video is ge-upload!"]);
    }

    #[Route('/api/video/delete/{id}', name: 'api_delete_video', methods: ['POST'])]
    public function delete($id): JsonResponse
    {

        $video = $this->em->getRepository(Video::class)->find($id);
        if(!$video){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Video niet geregistreerd in de database."
            ]);
        }

        $deleteResult = unlink($video->getFilePath());

        $this->em->remove($video);
        $this->em->flush();

        return new JsonResponse([
            "status" => "success",
            "message" => ($deleteResult ? "Video is verwijderd!" : "Video bestand niet kunnen verwijderen, video registratie is wel uit de database verwijderd.")
        ]);
    }

    #[Route('/api/video/update/{id}', name: 'api_update_video', methods: ['POST'])]
    public function update($id, Request $request): JsonResponse
    {

        $video = $this->em->getRepository(Video::class)->find($id);
        if(!$video){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Video niet geregistreerd in de database."
            ]);
        }

        $name = $request->request->get('name');
        if(!isset($name)){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Video naam niet ingevuld."
            ]);
        }

        $video->setName($name);

        $this->em->persist($video);
        $this->em->flush();

        return new JsonResponse([
            "status" => "success",
            "message" => "Video is ge-update!"
        ]);
    }


}
