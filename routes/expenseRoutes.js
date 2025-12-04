const express=require('express');
const router=express.Router();
const expenseController=require('../controller/expenseController');

router.post('/add',expenseController.addExpenses);
router.get('/',expenseController.getAllExpenses);
router.put('/update/:id',expenseController.updateExpense);
router.delete('/delete/:id',expenseController.deleteExpense);


module.exports=router;