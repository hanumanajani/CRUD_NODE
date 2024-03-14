require('dotenv').config();
const ejs = require('ejs');
const express =require("express");
const mongoose =require("mongoose");
const session =require("express-session");
const router = require('./routes/routes');
const User = require('./modles/users'); 

// const { router } = require('./routes/routes');
const app = express();
const PORT =process.env.PORT || 4000;
//database connection 
// mongoose.connect(process.env.DB_URI,{useNewParser:true,useUnifiedTopology:true});
mongoose.connect(process.env.DB_URI); // No options object needed


const db = mongoose.connection;
db.on("error",(error)=>console.log(error))
db.once("open",()=>console.log("connected to database!"));

//middlewears 
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
    secret:'mysecret key',
    saveUninitialized:true,
    resave:true
}));
app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
})

//set template engine
app.set('view engine','ejs');
// route prefix
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use("", router);
// app.get("/",(req,res)=>{
//     res.send("hello jani welcome");

// });



app.listen(PORT,()=>{
    console.log(`Server started at http://localhost:${PORT}`)
});