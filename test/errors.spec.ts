import { describe, expect, it } from 'vitest';
import { ApiError } from '../src/api/api-error-class';
import { errorMessage } from '../src/lib/errors';

describe('errorMessage', () => {
  it('maps duplicate register conflict to a friendly account message', () => {
    expect(errorMessage(new ApiError('Email already registered', 409))).toBe(
      'You already have an account with this email. Sign in instead.',
    );
  });

  it('maps invalid login credentials to a friendly password message', () => {
    expect(errorMessage(new ApiError('Invalid credentials', 401))).toBe(
      'Email or password is incorrect.',
    );
  });

  it('maps session-style 401 without credential wording', () => {
    expect(errorMessage(new ApiError('Token expired', 401))).toBe(
      'Please sign in again.',
    );
  });

  it('maps stale contract conflict separately from email conflict', () => {
    expect(
      errorMessage(
        new ApiError('Contract was modified by another request', 409),
      ),
    ).toBe('This was updated elsewhere. Refresh and try again.');
  });

  it('maps common client/server statuses', () => {
    expect(errorMessage(new ApiError('nope', 400))).toBe('nope');
    expect(errorMessage(new ApiError('Request failed', 400))).toBe(
      'Please check what you entered and try again.',
    );
    expect(errorMessage(new ApiError('forbidden', 403))).toBe(
      'You don’t have permission to do that.',
    );
    expect(errorMessage(new ApiError('missing', 404))).toBe(
      'We couldn’t find that.',
    );
    expect(errorMessage(new ApiError('slow down', 429))).toBe(
      'You’re doing that too quickly. Wait a moment and try again.',
    );
    expect(errorMessage(new ApiError('Internal Server Error', 503))).toBe(
      'Something went wrong on our side. Please try again.',
    );
  });

  it('keeps clean non-technical API bodies for uncommon statuses', () => {
    expect(errorMessage(new ApiError('Payment required soon', 402))).toBe(
      'Payment required soon',
    );
  });

  it('falls back for empty or technical uncommon statuses', () => {
    expect(errorMessage(new ApiError('Request failed', 402))).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('keeps clean string messages and scrubs status noise', () => {
    expect(errorMessage('Principal must be a positive amount')).toBe(
      'Principal must be a positive amount',
    );
    expect(errorMessage('Failed (503)')).toBe('Failed');
    expect(errorMessage('HTTP 503')).toBe(
      'Something went wrong. Please try again.',
    );
    expect(errorMessage('status code: 502 boom')).toBe('boom');
    expect(errorMessage('   ')).toBe('Something went wrong. Please try again.');
  });

  it('does not strip bare three-digit numbers from copy', () => {
    expect(errorMessage('Room 503 is unavailable')).toBe(
      'Room 503 is unavailable',
    );
  });

  it('handles network and unknown failures', () => {
    expect(errorMessage(new TypeError('Failed to fetch'))).toBe(
      'Couldn’t reach the server. Check your connection and try again.',
    );
    expect(errorMessage(new Error('ECONNREFUSED somewhere'))).toBe(
      'Couldn’t reach the server. Check your connection and try again.',
    );
    expect(
      errorMessage(new Error('NetworkError when attempting to fetch')),
    ).toBe('Couldn’t reach the server. Check your connection and try again.');
    expect(errorMessage(new Error('Temporary glitch'))).toBe(
      'Temporary glitch',
    );
    expect(errorMessage(new Error('status: 418'))).toBe(
      'Something went wrong. Please try again.',
    );
    expect(errorMessage(new Error(''))).toBe(
      'Something went wrong. Please try again.',
    );
    expect(errorMessage(null)).toBe('Something went wrong. Please try again.');
  });
});
