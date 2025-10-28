'use client';

import { SWRConfig } from 'swr';
import { getUser, getTeamForUser } from '@/lib/db/queries';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SWRConfig
      value={{
        fallback: {
          // We do NOT await here
          // Only components that read this data will suspend
          '/api/user': getUser(),
          '/api/team': getTeamForUser()
        },
        // Add error retry configuration
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        // Add refresh configuration
        refreshInterval: 0, // Disable automatic refresh by default
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}