import { ApiDomain } from '../utils/APIDomain';

export const uploadAPI = {
  uploadFile: async (token: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${ApiDomain}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
};