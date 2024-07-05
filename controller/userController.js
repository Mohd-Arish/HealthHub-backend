import {catchAsyncerrs} from "../middlewares/catchAsyncerrs.js"
import ErrorHandler from "../middlewares/errmidlw.js"
import { User } from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js"
import cloudinary from "cloudinary"

export const patientRegister= catchAsyncerrs(async(req, res, next)=>{
    const {firstName, lastName, email, phone, dob, gender, password, role}= req.body;
    if(!firstName || !lastName || !email || !phone || !dob || !gender || !password || !role){
        return next(new ErrorHandler("Please fill the form!", 400))
    }

    let user= await User.findOne({email})
    if(user){
        return next(new ErrorHandler("User already registered!", 400))
    }
    user= await User.create({firstName, lastName, email, phone, dob, gender, password, role})
    generateToken(user, "User Registered", 200, res)
    
})

export const login= catchAsyncerrs(async (req, res, next)=>{
    const {email, password, confirmPassword, role}= req.body
    if(!email || !password || !confirmPassword || !role){
        return next(new ErrorHandler("Please provide all details!", 400))
    }
    if(password != confirmPassword){
        return next(new ErrorHandler("Password and Confirm password do not match!", 400))
    }
    const user= await User.findOne({email}).select("+password") // finding user in db
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 400))  
    }

    const ispasswordMatched= await user.comparePassword(password)
    if(!ispasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 400))  
    }
    if(role !== user.role){
        return next(new ErrorHandler("User with this role not found", 400))
    }

    generateToken(user, "User logged in successfully!", 200, res)

})


export const addnewAdmin= catchAsyncerrs(async(req, res, next)=>{
    const {firstName, lastName, email, phone, dob, gender, password}= req.body;
    if(!firstName || !lastName || !email || !phone || !dob || !gender || !password){
        return next(new ErrorHandler("Please fill the form!", 400))
    }
    const isRegistered= await User.findOne({email})
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email already exists!`))
    }
    const admin= await User.create({firstName, lastName, email, phone, dob, gender, password, role: "Admin"})
    res.status(200).json({
        success: true,
        message: "New Admin Registered"
    })
})


export const getAllDoctors= catchAsyncerrs(async(req, res, next)=>{
    const doctors= await User.find({role: "Doctor"})
    res.status(200).json({
        success: true,
        doctors
    })
})

export const getUserdetails= catchAsyncerrs(async(req, res, next)=>{
    const user= req.user
    res.status(200).json({
        success: true,
        user
    })
})

export const Adminlogout=  catchAsyncerrs(async(req, res, next)=>{
    res.status(200).cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: true,
        sameSite: "None"
    }).json({
        success: true,
        message: "Admin logged out successfully!"
    })
})

export const Patientlogout=  catchAsyncerrs(async(req, res, next)=>{
    res.status(200).cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: true,
        sameSite: "None"
    }).json({
        success: true,
        message: "Patient logged out successfully!"
    })
})


export const addnewDoctor= catchAsyncerrs(async (req, res, next)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Doctor Avatar required!", 400))
    }
    const {docAvatar}= req.files
    const allowedFormats= ["image/png", "image/jpeg", "image/webp"]
    if(!allowedFormats.includes(docAvatar.mimetype)){ //ensures that the extension is of img and not of any videos
        return next(new ErrorHandler("File format not supported!", 400))
    }

    const {firstName, lastName, email, phone, dob, gender, password, docDepartment}= req.body
    if(!firstName || !lastName || !email || !phone || !dob || !gender || !password || !docDepartment){
        return next(new ErrorHandler("Please provide full Details!", 400))
    }

    const isRegisterd= await User.findOne({email})
    if(isRegisterd){
        return next(new ErrorHandler(`${isRegisterd.role} is already registered with this email!`, 400))
    }

    const cloudinaryResponse= await cloudinary.uploader.upload(docAvatar.tempFilePath)
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary error:", cloudinaryResponse.error || "Unknown Cloudinary error")
    }

    const doctor= await User.create({firstName, lastName, email, phone, dob, gender, password, docDepartment, role: "Doctor", docAvatar:{
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url
    }})

    res.status(200).json({
        success: true,
        message: "New Doctor Registered!",
        doctor
    })
})