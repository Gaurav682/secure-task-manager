import React, { useState, useEffect } from 'react';

function Tasks({ token, logout }) {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setTasks(data));
  }, [token]);

  const addTask = async () => {
    const res = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title: task })
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTask('');
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div aria-label="Task Manager">
      <h2>Tasks</h2>
      <input type="text" value={task} onChange={(e) => setTask(e.target.value)} placeholder="New Task" aria-label="New Task" />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            {t.title} <button onClick={() => deleteTask(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Tasks;