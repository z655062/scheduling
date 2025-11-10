import express from "express";
import auth from "./routes/auth.mjs"
import user from "./routes/user.mjs";
import initializePassport from "./passport.mjs";
// server.js
// const express = require('express');
const app = express();
const PORT = 3001;

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', './views'); // Assuming your EJS templates are in a 'views' folder

initializePassport(app);
// Middleware，讓 Express 可以解析 JSON 格式的請求主體
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hellow World!');
});

app.use('/api/auth', auth);
app.use('/api/user', user);

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});