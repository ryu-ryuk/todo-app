const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo'); // Ensure you have a Todo model
const auth = require('../middleware/auth'); // Import your auth middleware

// Add Todo route
router.post('/', auth, async (req, res) => {
  console.log('Request object:', req); // Debugging line to inspect req object
  const { title, description } = req.body;
  
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, msg: 'User not authenticated' });
    }
    const newTodo = new Todo({
      title,
      description,
      user: req.user // Associate the todo with the authenticated user
    });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    console.error('Error in creating Todo:', err);
    res.status(500).send('Server Error');
  }
});

// Get Todos route
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user }); // Fetch todos for the authenticated user
    res.json(todos);
  } catch (err) {
    console.error('Error fetching Todos:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
