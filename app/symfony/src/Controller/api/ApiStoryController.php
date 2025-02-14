<?php

namespace App\Controller\api;

use App\Entity\Story;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Attribute\Route;

use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class ApiStoryController extends AbstractController
{
    private EntityManagerInterface $em;
    private Serializer $serializer;
    public function __construct(EntityManagerInterface $EntityManager)
    {
        $this->em = $EntityManager;
        $this->serializer = new Serializer([new ObjectNormalizer()]);
    }



    #[Route('/api/story/get/{id}', name: 'api_get_story', methods: ['GET'])]
    public function get($id): JsonResponse
    {
        $story = $this->em->getRepository(Story::class)->find($id);
        if(!$story){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Story niet geregistreerd in de database."
            ]);
        }

        return new JsonResponse([
            "status" => "success",
            "story" => $this->serializer->normalize($story, 'json')
        ]);
    }

    #[Route('/api/story/get-all', name: 'api_get_all_story', methods: ['GET'])]
    public function getAll(): JsonResponse
    {
        $allStorys = $this->em->getRepository(Story::class)->findAll();

        return new JsonResponse([
            "status" => "success",
            "storys" => $this->serializer->normalize($allStorys, 'json')
        ]);
    }

    #[Route('/api/story/upload', name: 'api_upload_story', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        $name = $request->request->get('name');
        $text = $request->request->get('text');

        $story = new Story();
        $story->setName($name);
        $story->setText($text);

        $this->em->persist($story);
        $this->em->flush();

        return new JsonResponse(["status" => "success", "message" => "Story is ge-upload!"]);
    }

    #[Route('/api/story/delete/{id}', name: 'api_delete_story', methods: ['POST'])]
    public function delete($id): JsonResponse
    {
        $story = $this->em->getRepository(Story::class)->find($id);
        if(!$story){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Story niet geregistreerd in de database."
            ]);
        }

        $this->em->remove($story);
        $this->em->flush();


        return new JsonResponse([
            "status" => "success",
            "message" => "Story verwijderd!"
        ]);
    }

    #[Route('/api/story/update/{id}', name: 'api_update_story', methods: ['POST'])]
    public function update($id, Request $request): JsonResponse
    {
        $story = $this->em->getRepository(Story::class)->find($id);
        if(!$story){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Story niet geregistreerd in de database."
            ]);
        }

        // Check if any value is given
        $name = $request->request->get('name');
        $text = $request->request->get('text');
        if(empty($name) && empty($text)){
            return new JsonResponse([
                "status" => "failed",
                "message" => "Geen gegevens mee gegeven!"
            ]);
        }

        // Set values
        if(!empty($name)){
            $story->setName($name);
        }
        if(!empty($text)){
            $story->setText($text);
        }

        $this->em->persist($story);
        $this->em->flush();

        return new JsonResponse([
            "status" => "success",
            "message" => "Story is ge-update!"
        ]);
    }
}