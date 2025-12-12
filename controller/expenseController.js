const Expenses = require('../models/expenses');
const User = require('../models/users');
const jwt = require("jsonwebtoken");
const SECRET_KEY = "mySecretKey";
const { autoCategorize } = require("../services/aiCategoryService");
const sequelize = require('../utils/db-connection');


// ADD EXPENSE
const addExpenses = async (req, res) => {
    try {

        const { amount, description, category } = req.body;
        const decoded = jwt.verify(req.headers.authorization, SECRET_KEY);

        const result = await sequelize.transaction(async (t) => {

            let finalCategory = category;
            if (!finalCategory || finalCategory.trim() === "") {
                finalCategory = await autoCategorize(description);
            }

            const expense = await Expenses.create(
                {
                    amount,
                    description,
                    category: finalCategory,
                    userId: decoded.userId
                },
                { transaction: t }
            );

            await User.increment(
                { totalExpense: amount },
                { where: { id: decoded.userId }, transaction: t }
            );

            return expense; // returned from transaction
        });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL
const getAllExpenses = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, SECRET_KEY);

        const expenses = await Expenses.findAll({
            where: { userId: decoded.userId }
        });

        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};



// UPDATE EXPENSE
const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, category } = req.body;
        const decoded = jwt.verify(req.headers.authorization, SECRET_KEY);

        const updatedExpense = await sequelize.transaction(async (t) => {

            const existingExpense = await Expenses.findOne({
                where: { id, userId: decoded.userId },
                transaction: t
            });

            if (!existingExpense) {
                throw new Error("Expense not found or unauthorized");
            }

            const diff = Number(amount) - existingExpense.amount;

            await existingExpense.update(
                { amount, description, category },
                { transaction: t }
            );

            await User.increment(
                { totalExpense: diff },
                { where: { id: decoded.userId }, transaction: t }
            );

            return existingExpense;
        });

        res.status(200).json(updatedExpense);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE EXPENSE
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const decoded = jwt.verify(req.headers.authorization, SECRET_KEY);

        await sequelize.transaction(async (t) => {
            const expense = await Expenses.findOne({
                where: { id, userId: decoded.userId },
                transaction: t
            });

            if (!expense) {
                throw new Error("Expense not found or unauthorized");
            }

            await User.increment(
                { totalExpense: -expense.amount },
                { where: { id: decoded.userId }, transaction: t }
            );

            await expense.destroy({ transaction: t });
        });

        res.status(200).send("Expense deleted successfully");

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addExpenses,
    getAllExpenses,
    updateExpense,
    deleteExpense
};
