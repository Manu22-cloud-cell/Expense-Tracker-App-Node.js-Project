const User=require('./users');
const Expenses=require('./expenses');
const Payment=require('./payment');

//one to many

User.hasMany(Expenses,{foreignKey:"userId"});
Expenses.belongsTo(User,{foreignKey:"userId"});

//one to many
User.hasMany(Payment);
Payment.belongsTo(User);

module.exports={
    User,
    Expenses,
    Payment
}