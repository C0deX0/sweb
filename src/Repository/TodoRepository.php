<?php

namespace App\Repository;

use App\Entity\Todo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Todo|null find($id, $lockMode = null, $lockVersion = null)
 * @method Todo|null findOneBy(array $criteria, array $orderBy = null)
 * @method Todo[]    findAll()
 * @method Todo[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TodoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Todo::class);
    }

    // /**
    //  * @return Todo[] Returns an array of Todo objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Todo
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */

    public function getAll ($param)
    {
        if ('all' === $param) {
            return $this->createQueryBuilder('t')
                ->select('t.id, t.title, t.text, t.color')
                ->andWhere('t.status = ?0')
                ->setParameter(0, 'enabled')
                ->getQuery()
                ->getResult();
        } elseif ('finished' === $param) {
            return $this->createQueryBuilder('t')
                ->select('t.id, t.title, t.text, t.color')
                ->andWhere('t.status = ?0')
                ->setParameter(0, 'disabled')
                ->getQuery()
                ->getResult();
        }
    }
}
