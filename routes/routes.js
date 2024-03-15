const express = require("express");
// const router = require("express/")
const User = require('../modles/users');
const multer =require('multer');
const fs = require('fs')


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
// for update data 

router.post('/update/:id', upload, async (req, res) => {
    try {
        let id = req.params.id;
        let new_image = '';

        if (req.file) {
            new_image = req.file.filename;
            try {
                fs.unlinkSync("./uploads" + req.body.old_image);
            } catch (err) {
                console.log(err);
            }
        } else {
            new_image = req.body.old_image;
        }

        const updatedUser = await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });

        req.session.message = {
            type: 'success',
            message: 'User updated successfully',
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});


// router.post('/update/:id', upload, (req,res)=>{
//     let id = req.params.id;
//     let new_image ='';
//     if(req.file){
//         new_image=req.file.filename;
//         try{
//             fs.unlinkSync("./uploads"+req.body.old_image);
//         }catch(err){
//             console.log(err);
//         }

//     }else{
//         new_image = req.body.old_image;
//     }
//     User.findByIdAndUpdate(id,{
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         image:new_image,
//     },(err,result)=>{
//         if(err){
//             res.json({message:err.message, type:'danger'});
//         }else{
//             req.session.message={
//                 type:'success',
//                 message:'user updated successfully',
//             };
//             res.redirect("/");
//         }
//     })
    
// }) 
// for printing all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('index', {
            title: "Home page",
            users: users,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});
 
//  router.get("/",(req,res)=>{
//     // res.send('<h1>Home page</h1>');
//     // res.render('index',{title:"home-page"});
//     User.find().exec((err,users)=>{
//         if(err){
//             res.json({message:err.message});
//         }else{
//             res.render('index',{
//                 title:"Home page",
//                 users:users, 
//             })
//         }
//     })
// });

//for edit user 
router.get("/edit/:id",async (req,res)=>{
    let id =req.params.id;
    try{
        const user = await User.findById(id);
        if(user==null){
            res.redirect('/');
        }else{
            res.render('edit_users',{
                title:"Edit User",
                user:user, 
            })

        }
        
    }catch (err) {
        res.json({ message: err.message });
        res.redirect('/');
    }
    // User.findById(id,(err,user)=>{
    //     if(err){
    //         res.redirect('/');
    //     }
    //     else{
    //         if(user==null){
    //             res.redirect('/');
    //         }
    //         else{
    //             res.render('edit_users',{
    //                 title:"Edit User",
    //                 user:user, 
    //             })
    //         }
    //     }
    // })
})


router.get('/add',(req,res)=>{
    res.render("add_users",{title:"Add users"})
})

// module.exports=router;
module.exports = router; 