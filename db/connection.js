const mongoose=require("mongoose");
const URL="mongodb+srv://test:aqWW9h8C6XnEYE4h@cluster0.lkhf4ct.mongodb.net/?retryWrites=true&w=majority";

const DBconnection=()=>{
    try{
        mongoose.connect(URL);
        console.log("Database connected successfully");
    }
    catch(e){
        console.log("connection failed",e);
    }
}
module.exports=DBconnection