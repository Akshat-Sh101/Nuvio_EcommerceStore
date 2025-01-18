const express = require("express")
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')
const ownersRouter = require('./routes/ownersRouter')
const usersRouter = require('./routes/usersRouter')
const productsRouter = require('./routes/productsRouter')
const indexRouter = require("./routes/index")

const db = require('./config/mongoose-connection'); 

require("dotenv").config();    // is line se apne jitne variables banae hai .env file me vo use me aa jainge (process.env.<keyname>)

app.use(express.json())
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs');

app.use('/',indexRouter)
app.use('/owners', ownersRouter)
app.use('/users', usersRouter)
app.use('/products', productsRouter)

app.listen(3000)