import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('/api/users');
    setUsers(response.data);
  };

  const fetchTasks = async () => {
    const response = await axios.get('/api/tasks');
    setTasks(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/tasks', { title, description, assignedTo });
    setTitle('');
    setDescription('');
    setAssignedTo('');
    fetchTasks();
  };

  return (
    <div>
      <h1>Project Management Tool</h1>

      {/* Display users */}
      <h2>Users:</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.username}</li>
        ))}
      </ul>

      {/* Create a new user */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
          required
        />
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>
        <button type="submit">Create Task</button>
      </form>

      {/* Display tasks */}
      <h2>Tasks:</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong>
            <p>{task.description}</p>
            <p>Assigned to: {task.assignedTo.username}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
