const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://ammarmughal698:YmwSF47Kv5RRLcFm@cluster1.nknor.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster1', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', PostSchema);

app.post('/api/posts', async (req, res) => {
  try {
    console.log('Received post data:', req.body);
    const newPost = new Post({
      ...req.body,
      createdAt: new Date() // Ensure createdAt is set server-side
    });
    const savedPost = await newPost.save();
    console.log('Saved post:', savedPost);
    res.json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = search
      ? { $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } }
        ]}
      : {};

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    console.log('Fetching post with id:', req.params.id);
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log('Post not found');
      return res.status(404).json({ message: 'Post not found' });
    }
    console.log('Post found:', post);
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, author },
      { new: true, runValidators: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/posts', require('./routes/posts'));

module.exports = app;