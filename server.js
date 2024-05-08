const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const authRouter = require("./routes/auth")
require('dotenv').config();


// database connection
mongoose.connect(process.env.MONGODB_URL)
const connect = mongoose.connection
connect.on("open", () => {
    console.log(`Connected to the database`);
})

// middlewares
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// routes
app.use("/users", authRouter)

const firebaseConfig = {
    apiKey:process.env.REACT_APP_API_KEY,
    authDomain:process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket:process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId:process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId:process.env.REACT_APP_APP_ID,
    measurementId:process.env.REACT_APP_MEASURMENT_ID
  };

  const getItem = {
    key:"helo salman",
    data:"louna@33"
  }
  app.get('/tellygo/firebase/config', (req, res) => {
    res.json(firebaseConfig)
  });
app.get("/helo",(req, res)=>{
res.json(getItem)
})

const PORT = process.env.PORT || 2000
app.listen(PORT, () => {
    console.log(`port is running under ${PORT} ${process.env.REACT_APP_API_KEY}`)
})