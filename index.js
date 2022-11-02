const express = require('express')
const app = express()
const port = 3000
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


app.use(express.json());
app.get('/', (req, res) => {

  res.send('Hello World!')
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
  res.send("registered");

  }
})
})
app.post('/login', (req, res) => {
   // console.log(req.body);
    const password =req.body.password;
    const email=req.body.email;
    User.findOne({email:email,password:password},(err,user)=>{
      console.log(user)
      if(user){
        res.send(
          {
              status:'valid'
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