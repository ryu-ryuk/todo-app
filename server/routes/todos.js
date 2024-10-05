const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

// Todo route
router.post('/', auth, async (req, res) => {
  console.log('Received todo creation request:', req.body);
  const { title, description } = req.body;

  try {
    // Checks if user is authenticated (from auth middleware)
    if (!req.user) {
      return res.status(401).json({ success: false, msg: 'User not authenticated' });
    }

    // Creates a new Todo with the userId from the authenticated user
    const newTodo = new Todo({
      title,
      description,
      user: req.user.userId // Access userId from req.user
    });

    const savedTodo = await newTodo.save();
    console.log('Todo created successfully:', savedTodo);
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error('Error in creating Todo:', err);
    res.status(500).json({ success: false, msg: 'Server Error', error: err.message });
  }
});

// Get Todos route
router.get('/', auth, async (req, res) => {
  try {
    // Fetch todos for the authenticated user
    const todos = await Todo.find({ user: req.user.userId }); // Access userId from req.user
    res.json(todos);
  } catch (err) {
    console.error('Error fetching Todos:', err);
    res.status(500).json({ success: false, msg: 'Server Error', error: err.message });
  }
});

module.exports = router;
