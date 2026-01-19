import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signUp, signIn } from './auth';
import * as users from '@/lib/users';
import * as auth from '@/lib/auth';

vi.mock('@/lib/users', () => ({
  getUserByEmail: vi.fn(),
  createUser: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  setSession: vi.fn(),
  removeSession: vi.fn(),
  hashPassword: vi.fn((p) => `hashed_${p}`),
  verifyPassword: vi.fn((p, h) => h === `hashed_${p}`),
}));

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a new user and set session', async () => {
      vi.mocked(users.getUserByEmail).mockResolvedValue(undefined);
      vi.mocked(users.createUser).mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password123',
        created_at: new Date(),
      } as any);

      const result = await signUp('Test User', 'test@example.com', 'password123');

      expect(result).toEqual({ error: null });
      expect(users.createUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password123',
      });
      expect(auth.setSession).toHaveBeenCalled();
    });

    it('should return error if user exists', async () => {
      vi.mocked(users.getUserByEmail).mockResolvedValue({
        id: 1,
        name: 'Existing User',
        email: 'test@example.com',
        password: 'hash',
        created_at: new Date(),
      } as any);

      const result = await signUp('New User', 'test@example.com', 'password');

      expect(result.error).toBe('User already exists');
      expect(users.createUser).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should sign in with correct credentials', async () => {
      vi.mocked(users.getUserByEmail).mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password123',
        created_at: new Date(),
      } as any);

      const result = await signIn('test@example.com', 'password123');

      expect(result).toEqual({ error: null });
      expect(auth.setSession).toHaveBeenCalled();
    });

    it('should return error with incorrect password', async () => {
      vi.mocked(users.getUserByEmail).mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password123',
        created_at: new Date(),
      } as any);

      const result = await signIn('test@example.com', 'wrongpassword');

      expect(result.error).toBe('Invalid credentials');
      expect(auth.setSession).not.toHaveBeenCalled();
    });
  });
});
