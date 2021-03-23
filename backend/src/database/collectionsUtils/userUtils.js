const User = require("../models/user")

const addUser = async (data) => {
    try{
        const user = new User(data)
        await user.save()
    } catch(error) {
        console.log("ERROR during createUser : ", error)
    }
}
const findOneUser = async (data) => {
    try{
        const user = await User.findOne(data)
        return user
    } catch (error) {
        console.log("ERROR during printAllUsers : ", error)
    }
}
const findUsers = async (data) => {
    try{
        const users = await User.find(data)
        return users
    } catch (error) {
        console.log("ERROR during printAllUsers : ", error)
    }
}
const deleteUser = async (data) => {
    try{
        const users = await User.deleteOne(data)
        return users.ok
    } catch (error) {
        console.log("ERROR during deleteUser : ", error)
    }
}
const deleteManyUsers = async (data) => {
    try{
        const users = await User.deleteMany(data)
        return users.deletedCount
    } catch (error) {
        console.log("ERROR during deleteUser : ", error)
    }
}



const printUsers = async (data={}) => {
    console.log(await (await findUsers(data)))
}

const clearUsersCollection = async () => {
    console.log('Users collection cleared, ', await deleteManyUsers({}), ' users deleted')
}

const populateUsersCollection = async (n = 10) => {
    for(i=1; i<=n; i++){
        await addUser({name: 'NAME_'+i, surname: 'SURNAME_'+i})
    }
    console.log(n," new users added to users")
}

module.exports = {addUser, findOneUser, findUsers, deleteUser, deleteManyUsers, printUsers, clearUsersCollection, populateUsersCollection}