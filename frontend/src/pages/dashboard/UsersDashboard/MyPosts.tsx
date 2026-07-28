import { useState, useEffect } from 'react';
import { postsAPI } from '../../../Features/postsAPI';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import PostCard from '../../../components/posts/PostCard';
import './MyPosts.css';

const MyPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    if (!user) return;
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        const res = await postsAPI.getFeed(token, 1, 100);
        const myPosts = res.data.data.filter((p: any) => p.userId === user.userId);
        setPosts(myPosts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, [user, token]);

  const handleDelete = (postId: number) => {
    setPosts(prev => prev.filter(p => p.postId !== postId));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="my-posts">
      <h1>My Posts</h1>
      {posts.length === 0 ? (
        <p className="empty-msg">You haven't posted anything yet.</p>
      ) : (
        posts.map(post => (
          <PostCard key={post.postId} post={post} onDelete={handleDelete} token={token} />
        ))
      )}
    </div>
  );
};

export default MyPosts;