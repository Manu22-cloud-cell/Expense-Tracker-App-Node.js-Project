const express=require('express');
const router=express.Router();
const userController=require('../controller/userController')

router.post('/signUp',userController.userSignUp);

module.exports=router;