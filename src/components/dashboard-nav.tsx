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
    <nav className="flex items-center gap-2">
      {links.map((link) => {
        if (!link.show) return null;

        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200',
              isActive
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl'
                : 'border-2 border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-indigo-700 hover:shadow-md',
            )}
          >
            <Icon className="h-5 w-5" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
