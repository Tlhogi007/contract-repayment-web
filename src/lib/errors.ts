import { ApiError } from '../api/client';

/** Strip status-code noise from copy shown in the UI. */
function scrub(message: string): string {
  return message
    .replace(/\bHTTPS?\s*[:=]?\s*\d{3}\b/gi, '')
    .replace(/\bstatus(?:\s*code)?\s*[:=]?\s*\d{3}\b/gi, '')
    .replace(/\(\s*\d{3}\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim();
}

function looksTechnical(message: string): boolean {
  return /internal server error|bad gateway|service unavailable|econnrefused|networkerror|failed to fetch|request failed/i.test(
    message,
  );
}

function friendlyApiError(err: ApiError): string {
  const body = scrub(err.message);
  const lower = body.toLowerCase();

  switch (err.status) {
    case 400: {
      if (body && !looksTechnical(body)) {
        return body;
      }
      return 'Please check what you entered and try again.';
    }
    case 401:
      if (
        lower.includes('credential') ||
        lower.includes('password') ||
        lower.includes('unauthorized')
      ) {
        return 'Email or password is incorrect.';
      }
      return 'Please sign in again.';
    case 403:
      return 'You don’t have permission to do that.';
    case 404:
      return 'We couldn’t find that.';
    case 409:
      if (
        lower.includes('email') ||
        lower.includes('already') ||
        lower.includes('registered')
      ) {
        return 'You already have an account with this email. Sign in instead.';
      }
      return 'This was updated elsewhere. Refresh and try again.';
    case 429:
      return 'You’re doing that too quickly. Wait a moment and try again.';
    default:
      break;
  }

  if (err.status >= 500) {
    return 'Something went wrong on our side. Please try again.';
  }

  if (body && !looksTechnical(body)) {
    return body;
  }
  return 'Something went wrong. Please try again.';
}

export function errorMessage(err: unknown): string {
  if (typeof err === 'string' && err.trim()) {
    const cleaned = scrub(err);
    return cleaned || 'Something went wrong. Please try again.';
  }
  if (err instanceof ApiError) {
    return friendlyApiError(err);
  }
  if (err instanceof Error) {
    if (
      err.message === 'Failed to fetch' ||
      err.name === 'TypeError' ||
      looksTechnical(err.message)
    ) {
      return 'Couldn’t reach the server. Check your connection and try again.';
    }
    const cleaned = scrub(err.message);
    return cleaned || 'Something went wrong. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}
