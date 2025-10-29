import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';

export async function SWRProvider({ children }: { children: React.ReactNode }) {
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
