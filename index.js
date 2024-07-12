const express=require("express")
const app=express()
const cors = require('cors');
const routes = require('./routes');
const DBconnection=require("./db/connection");

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(5000,async()=>{
    try{
        await DBconnection()
        console.log("server is running...... ")
    }
    catch(e){
        console.log("server failed",e)
    }
})