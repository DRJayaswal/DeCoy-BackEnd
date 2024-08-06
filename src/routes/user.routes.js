/* eslint-disable no-unused-vars */
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    regUser,
    loginUser,
    logoutUser,
    renewSession,
    changePassword,
    currentUser,
    updateAccount,
    playHistory,
} from "../controllers/user.controller.js";

const router = Router()
// POST
router.route("/register")       .post(regUser)
router.route("/login")          .post(loginUser)
router.route("/logout")         .post(verifyJWT, logoutUser)
router.route("/renew")          .post(verifyJWT, renewSession)

// GET
router.route("/current")        .get(verifyJWT, currentUser)

// PUT
router.route("/change-password").put(verifyJWT, changePassword)
router.route("/update-account") .put(verifyJWT, updateAccount)

export default router