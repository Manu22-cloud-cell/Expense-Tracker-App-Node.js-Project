const Expenses=require('../models/expenses');
const User=require('../models/users');
const jwt = require("jsonwebtoken");
const SECRET_KEY="mySecretKey";
const { autoCategorize } = require("../services/aiCategoryService");

// ADD EXPENSE WITH AI AUTO-CATEGORY
const addExpenses= async (req,res)=>{
    try {
        let {amount,description,category}=req.body;

        const token = req.headers.authorization;
        const decoded = jwt.verify(token, SECRET_KEY);

        console.log(description);

        //If user did not pick a category → Let AI decide
        if(!category || category.trim()===""){
            category = await autoCategorize(description)
        }

        console.log(category);

        const expense=await Expenses.create({
            amount:amount,
            description:description,
            category:category,
            userId:decoded.userId //Assign logged-in user's ID
        })

        //Update totalExpense incrementally
        await User.increment(
            {totalExpense:amount},
            {where:{id:decoded.userId}}
        )

        console.log("Expense added with AI category");
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

        //Fetch old expense
        const existingExpense=await Expenses.findOne({
            where:{id,userId:decoded.userId}
        });

        if(!existingExpense){
            return res.status(404).send("Expense not found or unauthorized");
        }

        const oldAmount=existingExpense.amount;
        const newAmount=Number(amount);

        //calculate the differenc
        const diff=newAmount-oldAmount;

        existingExpense.amount=amount;
        existingExpense.description=description;
        existingExpense.category=category;
        await existingExpense.save();

        await User.increment(
            {totalExpense:diff},
            {where:{id:decoded.userId}}
        );

        res.status(200).json(existingExpense)
    } catch (error) {
        res.status(500).send({error:error.message});     
    }
}
const deleteExpense= async (req,res)=>{
    try {
        const {id}=req.params;

        const token = req.headers.authorization;
        const decoded = jwt.verify(token, SECRET_KEY);

        //Find the expense first
        const expense=await Expenses.findOne({
            where:{id,userId:decoded.userId}
        });

        if(!expense){
            return res.status(404).send("Expense not found or unauthorized");
        }

        const amountToSubtract = expense.amount;

        //delete the expense
        await expense.destroy();

        //subtract from the totalExpense
        await User.increment(
            {totalExpense:-amountToSubtract},
            {where:{id:decoded.userId}}
        );

        res.status(200).send("Expense deleted successfully");
    } catch (error) {
        res.status(500).send({error:error.message});
    }
}

module.exports={
    addExpenses,
    getAllExpenses,
    updateExpense,
    deleteExpense
}