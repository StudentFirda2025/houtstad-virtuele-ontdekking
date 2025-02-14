<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\HttpFoundation\Request;    
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\User;   

use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


class LoginController extends AbstractController
{
    private EntityManagerInterface $em;
    public function __construct(EntityManagerInterface $EntityManager) {
        $this->em = $EntityManager;
    }

    #[Route(path: '/testlogin', name: 'testLoginPage')]
    public function testLoginPage(AuthenticationUtils $authenticationUtils): Response
    {

        return $this->render("test/testLogin.html.twig");
    }

    #[Route(path: '/login', name: 'app_login')]
    public function login(): Response //AuthenticationUtils $authenticationUtils
    {
//        dd($this->getUser());

        // dd($authenticationUtils);
        
        // get the login error if there is one
        // $error = $authenticationUtils->getLastAuthenticationError();

        // // last username entered by the user
        // $lastUsername = $authenticationUtils->getLastUsername();


        // return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);

        return $this->render("security/login/index.html.twig");
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

     #[Route(path: '/register', name: 'TEMP_register')]
    public function TEMP_register(Request $request, UserPasswordHasherInterface $passwordHasher): void
    {
        
        $data = $request->request->all();
        // dd($data);
        $testUser = new User();
        $testUser->setEmail($data["email"]);


        $hashedPassword = $passwordHasher->hashPassword(
            $testUser,
            $data["password"]
        );


        $testUser->setPassword($hashedPassword);
        // dd($testUser);

        $this->em->persist($testUser);
        $this->em->flush();
    }


}
