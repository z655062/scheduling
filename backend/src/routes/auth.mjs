import express from "express";
import passport from "passport";

import expressSession from "express-session";


const router = express.Router();
router.use(expressSession({ secret: "keyboard dog", resave: true, saveUninitialized: true }));

//#region Oauth
router.get("/google", passport.authenticate("google", {
    scope: ["email", "profile", "openid"],
}));


router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
    console.log(req, res)
    res.send({
        status: true,
        data: {
            id: req.user.id,
            name: req.user.displayName
        }
    });
})

router.get("/line", passport.authenticate("line"));

router.get("/line/callback", passport.authenticate("line", { session: false }), (req, res) => {
    console.log(req, res)
    res.send({
        status: true,
        data: {
            id: req.user.id,
            name: req.user.displayName
        }
    });
})
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
            const token = await authService.generateToken(user);

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
