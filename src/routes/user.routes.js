import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {regUser,loginUser,logoutUser} from "../controllers/user.controller.js";

const router = Router()
router.route("/register").post(regUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)

export default router