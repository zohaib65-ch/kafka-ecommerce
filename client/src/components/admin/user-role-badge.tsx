import { Badge } from '@/components/ui/badge';
import { ROLES } from '@/lib/constants';

export function UserRoleBadge({ role }: { role?: string }) {
  if (role === ROLES.Admin) return <Badge>Admin</Badge>;
  if (role === ROLES.Merchant) return <Badge variant='outline'>Merchant</Badge>;
  return <Badge variant='secondary'>Member</Badge>;
}
