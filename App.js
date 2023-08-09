const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/project_management_tool', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Create a schema and model for users and tasks
const userSchema = new mongoose.Schema({
  username: String,
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

// API endpoint to get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// API endpoint to add a new user
app.post('/api/users', async (req, res) => {
  try {
    const { username } = req.body;
    const newUser = new User({ username });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// API endpoint to get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// API endpoint to add a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const newTask = new Task({ title, description, assignedTo });
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
