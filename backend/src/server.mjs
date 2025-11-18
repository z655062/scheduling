import 'dotenv/config';
import express from "express";
// import cors from 'cors';
import auth from "./routes/auth.mjs"
import user from "./routes/user.mjs";
import initializePassport from "./passport.mjs";
// import cookieParser from 'cookie-parser';
// server.js
// const express = require('express');
const app = express();
const PORT = process.env.PORT ?? 3001;

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', './views'); // Assuming your EJS templates are in a 'views' folder

initializePassport(app);
// Middleware，讓 Express 可以解析 JSON 格式的請求主體
app.use(express.json());

const allowedOrigins = ['http://localhost:1743']; // 允許的前端來源

// 1. 啟用 CORS 中間件
// app.use(cors({
//   origin: (origin, callback) => {
//     // 允許沒有 origin (例如 Postman 或同源請求)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   // **關鍵步驟 A：允許傳輸憑證 (Cookie)**
//   credentials: true,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   allowedHeaders: 'Content-Type,Authorization',
// }));

// 2. 啟用 Cookie Parser
// app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hellow World!');
});

app.use('/api/auth', auth);
app.use('/api/user', user);

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});