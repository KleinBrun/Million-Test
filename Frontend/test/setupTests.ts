import { vi, afterEach } from 'vitest';
import 'whatwg-fetch';

vi.stubGlobal('fetch', vi.fn());

vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:5228/api/Property');

afterEach(() => {
  (fetch as unknown as { mockReset: () => void }).mockReset?.();
});

vi.stubGlobal('localStorage', {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
});

Object.defineProperty(window, 'location', {
  value: { href: 'http://localhost:3000', reload: vi.fn() },
  writable: true,
});

vi.stubGlobal('navigator', {
  share: vi.fn(),
  clipboard: { writeText: vi.fn() },
});
