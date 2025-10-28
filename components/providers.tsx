'use client';

import { SWRConfig } from 'swr';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="ui-theme"
    >
      <SWRConfig
        value={{
          fallback: {
            // We do NOT await here
            // Only components that read this data will suspend
            '/api/user': getUser(),
            '/api/team': getTeamForUser()
          },
          errorRetryCount: 3,
          errorRetryInterval: 5000,
          revalidateOnFocus: false,
          revalidateOnReconnect: true,
        }}
      >
        {children}
      </SWRConfig>
    </ThemeProvider>
  );
}