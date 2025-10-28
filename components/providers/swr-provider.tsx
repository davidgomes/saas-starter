'use client';

import { SWRConfig } from 'swr';
import { getUser, getTeamForUser } from '@/lib/db/queries';

interface SWRProviderProps {
  children: React.ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fallback: {
          // We do NOT await here
          // Only components that read this data will suspend
          '/api/user': getUser(),
          '/api/team': getTeamForUser()
        }
      }}
    >
      {children}
    </SWRConfig>
  );
}