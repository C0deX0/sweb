<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CalendarNormalRepository")
 */
class CalendarNormal
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="text")
     */
    private $title;

    /**
     * @ORM\Column(type="text")
     */
    private $description;

    /**
     * @ORM\Column(type="text")
     */
    private $color;

    /**
     * @ORM\Column(type="datetime")
     */
    private $start_event;

    /**
     * @ORM\Column(type="datetime")
     */
    private $end_event;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id): void
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param mixed $title
     */
    public function setTitle($title): void
    {
        $this->title = $title;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description): void
    {
        $this->description = $description;
    }

    /**
     * @return mixed
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * @param mixed $color
     */
    public function setColor($color): void
    {
        $this->color = $color;
    }

    /**
     * @return mixed
     */
    public function getStartEvent()
    {
        return $this->start_event;
    }

    /**
     * @param mixed $start_event
     */
    public function setStartEvent($start_event): void
    {
        $this->start_event = $start_event;
    }

    /**
     * @return mixed
     */
    public function getEndEvent()
    {
        return $this->end_event;
    }

    /**
     * @param mixed $end_event
     */
    public function setEndEvent($end_event): void
    {
        $this->end_event = $end_event;
    }
}
