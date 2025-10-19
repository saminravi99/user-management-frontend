'use client';

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
    // Super admin can change anyone's role
    if (currentUser.role === UserRole.SUPERADMIN && targetUser.id !== currentUser.id) {
      return true;
    }

    // Admin can only promote users to admin
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.contactNumber || '—'}</TableCell>
              <TableCell>
                {canChangeRole(user) ? (
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                    disabled={isChangingRole === user.id}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableRoles(user).map((role) => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center gap-2">
                            <Shield className="h-3 w-3" />
                            <span className="capitalize">{role}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                    {user.id === currentUser.id && ' (You)'}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {user.isVerified ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-gray-400">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm">Unverified</span>
                  </div>
                )}
              </TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                {user.id !== currentUser.id && currentUser.role === UserRole.SUPERADMIN && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 focus:text-red-600"
                        disabled={isDeletingUser === user.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeletingUser === user.id ? 'Deleting...' : 'Delete User'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
