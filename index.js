import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import connectDb from "./Database/dbConfig.js";
import router from "./Router/authRouter.js";
import "./Passport/passportConfig.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "defaultSecret123",
    resave: false,
    saveUninitialized: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());

connectDb();


app.get("/",(req,res)=>{
    res.status(200).send("Welcome to O_Auth Login")
})
app.use("/api/auth",router)

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log("server is running");
})  