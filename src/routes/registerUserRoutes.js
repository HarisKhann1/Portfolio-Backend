import { Router } from "express";
import {userRegistration, userLogin, refreshToken, logoutUser} from "../controllers/userControllers.js"


const router = Router()

router.post("/register", userRegistration);
router.post("/login", userLogin);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);

export default router