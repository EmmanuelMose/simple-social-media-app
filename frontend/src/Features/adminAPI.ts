import { ApiDomain } from '../utils/APIDomain';

export interface User {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
}

export interface Complaint {
  complaintId: number;
  userId: number;
  complaint: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalComplaints: number;
}

export interface ResultPost {
  postId: number;
  content: string;
  likes: number;
  comments: number;
  totalEngagement: number;
}

export const adminAPI = {
  getAllUsers: async (token: string, page = 1, limit = 10) => {
    const res = await fetch(`${ApiDomain}/admin/users?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  updateUserRole: async (token: string, userId: number, role: 'user' | 'admin') => {
    const res = await fetch(`${ApiDomain}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error('Failed to update role');
    return res.json();
  },

  deleteUser: async (token: string, userId: number) => {
    const res = await fetch(`${ApiDomain}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },

  getComplaints: async (token: string, page = 1, limit = 10) => {
    const res = await fetch(`${ApiDomain}/admin/complaints?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch complaints');
    return res.json();
  },

  resolveComplaint: async (token: string, complaintId: number, status: 'resolved' | 'dismissed') => {
    const res = await fetch(`${ApiDomain}/admin/complaints/${complaintId}/resolve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to resolve complaint');
    return res.json();
  },

  getAnalytics: async (token: string) => {
    const res = await fetch(`${ApiDomain}/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  getResults: async (token: string) => {
    const res = await fetch(`${ApiDomain}/admin/results`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch results');
    return res.json();
  },
};