import { Router } from "express";
import {regUser,loginUser} from "../controllers/user.controller.js";

const router = Router()
router.route("/register").post(regUser)
router.route("/login").post(loginUser)

export default router