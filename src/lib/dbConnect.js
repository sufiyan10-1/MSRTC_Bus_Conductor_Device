import mongoose from 'mongoose'


const connection = {}
export default async function dbConnect(){
    if(connection.isConnected){
      console.log("Already Connected to data base");
      return
    }

    try{
        const db = await mongoose.connect(process.env.MONGO_DB_URI || "")
        connection.isConnected = db.connections[0].readyState;
        console.log("data base connected successfully") 
    }catch(error){
        console.log("Data base connection faild", error)
        process.exit();
    }
}