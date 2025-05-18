import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Get all messages with optional filtering
router.get('/', async (req, res) => {
  try {
    const { type, location, tags } = req.query;
    let query = {};
    
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (tags) query.tags = { $in: tags.split(',') };
    
    const messages = await Message.find(query).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single message
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new message
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update message
router.patch('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(message);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete message
router.delete('/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a comment to a message
router.post('/:id/comments', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    message.comments.push(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Like a message
router.post('/:id/like', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    message.likes += 1;
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router; 