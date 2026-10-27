import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { SupportUser } from './types';

type UserListProps = {
  users: SupportUser[];
  selectedId: string | null;
  unread: Record<string, number>;
  onSelect: (user: SupportUser) => void;
};

export function UserList({
  users,
  selectedId,
  unread,
  onSelect
}: UserListProps) {
  return (
    <ul className='divide-y border-b'>
      {users.map(user => {
        const selected = user.id === selectedId;
        const count = unread[user.id] ?? 0;

        return (
          <li key={user.id}>
            <button
              type='button'
              onClick={() => onSelect(user)}
              aria-current={selected ? 'true' : undefined}
              className={cn(
                'flex min-h-14 w-full items-center gap-3 border-l-4 px-4 py-3 text-left transition-colors focus-visible:bg-accent',
                selected
                  ? 'border-l-brand bg-accent'
                  : 'border-l-transparent hover:bg-accent/60'
              )}
            >
              <span className='min-w-0 flex-1'>
                <span className='block truncate font-semibold'>
                  {user.name}
                </span>
                <span className='meta mt-0.5 flex items-center gap-1.5'>
                  <span
                    aria-hidden='true'
                    className={cn(
                      'size-2',
                      user.online ? 'bg-success' : 'bg-muted-foreground/40'
                    )}
                  />
                  {user.online ? 'Online' : 'Offline'}
                </span>
              </span>
              {count > 0 && (
                <Badge
                  className='bg-brand text-brand-foreground'
                  aria-label={`${count} unread messages`}
                >
                  {count}
                </Badge>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
