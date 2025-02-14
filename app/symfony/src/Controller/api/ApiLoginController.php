<?php

namespace App\Controller\api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Security\Core\User\UserInterface;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;


use App\Entity\User;



class ApiLoginController extends AbstractController
{
    private EntityManagerInterface $em;
    public function __construct(EntityManagerInterface $EntityManager) {
        $this->em = $EntityManager;


    }


    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(#[CurrentUser] ?UserInterface $user): JsonResponse
    {
        if($user === null){
            return $this->json([
                "status" => "failed",
                "message" => "Login failed!"
            ]);
        }

        // get the login error if there is one
        // $error = $authenticationUtils->getLastAuthenticationError();

        // // last username entered by the user
        // $lastUsername = $authenticationUtils->getLastUsername();


        return $this->json([
            "status" => "success",
            "message" => "Login success!",
            "user" => $user,
        ]);
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): JsonResponse //#[CurrentUser] ?UserInterface  $user
    {

    }

//    #[Route('/api/changerole', name: 'api_changerole', methods: ['POST'])]
//    public function TEMP_changerole()
//    {
//        $user =  $this->em->getRepository(User::class)->findOneByEmail("flvrij03@gmail.com");
//
//        if($user !== null){
//            $user->setRoles(["ADMIN"]);
//            $this->em->persist($user);
//            $this->em->flush();
//        }else{
//            dd("USER NOT FOUND WHAT THE HELL");
//        }
//    }



    #[Route('/api/current-user', name: 'api_current-user', methods: ['GET'])]
    public function getCurrentUser(): JsonResponse //#[CurrentUser] ?UserInterface  $user
    {
        $user = $this->getUser();

        if($user === null){
            return $this->json([
                "user" => null
            ]);
        }

        return $this->json([
            "user" => [
                "id" => $user->getId(),
                "email" => $user->getEmail(),
                "roles" => $user->getRoles()
            ]
        ]);
    }
}
