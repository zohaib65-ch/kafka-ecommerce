import { Badge } from '@/components/ui/badge';
import { getAvatarColor, cn } from '@/lib/utils';

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
    <ul className='p-2'>
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
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                selected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
              )}
            >
              <span
                className='relative grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white'
                style={{ backgroundColor: getAvatarColor(user.id) }}
                aria-hidden='true'
              >
                {user.name.charAt(0).toUpperCase()}
                <span
                  className={cn(
                    'absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-card',
                    user.online ? 'bg-success' : 'bg-muted-foreground/40'
                  )}
                />
              </span>
              <span className='min-w-0 flex-1'>
                <span className='block truncate text-sm font-medium'>
                  {user.name}
                </span>
                <span className='block text-xs text-muted-foreground'>
                  {user.online ? 'Online' : 'Offline'}
                </span>
              </span>
              {count > 0 && (
                <Badge aria-label={`${count} unread messages`}>{count}</Badge>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
