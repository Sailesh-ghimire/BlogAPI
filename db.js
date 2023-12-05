const mongoose = require("mongoose");

const mongoURI = "mongodb://127.0.0.1:27017/inotebook"


// const connectToMongo=()=>{
//     mongoose.connect(mongoURI, ()=>{
//     console.log("connected to mongo");
// })
// }

async function connectToMongo() {
    await mongoose.connect(mongoURI).then(()=>
    console.log("Connected to MongoDB Successfully")
    ).catch(err => console.log(err));
  }



module.exports = connectToMongo;