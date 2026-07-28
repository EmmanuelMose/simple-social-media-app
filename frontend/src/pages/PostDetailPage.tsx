import PostDetail from '../components/posts/PostDetail';
import './PostDetailPage.css';

const PostDetailPage = () => {
  const token = localStorage.getItem('token') || '';

  return (
    <div className="post-detail-page">
      <PostDetail token={token} />
    </div>
  );
};

export default PostDetailPage;