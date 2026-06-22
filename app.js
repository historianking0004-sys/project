const express = require('express');
const app = express();
const ejs = require('ejs');
const userModel = require('./models/user');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const port = process.env.PORT || 3000;
   
const cookieParser = require('cookie-parser');
const path = require('path');
const { log } = require('console');
const fs=require('fs');

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));

app.get('/', (req, res) => {
    res.render('index');
})
app.get('/dashboard', function(req, res){
    fs.readdir(`./files`, function(err, files){
        res.render("index", {files: files});  // renders views/index.ejs
    })
})
app.get('/createUser', (req, res) => {
    res.render('createuser');
})
app.post('/create-user', (req, res) => {
    let { username, email, password, age } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                username,
                email,
                password:hash,
                 age
            })
            let token = jwt.sign({email},"shhhhhhh");
            res.cookie("token",token)
            res.send(createdUser)
        })
    })
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.post('/login', async (req, res) => {
    let user = await userModel.findOne({email:req.body.email});
    if (!user) return res.send('wrong');
    bcrypt.compare(req.body.password,user.password,function(err,result){
        if (result) {
              let token = jwt.sign({email: user.email},"shhhhhhh");
            res.cookie("token",token)
        
        res.render("index");} 
        else res.send("you cant");
    })
})
app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect('/');
})
app.listen(port, () => console.log(`Running on ${port}`));