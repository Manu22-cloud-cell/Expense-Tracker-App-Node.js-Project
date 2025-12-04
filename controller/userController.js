const Users=require('../models/users');
const bcrypt=require('bcryptjs');

const userSignUp = async (req,res)=>{

    try {
    const {userName,email,password}=req.body;

    //check if user already exist
    const existingUser=await Users.findOne({where:{email}});

    if(existingUser){
        return res.status(409).json({message:"Email already registered"});
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password,10);

    const newUser=await Users.create({
        userName:userName,
        email:email,
        password:hashedPassword
    });

    console.log("New User account is created");
    res.status(201).json({message:"User created succuessfully",newUser})

    } catch (error) {
        console.log.apply(error);
        res.status(409).send({error:"Email already registered"}); 
    }
};

const userLogin= async (req,res)=>{
    try {
        const {email,password}=req.body;

        const user=await Users.findOne({where:{email}});

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch) {
            return res.status(401).json({message:"Incorrect password"});
        }
        res.status(200).json({message:"Login Successful",user});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server error"})
    }
}

module.exports={
    userSignUp,
    userLogin
}