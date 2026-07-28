import { useState } from 'react';
import { commentsAPI } from '../../Features/commentsAPI';
import './CommentForm.css';

interface CommentFormProps {
  postId: number;
  onCommentAdded: (comment: any) => void;
  token: string;
}

const CommentForm = ({ postId, onCommentAdded, token }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await commentsAPI.create(token, postId, content);
      onCommentAdded(res.data);
      setContent('');
    } catch (error) {
      console.error('Comment creation error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="comment-input"
      />
      <button type="submit" className="comment-submit" disabled={loading}>
        {loading ? '...' : 'Send'}
      </button>
    </form>
  );
};

export default CommentForm;