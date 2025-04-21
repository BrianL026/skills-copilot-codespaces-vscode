// Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Comment = require('./models/comment'); // Import the Comment model
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'commentsDB'; // Replace with your database name
const port = 3000;
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connect to MongoDB
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
  const db = client.db(dbName);
  // Initialize the Comment model with the database connection
  Comment.init(db);
});
// Define the Comment schema
const commentSchema = new mongoose.Schema({
  name: String,
  email: String,
  comment: String,
  date: { type: Date, default: Date.now },
});
// Create the Comment model
const Comment = mongoose.model('Comment', commentSchema);
// Define the API endpoints
app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/comments', async (req, res) => {
  const comment = new Comment({
    name: req.body.name,
    email: req.body.email,
    comment: req.body.comment,
  });
  try {
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.put('/comments/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send('Comment not found');
    comment.name = req.body.name;
    comment.email = req.body.email;
    comment.comment = req.body.comment;
    const updatedComment = await comment.save();
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.delete('/comments/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send('Comment not found');
    await comment.remove();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// Close the MongoDB connection when the server is stopped
process.on('SIGINT', () => {
  client.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
// Export the app for testing
module.exports = app;
// Export the MongoDB client for testing
module.exports.client = client;
// Export the database name for testing
module.exports.dbName = dbName;
// Export the port for testing
module.exports.port = port;
// Export the cors options for testing
module.exports.corsOptions = corsOptions;
// Export the Comment model for testing
module.exports.Comment = Comment;
// Export the comment schema for testing
module.exports.commentSchema = commentSchema;
// Export the express app for testing
module.exports.app = app;
// Export the body parser for testing
module.exports.bodyParser = bodyParser;
// Export the express for testing
module.exports.express = express;
// Export the cors for testing
module.exports.cors = cors;
// Export the mongoose for testing
module.exports.mongoose = mongoose;
// Export the MongoClient for testing
module.exports.MongoClient = MongoClient;
// Export the uri for testing
module.exports.uri = uri;
// Export the db for testing
module.exports.db = client.db(dbName);
// Export the port for testing
module.exports.port = port;
// Export the cors options for testing
module.exports.corsOptions = corsOptions;
// Export the comment model for testing
module.exports.Comment = Comment;
// Export the comment schema for testing
module.exports.commentSchema = commentSchema;
