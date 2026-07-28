import { ApiDomain } from '../utils/APIDomain';

export interface Post {
  postId: number;
  content: string;
  mediaUrl: string | null;
  mediaType: 'image' | 'video' | 'none';
  userId: number;
  user?: {
    userId: number;
    username: string;
    fullName: string;
    avatar: string | null;
  };
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export interface CreatePostPayload {
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'none';
}

export interface ApiResponse<T> {
  filter(arg0: (p: any) => boolean): unknown;
  success: boolean;
  message?: string;
  data: T;
}

export const postsAPI = {
  getFeed: async (token: string, page = 1, limit = 10): Promise<ApiResponse<Post[]>> => {
    const res = await fetch(`${ApiDomain}/posts/feed?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to fetch feed (${res.status})`);
    return res.json();
  },

  getPost: async (token: string, postId: number): Promise<ApiResponse<Post>> => {
    const res = await fetch(`${ApiDomain}/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to fetch post (${res.status})`);
    return res.json();
  },

  createPost: async (token: string, payload: CreatePostPayload): Promise<ApiResponse<Post>> => {
    const res = await fetch(`${ApiDomain}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to create post (${res.status})`);
    return res.json();
  },

  deletePost: async (token: string, postId: number): Promise<ApiResponse<null>> => {
    const res = await fetch(`${ApiDomain}/posts/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to delete post (${res.status})`);
    return res.json();
  },

  likePost: async (token: string, postId: number): Promise<ApiResponse<{ likeId: number }>> => {
    const res = await fetch(`${ApiDomain}/likes/${postId}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to like post (${res.status})`);
    return res.json();
  },

  unlikePost: async (token: string, postId: number): Promise<ApiResponse<null>> => {
    const res = await fetch(`${ApiDomain}/likes/${postId}/unlike`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to unlike post (${res.status})`);
    return res.json();
  },
};