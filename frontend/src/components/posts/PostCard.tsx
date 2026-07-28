import { useState } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../../Features/postsAPI';
import { type Post } from '../../Features/postsAPI';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: number) => void;
  token: string;
}

const PostCard = ({ post, onDelete, token }: PostCardProps) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    try {
      if (liked) {
        await postsAPI.unlikePost(token, post.postId);
        setLikesCount(prev => prev - 1);
      } else {
        await postsAPI.likePost(token, post.postId);
        setLikesCount(prev => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Like error', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    setIsDeleting(true);
    try {
      await postsAPI.deletePost(token, post.postId);
      if (onDelete) onDelete(post.postId);
    } catch (error) {
      console.error('Delete error', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={post.user?.avatar || 'https://ui-avatars.com/api/?name=' + (post.user?.fullName || 'U')}
          alt={post.user?.fullName}
          className="post-avatar"
        />
        <div className="post-user">
          <Link to={`/profile/${post.userId}`} className="post-username">
            {post.user?.fullName || 'Unknown'}
          </Link>
          <span className="post-date">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <button
          onClick={handleDelete}
          className="post-delete"
          disabled={isDeleting}
          title="Delete post"
        >
          {isDeleting ? '...' : '✕'}
        </button>
      </div>

      <p className="post-content">{post.content}</p>

      {post.mediaUrl && post.mediaType !== 'none' && (
        <div className="post-media">
          {post.mediaType === 'image' ? (
            <img src={post.mediaUrl} alt="Post media" />
          ) : (
            <video src={post.mediaUrl} controls />
          )}
        </div>
      )}

      <div className="post-actions">
        <button className="like-btn" onClick={handleLike}>
          <span className="like-icon">{liked ? '❤️' : '🤍'}</span>
          <span className="like-count">{likesCount}</span>
        </button>
        <Link to={`/post/${post.postId}`} className="comment-link">
          <span className="comment-icon">💬</span>
          <span className="comment-count">{post.commentsCount || 0}</span>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;