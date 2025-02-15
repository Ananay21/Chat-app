import { Router } from "express";
import { login, logout, signup, update,checkAuth } from "../controllers/auth.controller.js";
import {protectRoute} from "../middlewares/auth.middleware.js";
 
const router=Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update",protectRoute,update);

router.get("/check",protectRoute,checkAuth);

export default router;