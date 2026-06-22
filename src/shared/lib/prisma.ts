import 'server-only';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Prisma 7: o Client em runtime usa um driver adapter sobre a conexão
// POOLED (DATABASE_URL / Supavisor :6543). A conexão direta (:5432) é usada
// só pela CLI nas migrations, configurada em prisma.config.ts.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Singleton: evita esgotar conexões com hot-reload do Next em desenvolvimento.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
