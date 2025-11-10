import express from "express";
import db from "../../models/index.js";
const { User } = db;
import UserService from "../services/user.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await UserService.getAllUsers();

        return res.status(200).json({ users: users });
    } catch (error) {
        console.error("查詢所有使用者時發生錯誤:", error);
        return res.status(500).json({
            error: "無法查詢所有使用者",
            details: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserService.getUserById(id);

        return res.status(200).json({ user: user });
    } catch (error) {
        console.error("READ 錯誤:", error);
        return res.status(500).json({ error: "無法讀取使用者" });
    }
});

router.post("/", async (req, res) => {
    const { username, is_active, role, password } = req.body;
    const userData = { username, is_active, role, password };

    try {
        const newUser = await UserService.createUser(userData);

        res.status(200).json(newUser);
    } catch (error) {
        console.error("無法新增使用者:", error);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role, password } = req.body;
        const updateData = { username, role, password };

        const updatedUser = await UserService.updateUser(id, updateData);

        if (!updatedUser) {
            return res.status(404).json({ message: "找不到或沒有資料更新" });
        }

        return res.status(200).json({ message: "使用者更新成功", user: updatedUser });
    } catch (error) {
        console.error("UPDATE 錯誤:", error);
        return res.status(500).json({ error: "無法更新使用者" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRowCount = await UserService.deleteUser(id);

        if (deletedRowCount === 0) {
            return res.status(404).json({ message: "找不到該使用者，刪除失敗" });
        }

        return res.status(204).json({ message: "使用者刪除成功" }); // 204 No Content

    } catch (error) {
        console.error("DELETE 錯誤:", error);
        return res.status(500).json({ error: "無法刪除使用者" });
    }
});

// module.exports = router;
export default router;