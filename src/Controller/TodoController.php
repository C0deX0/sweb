<?php

namespace App\Controller;

use App\Entity\Todo;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class TodoController extends AbstractController
{
    /**
     * @Route("/todo", name="todo")
     */
    public function index()
    {
        return $this->render('todo/index.html.twig', [
            'controller_name' => 'TodoController',
        ]);
    }

    /**
     *
     * @Route("/todoAjax", name="todoAjaxCall")
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

    protected function getTodos (Request $request)
    {
        $todoEntity = $this->getDoctrine()->getRepository(Todo::class);

        $todos = [
            'Request Error'
        ];
        if ('all' === $request->get('param')) {
            $todos = $todoEntity->getAll('all');
        } elseif ('finished' === $request->get('param')) {
            $todos = $todoEntity->getAll('finished');
        }

        return $todos;
    }
}
