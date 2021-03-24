import mongoose = require("mongoose");
import * as dotenv from 'dotenv'
dotenv.config()

export const connect = (databaseName=process.env.DATABASE_NAME, address=process.env.DATABASE_ADDRESS, port=process.env.DATABASE_PORT) => {
    try{
        const url = `mongodb://${address}:${port}/${databaseName}`
        mongoose.connect(url,{
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        console.log("CONNECTION ESTABLISHED\n")
    } catch (error) {
        console.log("ERROR during connecting to database : ", error)
    }
}

export const disconnect = () => {
    try{
        mongoose.disconnect()
    } catch (error) {
        console.log("ERROR during disconnecting from database : ", error)
    }
}

