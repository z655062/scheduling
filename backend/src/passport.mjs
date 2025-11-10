import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import googleAuth from "passport-google-oauth20";
import lineAuth from "passport-line-auth";

import db from "../models/index.js";
const { User } = db;
import AuthService from "./services/auth.mjs";

const GoogleStrategy = googleAuth.Strategy;
const LineStrategy = lineAuth.Strategy;

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_SUPER_SECURE_SECRET";

export default function initializePassport(app) {
    // 1. 本地登入策略 (Local Strategy)
    passport.use(new LocalStrategy({
        usernameField: "username",
        passwordField: "password"
    }, async (username, password, done) => {
        try {
            const user = await AuthService.validateUser(username, password);
            if (!user) {
                return done(null, false, { message: "不正確的帳號或密碼。" });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    // 2. JWT 策略 (用於驗證受保護的路由)
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 從 Header 的 Bearer Token 獲取
        secretOrKey: JWT_SECRET,
    };

    passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
        try {
            // 檢查 User ID 是否存在於資料庫 (或直接相信 Token 資訊)
            const user = await User.findByPk(jwtPayload.id);
            if (user) {
                return done(null, user); // 成功，將使用者資訊放入 req.user
            } else {
                return done(null, false); // 使用者不存在
            }
        } catch (err) {
            return done(err, false);
        }
    }));

    // 3. Google 策略 (Google Oauth)
    passport.use(new GoogleStrategy({
        // clientID: "714526822821-v92legl2mokolrejkso5gg08jg3o2h5c.apps.googleusercontent.com",
        clientID: "714526822821-9ga0k0dauj3pi3gkunqff49su26ptm3j.apps.googleusercontent.com",
        // clientSecret: "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",
        clientSecret: "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",
        callbackURL: "https://2c54d2268c6f.ngrok-free.app/api/auth/google/callback"
    },
        (accessToken, refreshToken, profile, cb) => {
            return cb("test err", profile);
        }
    ));

    // 4. Google 策略 (Line Oauth)
    passport.use(new LineStrategy({
        channelID: "2008308071",
        channelSecret: "87577f8a7e74a1216438197c8b957cf9",
        callbackURL: "https://2c54d2268c6f.ngrok-free.app/api/auth/line/callback",
        scope: ["profile", "openid", "email"],
        botPrompt: "normal",
        uiLocales: "zh-tw",
    },
        function (accessToken, refreshToken, profile, cb) {
            console.log(accessToken, refreshToken, profile)
            return cb("line", profile);
        }
    ));

    app.use(passport.initialize());
}