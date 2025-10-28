import { SWRConfiguration } from 'swr';
import { getUser, getTeamForUser } from '@/lib/db/queries';

/**
 * Creates the SWR configuration for the root layout.
 * Initializes fallback data for API endpoints to avoid waterfalls
 * and enable React Suspense for components that depend on this data.
 *
 * Note: We do NOT await here. Only components that read this data will suspend.
 */
export function createSWRConfig(): SWRConfiguration {
  return {
    fallback: {
      '/api/user': getUser(),
      '/api/team': getTeamForUser()
    }
  };
}
