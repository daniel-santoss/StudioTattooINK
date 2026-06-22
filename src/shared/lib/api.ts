import type { ApiResponse } from '@/shared/types';

const BASE_URL = '/api';

/**
 * Typed fetch wrapper for API Routes.
 * Centralizes error handling and response parsing.
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      return {
        data: null as unknown as T,
        success: false,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();
    return { data, success: true };
  } catch (error) {
    return {
      data: null as unknown as T,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
