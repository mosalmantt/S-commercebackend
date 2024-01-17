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


const PORT = process.env.PORT || 2000
app.listen(PORT, () => {
    console.log(`port is running under ${PORT}`)
})