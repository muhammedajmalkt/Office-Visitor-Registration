import express from "express";
import { logedAdmin, loginAdmin, logoutAdmin } from "../Controllers/adminController.js";
import { asyncErrorhandler } from "../Middlewares/asyncErrorHandler.js";
import verifyToken from "../Middlewares/verifyToken.js";
const router = express.Router()

router.post("/login", asyncErrorhandler(loginAdmin));
router.post("/logout", asyncErrorhandler(logoutAdmin));
router.get("/adminin",verifyToken,asyncErrorhandler(logedAdmin))



export default router