<?php

namespace App\Controller\api;

use App\Entity\Image;
use App\Entity\Video;
use App\Entity\Audio;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

use App\Entity\InfoPunt;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ArrayDenormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class ApiInfoPuntController extends AbstractController
{
    private EntityManagerInterface $em;
    private Serializer $serializer;

    public function __construct(EntityManagerInterface $EntityManager)
    {
        $this->em = $EntityManager;
        $this->serializer = new Serializer([new ObjectNormalizer()]);
    }


    #[Route('/api/info-punt/get/{id}', name: 'api_get_info_punt', methods: ['GET'])]
    public function get($id): JsonResponse
    {
        $infoPunt = $this->em->getRepository(InfoPunt::class)->find($id);
        if (!$infoPunt) {
            return new JsonResponse([
                "message" => "Info-punt niet geregistreerd in de database.",
                "status" => "failed"
            ]);
        }

        $infoPuntJson = $this->convertInfoPuntToJson($infoPunt);
        return new JsonResponse([
            "infoPunt" => $infoPuntJson,
            "status" => "success"
        ]);
    }

    #[Route('/api/info-punt/get-all', name: 'api_get_all_info_punt', methods: ['GET'])]
    public function getAll(): JsonResponse
    {
        $infoPunten = $this->em->getRepository(InfoPunt::class)->findAll(); 

        // Collect info punten in json format, it will add the json video or audio with the get methode.
        $collectedInfoPunten = [];
        foreach($infoPunten as $infoPunt) {
            // Convert the json response from the $this->get methode to a asso array
            $infoPuntJson = $this->convertInfoPuntToJson($infoPunt); //
//            $array = json_decode($jsonReponse->getContent(), true);

//            $infoPuntJson = $array["infoPunt"];
            array_push($collectedInfoPunten, $infoPuntJson);
        }

        return new JsonResponse([
            "status" => "success",
            "infoPunten" => $collectedInfoPunten
        ]);
    }

    public function convertInfoPuntToJson(InfoPunt $infoPunt): float|array|\ArrayObject|bool|int|string
    {
        $mediaChanged = false;

        $jsonVideo = null;
        if ($infoPunt->getVideoId() != null) {
            $video = $this->em->getRepository(Video::class)->find($infoPunt->getVideoId());
            if(!$video){
                $infoPunt->setVideoId(null); // Remove from info-punt when not found (prob deleted)
                $mediaChanged = true;
            }else{
                $jsonVideo = [
                    "id" => $video->getId(),
                    "name" => $video->getName()
                ];
            }
        }

        $jsonAudio = null;
        if ($infoPunt->getAudioId() != null) {
            $audio = $this->em->getRepository(Audio::class)->find($infoPunt->getAudioId());
            if(!$audio){
                $infoPunt->setAudioId(null); // Remove from info-punt when not found (prob deleted)
                $mediaChanged = true;
            }else{
                $jsonAudio = [
                    "id" => $audio->getId(),
                    "name" => $audio->getName()
                ];
            }
        }

        $jsonImage = null;
        if ($infoPunt->getImageId() != null) {
            $image = $this->em->getRepository(Image::class)->find($infoPunt->getImageId());
            if(!$image){
                $infoPunt->setImageId(null); // Remove from info-punt when not found (prob deleted)
                $mediaChanged = true;
            }else{
                $jsonImage = [
                    "id" => $image->getId(),
                    "name" => $image->getName()
                ];
            }
        }

        if($mediaChanged) {
            $this->em->persist($infoPunt);
            $this->em->flush();
        }


        $infoPuntJson = $this->serializer->normalize($infoPunt, "json");
        unset($infoPuntJson["videoId"]);
        unset($infoPuntJson["audioId"]);
        unset($infoPuntJson["imageId"]);

        $infoPuntJson['video'] = $jsonVideo;
        $infoPuntJson['audio'] = $jsonAudio;
        $infoPuntJson['image'] = $jsonImage;

        return $infoPuntJson;
    }


    #[Route('/api/info-punt/create', name: 'api_create_info_punt', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {

        // Get data
        $data = $request->request->all();

        if(!isset($data['infopuntnaam']) && trim((string)$data['infopuntnaam']) != "") {
            return new JsonResponse([
                "status" => "failed",
                "message" => "Er is geen naam opgegeven."
            ]);
        }

        // Create new info-punt
        $newInfoPunt = new InfoPunt();
        $newInfoPunt->setName((string)$data['infopuntnaam']);

        // Set given media
        if(isset($data["text"]) && !empty((string)$data["text"])) {
            $newInfoPunt->setText((string)$data["text"]);
        }
        if(isset($data["audioId"]) && !empty((int)$data["audioId"])) {
            $newInfoPunt->setAudioId($data["audioId"]);
        }
        if(isset($data["videoId"]) && !empty((int)$data["videoId"])){
            $newInfoPunt->setVideoId((int)$data["videoId"]);
        }
        if(isset($data["imageId"]) && !empty((int)$data["imageId"])){
            $newInfoPunt->setImageId((int)$data["imageId"]);
        }

        if(!$newInfoPunt->hasMedia()){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Geen media toegevoed."
            ]);
        }

        // Flush to database
        $this->em->persist($newInfoPunt);
        $this->em->flush();

        return new JsonResponse([
            "status" => "success",
            "message" => "Info punt is aangemaakt."
        ]);
    }

    #[Route('/api/info-punt/delete/{id}', name: 'api_delete_info_punt', methods: ['POST'])]
    public function delete($id): JsonResponse
    {
        $infoPunt = $this->em->getRepository(InfoPunt::class)->find($id);

        if (!$infoPunt) {
            return new JsonResponse([
                "status" => "failed",
                "message" => "Geen info-punt gevonden om te verwijderen."
            ]);
        }

        $this->em->remove($infoPunt);
        $this->em->flush();
        return new JsonResponse([
            "status" => "success",
            "message" => "Info-punt is verwijderd!"
        ]);
    }

    #[Route('/api/info-punt/update/{id}', name: 'api_update_info_punt', methods: ['POST'])]
    public function update($id, Request $request): JsonResponse
    {
        $data = $request->request->all();
        $infoPunt = $this->em->getRepository(InfoPunt::class)->find($id);
        if (!$infoPunt) {
            return new JsonResponse([
                "status" => "failed",
                "message" => "Info-punt niet geregistreerd in de database."
            ]);
        }

        if (isset($data["infopuntnaam"]) && !empty((string)$data["infopuntnaam"])) {
            $infoPunt->setName((string)$data["infopuntnaam"]);
        }

        if(isset($data["text"]) && !empty((string)$data["text"]) != "") {
            $infoPunt->setText((string)$data["text"]);
        }else{
            $infoPunt->setText(NULL);
        }

        if(isset($data["audioId"]) && !empty((int)$data["audioId"])) {
            $infoPunt->setAudioId((int)$data["audioId"]);
        }else{
            $infoPunt->setAudioId(NULL);
        }

        if(isset($data["videoId"]) && !empty((int)$data["videoId"])){
            $infoPunt->setVideoId((int)$data["videoId"]);
        }else{
            $infoPunt->setVideoId(NULL);
        }

        if(isset($data["imageId"]) && !empty((int)$data["imageId"])){
            $infoPunt->setImageId((int)$data["imageId"]);
        }else{
            $infoPunt->setImageId(NULL);
        }

        if(!$infoPunt->hasMedia()){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Alle media is weggehaald, er moet minimaal één stuk media aanwezig zijn bij het info-punt."
            ]);
        }

        $this->em->persist($infoPunt);
        $this->em->flush();
        
        return new JsonResponse([
            "status" => "success",
            "message" => "Info-punt is ge-update."
        ]);
    }

}