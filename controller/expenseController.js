const Expenses=require('../models/expenses');
const jwt = require("jsonwebtoken");
const SECRET_KEY="mySecretKey"

const addExpenses= async (req,res)=>{
    try {
        const {amount,description,category}=req.body;

        const token = req.headers.authorization;
        const decoded = jwt.verify(token, SECRET_KEY);

        const expense=await Expenses.create({
            amount:amount,
            description:description,
            category:category,
            userId:decoded.userId //Assign logged-in user's ID
        })
        console.log("Expense details has been added");
        res.status(201).json(expense);
    } catch (error) {
        console.log(error)
        res.status(500).send({'error':error.message});
    }
}

const getAllExpenses= async (req,res)=>{

    try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, SECRET_KEY);
        const expenses= await Expenses.findAll({
            where:{userId:decoded.userId}//Filter by logged-in user
        });
        console.log("Fetching all expesnses");
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).send({'error':error.message});   
    }
}

const updateExpense= async (req,res)=>{
    try {
        const { id }=req.params;
        const { amount,description,category }=req.body;

        const token=req.headers.authorization;
        const decoded=jwt.verify(token,SECRET_KEY);

        const updatedExpense = await Expenses.findOne({
            where:{id,userId:decoded.userId} //Ensure ownership
        });

        if(!updatedExpense){
            res.status(404).send("Expense not found or unauthorized");
        }

        updatedExpense.amount=amount;
        updatedExpense.description=description;
        updatedExpense.category=category;
        await updatedExpense.save();
        res.status(200).json(updatedExpense)
    } catch (error) {
        res.status(500).send({"error":error.message});     
    }
}
const deleteExpense= async (req,res)=>{
    try {
        const {id}=req.params;

        const token = req.headers.authorization;
        const decoded = jwt.verify(token, SECRET_KEY);

        const deleteExpense=Expenses.destroy({
            where:{ id,userId:decoded.userId } //only delete own expense
        })
        if(!deleteExpense){
            res.status(404).send("Expense not found or unauthorized");
        }
        res.status(200).send("Expense details deleted");
    } catch (error) {
        res.status(500).send({'error':error.message});
    }
}

module.exports={
    addExpenses,
    getAllExpenses,
    updateExpense,
    deleteExpense
}