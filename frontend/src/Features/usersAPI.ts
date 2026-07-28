import { ApiDomain } from '../utils/APIDomain';

export interface UserProfile {
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
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowed: boolean;
  viewCount: number;
}

export interface UpdateProfilePayload {
  fullName?: string;
  bio?: string | null;
  avatar?: string | null;
}

export const usersAPI = {
  getProfile: async (token: string, userId: number): Promise<UserProfile> => {
    const res = await fetch(`${ApiDomain}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    const data = await res.json();
    return data.data;
  },

  updateProfile: async (token: string, payload: UpdateProfilePayload) => {
    const res = await fetch(`${ApiDomain}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  searchUsers: async (token: string, query: string) => {
    const res = await fetch(`${ApiDomain}/users/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to search users');
    return res.json();
  },
};