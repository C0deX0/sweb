<?php

namespace App\Repository;

use App\Entity\CalendarNormal;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method CalendarNormal|null find($id, $lockMode = null, $lockVersion = null)
 * @method CalendarNormal|null findOneBy(array $criteria, array $orderBy = null)
 * @method CalendarNormal[]    findAll()
 * @method CalendarNormal[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CalendarNormalRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CalendarNormal::class);
    }

    // /**
    //  * @return CalendarNormal[] Returns an array of CalendarNormal objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CalendarNormal
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
