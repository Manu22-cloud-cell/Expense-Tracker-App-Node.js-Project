const Users=require('../models/users');

const userSignUp = async (req,res)=>{

    try {
    const {userName,email,password}=req.body;
    const newUser=await Users.create({
        userName:userName,
        email:email,
        password:password
    });
    console.log("New User account is created");
    res.status(201).json({message:"User created succuessfully",newUser})
    } catch (error) {
        res.status(409).send({error:"Email already registered"}); 
    }
}

module.exports={
    userSignUp
}