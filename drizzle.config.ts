import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local (development) or .env (production)
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
} satisfies Config;
