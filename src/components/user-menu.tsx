'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logoutAction } from '@/lib/actions/auth.actions';
import { User, UserRole } from '@/types';
import { Crown, LogOut, Shield, User as UserIcon } from 'lucide-react';

interface UserMenuProps {
  user: User;
}

function getRoleBadgeVariant(role: UserRole) {
  switch (role) {
    case UserRole.SUPERADMIN:
      return 'destructive';
    case UserRole.ADMIN:
      return 'default';
    default:
      return 'secondary';
  }
}

function getRoleIcon(role: UserRole) {
  switch (role) {
    case UserRole.SUPERADMIN:
      return Crown;
    case UserRole.ADMIN:
      return Shield;
    default:
      return UserIcon;
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const RoleIcon = getRoleIcon(user.role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <div className="pt-1">
              <Badge
                variant={getRoleBadgeVariant(user.role)}
                className="flex w-fit items-center gap-1"
              >
                <RoleIcon className="h-3 w-3" />
                {user.role}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={logoutAction}>
            <button type="submit" className="flex w-full items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
