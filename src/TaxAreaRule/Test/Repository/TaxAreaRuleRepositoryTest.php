<?php declare(strict_types=1);

namespace Shopware\TaxAreaRule\Test\Repository;

use Shopware\Context\Struct\TranslationContext;
use Shopware\Search\Criteria;
use Shopware\Search\UuidSearchResult;
use Shopware\TaxAreaRule\Repository\TaxAreaRuleRepository;
use Shopware\TaxAreaRule\Searcher\TaxAreaRuleSearchResult;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class TaxAreaRuleRepositoryTest extends KernelTestCase
{
    /**
     * @var TaxAreaRuleRepository
     */
    private $repository;

    public function setUp()
    {
        self::bootKernel();
        $this->repository = self::$kernel->getContainer()->get('shopware.tax_area_rule.repository');
    }

    public function testSearchUuidsReturnsUuidSearchResult()
    {
        $context = new TranslationContext('SWAG-SHOP-UUID-1', true, null);
        $criteria = new Criteria();
        $criteria->setLimit(1);
        $result = $this->repository->searchUuids($criteria, $context);

        $this->assertInstanceOf(UuidSearchResult::class, $result);
    }

    public function testSearchReturnsSearchResult()
    {
        $context = new TranslationContext('SWAG-SHOP-UUID-1', true, null);
        $criteria = new Criteria();
        $criteria->setLimit(1);

        $result = $this->repository->search($criteria, $context);
        $this->assertInstanceOf(TaxAreaRuleSearchResult::class, $result);
    }
}
