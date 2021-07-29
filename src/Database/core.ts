import {connect,connection} from "mongoose"


export const connectDB = async(url : string)=>{
    try {
        const connection = await connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false,
            useCreateIndex:true
        })
        console.log(`MongoDB Connected ! ${connection.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

connection.on("error",console.error.bind(console,"connection error:"))
connection.once("open",()=>{
    console.log("First Connection Opened Successfuly ")
})


