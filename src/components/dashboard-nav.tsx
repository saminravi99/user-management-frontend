'use client';

import { cn } from '@/lib/utils';
import { User, UserRole } from '@/types';
import { Home, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardNavProps {
  user: User;
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();

  const links = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: Home,
      show: true,
    },
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: Settings,
      show: true,
    },
    {
      href: '/dashboard/admin',
      label: 'User Management',
      icon: Users,
      show: user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN,
    },
  ];

  return (
    <nav className="flex items-center gap-1">
      {links.map((link) => {
        if (!link.show) return null;

        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
