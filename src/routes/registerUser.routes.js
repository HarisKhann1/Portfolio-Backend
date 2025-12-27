import { Router } from "express";
import {userRegistration, userLogin} from "../controllers/user.js"


const router = Router()

router.post("/register", userRegistration);
router.post("/login", userLogin);

export default router