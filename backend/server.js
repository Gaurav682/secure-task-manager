const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

const PORT = 5000;
const SECRET = 'your_jwt_secret';
let users = [];
let tasks = [];
let idCounter = 1;

app.use(cors());
app.use(express.json());

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Register route
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  res.status(201).send('User registered');
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(403).send('Invalid credentials');
  }
  const token = jwt.sign({ email: user.email }, SECRET);
  res.json({ token });
});

// Get tasks
app.get('/api/tasks', authenticateToken, (req, res) => {
  res.json(tasks.filter(task => task.email === req.user.email));
});

// Add task
app.post('/api/tasks', authenticateToken, (req, res) => {
  const task = { _id: idCounter++, title: req.body.title, email: req.user.email };
  tasks.push(task);
  res.status(201).json(task);
});

// Delete task
app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  tasks = tasks.filter(task => task._id !== parseInt(req.params.id));
  res.sendStatus(204);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));