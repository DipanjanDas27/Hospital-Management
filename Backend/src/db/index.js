import mongoose from "mongoose"

const connectdb= async ()=>{
    try {
       const connectioninstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
       console.log("Mongodb CONNECTED !!")
       console.log("HOST:",connectioninstance.connection.host);

       //console.log(`MongoDb connected, host :${connectioninstance.Connection.host}`)

    } catch (error) {
        console.log("Mongodb connection error:", error)
        process.exit(1)
    }
}

export default connectdb