'use client';

import { Header } from '@/components/header';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
