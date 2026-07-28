import { ApiDomain } from '../utils/APIDomain';

// types inlined
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  fullName: string;
  bio?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      userId: number;
      username: string;
      email: string;
      fullName: string;
      bio: string | null;
      avatar: string | null;
      role: 'user' | 'admin';
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  };
}

export const authAPI = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await fetch(`${ApiDomain}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await fetch(`${ApiDomain}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  getMe: async (token: string) => {
    const res = await fetch(`${ApiDomain}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },
};