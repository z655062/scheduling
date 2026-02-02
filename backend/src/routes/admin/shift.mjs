import 'dotenv/config';
import express from "express";
import passport from "passport";

import expressSession from "express-session";
import ShiftService from "../../services/shift.mjs";
import range from "./shiftRange.mjs";

const router = express.Router();
router.use("/ranges", range);

router.get("/", async (req, res) => {
    try {
        const users = await ShiftService.getAllUsers();

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
        const user = await ShiftService.getUserById(id);

        return res.status(200).json({ user: user });
    } catch (error) {
        console.error("READ 錯誤:", error);
        return res.status(500).json({ error: "無法讀取使用者" });
    }
});

router.post("/", async (req, res) => {
    const { name, start_date, end_date } = req.body;
    const data = { name, start_date, end_date };
    // name
    // start_date
    // end_date
    // is_published
    try {
        const newUser = await ShiftService.createShiftRequirement(data);

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

        const updatedUser = await ShiftService.updateUser(id, updateData);

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

        const deletedRowCount = await ShiftService.deleteUser(id);

        if (deletedRowCount === 0) {
            return res.status(404).json({ message: "找不到該使用者，刪除失敗" });
        }

        return res.status(204).json({ message: "使用者刪除成功" }); // 204 No Content

    } catch (error) {
        console.error("DELETE 錯誤:", error);
        return res.status(500).json({ error: "無法刪除使用者" });
    }
});



export default router;
