<?php

namespace App\Controller;

use App\Entity\CalendarNormal;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CalendarController extends AbstractController
{
    /**
     * @Route("/calendar", name="calendar")
     */
    public function index()
    {
        return $this->render('calendar/index.html.twig', [
            'controller_name' => 'CalendarController',
        ]);
    }

    /**
     *
     * @Route("/calendarAjax", name="calendarAjaxCall")
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function ajaxCall (Request $request)
    {
        $moduleAction = $request->get('action');

        if (\method_exists($this, $moduleAction)) {
            $returnArray = $this->$moduleAction($request);
        } else {
            $returnArray = 'Ajax Call Error';
        }

        return new JsonResponse($returnArray);
    }

    protected function saveEvent (Request $request)
    {
        $calendarEntity = $this->getDoctrine()->getManager();
        $saveType = $request->get('saveType');

        if ('insert' === $saveType) {
            $eventTitle = $request->get('eventTitle');
            if (isset($eventTitle)) {

                $calendarNormal = new CalendarNormal();
                $calendarNormal->setTitle($request->get('eventTitle'));
                $calendarNormal->setDescription('');
                $calendarNormal->setColor($request->get('eventColor'));
                $calendarNormal->setStartEvent(new \DateTime($request->get('eventStart')));
                $calendarNormal->setEndEvent(new \DateTime($request->get('eventEnd')));

                $calendarEntity->persist($calendarNormal);
                $calendarEntity->flush();
            }
        } elseif ('update' === $saveType) {

        }
    }

    protected function getCurrentEvents ()
    {
        $calendarEntity = $this->getDoctrine()->getRepository(CalendarNormal::class);

        $currentEvents = $calendarEntity->getAllThisMonth();

        return $currentEvents;
    }
}
