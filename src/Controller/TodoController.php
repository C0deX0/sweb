<?php

namespace App\Controller;

use App\Entity\Todo;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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

    /**
     * Get all todos from my sql database
     *
     * @param Request $request
     *
     * @return array
     */
    protected function getTodos (Request $request): array
    {
        $todoEntity = $this->getDoctrine()->getRepository(Todo::class);

        $getFetchType = $request->get('fetchType');
        $todos = [
            'Request Error'
        ];
        if ('all' === $getFetchType) {
            $todos = $todoEntity->getAll('all');
        } elseif ('finished' === $getFetchType) {
            $todos = $todoEntity->getAll('finished');
        }

        return $todos;
    }

    /**
     * Save New/Edit todo to database
     *
     * @param Request $request
     */
    protected function saveTodo (Request $request)
    {
        $todoEntity = $this->getDoctrine()->getManager();
        $getSaveType = $request->get('saveType');

        if ('insert' === $getSaveType) {

            $todo = new Todo();
            $todo->setTitle($request->get('todoTitle'));
            $todo->setText($request->get('todoText'));
            $todo->setColor($request->get('todoColor'));
            $todo->setStatus('enabled');

            $todoEntity->persist($todo);
            $todoEntity->flush();
        } elseif ('update' === $getSaveType) {

            $todo = $todoEntity->getRepository(Todo::class)->find($request->get('todoId'));
            $todo->setTitle($request->get('todoTitle'));
            $todo->setText($request->get('todoText'));
            $todo->setColor($request->get('todoColor'));
            $todo->setStatus('enabled');

            $todoEntity->flush();
        }
    }

    /**
     * Set todo to finish
     *
     * @param Request $request
     */
    protected function finishTodo (Request $request): void
    {
        $entityManager = $this->getDoctrine()->getManager();
        $todo = $entityManager->getRepository(Todo::class)->find($request->get('todoId'));

        if (!$todo) {
            throw new $this->createNotFoundException(
                'Not todo with id: ' . $request->get('todoId')
            );
        }

        $todo->setStatus('disabled');
        $entityManager->flush();
    }

    /**
     * Delete todo from database
     *
     * @param Request $request
     */
    protected function deleteTodo (Request $request): void
    {
        $entityManager = $this->getDoctrine()->getManager();
        $todo = $entityManager->getRepository(Todo::class)->find($request->get('todoId'));

        $entityManager->remove($todo);
        $entityManager->flush();
    }
}
