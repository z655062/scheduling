import express from "express";
const router = express.Router();

// 假的資料庫
let todos = [
  { id: 1, title: '學習 Express.js', completed: false },
  { id: 2, title: '建置 RESTful API', completed: true },
];

// Helper function to find a todo by ID
const findTodoById = (id) => {
  return todos.find((todo) => todo.id === parseInt(id));
};

// Helper function to generate a new ID
const generateId = () => {
  return todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
};

// 1. GET /api/todos - 取得所有待辦事項 (Read All)
router.get('/', (req, res) => {
  res.status(200).json(todos);
});

// 2. GET /api/todos/:id - 根據 ID 取得單一待辦事項 (Read One)
router.get('/:id', (req, res) => {
  const todo = findTodoById(req.params.id);
  if (!todo) {
    return res.status(404).send('待辦事項不存在');
  }
  res.status(200).json(todo);
});

// 3. POST /api/todos - 建立一個新的待辦事項 (Create)
router.post('/', (req, res) => {
  if (!req.body.title) {
    return res.status(400).send('標題為必填欄位');
  }

  const newTodo = {
    id: generateId(),
    title: req.body.title,
    completed: req.body.completed || false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// 4. PUT /api/todos/:id - 根據 ID 更新一個待辦事項 (Update)
router.put('/:id', (req, res) => {
  const todo = findTodoById(req.params.id);
  if (!todo) {
    return res.status(404).send('待辦事項不存在');
  }
  
  if (req.body.title) {
    todo.title = req.body.title;
  }
  if (req.body.hasOwnProperty('completed')) {
    todo.completed = req.body.completed;
  }
  
  res.status(200).json(todo);
});

// 5. DELETE /api/todos/:id - 根據 ID 刪除一個待辦事項 (Delete)
router.delete('/:id', (req, res) => {
  const initialLength = todos.length;
  todos = todos.filter((todo) => todo.id !== parseInt(req.params.id));

  if (todos.length === initialLength) {
    return res.status(404).send('待辦事項不存在');
  }
  
  res.status(204).send(); // 204 No Content 代表成功刪除但沒有回傳內容
});

// module.exports = router;
export default router;