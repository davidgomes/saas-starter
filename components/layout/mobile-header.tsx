'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  onToggleSidebar: () => void;
}

export function MobileHeader({ onToggleSidebar }: MobileHeaderProps) {
  return (
    <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
      <div className="flex items-center">
        <h1 className="font-medium text-lg">Settings</h1>
      </div>
      <Button
        className="-mr-3"
        variant="ghost"
        onClick={onToggleSidebar}
        aria-label="Toggle navigation menu"
        aria-expanded="false"
        aria-controls="sidebar-navigation"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
    </div>
  );
}