import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, search]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts?page=${currentPage}&search=${search}`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${id}`);
        alert('Post deleted successfully!');
        fetchPosts(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete the post. Please try again.');
      }
    }
  };

  return (
    <div className="post-list">
      <h2>Blog Posts</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post._id}>
              <td>{post.title}</td>
              <td>{post.author}</td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              <td>
                <Link to={`/post/${post._id}`} className="view-btn">View</Link>
                <Link to={`/edit/${post._id}`} className="edit-btn">Edit</Link>
                <button onClick={() => handleDelete(post._id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default PostList;