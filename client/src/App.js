import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Starbucks Blogs</h1>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/new">Create New Post</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/new" element={<PostForm />} />
            <Route path="/edit/:id" element={<PostForm />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; 2024 Starbucks Blogs. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;