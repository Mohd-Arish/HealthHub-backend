class ErrorHandler extends Error{
    constructor(message, statuscode){
        super(message);
        this.statuscode= statuscode
    }
}

export const errMiddleware= (err, req, res, next)=>{
    err.message= err.message || "Internal server error"
    err.statuscode= err.statuscode || 500

    if(err.code === 11000){
        const message= `Duplicate ${Object.keys(err.keyValue)} entered` // err ki values fetch krne ke liye
        err= new ErrorHandler(message, 400)
    }//database err if duplicate info exists

    if(err.name === "JsonWebTokenError"){
        const message= "Invalid Json web token...Try again!"
        err= new ErrorHandler(message, 400)
    }

    if(err.name === "TokenExpiredError"){
        const message= "Json web token Expired...Try again!"
        err= new ErrorHandler(message, 400)
    }
    if(err.name === "CastError"){
        const message= `Invalid ${err.path}`
        err= new ErrorHandler(message, 400)
    }

    const errorMessage= err.errors ? Object.values(err.errors).map((error)=> error.message).join(" ") : err.message

    return res.status(err.statuscode).json({
        success: false,
        message: errorMessage,
    })
}

export default ErrorHandler