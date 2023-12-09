//1. Import the libraries
const express =require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser'); 
require('dotenv/config')  // to import .env file

app.use(bodyParser.json())

const appRoute = require('./routes/Piazzas')
const authRoute = require('./routes/UserAuthentication')

//2. Middleware

app.use('/app/post',appRoute)
app.use('/app/user',authRoute)
app.get('/', (req,res)=>{
    res.send('Welcome to Piazz App')
})
mongoose.connect(process.env.DB_CONNECTOR,  ()=>{
    console.log('DB is connected')
})

app.listen(3000,()=>{
    console.log('Server is up and running fine')

})