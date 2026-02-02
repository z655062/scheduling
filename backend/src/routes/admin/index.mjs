import 'dotenv/config';
import express from "express";
import passport from "passport";

import shiftRounter from "./shift.mjs";

const router = express.Router();

router.use("/shift", shiftRounter)

export default router;
