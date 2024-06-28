const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
email:String ,
password : String,
role : String,
name:String 
})

const EmployeeModel = mongoose.model("employee" , EmployeeSchema)
module.exports = EmployeeModel