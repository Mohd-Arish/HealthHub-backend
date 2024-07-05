import {catchAsyncerrs} from "../middlewares/catchAsyncerrs.js"
import { Message } from "../models/msgSchema.js"
import ErrorHandler from "../middlewares/errmidlw.js"

export const sendMessage= catchAsyncerrs(async (req, res, next)=>{
    const {firstName, lastName, email, phone, message}= req.body;
    if(!firstName || !lastName || !email || !phone || !message){
        return next(new ErrorHandler("Please fill Full form", 400))
    }
        await Message.create({firstName, lastName, email, phone, message})
        res.status(200).json({
            success: true,
            message: "Message send successfully",
        });
})


export const getAllMessages= catchAsyncerrs(async (req, res, next)=>{
    const messages= await Message.find()
    res.status(200).json({
        success: true,
        messages
    })
})