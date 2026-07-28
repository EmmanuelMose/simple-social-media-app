import { ApiDomain } from '../utils/APIDomain';

export const followersAPI = {
  follow: async (token: string, userId: number) => {
    const res = await fetch(`${ApiDomain}/followers/${userId}/follow`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to follow user');
    return res.json();
  },

  unfollow: async (token: string, userId: number) => {
    const res = await fetch(`${ApiDomain}/followers/${userId}/unfollow`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to unfollow user');
    return res.json();
  },

  getFollowers: async (token: string, userId: number) => {
    const res = await fetch(`${ApiDomain}/followers/${userId}/followers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch followers');
    return res.json();
  },

  getFollowing: async (token: string, userId: number) => {
    const res = await fetch(`${ApiDomain}/followers/${userId}/following`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch following');
    return res.json();
  },
};