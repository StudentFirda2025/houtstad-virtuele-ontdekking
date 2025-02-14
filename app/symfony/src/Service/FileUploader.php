<?php
// src/Service/FileUploader.php
namespace App\Service;

use Exception;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileUploader
{

    public function __construct(
        private SluggerInterface $slugger
    ) {
    }


    // Returns the new slugged file name
    public function upload(UploadedFile $file, $targetPath): string
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $fileName = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();

        try {
            $file->move($targetPath, $fileName);
        } catch (FileException $e) {
            throw new Exception("Error in FileUploader->upload(): " . $e->getMessage());
        }

        return $fileName;
    }

}