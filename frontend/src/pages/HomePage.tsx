import { useState, useEffect } from 'react';
import { postsAPI } from '../Features/postsAPI';
import PostList from '../components/posts/PostList';
import CreatePost from '../components/posts/CreatePost';
import './HomePage.css';

const HomePage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const token = localStorage.getItem('token') || '';

  const fetchPosts = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      const res = await postsAPI.getFeed(token, reset ? 1 : page, 10);
      const response = res as any;
      const newPosts = Array.isArray(response) ? response : response?.data?.data || [];
      if (reset) {
        setPosts(newPosts);
        setPage(2);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
      }
      setHasMore(newPosts.length === 10);
    } catch (err: any) {
      console.error('Fetch feed error', err);
      setError(err.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(false);
    }
  };

  const handlePostCreated = (newPost: any) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId: number) => {
    setPosts(prev => prev.filter(p => p.postId !== postId));
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="home-page">
      <CreatePost onPostCreated={handlePostCreated} token={token} />
      <PostList
        posts={posts}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onPostDeleted={handlePostDeleted}
        token={token}
      />
    </div>
  );
};

export default HomePage;