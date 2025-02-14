<?php

namespace App\Service;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\Finder\Finder;

// TODO: https://stackoverflow.com/questions/34290684/serving-file-from-secure-location-with-symfony

class FileGetter
{
    private Finder $finder;
    public function __construct(){
        $this->finder = new Finder();
    }
    public function searchFiles($name, $path): array
    {
        $this->finder->files()                // Only search for files
                     ->ignoreUnreadableDirs() // Ignore directories where you don't have read premition for
                     ->followLinks()          // Follow symbolic system links
                     ->in($path)              // Path to search in
                     ->name($name);           // File name to search for

        $foundFiles = [];
        foreach ($this->finder as $file) {
            array_push($foundFiles, $file);
        }

        return $foundFiles;
    }

}