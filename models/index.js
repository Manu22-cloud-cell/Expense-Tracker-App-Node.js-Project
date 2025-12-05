const User=require('./users');
const Expenses=require('./expenses');

//one to many

User.hasMany(Expenses,{foreignKey:"userId"});
Expenses.belongsTo(User,{foreignKey:"userId"});

module.exports={
    User,
    Expenses
}