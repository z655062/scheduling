import 'dotenv/config';
import express from "express";
import passport from "passport";

import expressSession from "express-session";
import AuthService from "../services/auth.mjs";


const router = express.Router();
router.use(expressSession({ secret: "keyboard dog", resave: true, saveUninitialized: true }));

//#region Oauth
const redirectFrontend = async (req, res) => {
    const user = req.user;
    const token = await AuthService.generateToken(user);
    const frontendSuccessUrl = `${process.env.FRONTEND_BASE_URL}/auth/callback?token=${token}`;
    res.cookie("jwt", token, { httpOnly: true, secure: true, maxAge: "3600000" })
    // res.redirect(process.env.FRONTEND_BASE_URL);
    res.redirect(frontendSuccessUrl);
};

router.get("/google", passport.authenticate("google", {
    scope: ["email", "profile", "openid"],
}));

router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: '/login' }), redirectFrontend)

router.get("/line", passport.authenticate("line"));

// router.get("/line/callback", passport.authenticate("line", { session: false, failureRedirect: '/login', successRedirect: '/' }), (req, res) => {
router.get("/line/callback", passport.authenticate("line", { session: false, failureRedirect: '/login' }), redirectFrontend);

//#endregion

//#region local strategy
router.post("/login", (req, res, next) => {
    // 使用 Passport 執行本地策略
    passport.authenticate("local", { session: false }, async (err, user, info) => {
        console.log("🚀 ~ err, user, info:", err, user, info)
        if (err || !user) {
            return res.status(401).json({
                message: info ? info.message : "登入失敗，帳號或密碼錯誤。",
                user: user
            });
        }

        req.login(user, { session: false }, async (err) => {
            if (err) {
                res.status(500).send(err);
            }

            // 成功登入，生成 JWT Token
            const token = await AuthService.generateToken(user);

            // 返回 Token 給客戶端 (RESTful API 標準做法)
            return res.json({
                message: "登入成功",
                token: token,
                // ⚠️ 實際應用中，可以額外回傳部分使用者資訊
            });
        });
    })(req, res, next);
});

router.post("logout", (req, res) => {
    res.json({ message: "登出成功" });
});
//#endregion

export default router;
