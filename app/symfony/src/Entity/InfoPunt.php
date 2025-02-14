<?php

namespace App\Entity;

use App\Repository\InfoPuntRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InfoPuntRepository::class)]
class InfoPunt
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: "text", nullable: true)]
    private ?string $text = null;

    #[ORM\Column(nullable: true)]
    private ?int $videoId = null;

    #[ORM\Column(nullable: true)]
    private ?int $audioId = null;

    #[ORM\Column(nullable: true)]
    private ?int $imageId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(?string $text): static
    {
        $this->text = $text;

        return $this;
    }

    public function getVideoId(): ?int
    {
        return $this->videoId;
    }

    public function setVideoId(?int $videoId): static
    {
        $this->videoId = $videoId;

        return $this;
    }

    public function getAudioId(): ?int
    {
        return $this->audioId;
    }

    public function setAudioId(?int $audioId): static
    {
        $this->audioId = $audioId;

        return $this;
    }

    public function getImageId(): ?int
    {
        return $this->imageId;
    }

    public function setImageId(?int $imageId): static
    {
        $this->imageId = $imageId;

        return $this;
    }


    /**
     * Media in this context is considerd -> text, audio, video, image.
     * Returns false if there is no text, audio, or video present.
     * @return bool
     */
    public function hasMedia(): bool{
        return !(empty($this->getText()) && empty($this->getAudioId()) && empty($this->getVideoId()) && empty($this->getImageId()));
    }
}
