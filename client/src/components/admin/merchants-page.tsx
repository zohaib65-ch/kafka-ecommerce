'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { SubPage } from '@/components/dashboard/sub-page';
import { EmptyState } from '@/components/shared/empty-state';
import { InlineLoader } from '@/components/shared/loading';
import { PaginationBar } from '@/components/shared/pagination-bar';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  approveMerchant,
  deleteMerchant,
  disableMerchant,
  fetchMerchants,
  rejectMerchant,
  searchMerchants
} from '@/store/merchant/actions';

import { ListSearch } from './list-search';
import { MerchantCard } from './merchant-card';
import { ResultCount } from './result-count';
import { useLoad } from './use-load';

export function MerchantsPage() {
  const dispatch = useAppDispatch();
  const merchants = useAppSelector(state => state.merchant.merchants);
  const searchedMerchants = useAppSelector(
    state => state.merchant.searchedMerchants
  );
  const advancedFilters = useAppSelector(
    state => state.merchant.advancedFilters
  );
  const isLoading = useAppSelector(state => state.merchant.isLoading);
  const [search, setSearch] = useState('');

  const loaded = useLoad(
    useCallback(() => dispatch(fetchMerchants()), [dispatch])
  );

  // Two characters are needed to search; clearing the field goes back to the paged list.
  const handleSearch = (value: string) => {
    if (value.length >= 2) {
      setSearch(value);
      dispatch(searchMerchants({ name: 'merchant', value }));
    } else {
      setSearch('');
    }
  };

  const isSearch = search.length > 0;
  const filtered = isSearch ? searchedMerchants : merchants;
  const { currentPage, totalPages, count } = advancedFilters;

  return (
    <SubPage
      title='Merchants'
      description='Applications and merchant accounts.'
      actions={
        <Button size='sm' asChild>
          <Link href='/dashboard/merchant/add'>
            <Plus /> Add merchant
          </Link>
        </Button>
      }
    >
      <div className='space-y-6'>
        <ListSearch
          label='Search merchants'
          placeholder='Type email, phone number, brand or status'
          onSearch={handleSearch}
        />

        {!loaded || (isLoading && filtered.length === 0) ? (
          <InlineLoader label='Loading merchants' />
        ) : filtered.length > 0 ? (
          <div className='space-y-4' aria-busy={isLoading}>
            <ResultCount
              count={isSearch ? filtered.length : count}
              singular='merchant'
              plural='merchants'
            />
            <ul className='divide-y border-y border-foreground'>
              {filtered.map(merchant => (
                <li key={merchant._id}>
                  <MerchantCard
                    merchant={merchant}
                    onApprove={m =>
                      dispatch(approveMerchant(m, search, currentPage))
                    }
                    onReject={m =>
                      dispatch(rejectMerchant(m, search, currentPage))
                    }
                    onDelete={m =>
                      dispatch(deleteMerchant(m, search, currentPage))
                    }
                    onToggleActive={(m, value) =>
                      dispatch(disableMerchant(m, value, search, currentPage))
                    }
                  />
                </li>
              ))}
            </ul>
            {!isSearch && totalPages > 1 && (
              <PaginationBar
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={page => dispatch(fetchMerchants(page))}
              />
            )}
          </div>
        ) : (
          <EmptyState message='No merchants found.' />
        )}
      </div>
    </SubPage>
  );
}
