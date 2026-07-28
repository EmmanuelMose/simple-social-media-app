import { useState } from 'react';
import { postsAPI } from '../../Features/postsAPI';
import { uploadAPI } from '../../Features/uploadsAPI';
import './CreatePost.css';

interface CreatePostProps {
  onPostCreated: (post: any) => void;
  token: string;
}

const CreatePost = ({ onPostCreated, token }: CreatePostProps) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please write something');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let mediaUrl: string | undefined;
      let mediaType: 'image' | 'video' | 'none' = 'none';

      if (file) {
        const uploadRes = await uploadAPI.uploadFile(token, file);
        mediaUrl = uploadRes.data.url;
        mediaType = uploadRes.data.mediaType;
      }

      const postRes = await postsAPI.createPost(token, {
        content,
        mediaUrl,
        mediaType,
      });

      onPostCreated(postRes.data);
      setContent('');
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          className="post-textarea"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <div className="create-post-actions">
          <label htmlFor="file-input" className="file-input-label">
            📎 Attach
            <input
              id="file-input"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="file-input-hidden"
            />
          </label>
          {file && <span className="file-name">{file.name}</span>}
          <button type="submit" className="post-submit-btn" disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
        {error && <div className="post-error">{error}</div>}
      </form>
    </div>
  );
};

export default CreatePost;