import { type Post } from '../../Features/postsAPI';
import PostCard from './PostCard';
import LoadingSpinner from '../common/LoadingSpinner';
import './PostList.css';

interface PostListProps {
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore?: () => void;
  onPostDeleted?: (postId: number) => void;
  token: string;
}

const PostList = ({
  posts,
  loading,
  hasMore,
  onLoadMore,
  onPostDeleted,
  token,
}: PostListProps) => {
  if (loading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  if (posts.length === 0 && !loading) {
    return (
      <div className="post-list-empty">
        <p>No posts yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={post}
          onDelete={onPostDeleted}
          token={token}
        />
      ))}
      {hasMore && (
        <div className="post-list-load-more">
          <button onClick={onLoadMore} className="load-more-btn">
            Load more
          </button>
        </div>
      )}
      {loading && posts.length > 0 && (
        <div className="post-list-loading-more">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default PostList;