const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('expensedb', 'root', '252582', {
    host: 'localhost',
    dialect: 'mysql'
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection to the Database has been created");
    } catch (error) {
        console.log(error);
    }
})();

module.exports = sequelize;

