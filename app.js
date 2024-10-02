const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Init Middleware
app.use(express.json()); // Middleware to parse JSON requests

// Root endpoint
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define Routes
const authRouter = require('./routes/auth');
const todosRouter = require('./routes/todos');

app.use('/api/auth', authRouter); // Auth routes
app.use('/api/todos', todosRouter); // Todos routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
