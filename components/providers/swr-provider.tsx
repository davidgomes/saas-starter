'use client';

import { SWRConfig } from 'swr';

interface SWRProviderProps {
  children: React.ReactNode;
  fallback: {
    '/api/user': Promise<any>;
    '/api/team': Promise<any>;
  };
}

export function SWRProvider({ children, fallback }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fallback
      }}
    >
      {children}
    </SWRConfig>
  );
}