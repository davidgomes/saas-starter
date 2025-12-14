'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Users, Settings, Shield, Activity } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: '/dashboard', icon: Users, label: 'Team' },
  { href: '/dashboard/general', icon: Settings, label: 'General' },
  { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
  { href: '/dashboard/security', icon: Shield, label: 'Security' }
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`w-64 bg-white lg:bg-gray-50 border-r border-gray-200 lg:block ${
        isOpen ? 'block' : 'hidden'
      } lg:relative absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      role="navigation"
      aria-label="Dashboard navigation"
    >
      <nav className="h-full overflow-y-auto p-4" role="menubar">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className={`shadow-none my-1 w-full justify-start ${
                pathname === item.href ? 'bg-gray-100' : ''
              }`}
              onClick={onClose}
              role="menuitem"
              aria-current={pathname === item.href ? 'page' : undefined}
              aria-label={`Navigate to ${item.label}`}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}