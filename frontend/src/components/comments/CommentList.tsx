import { type Comment } from '../../Features/commentsAPI';
import { commentsAPI } from '../../Features/commentsAPI';
import './CommentList.css';

interface CommentListProps {
  comments: Comment[];
  onCommentDeleted?: (commentId: number) => void;
  token: string;
}

const CommentList = ({ comments, onCommentDeleted, token }: CommentListProps) => {
  const handleDelete = async (commentId: number) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await commentsAPI.delete(token, commentId);
      if (onCommentDeleted) onCommentDeleted(commentId);
    } catch (error) {
      console.error('Delete comment error', error);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="comment-list-empty">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.commentId} className="comment-item">
          <img
            src={comment.user?.avatar || 'https://ui-avatars.com/api/?name=' + (comment.user?.fullName || 'U')}
            alt={comment.user?.fullName}
            className="comment-avatar"
          />
          <div className="comment-body">
            <div className="comment-meta">
              <span className="comment-author">{comment.user?.fullName || 'Unknown'}</span>
              <span className="comment-date">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="comment-content">{comment.content}</p>
            <button
              onClick={() => handleDelete(comment.commentId)}
              className="comment-delete"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;