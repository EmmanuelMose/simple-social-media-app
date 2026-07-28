import { ApiDomain } from '../utils/APIDomain';

export interface Comment {
  commentId: number;
  content: string;
  userId: number;
  postId: number;
  user?: {
    userId: number;
    username: string;
    fullName: string;
    avatar: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export const commentsAPI = {
  getByPost: async (token: string, postId: number) => {
    const res = await fetch(`${ApiDomain}/comments/post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },

  create: async (token: string, postId: number, content: string) => {
    const res = await fetch(`${ApiDomain}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, content }),
    });
    if (!res.ok) throw new Error('Failed to create comment');
    return res.json();
  },

  delete: async (token: string, commentId: number) => {
    const res = await fetch(`${ApiDomain}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete comment');
    return res.json();
  },
};