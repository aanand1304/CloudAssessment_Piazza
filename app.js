//1. Import the libraries
const express =require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser'); 
require('dotenv/config')  // to import .env file

app.use(bodyParser.json())

const appRoute = require('./routes/Piazzas')
const authRoute = require('./routes/UserAuthentication')


app.use('/app/user',authRoute) //User route
app.use('/app',appRoute)  //App Piazza Sytem route

app.get('/', (req,res)=>{
    res.send('Welcome to Piazz App')
})
///showing connection to mongodb
mongoose.connect(process.env.DB_CONNECTOR,  ()=>{
    console.log('DB is connected')
})
///just to show a message if server is up and running or not
app.listen(3000,()=>{
    console.log('Server is up and running fine')

})