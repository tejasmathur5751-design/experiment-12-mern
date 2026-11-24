const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection (replace with your Atlas URI)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern_tasks';
mongoose.connect(MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Task schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Frontend' },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// POST - create task
app.post('/api/tasks', async (req, res) => {
  const { title, category } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const task = new Task({ title, category });
  await task.save();
  res.status(201).json(task);
});

// PUT - update task status
app.put('/api/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// DELETE - remove task
app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
