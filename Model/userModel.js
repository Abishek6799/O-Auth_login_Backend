import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:false, 
        unique: true, 
        default: "",
        sparse:true,
    },
    googleId:{
        type:String,unique:true
    },
    facebookId:{
        type:String,unique:true
    },
    githubId:{
        type:String,unique:true
    },
    password:{
        type:String,
       required: function () {
      return !this.googleId && !this.facebookId && !this.githubId; 
    }
    },
    token:{
        type:String
    }
});

const User = mongoose.model("User",userSchema);
export default User;

