const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogPost');

// Create a new blog post
router.post('/', async (req, res) => {
  try {
    const newPost = new BlogPost(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single blog post
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a blog post
router.put('/:id', async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;