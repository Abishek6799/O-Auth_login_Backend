import User from "../Model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendMail from "../Utils/mail.js";

dotenv.config();

export const register = async (req, res) => {
    try{
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({name,email,password:hashedPassword});
        await newUser.save();
        res.status(201).json({message:"User registered successfully",newUser});
    }catch(error){
        res.status(500).json({message:error.message});
    }
} 

export const login = async (req, res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(401).json({message:"Invalid password"});
        }
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        user.token = token;
        await user.save();
        res.status(200).json({message:"Login successful",token});
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const resetPasswordLink = `http://localhost:5174/reset-password/${user._id}/${token}`;  
        const emailSend = await sendMail({
            to:user.email,
            subject:'Reset Password',
            text:`Hello ${user.name},\n\nYou requested a password reset. Please click the link below to reset your password:\n\n${resetPasswordLink}\n\nIf you did not request a password reset, please ignore this email.`
    })
        if (!emailSend.success) {
            return res.status(500).json({ message: "Failed to send email" });
        }   
        res.status(200).json({ message: "Password Reset Link Email Sent Successfully" });
        
        } catch (error) {
            res.status(500).json({ message: error.message});  
}   
}; 

export const resetPassword = async (req, res) => {
    try {
        const { id, token } = req.params;
        const { password } = req.body;
       jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
           if (err) {
               return res.status(400).json({ message: "Invalid or Expired Token" });
           }
           const user = await User.findById(id);
           if (!user) {
               return res.status(400).json({ message: "User Not Found" });
           }
           const hashedPassword = await bcrypt.hash(password, 10);
           user.password = hashedPassword;
           await user.save();
           res.status(200).json({ message: "Password Reset Successfully" });
       });
    } catch (error) {
       res.status(500).json({
           message: error.message
       })
    }
};