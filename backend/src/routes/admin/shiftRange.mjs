import 'dotenv/config';
import express from "express";
import passport from "passport";

import expressSession from "express-session";
import ShiftService from "../../services/shift.mjs";


const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const ranges = await ShiftService.getAllShiftRanges();

        return res.status(200).json({ ranges: ranges });
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
        const range = await ShiftService.getShiftRangeById(id);

        return res.status(200).json({ range: range });
    } catch (error) {
        console.error("READ 錯誤:", error);
        return res.status(500).json({ error: "無法讀取排班區間" });
    }
});

router.post("/", async (req, res) => {
    const { name, start_date, end_date } = req.body;
    const data = { name, start_date, end_date };
    // name
    // start_date
    // end_date
    // is_published
    console.log(start_date, end_date)
    try {
        const newRange = await ShiftService.createShiftRange(data);

        res.status(200).json(newRange);
    } catch (error) {
        console.error("無法新增排班區間:", error);
    }
});

export default router;
