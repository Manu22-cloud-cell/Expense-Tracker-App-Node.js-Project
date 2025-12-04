const Expenses=require('../models/expenses');

const addExpenses= async (req,res)=>{
    try {
        const {amount,description,category}=req.body;

        const expense=await Expenses.create({
            amount:amount,
            description:description,
            category:category
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
        const expenses= await Expenses.findAll();
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
        const updatedExpense = await Expenses.findByPk(id);
        if(!updatedExpense){
            res.status(404).send("Expense not found");
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
        const deleteExpense=Expenses.destroy({
            where:{
                id:id
            }
        })
        if(!deleteExpense){
            res.status(404).send("Expense not found");
        }
        res.status(200).send(`Expense with id ${id} is deleted`);
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