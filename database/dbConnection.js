import mongoose from "mongoose"

export const dbConnection= ()=>{
  mongoose
    .connect(process.env.MONGO_URI, {
        dbName: "HEALTHHUB_HMS_HOSTED"
    })
    .then(()=>{
        console.log("Connected to database")
    })
    .catch((err)=>{
        console.log(`Some error occurred while connecting to database ${err}`)
    })
}