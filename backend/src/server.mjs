import express from "express";
import auth from "./routes/auth.mjs"
import todoRoutes from "./routes/todoRoutes.mjs";
// server.js
// const express = require('express');
const app = express();
const PORT = 3000;

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', './views'); // Assuming your EJS templates are in a 'views' folder

// Middleware，讓 Express 可以解析 JSON 格式的請求主體
app.use(express.json());

// 範例資料庫，通常在實際專案中你會連接到 MongoDB 或 PostgreSQL 等資料庫
let todos = [
  { id: 1, title: '學習 Express.js', completed: false },
  { id: 2, title: '建置 RESTful API', completed: true },
];

// 根路由，用於測試伺服器是否正常運作
app.get('/', (req, res) => {
  res.send('Welcome to the Todo API!');
});

// 引入 todos 路由
app.use('/api/todos', todoRoutes);
app.use('/api/auth', auth);

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});