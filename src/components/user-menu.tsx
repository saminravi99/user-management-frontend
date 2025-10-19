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
        <Button
          variant="ghost"
          className="relative h-12 w-12 rounded-full border-2 border-indigo-200 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg transition-all duration-200 hover:scale-110 hover:border-indigo-400 hover:shadow-xl"
        >
          <Avatar className="h-11 w-11">
            <AvatarFallback className="bg-gradient-to-br from-white to-indigo-100 text-lg font-extrabold text-indigo-700">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50/50 shadow-2xl"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="pb-3 font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-base font-bold leading-none text-gray-800">{user.name}</p>
            <p className="text-sm font-medium leading-none text-gray-600">{user.email}</p>
            <div className="pt-1">
              <Badge
                variant={getRoleBadgeVariant(user.role)}
                className="flex w-fit items-center gap-1.5 px-3 py-1 text-sm font-bold shadow-sm"
              >
                <RoleIcon className="h-4 w-4" />
                {user.role}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-indigo-200" />
        <DropdownMenuItem asChild>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span>Log out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
