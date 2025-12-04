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

const userLogin= async (req,res)=>{
    try {
        const {email,password}=req.body;

        const user=await Users.findOne({where:{email}});

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        if(user.password !==password) {
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