'use client';

import { useCallback, useState } from 'react';

import { SubPage } from '@/components/dashboard/sub-page';
import { EmptyState } from '@/components/shared/empty-state';
import { InlineLoader } from '@/components/shared/loading';
import { PaginationBar } from '@/components/shared/pagination-bar';
import { formatDate } from '@/lib/format';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsers, searchUsers } from '@/store/users/actions';
import type { UserListItem } from '@/types';

import { ListSearch } from './list-search';
import { ResultCount } from './result-count';
import { ResponsiveTable, type Column } from './responsive-table';
import { UserRoleBadge } from './user-role-badge';
import { useLoad } from './use-load';

const columns: Column<UserListItem>[] = [
  {
    id: 'name',
    header: 'Name',
    primary: true,
    cell: user => (
      <span className='font-semibold'>
        {user.firstName ? `${user.firstName} ${user.lastName ?? ''}` : 'N/A'}
      </span>
    )
  },
  {
    id: 'email',
    header: 'Email',
    cell: user => <span className='break-all'>{user.email ?? '–'}</span>
  },
  { id: 'provider', header: 'Provider', cell: user => user.provider ?? '–' },
  {
    id: 'created',
    header: 'Created',
    cell: user => (user.created ? formatDate(user.created) : '–')
  },
  {
    id: 'role',
    header: 'Role',
    cell: user => <UserRoleBadge role={user.role} />
  }
];

export function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.users.users);
  const searchedUsers = useAppSelector(state => state.users.searchedUsers);
  const advancedFilters = useAppSelector(state => state.users.advancedFilters);
  const isLoading = useAppSelector(state => state.users.isLoading);
  const [search, setSearch] = useState('');

  const loaded = useLoad(useCallback(() => dispatch(fetchUsers()), [dispatch]));

  // Two characters are needed to search; clearing the field goes back to the paged list.
  const handleSearch = (value: string) => {
    if (value.length >= 2) {
      setSearch(value);
      dispatch(searchUsers({ name: 'user', value }));
    } else {
      setSearch('');
    }
  };

  const isSearch = search.length > 0;
  const filtered = isSearch ? searchedUsers : users;
  const { currentPage, totalPages, count } = advancedFilters;

  return (
    <SubPage title='Users' description='Everyone with an account.'>
      <div className='space-y-6'>
        <ListSearch
          label='Search users'
          placeholder='Type user name or email'
          onSearch={handleSearch}
        />

        {!loaded || (isLoading && filtered.length === 0) ? (
          <InlineLoader label='Loading users' />
        ) : filtered.length > 0 ? (
          <div className='space-y-4' aria-busy={isLoading}>
            <ResultCount
              count={isSearch ? filtered.length : count}
              singular='user'
              plural='users'
            />
            <ResponsiveTable
              caption='Users'
              rows={filtered}
              columns={columns}
              getRowKey={(user, index) => `${user.email ?? 'user'}-${index}`}
            />
            {!isSearch && totalPages > 1 && (
              <PaginationBar
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={page => dispatch(fetchUsers(page))}
              />
            )}
          </div>
        ) : (
          <EmptyState message='No users found.' />
        )}
      </div>
    </SubPage>
  );
}
