import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './PostDetail.css';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching post with id:', id);
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        console.log('Response:', res);
        if (res.data) {
          setPost(res.data);
          setLoading(false);
        } else {
          setError('Post data is empty');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching post:', error.response || error);
        setError(`Failed to load the post. ${error.response ? error.response.data.message : error.message}`);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete the post. Please try again.');
      }
    }
  };

  if (loading) return <div className="post-detail loading">Loading...</div>;
  if (error) return <div className="post-detail error">{error}</div>;
  if (!post) return <div className="post-detail not-found">Post not found.</div>;

  return (
    <div className="post-detail">
      <h2>{post.title}</h2>
      <div className="meta">
        <p><strong>Author:</strong> {post.author}</p>
        <p><strong>Created:</strong> {new Date(post.createdAt).toLocaleString()}</p>
      </div>
      <div className="content">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="actions">
        <Link to={`/edit/${post._id}`} className="edit-btn">Edit</Link>
        <button onClick={handleDelete} className="delete-btn">Delete</button>
        <Link to="/" className="back-btn">Back to List</Link>
      </div>
    </div>
  );
}

export default PostDetail;