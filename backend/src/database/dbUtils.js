const mongoose = require('mongoose')

const connect = (databaseName='IO_TEAM_B_20_21', address='127.0.0.1', port='27017') => {
    try{
        const url = 'mongodb://'+address+":"+port+"/"+databaseName
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

const disconnect = () => {
    try{
        mongoose.disconnect()
    } catch (error) {
        console.log("ERROR during disconnecting from database : ", error)
    }
}


module.exports = {connect, disconnect}
