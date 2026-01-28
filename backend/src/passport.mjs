import 'dotenv/config';
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import googleAuth from "passport-google-oauth20";
import lineAuth from "passport-line-auth";

import db from "../models/index.js";
const { User } = db;
import AuthService from "./services/auth.mjs";
import UserService from "./services/user.mjs";

const GoogleStrategy = googleAuth.Strategy;
const LineStrategy = lineAuth.Strategy;

const JWT_SECRET = process.env.JWT_SECRET;
const HOST = process.env.HOST;
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
    // const cookieExtractor = (req) => {
    //     console.log("🚀 ~ cookieExtractor ~ req:", req)
    //     let token = null;
    //     if (req && req.cookies) {
    //         console.log(req.cookies)
    //         // 假設您將 JWT 儲存在名為 'jwt' 的 Cookie 中
    //         token = req.cookies['jwt'];
    //     }
    //     return token;
    // };

    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: `${HOST}/api/auth/google/callback`
    },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                // console.log(accessToken, refreshToken, profile)
                const { id } = profile;
                const { sub, name, given_name, family_name, picture, email, email_verified } = profile._json;
                const user = await UserService.findOrCreateOauthUser(profile);
                return cb(null, user);
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    // 4. Line 策略 (Line Oauth)
    passport.use(new LineStrategy({
        channelID: process.env.LINE_ID,
        channelSecret: process.env.LINE_SECRET,
        callbackURL: `${HOST}/api/auth/line/callback`,
        scope: ["profile", "openid", "email"],
        botPrompt: "normal",
        uiLocales: "zh-tw",
    },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                // console.log(accessToken, refreshToken, profile)
                const { provider, id, displayName, pictureUrl, _raw } = profile;
                const user = await UserService.findOrCreateOauthUser(profile);

                return cb(null, user);
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    app.use(passport.initialize());
}