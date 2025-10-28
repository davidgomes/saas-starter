import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRProvider } from './swr-provider';

interface ServerDataProviderProps {
  children: React.ReactNode;
}

export async function ServerDataProvider({ children }: ServerDataProviderProps) {
  // Fetch data on the server
  const [user, team] = await Promise.all([
    getUser().catch(() => null),
    getTeamForUser().catch(() => null)
  ]);

  const fallbackData = {
    '/api/user': user,
    '/api/team': team
  };

  return (
    <SWRProvider fallbackData={fallbackData}>
      {children}
    </SWRProvider>
  );
}