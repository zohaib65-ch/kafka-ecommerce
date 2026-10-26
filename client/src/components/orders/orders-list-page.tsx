'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReceiptText, SearchX } from 'lucide-react';

import { SubPage } from '@/components/dashboard/sub-page';
import { EmptyState } from '@/components/shared/empty-state';
import { ListSkeleton } from '@/components/shared/loading';
import { PaginationBar } from '@/components/shared/pagination-bar';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/lib/constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAccountOrders,
  fetchOrders,
  searchOrders
} from '@/store/order/actions';
import type { AppThunk } from '@/store';

import { OrderList } from './order-list';
import { OrderSearch } from './order-search';
import { useLoadedFor } from './use-loaded-for';

// Stable loaders for useLoadedFor (the id is just a label for "the first page").
const loadMyOrders = (): AppThunk<Promise<unknown>> => fetchAccountOrders();
const loadAllOrders = (): AppThunk<Promise<unknown>> => fetchOrders();

type OrdersListPageProps = {
  /** 'mine': the signed in user's orders (filtered by id in the browser, as before).
   *  'customers': every order (admin), searched on the server. */
  variant: 'mine' | 'customers';
};

/**
 * Order lists of the dashboard. "Your Orders" is available to everyone and offers admins a shortcut
 * to "Customer Orders", which lists all orders and searches them on the server.
 */
export function OrdersListPage({ variant }: OrdersListPageProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isCustomers = variant === 'customers';

  const user = useAppSelector(state => state.account.user);
  const orders = useAppSelector(state => state.order.orders);
  const searchedOrders = useAppSelector(state => state.order.searchedOrders);
  const isLoading = useAppSelector(state => state.order.isLoading);
  const filters = useAppSelector(state => state.order.advancedFilters);

  const ready = useLoadedFor(
    'first-page',
    isCustomers ? loadAllOrders : loadMyOrders
  );
  const [search, setSearch] = useState('');

  const handleSearch = useCallback(
    (value: string) => {
      if (value.length >= 2) {
        if (isCustomers) {
          dispatch(searchOrders({ name: 'order', value }));
        }
        setSearch(value);
      } else {
        setSearch('');
      }
    },
    [dispatch, isCustomers]
  );

  const isSearch = search.length > 0;
  const visibleOrders = isSearch
    ? isCustomers
      ? searchedOrders
      : orders.filter(order => order._id.includes(search))
    : orders;

  const showPagination = !isSearch && filters.totalPages > 1;
  const count = isSearch ? visibleOrders.length : filters.count;
  const isAdmin = user.role === ROLES.Admin;

  const goToPage = (page: number) =>
    dispatch(isCustomers ? fetchOrders(page) : fetchAccountOrders(page));

  return (
    <SubPage
      title={isCustomers ? 'Customer Orders' : 'Your Orders'}
      description={
        isCustomers
          ? 'Every order placed in the store.'
          : 'Track and manage the orders you have placed.'
      }
      actions={
        isCustomers ? (
          <Button
            variant='outline'
            size='sm'
            onClick={() => router.push('/dashboard/orders')}
          >
            My Orders
          </Button>
        ) : isAdmin ? (
          <Button
            variant='outline'
            size='sm'
            onClick={() => router.push('/dashboard/orders/customers')}
          >
            Customer Orders
          </Button>
        ) : null
      }
    >
      <div className='space-y-5'>
        <OrderSearch
          onSearch={handleSearch}
          debounceMs={isCustomers ? 600 : 0}
        />

        {!ready ? (
          <ListSkeleton rows={4} />
        ) : visibleOrders.length > 0 ? (
          <div
            aria-busy={isLoading}
            className={isLoading ? 'opacity-60 transition-opacity' : undefined}
          >
            <p className='mb-3 text-sm text-muted-foreground'>
              <span className='font-medium text-foreground'>{count}</span>{' '}
              orders
            </p>
            <OrderList orders={visibleOrders} />
            {showPagination && (
              <PaginationBar
                className='mt-8'
                totalPages={filters.totalPages}
                currentPage={filters.currentPage}
                onPageChange={goToPage}
              />
            )}
          </div>
        ) : isLoading ? (
          <ListSkeleton rows={4} />
        ) : isSearch ? (
          <EmptyState
            icon={SearchX}
            message={
              isCustomers ? 'No orders found.' : 'No orders match that ID.'
            }
            description='Check the order ID and try again.'
          />
        ) : (
          <EmptyState
            icon={ReceiptText}
            message={
              isCustomers ? 'No orders found.' : 'You have no orders yet.'
            }
            description={
              isCustomers
                ? undefined
                : 'When you place an order it will show up here.'
            }
            action={
              isCustomers ? undefined : (
                <Button onClick={() => router.push('/shop')}>
                  Start shopping
                </Button>
              )
            }
          />
        )}
      </div>
    </SubPage>
  );
}
