/**
 * React Router DOM → Next.js Compatibility Layer
 *
 * Re-exports Next.js navigation hooks with React Router API names.
 * This allows existing components to work with minimal changes during migration.
 *
 * Usage: Replace `import { ... } from 'react-router-dom'` with
 *        `import { ... } from '@/shared/lib/router-compat'`
 */

'use client';

export { useRouter as useNavigate } from 'next/navigation';
export { usePathname as useLocation } from 'next/navigation';
export { useParams } from 'next/navigation';
export { useSearchParams } from 'next/navigation';
export { default as Link } from 'next/link';

// useNavigate returns a router object in Next.js, but we need a function.
// This wrapper provides the navigate(path) API.
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useNavigateCompat() {
  const router = useRouter();
  const navigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );
  return navigate;
}
