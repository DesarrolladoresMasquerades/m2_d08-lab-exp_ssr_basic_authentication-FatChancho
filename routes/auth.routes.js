const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const saltRound = 5; //5times will be whashed
const bcrypt = require('bcrypt');
const res = require('express/lib/response');
const { redirect } = require('express/lib/response');

router.route('/signup')
.get((req,res)=>{
    res.render('signup');
})
.post((req,res)=>{
const username = req.body.username;
const userPassword = req.body.password;

if(!username || !userPassword){
    res.render('signup',{errorMessage:'All fields are required'})
}
User.findOne({username})
.then(user=>{
    if(user && user.username){
        res.render('signup',{errorMessage:'Username is already taken'})
        //throw new Error('wrong validation username')
    }
    const salt = bcrypt.genSaltSync(saltRound);
    const password = bcrypt.hashSync(userPassword,salt);

    User.create({username, password})
    .then(()=>{res.redirect('/')})
})
})

router
.route('/login')
.get((req,res)=>{
    res.render('login')
})
.post((req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    if(!username || !password){
        res.render('/login',{errorMessage:'All fields are required'})
    }
    User.findOne({username})
    .then((user)=>{
        if(!user){
            res.render('login',{errorMessage:'Incorrect credentials'})
        }
        const isPwdCorrect = bcrypt.compareSync(password,user.password);
        if(isPwdCorrect){
            req.session.currentUserId = user._id;
            res.redirect('/auth/profile');
        }else{
            res.render('login',{errorMessage:'Incorrect credentials'})
        }
    })
    .catch((err)=>console.log(err));
})

router
.get('/profile',(req,res)=>{
    const id = req.session.currentUserId;
    User.findById(id)
    .then((user)=> res.render('profile',user))
    .catch((error)=>console.log(error));
})

router.get('/logout',(req,res)=>req.session.destroy((err)=>res.redirect('/')))


module.exports = router;