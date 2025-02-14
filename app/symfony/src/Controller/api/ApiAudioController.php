<?php

namespace App\Controller\api;

use App\Entity\Audio;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Attribute\Route;

use App\Service\FileGetter;
use App\Service\FileUploader;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class ApiAudioController extends AbstractController
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
    #[Route('/api/audio/get/file/{id}', name: 'api_get_audio_file', methods: ['GET'])]
    public function getFile($id): BinaryFileResponse | JsonResponse
    {
        // Get audio object
        $audio = $this->em->getRepository(Audio::class)->find($id);
        if(!$audio){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Audio niet geregistreerd in de database."
            ]);
        }


        // Get audio file
        $result = $this->fileGetter->searchFiles(
            $audio->getFileName(),
            $audio->getFilePathWithoutFileName()
        );

        if(count($result) == 0 || $result[0]->isFile() == false){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Audio bestand niet gevonden."
            ]);
        }


        $fileMimeType = mime_content_type($audio->getFilePath());

        // Create response
        $response = new BinaryFileResponse($audio->getFilePath());
        $response->headers->set('Cache-Control', 'private');
        $response->headers->set('Content-Type', $fileMimeType);
        $response->headers->set('Content-Disposition', $response->headers->makeDisposition(
            ResponseHeaderBag::DISPOSITION_INLINE,
            $audio->getName()
        ));

        return $response;
    }

    #[Route('/api/audio/get/{id}', name: 'api_get_audio', methods: ['GET'])]
    public function get($id): JsonResponse
    {
        $audio = $this->em->getRepository(Audio::class)->find($id);
        if(!$audio){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Audio niet geregistreerd in de database."
            ]);
        }

        return new JsonResponse([
            "status" => "success",
            "audio" => $this->serializer->normalize($audio, 'json')
        ]);
    }

    #[Route('/api/audio/get-all', name: 'api_get_all_audio', methods: ['GET'])]
    public function getAll(): JsonResponse
    {
        $allAudios = $this->em->getRepository(Audio::class)->findAll();

        $collectedAudios = [];
        foreach($allAudios as $audio){
            array_push($collectedAudios, [
                "id" => $audio->getId(),
                "name" => $audio->getName(),
            ]);
        }

        return new JsonResponse([
            "status" => "success",
            "audios" => $this->serializer->normalize($collectedAudios, 'json')
        ]);
    }

    #[Route('/api/audio/upload', name: 'api_upload_audio', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        $file = $request->files->get("file");

        // Check if file is audio
        if ($file instanceof UploadedFile) {
            $mimeType = $file->getMimeType();

            // Check if the file's MIME type starts with 'audio/'
            if (strpos($mimeType, 'audio/') !== 0) {
                return new JsonResponse(["status" => "failed", "message" => "Alleen audio bestanden zijn toegestaan."]);
            }
        }

        $originalFileName = $file->getClientOriginalName();
        $path = $this->getParameter('kernel.project_dir')."/media/audio/";

        $safeFileName = $this->uploader->upload($file, $path);
        if($safeFileName == ""){
            return new JsonResponse(["status" => "failed", "message" => "Unknown error in api_audio_controller."]);
        }

        $audioPath = $path.$safeFileName;
        $audio = new Audio();
        $audio->setName($originalFileName);
        $audio->setFileName($safeFileName);
        $audio->setFilePath($audioPath);

        $this->em->persist($audio);
        $this->em->flush();

        return new JsonResponse(["status" => "success", "message" => "Audio is ge-upload!"]);
    }

    #[Route('/api/audio/delete/{id}', name: 'api_delete_audio', methods: ['POST'])]
    public function delete($id): JsonResponse
    {

        $audio = $this->em->getRepository(Audio::class)->find($id);
        if(!$audio){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Audio niet geregistreerd in de database."
            ]);
        }

        $deleteResult = unlink($audio->getFilePath());

        $this->em->remove($audio);
        $this->em->flush();


        return new JsonResponse([
            "status" => "success",
            "message" => ($deleteResult ? "Audio is verwijderd!" : "Audio bestand niet kunnen verwijderen, audio registratie is wel uit de database verwijderd.")
        ]);
    }

    #[Route('/api/audio/update/{id}', name: 'api_update_audio', methods: ['POST'])]
    public function update($id, Request $request): JsonResponse
    {

        $audio = $this->em->getRepository(Audio::class)->find($id);
        if(!$audio){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Audio niet geregistreerd in de database."
            ]);
        }

        $name = $request->request->get('name');
        if(!isset($name)){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Audio naam niet ingevuld."
            ]);
        }

        $audio->setName($name);

        $this->em->persist($audio);
        $this->em->flush();

        return new JsonResponse([
            "status" => "success",
            "message" => "Audio is ge-update!"
        ]);
    }
}