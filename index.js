
const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "ksmaknaskcklasmclkas";       // This is a JWT secret like a password to create token, can be anything.

const app = express();
app.use(express.json());
const users=[];                         // Local array to store user data, ideally Database is used.
let count = 0;

function logger(req,res,next){          // A logger function to moniton type and count of requests received.
    count++;
    console.log(req.method+" request was received. Request Count = "+count);
    next();
}

function auth(req,res,next){            // This is the Auth Middleware used to authenticate requests.
    const token = req.headers.token;
    const decodedData = jwt.verify(token,JWT_SECRET);

    if(decodedData){
        req.username = decodedData.username;
        next();
    }
    else{
        res.json({
            message:"Unauthorized."
        })
    }
}

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html");
})

app.post("/signup", logger, (req,res)=>{            //This is sign up endpoint.
    const username = req.body.username;
    const password = req.body.password;
    
    users.push({
        username:username,
        password:password
    });
    res.json({
        message:"Congratulations! You have signed up.",
    });
})

app.post("/signin", logger, (req,res)=>{            //This is sign in endpoint.
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = users.find(user=>user.username==username && user.password==password);
    

    if(foundUser){
        const token = jwt.sign({username:foundUser.username}, JWT_SECRET);
        res.header("jwt",token);
        //foundUser.token = token           No need to store the token as we use JWT
        res.json({
            token: token                 //Send token to user, which is used during any call on endpoints.
        })
    }
    else{
        res.json({
            message:"Invalid Credentials. Please Enter Valid Username and Password."
        })
    }
})

app.get("/me", logger, auth, (req,res)=>{       // This is the endpoint where user requests data.
    const currentUser = req.username;       // This is the username sent by the Auth Middleware.
    let foundUser = users.find(user=>user.username==currentUser);
    
    if(foundUser.username){
        res.json({
            username:foundUser.username,
            password:foundUser.password
        })
    }
    else{
        res.json({
            message:"Unauthorized."
        })
    }
    
})

app.listen(3000);



