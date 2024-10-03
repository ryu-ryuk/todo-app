const express = require('express');
const connectDB = require('./config/db'); // Adjust path if necessary
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Define Routes
const authRouter = require('./routes/auth');
const todosRouter = require('./routes/todos');

app.use('/api/auth', authRouter); 
app.use('/api/todos', todosRouter); 

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set the static folder to serve the React app
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Handle any route that isn't explicitly defined (i.e., React frontend routes)
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, msg: 'Server Error', error: err.message });
});

// Optional: Remove the below route if not needed
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
