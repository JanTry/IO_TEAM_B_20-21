import {User} from '../models/user'

export const addUser = async (userData) => {
    try{
        return await new User(userData).save()
    } catch(error) {
        console.log("ERROR during createUser : ", error)
    }
}
export const findOneUser = async (userData) => {
    try{
        return await User.findOne(userData)
    } catch (error) {
        console.log("ERROR during printAllUsers : ", error)
    }
}
export const findUsers = async (userData) => {
    try{
        return await User.find(userData)
    } catch (error) {
        console.log("ERROR during printAllUsers : ", error)
    }
}
export const deleteUser = async (userData) => {
    try{
        return await User.deleteOne(userData)
    } catch (error) {
        console.log("ERROR during deleteUser : ", error)
    }
}
export const deleteManyUsers = async (userData) => {
    try{
        return await User.deleteMany(userData)
    } catch (error) {
        console.log("ERROR during deleteUser : ", error)
    }
}



export const printUsers = async (userData={}) => {
    console.log(await findUsers(userData))
}

export const clearUsersCollection = async () => {
    console.log('Users collection cleared, ', await deleteManyUsers({}), ' users deleted')
}

export const populateUsersCollection = async (n = 10) => {
    for(let i=1; i<=n; i++){
        await addUser({name: 'NAME_'+i, surname: 'SURNAME_'+i})
    }
    console.log(n," new users added to users")
}
