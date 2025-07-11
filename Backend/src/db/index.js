import mongoose from "mongoose"
import {app} from "../app.js"

const connectdb = async () => {
    try {
        const connectioninstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
        console.log("Mongodb CONNECTED !!");
        console.log("HOST:", connectioninstance.connection.host);
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })

    } catch (error) {
        console.log("Mongodb connection error:", error)
        process.exit(1)
    }
}

export default connectdb