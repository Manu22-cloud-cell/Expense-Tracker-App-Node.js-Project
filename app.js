const express=require('express');
const db=require('./utils/db-connection');
const userRouter=require('./routes/userRoutes');
const userModel=require('./models/users');
const cors=require('cors');

const app=express();

app.use(cors());

app.use(express.json());

app.use('/users',userRouter);



db.sync({force:true}).then(()=>{
    app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    })
}).catch((err)=>{
    console.log(err);
})




