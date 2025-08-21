import express from "express";
const router = express.Router()
import { checkIn, checkOut, getAllVisitors, getVisitorById, updateVisitorIdInfo } from "../Controllers/VisitorsController.js";
import { asyncErrorhandler } from "../Middlewares/asyncErrorHandler.js";
import upload from "../Middlewares/upload.js";
import verifyToken from "../Middlewares/verifyToken.js";


router.post("/checkin",upload.single("photo"),asyncErrorhandler(checkIn))
router.post("/checkout",asyncErrorhandler(checkOut))
router.get("/allvisitors",asyncErrorhandler(getAllVisitors))
router.get("/visitor/:id", asyncErrorhandler(getVisitorById));
router.put('/update-id/:id', verifyToken,asyncErrorhandler(updateVisitorIdInfo));




export default router