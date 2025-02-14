<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class MediaCmsController extends AbstractController
{
    #[Route('/media/cms', name: 'app_media_cms')]
    public function index(): Response
    {
        return $this->render('media_cms/index.html.twig');
    }
}
