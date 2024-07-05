import {catchAsyncerrs} from "./catchAsyncerrs.js"
import ErrorHandler from "./errmidlw.js"
import jwt from "jsonwebtoken"
import {User} from "../models/userSchema.js"

//Authentication and Authorization for admin and patient

export const isAdminAuthenticated= catchAsyncerrs(async(req, res, next)=>{
    const token= req.cookies.adminToken
    if(!token){
       return next(new ErrorHandler("Admin not Authenticated", 400))
    }
    const decoded= jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user= await User.findById(decoded.id)
    if(req.user.role !== "Admin"){
        return next (new ErrorHandler(`${req.user.role} is not autorized to access the resource`, 403))
    }
    next()

})

export const isPatientAuthenticated= catchAsyncerrs(async(req, res, next)=>{
    const token= req.cookies.patientToken
    if(!token){
       return next(new ErrorHandler("Patient not Authenticated", 400))
    }
    const decoded= jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user= await User.findById(decoded.id)
    if(req.user.role !== "Patient"){
        return next (new ErrorHandler(`${req.user.role} is not autorized to access the resource`, 403))
    }
    next()

})