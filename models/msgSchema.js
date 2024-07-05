import mongoose from "mongoose";
import validator from "validator";

const msgSchema= new mongoose.Schema({
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
    message:{
        type: String,
        required: true,
        minLength: [10, "Message must contain at least 10 characters"]
    }
})

export const Message= mongoose.model("Message", msgSchema)