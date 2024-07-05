export const catchAsyncerrs= (thef)=>{
    return(req, res, next)=>{
        Promise.resolve(thef(req, res, next)).catch(next)
    }
}