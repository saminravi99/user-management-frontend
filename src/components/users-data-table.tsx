'use client';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { changeUserRoleAction, deleteUserAction } from '@/lib/actions/user.actions';
import { User, UserRole } from '@/types';
import { CheckCircle, MoreHorizontal, Shield, Trash2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UsersDataTableProps {
  users: User[];
  currentUser: User;
}

export function UsersDataTable({ users, currentUser }: UsersDataTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isChangingRole, setIsChangingRole] = useState<string | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState<string | null>(null);

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPERADMIN:
        return 'destructive';
      case UserRole.ADMIN:
        return 'default';
      default:
        return 'secondary';
    }
  };

  const canChangeRole = (targetUser: User) => {
    if (currentUser.role === UserRole.SUPERADMIN && targetUser.id !== currentUser.id) {
      return true;
    }

    if (currentUser.role === UserRole.ADMIN && targetUser.role === UserRole.USER) {
      return true;
    }

    return false;
  };

  const getAvailableRoles = (targetUser: User): UserRole[] => {
    if (currentUser.role === UserRole.SUPERADMIN) {
      return [UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN];
    }

    if (currentUser.role === UserRole.ADMIN && targetUser.role === UserRole.USER) {
      return [UserRole.USER, UserRole.ADMIN];
    }

    return [targetUser.role];
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setIsChangingRole(userId);

    const result = await changeUserRoleAction(userId, newRole);

    if (result.success) {
      toast({
        title: 'Success',
        description: result.message || 'Role updated successfully!',
      });
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message || 'Failed to update role',
      });
    }

    setIsChangingRole(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setIsDeletingUser(userId);

    const result = await deleteUserAction(userId);

    if (result.success) {
      toast({
        title: 'Success',
        description: result.message || 'User deleted successfully!',
      });
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message || 'Failed to delete user',
      });
    }

    setIsDeletingUser(null);
  };

  return (
    <div className="overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-xl">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 hover:from-indigo-100 hover:via-purple-100 hover:to-pink-100">
            <TableHead className="text-base font-bold text-gray-800">Name</TableHead>
            <TableHead className="text-base font-bold text-gray-800">Email</TableHead>
            <TableHead className="text-base font-bold text-gray-800">Contact</TableHead>
            <TableHead className="text-base font-bold text-gray-800">Role</TableHead>
            <TableHead className="text-base font-bold text-gray-800">Status</TableHead>
            <TableHead className="text-base font-bold text-gray-800">Joined</TableHead>
            <TableHead className="text-right text-base font-bold text-gray-800">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.id}
              className={`border-b border-gray-100 transition-all duration-200 hover:scale-[1.01] hover:bg-gradient-to-r hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 hover:shadow-md ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
              }`}
            >
              <TableCell className="font-bold text-gray-900">{user.name}</TableCell>
              <TableCell className="text-gray-600">{user.email}</TableCell>
              <TableCell className="text-gray-600">{user.contactNumber || '—'}</TableCell>
              <TableCell>
                {canChangeRole(user) ? (
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                    disabled={isChangingRole === user.id}
                  >
                    <SelectTrigger className="w-[140px] cursor-pointer border-2 border-indigo-200 bg-gradient-to-r from-white to-indigo-50 font-semibold shadow-sm transition-all duration-200 hover:border-indigo-400 hover:shadow-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-indigo-200 shadow-xl">
                      {getAvailableRoles(user).map((role) => (
                        <SelectItem
                          key={role}
                          value={role}
                          className="cursor-pointer font-semibold transition-colors hover:bg-indigo-100"
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-indigo-600" />
                            <span className="capitalize">{role}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant={getRoleBadgeVariant(user.role)}
                    className="cursor-default px-3 py-1 text-sm font-bold shadow-sm"
                  >
                    {user.role}
                    {user.id === currentUser.id && ' (You)'}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {user.isVerified ? (
                  <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-green-700 shadow-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-bold">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-red-600 shadow-sm">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm font-bold">Unverified</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-semibold text-gray-700">
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                {user.id !== currentUser.id &&
                (currentUser.role === UserRole.ADMIN ||
                  currentUser.role === UserRole.SUPERADMIN) ? (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={() => console.log('Button clicked for user:', user.id)}
                        className="relative z-10 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg transition-all duration-200 hover:scale-110 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <MoreHorizontal className="h-6 w-6 text-white" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="z-[9999] w-56 rounded-lg border-2 border-indigo-200 bg-white shadow-2xl"
                      sideOffset={8}
                    >
                      <DropdownMenuLabel className="px-3 py-2 text-base font-bold text-gray-800">
                        User Actions
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-indigo-200" />
                      <div className="p-1">
                        {currentUser.role === UserRole.SUPERADMIN && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isDeletingUser === user.id}
                            className="cursor-pointer rounded-md px-3 py-2.5 font-semibold text-red-600 transition-colors hover:bg-red-50 focus:bg-red-100 focus:text-red-700"
                          >
                            <Trash2 className="mr-2 h-5 w-5" />
                            <span className="text-base">
                              {isDeletingUser === user.id ? 'Deleting...' : 'Delete User'}
                            </span>
                          </DropdownMenuItem>
                        )}
                        {currentUser.role === UserRole.ADMIN && (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            Only superadmins can delete users
                          </div>
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="text-sm text-gray-400">—</div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
