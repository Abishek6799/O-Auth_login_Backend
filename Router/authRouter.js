import express from "express";
import passport from "passport";
import { forgotPassword, login, register, resetPassword } from "../Controller/authController.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);

const frontend = "https://stunning-blancmange-791742.netlify.app"

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: frontend }), 
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1h"});
    res.redirect(`${frontend}/oauth/callback?token=${token}`);
  }
);
router.get("/facebook", passport.authenticate("facebook", { scope: ["public_profile"] })); 
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: frontend }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({id:user._id,facebookId:user.facebookId},process.env.JWT_SECRET,{expiresIn:"1h"});
    res.redirect(`${frontend}/oauth/callback?token=${token}`);
  }
);
router.get("/github", passport.authenticate("github", { scope: ["user:email"] })); 
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: frontend }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1h"});
    res.redirect(`${frontend}/oauth/callback?token=${token}`);
  }
);
 
export default router