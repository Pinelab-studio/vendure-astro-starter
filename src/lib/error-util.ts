// Generic utility functions

export interface ErrorResult {
  errorCode: string;
  message: string;
}

/**
 * Returns the result as an ErrorResult if it is an error result, otherwise null.
 */
export function isErrorResult(result: any): ErrorResult | null {
  if (!('errorCode' in result)) {
    return null;
  }
  return result as ErrorResult;
}

/**
 * Tries to parse the error message from a graphql error, or otherwise just error.message.
 */
export function getErrorMessage(error: any): string {
    if (error?.response?.errors?.[0]?.message) {
        return error.response.errors[0].message;
    }
    return error?.message ?? 'Unknown error';
}