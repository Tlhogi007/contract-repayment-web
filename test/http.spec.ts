import { describe, expect, it } from 'vitest';
import { HTTP_CONFLICT } from '../src/lib/http';

describe('http', () => {
  it('exports the conflict status constant', () => {
    expect(HTTP_CONFLICT).toBe(409);
  });
});
