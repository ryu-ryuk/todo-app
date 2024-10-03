import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Button, Container, Typography, List, ListItem, ListItemText,
  Tabs, Tab, Box, IconButton, Checkbox, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Alert } from '@mui/material';

function App() {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [todos, setTodos] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const newToken = response.data.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      fetchTodos();
      showSnackbar('Logged in successfully', 'success');
    } catch (error) {
      console.error('Login error', error);
      showSnackbar('Login failed', 'error');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { email: newUserEmail, password: newUserPassword });
      setNewUserEmail('');
      setNewUserPassword('');
      showSnackbar('Registration successful! Please log in.', 'success');
      setTabValue(0); // Switch back to login tab after registration
    } catch (error) {
      console.error('Registration error', error);
      showSnackbar('Registration failed', 'error');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setTodos([]);
    showSnackbar('Logged out successfully', 'success');
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos', error);
      showSnackbar('Failed to fetch todos', 'error');
    }
  };

  const addTodo = async () => {
    try {
      await axios.post(`${API_URL}/todos`, newTodo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewTodo({ title: '', description: '' });
      fetchTodos();
      showSnackbar('Todo added successfully', 'success');
    } catch (error) {
      console.error('Error adding todo', error);
      showSnackbar('Failed to add todo', 'error');
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      await axios.put(`${API_URL}/todos/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTodos();
      showSnackbar('Todo updated successfully', 'success');
    } catch (error) {
      console.error('Error updating todo', error);
      showSnackbar('Failed to update todo', 'error');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTodos();
      showSnackbar('Todo deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting todo', error);
      showSnackbar('Failed to delete todo', 'error');
    }
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTodo(null);
  };

  const handleSaveEdit = () => {
    updateTodo(editingTodo._id, editingTodo);
    handleCloseDialog();
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container>
      <Tabs value={tabValue} onChange={handleChangeTab} centered>
        <Tab label={token ? "Todos" : "Login"} />
        {!token && <Tab label="Register" />}
        {token && <Tab label="Add Todo" />}
      </Tabs>

      <Box hidden={tabValue !== 0}>
        {!token ? (
          <>
            <Typography variant="h4">Login</Typography>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
            <Button onClick={handleLogin} variant="contained" color="primary" fullWidth>Login</Button>
          </>
        ) : (
          <>
            <Typography variant="h4">Todo List</Typography>
            <List>
              {todos.map((todo) => (
                <ListItem key={todo._id} secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(todo)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo._id)}>
                      <Delete />
                    </IconButton>
                  </>
                }>
                  <Checkbox
                    edge="start"
                    checked={todo.completed}
                    onChange={() => updateTodo(todo._id, { completed: !todo.completed })}
                  />
                  <ListItemText 
                    primary={todo.title} 
                    secondary={todo.description}
                    style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                  />
                </ListItem>
              ))}
            </List>
            <Button onClick={handleLogout} variant="contained" color="secondary">Logout</Button>
          </>
        )}
      </Box>

      <Box hidden={tabValue !== 1 || !token}>
        <Typography variant="h4">Add New Todo</Typography>
        <TextField 
          label="Title" 
          value={newTodo.title} 
          onChange={(e) => setNewTodo({...newTodo, title: e.target.value})} 
          fullWidth 
          margin="normal"
        />
        <TextField 
          label="Description" 
          value={newTodo.description} 
          onChange={(e) => setNewTodo({...newTodo, description: e.target.value})} 
          fullWidth 
          margin="normal"
          multiline
          rows={4}
        />
        <Button onClick={addTodo} variant="contained" color="primary" fullWidth>Add Todo</Button>
      </Box>

      <Box hidden={tabValue !== 1 && !token}>
        <Typography variant="h4">Register</Typography>
        <TextField 
              label="Username" 
              value={newUserUsername} 
              onChange={(e) => setNewUserUsername(e.target.value)} 
              fullWidth 
              margin="normal" 
        />
        <TextField 
              label="Email" 
              value={newUserEmail} 
              onChange={(e) => setNewUserEmail(e.target.value)} 
              fullWidth 
              margin="normal" 
       />
       <TextField 
              label="Password" 
              type="password" 
              value={newUserPassword} 
              onChange={(e) => setNewUserPassword(e.target.value)} 
              fullWidth 
              margin="normal" 
        />
       <Button onClick={handleRegister} variant="contained" color="primary" fullWidth>Register</Button>
      </Box>


      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editingTodo?.title || ''}
            onChange={(e) => setEditingTodo({...editingTodo, title: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editingTodo?.description || ''}
            onChange={(e) => setEditingTodo({...editingTodo, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
