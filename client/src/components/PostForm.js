import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './PostForm.css';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
          setTitle(res.data.title);
          setContent(res.data.content);
          setAuthor(res.data.author);
          setCreatedAt(new Date(res.data.createdAt).toLocaleString());
        } catch (error) {
          console.error("Error fetching post:", error);
          alert('Failed to fetch the post for editing. Please try again.');
        }
      };
      fetchPost();
    } else {
      setCreatedAt(new Date().toLocaleString());
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !author) {
      alert('Please fill in all fields');
      return;
    }
    const postData = { title, content, author };
    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/posts/${id}`, postData);
        alert('Post updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/posts', postData);
        alert('Post created successfully!');
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving post:', error);
      alert(`An error occurred while ${id ? 'updating' : 'creating'} the post: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2>{id ? 'Edit Post' : 'Create New Post'}</h2>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="createdAt">Created At:</label>
        <input
          type="text"
          id="createdAt"
          value={createdAt}
          readOnly
        />
      </div>
      <button type="submit">{id ? 'Update' : 'Create'} Post</button>
    </form>
  );
}

export default PostForm;