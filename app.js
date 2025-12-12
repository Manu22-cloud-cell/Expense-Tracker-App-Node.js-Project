const express=require('express');
const db=require('./utils/db-connection');
const userRouter=require('./routes/userRoutes');
const expenseRouter=require('./routes/expenseRoutes');
const paymentRoutes=require('./routes/paymentRoutes');
const leaderboardRouter=require('./routes/userLeaderBoard')
const path=require("path");
const cors=require('cors');
require("dotenv").config();

const app=express();

//importing all the models
require('./models');

app.use(cors());

app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "Frontend")));

app.use('/users',userRouter);
app.use('/expenses',expenseRouter);
app.use('/expenses',leaderboardRouter)
app.use('/payment',paymentRoutes);

db.sync().then(()=>{
    app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    })
}).catch((err)=>{
    console.log(err);
})




