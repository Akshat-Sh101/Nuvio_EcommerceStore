const express = require("express")
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')
const ownersRouter = require('./routes/ownersRouter')
const usersRouter = require('./routes/usersRouter')
const productsRouter = require('./routes/productsRouter')
const indexRouter = require("./routes/index")
const flash = require("connect-flash") // to use false message for mainly showing errors we always use expressSesssion
const expressSession = require("express-session")

// flash message is basically used for creating a data on a particular route and then if we redirect to another route there also we can use this data

const db = require('./config/mongoose-connection'); 

require("dotenv").config();    // is line se apne jitne variables banae hai .env file me vo use me aa jainge (process.env.<keyname>)

app.use(express.json())
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser())

app.use(
    expressSession({
        resave: false,
        saveUninitialized: false, // agar koi banda registered/login nahi hai to uska session mat create karo
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
)
app.use(flash())

app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs');

app.use('/',indexRouter)
app.use('/owners', ownersRouter)
app.use('/users', usersRouter)
app.use('/products', productsRouter)

app.listen(3000)