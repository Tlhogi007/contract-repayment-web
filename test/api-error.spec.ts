import { describe, expect, it } from 'vitest';
import { ApiError } from '../src/api/api-error-class';
import { isUnauthorized } from '../src/lib/api-error';

describe('isUnauthorized', () => {
  it('detects 401 ApiError', () => {
    expect(isUnauthorized(new ApiError('Invalid credentials', 401))).toBe(true);
  });

  it('ignores other statuses and plain errors', () => {
    expect(isUnauthorized(new ApiError('Email already registered', 409))).toBe(
      false,
    );
    expect(isUnauthorized(new Error('boom'))).toBe(false);
  });
});
