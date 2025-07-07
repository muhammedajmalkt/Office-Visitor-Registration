import express from "express";
import { config } from "dotenv";
config()
import cors from "cors"
import mongoose from "mongoose";
const app = express()
import visitorRouter  from "./Routers/visitorsRouter.js"
import { errorHandler } from "./Middlewares/errorHandler.js";
import cookieParser from "cookie-parser"
import adminRouter from "./Routers/adminRouter.js"

app.use(express.json())
app.use(cookieParser());

// app.use((req,res,next)=>{
//     console.log(req.originalUrl ,"===============" )
//     next()
// })

app.use(cors({origin:"http://localhost:5173",credentials:true}))

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Database Connected"))
.catch((err)=>console.log(err))

app.use("/api/visitors",visitorRouter)
app.use("/api/admin",adminRouter)

app.use(errorHandler);

 
app.listen(process.env.PORT || 3000,()=>{
    console.log('server running');
    
})
