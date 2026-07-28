import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postsAPI, type Post } from '../../Features/postsAPI';
import { commentsAPI } from '../../Features/commentsAPI';
import CommentList from '../../components/comments/CommentList';
import CommentForm from '../../components/comments/CommentForm';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import PostCard from './PostCard';
import './PostDetail.css';

interface PostDetailProps {
  token: string;
}

const PostDetail = ({ token }: PostDetailProps) => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!postId) return;
    try {
      setLoading(true);
      const postRes = await postsAPI.getPost(token, parseInt(postId));
      setPost(postRes.data);
      const commentsRes = await commentsAPI.getByPost(token, parseInt(postId));
      setComments(commentsRes.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postId, token]);

  const handleCommentAdded = (newComment: any) => {
    setComments(prev => [newComment, ...prev]);
    // update comment count on post
    if (post) {
      setPost({
        ...post,
        commentsCount: (post.commentsCount || 0) + 1,
      });
    }
  };

  const handleCommentDeleted = (commentId: number) => {
    setComments(prev => prev.filter(c => c.commentId !== commentId));
    if (post) {
      setPost({
        ...post,
        commentsCount: Math.max(0, (post.commentsCount || 0) - 1),
      });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return <ErrorMessage message="Post not found" />;

  return (
    <div className="post-detail">
      <PostCard post={post} token={token} />
      <div className="comments-section">
        <h3>Comments</h3>
        <CommentForm postId={post.postId} onCommentAdded={handleCommentAdded} token={token} />
        <CommentList
          comments={comments}
          onCommentDeleted={handleCommentDeleted}
          token={token}
        />
      </div>
    </div>
  );
};

export default PostDetail;