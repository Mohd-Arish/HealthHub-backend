import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema= new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: [3, "First name must have at least 3 characters"]
    },
    lastName:{
        type: String,
        required: true,
        minLength: [3, "Last name must have at least 3 characters"]
    },
    email:{
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    phone:{
        type: String,
        required: true,
        minLength: [10, "Phone number must have exact 10 digits"],
        maxLength: [10, "Phone number must have 10 digits"]
    },
    
    dob:{
        type: Date,
        required: [true, "Date of Birth required"]
    },
    gender:{
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    password:{
        type: String,
        required: true,
        minLength: [8, "Password must contain atleast 8 characters"],
        select: false
    },
    role:{
        type: String,
        required: true,
        enum: ["Admin", "Patient", "Doctor"]
    },
    docDepartment:{
        type: String
    },
    docAvatar:{
        public_id: String,
        url: String
    },
})




    userSchema.pre("save", async function (next){
        if(!this.isModified("password")){
            next(); // new user registration par password hash ho jaye mtlb safe and secure
        }
        this.password=  await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword= async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.generateJsonWebToken= function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    })
}

export const User= mongoose.model("User", userSchema)


// nic:{
//     type: String,
//     required: true,
//     minLength: [11, "NIC must have 10 digits"],
//     maxLength: [11, "NIC must have 10 digits"]
// },