const express = require('express')

const app = express()
const port = 3000
var cors=require('cors');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const{Schema}=mongoose;
mongoose.connect('mongodb+srv://hk:hQpc9Dp6RsMcYYca@cluster0.0fcj7nh.mongodb.net/hk?retryWrites=true&w=majority');
// ,{useCreateIndex:true,
// useUnifiedTropology:true,  
// useNewUrlParser:true});

// mongoose.connect('mongodb+srv://hk:hQpc9Dp6RsMcYYca@cluster0.0fcj7nh.mongodb.net/?retryWrites=true&w=majority',
// useCreateIndex:true,);

const User= mongoose.model('Users', new Schema({
  name:String,
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
  required:true
}
}));


function generateAccessToken(user){
  const payrol={
    id:user.id,
    name:user.name
  }
  return jwt.sign(payrol,"hassan",{expiresIn:'7200s'})
  }


app.use(cors());
//app.use((req,res,next)=>{
// res.header("Access-Control-Allow-Origin","*")
// next();
// })
app.use(express.json());


function authenticateToken(req,res,next){
  console.log(req.headers)
  const authHeaderToken = req.headers['authorization']
  if(!authHeaderToken) return res.sendStatus(401)
  jwt.verify(authHeaderToken,"hassan",(err,user)=>{
    if(err) return res.sendStatus(403)
    req.user=user;
   // console.log(user)
    next();
  })
}


app.get('/', (req, res) => {

  res.send('Hello World!')
})
app.get('/wishlist',authenticateToken,(req,res)=>{
console.log(req.user)
res.send({
  items:[
    'arrow',
    'flash',
    'super man'
  ]
});
})


app.post('/register',(req,res)=>{
const newUser= new User({
name:req.body.name,
email:req.body.email,
password:req.body.password
})
newUser.save((err,user)=>{
  if(err){
    console.log(err)
    res.send(400,{
      status:err
    });

  }else{

  console.log("all is good");
  console.log(user)
  console.log("registered!")
  res.send({data:"registered"});

  }
})
})
app.post('/login', (req, res) => {
   // console.log(req.body);
    const password =req.body.password;
    const email=req.body.email;
    console.log(email)
    User.findOne({email:email,password:password},(err,user)=>{
      
      if(user){
        console.log(user);
        const token=generateAccessToken(user);
        console.log(token)
        res.send(
          {
              status:'valid',
              token:token
          })
      }else{
        console.log(err);
        res.send(404,{
          status:"Not Found"
        })
      }
     
    })

  
  })
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})