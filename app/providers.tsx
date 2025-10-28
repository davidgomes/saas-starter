'use client';

import { SWRConfig } from 'swr';
import { getUser, getTeamForUser } from '@/lib/db/queries';

// ============================================================================
// SWR Fallback Data Configuration
// ============================================================================

const swrFallback = {
  '/api/user': getUser(),
  '/api/team': getTeamForUser()
};

// ============================================================================
// Providers Component
// ============================================================================

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Client-side providers wrapper
 * 
 * Configures SWR with initial fallback data from server queries.
 * Note: We do NOT await the queries here - only components that read
 * this data will suspend and wait for the data.
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <SWRConfig value={{ fallback: swrFallback }}>
      {children}
    </SWRConfig>
  );
}
