// Feature's to implement in future
//          1. AR feature 2. Dresscode suggestion system(get dress code color data and show the bags)
//          3. adding most viewed attribute (no. of times item added in cart by all users) for for sort by and recommendation feature
// (Done)   4. Dynamic discount(provide the min and max price and the model will automatically inc or dec the discount on basis of times ordered)
//          5. a Bargaining chatbot for providing extra discount(if possible) based on user past orders and history
//          6. Smart Wishlist to notify when price drops for an item.
//          7. product price predictor: predicts the data when you can by it for lower prices within next 30 days.

   
const express = require("express")
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')
const cron = require('./utils/dynamicdiscount')
const ownersRouter = require('./routes/ownersRouter')
const ordersRouter = require('./routes/ordersRouter')
const usersRouter = require('./routes/usersRouter')
const cartsRouter = require('./routes/cartsRouter')
const productsRouter = require('./routes/productsRouter')
const indexRouter = require("./routes/index")
const flash = require("connect-flash") // to use false message for mainly showing errors we always use expressSesssion
const expressSession = require("express-session")

// flash message is basically used for creating a data on a particular route and then if we redirect to another route there also we can use this data

const db = require('./config/mongoose-connection'); 

require("dotenv").config();    // is line se apne jitne variables banae hai .env file me vo use me aa jainge (process.env.<keyname>)

app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'public')));
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

// Dynamic discount logic to run a automatic schedule using node-cron

cron.dynamicdiscount();

app.use('/',indexRouter)
app.use('/owners', ownersRouter)
app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/carts', cartsRouter)
app.use('/orders', ordersRouter)

app.listen(3000)