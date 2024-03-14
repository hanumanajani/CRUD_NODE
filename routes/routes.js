const express = require("express");
// const router = require("express/")
const User = require('../modles/users');
const multer =require('multer');


var router = express.Router(); 
//image upload

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads');
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
})
var upload =multer({
    storage:storage
}).single("image");

//insert an user into database 
router.post('/add', upload, (req,res)=>{
    const user1 = new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:req.file.filename
        
    });
     user1.save()
    // user1.save((err)=>{
        // if(err){
        //     // res.json({message:err.message,type:"danger"});
        // }
        // else{
            req.session.message={
                type:'success',
                message:"user addded successfully"
            }
        // }
    // });
    res.redirect("/")
    
}) 
// for printing all users
 
 router.get("/",(req,res)=>{
    // res.send('<h1>Home page</h1>');
    // res.render('index',{title:"home-page"});
    User.find().exec((err,users)=>{
        if(err){
            res.json({message:err.message});
        }else{
            res.render('index',{
                title:"Home page",
                users:users, 
            })
        }
    })
});

router.get('/add',(req,res)=>{
    res.render("add_users",{title:"Add users"})
})

// module.exports=router;
module.exports = router; 