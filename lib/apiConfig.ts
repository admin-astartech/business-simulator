/**
 * API Configuration for Vercel deployment
 * Handles timeout limits and optimization for serverless functions
 */

export const API_CONFIG = {
  // Vercel timeout limits
  TIMEOUTS: {
    // Default timeout for most API routes
    DEFAULT: 10000, // 10 seconds
    // Extended timeout for AI/ML operations
    AI_OPERATIONS: 25000, // 25 seconds
    // Maximum timeout for complex operations
    MAXIMUM: 30000, // 30 seconds (Vercel limit)
  },
  
  // Rate limiting configuration
  RATE_LIMITS: {
    // Requests per minute per IP
    REQUESTS_PER_MINUTE: 60,
    // Burst limit for short periods
    BURST_LIMIT: 10,
  },
  
  // Batch processing limits
  BATCH_LIMITS: {
    // Maximum citizens to process in a single batch
    MAX_CITIZENS_BATCH: 10,
    // Maximum messages to process in a single batch
    MAX_MESSAGES_BATCH: 20,
  },
  
  // Retry configuration
  RETRY: {
    // Maximum retry attempts
    MAX_ATTEMPTS: 3,
    // Delay between retries (ms)
    RETRY_DELAY: 1000,
  }
}

/**
 * Wrapper function to handle API timeouts
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = API_CONFIG.TIMEOUTS.DEFAULT
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ])
}

/**
 * Batch processing helper for large datasets
 */
export function createBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}

/**
 * Retry wrapper for operations that might fail
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = API_CONFIG.RETRY.MAX_ATTEMPTS
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      console.warn(`Attempt ${attempt} failed:`, error)
      
      if (attempt < maxAttempts) {
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.RETRY.RETRY_DELAY * attempt)
        )
      }
    }
  }
  
  throw lastError!
}

/**
 * Response helper for consistent API responses
 */
export function createApiResponse<T>(
  data: T,
  success: boolean = true,
  message?: string,
  status: number = 200
) {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
    status
  }
}

/**
 * Error response helper
 */
export function createErrorResponse(
  error: string | Error,
  status: number = 500,
  details?: any
) {
  return {
    success: false,
    error: error instanceof Error ? error.message : error,
    details,
    timestamp: new Date().toISOString(),
    status
  }
}
