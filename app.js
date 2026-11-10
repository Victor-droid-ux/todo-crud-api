const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory storage (lost when the server restarts)
let todos = [];
let nextId = 1;

// CREATE
app.post('/api/todos', (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Title required' });
  }
  const newTodo = {
    id: nextId++, title, description, completed: false, createdAt: new Date()
  };
  todos.push(newTodo);
  res.status(201).json({ success: true, data: newTodo });
});

// READ ALL (optional filter: ?completed=true)
app.get('/api/todos', (req, res) => {
  let result = todos;
  if (req.query.completed !== undefined) {
    result = todos.filter(t => String(t.completed) === req.query.completed);
  }
  res.status(200).json({ success: true, count: result.length, data: result });
});

// READ ONE
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ success: false, message: 'Todo not found' });
  }
  res.status(200).json({ success: true, data: todo });
});

// UPDATE
app.put('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ success: false, message: 'Todo not found' });
  }
  const { title, description, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (completed !== undefined) todo.completed = completed;
  res.status(200).json({ success: true, data: todo });
});

// DELETE
app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Todo not found' });
  }
  todos.splice(index, 1);
  res.status(200).json({ success: true, message: 'Todo deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
