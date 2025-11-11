import 'dotenv/config';
import jwt from "jsonwebtoken";
import db from "../../models/index.js";
const { User } = db;

class AuthService {
    static JWT_SECRET = process.env.JWT_SECRET;
    static JWT_EXPIRY = "7d";

    // ----------------------------------------------------
    // 生成 JWT Token
    // ----------------------------------------------------
    static async generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
        };

        const token = jwt.sign(payload, AuthService.JWT_SECRET, {
            expiresIn: AuthService.JWT_EXPIRY,
        });

        return token;
    }

    // ----------------------------------------------------
    // 驗證使用者帳號密碼
    // ----------------------------------------------------
    static async validateUser(username, password) {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return null;
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return null;
        }

        return user.toJSON();
    }

    // ----------------------------------------------------
    // 根據 Token 獲取使用者資訊
    // ----------------------------------------------------
    static async verifyAndGetToken(token) {
        try {
            const payload = jwt.verify(token, AuthService.JWT_SECRET);
            return payload;
        } catch (err) {
            return null;
        }
    }
}

export default AuthService;