const express=require('express');
const db=require('./utils/db-connection');
const userRouter=require('./routes/userRoutes');
const expenseRouter=require('./routes/expenseRoutes');
const cors=require('cors');

const app=express();

//importing all the models
require('./models');

app.use(cors());

app.use(express.json());

app.use('/users',userRouter);
app.use('/expenses',expenseRouter);

db.sync().then(()=>{
    app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    })
}).catch((err)=>{
    console.log(err);
})




