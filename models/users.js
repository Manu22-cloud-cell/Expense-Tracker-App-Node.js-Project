const {Sequelize,DataTypes}=require('sequelize');
const sequelize=require('../utils/db-connection');

const Users=sequelize.define('users',{
    userId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    userName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

module.exports=Users;