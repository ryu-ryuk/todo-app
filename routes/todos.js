const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo'); // Ensure you have a Todo model
const auth = require('../middleware/auth'); // Import your auth middleware

// Add Todo route
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new Todo({
      title,
      description,
      user: req.user // Associate the todo with the authenticated user
    });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get Todos route
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user }); // Fetch todos for the authenticated user
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
