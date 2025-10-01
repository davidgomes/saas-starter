'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Users, Settings, Shield, Activity, Menu } from 'lucide-react';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle escape key for closing mobile sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSidebarOpen]);

  // Auto-focus first navigation link when sidebar opens
  useEffect(() => {
    if (isSidebarOpen) {
      const firstNavItem = document.querySelector('#sidebar [role="list"] li:first-child button');
      if (firstNavItem instanceof HTMLElement) {
        setTimeout(() => firstNavItem.focus(), 100);
      }
    }
  }, [isSidebarOpen]);

  const navItems = [
    { href: '/dashboard', icon: Users, label: 'Team' },
    { href: '/dashboard/general', icon: Settings, label: 'General' },
    { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
    { href: '/dashboard/security', icon: Shield, label: 'Security' }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>
      
      {/* Mobile header */}
      <header className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
        <div className="flex items-center">
          <h1 className="font-medium">Settings</h1>
        </div>
        <Button
          className="-mr-3"
          variant="ghost"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsSidebarOpen(!isSidebarOpen);
              e.preventDefault();
            }
          }}
          aria-expanded={isSidebarOpen}
          aria-controls="sidebar"
          aria-label={`${isSidebarOpen ? 'Close' : 'Open'} navigation menu`}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <aside
          id="sidebar"
          className={`w-64 bg-white lg:bg-gray-50 border-r border-gray-200 lg:block ${
            isSidebarOpen ? 'block' : 'hidden'
          } lg:relative absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-label="Settings navigation"
        >
          <nav 
            className="h-full overflow-y-auto p-4"
            role="navigation"
            aria-label="Main settings navigation"
          >
            <ul role="list" className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    passHref
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    <Button
                      variant={pathname === item.href ? 'secondary' : 'ghost'}
                      className={`shadow-none my-1 w-full justify-start ${
                        pathname === item.href ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setIsSidebarOpen(false)}
                      aria-describedby={pathname === item.href ? 'current-page' : undefined}
                    >
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.label}</span>
                      {pathname === item.href && (
                        <span id="current-page" className="sr-only">
                          Current page
                        </span>
                      )}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main 
          id="main-content"
          className="flex-1 overflow-y-auto p-0 lg:p-4"
          role="main"
          aria-label="Dashboard content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
