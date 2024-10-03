const axios = require('axios');
const readline = require('readline');

const API_URL = 'http://localhost:5000'; 
const userData = {
  email: 'test@example.com', 
  password: 'password123'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function loginAndAddTodo() {
  try {
    // Login
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: userData.email,
      password: userData.password
    });
    const token = loginResponse.data.token;
    console.log('User logged in.');

    // Get task title input from command line
    rl.question('Enter your task title: ', async (taskTitle) => {
      if (!taskTitle) {
        console.log('Task title cannot be empty!');
        rl.close();
        return;
      }

      // Add the task
      await axios.post(`${API_URL}/todos`, { title: taskTitle }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(`Task "${taskTitle}" added successfully!`);
      rl.close();
    });

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    rl.close();
  }
}

loginAndAddTodo();
