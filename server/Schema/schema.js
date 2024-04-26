const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const todo = new mongoose.Schema({
    userName: String,
    password: String,
    todo: [{
        title: String,
        descreption: String,
        todo_id: ObjectId,
    }]
});


todo.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        return token
    } catch (error) {
        console.log(error);
    }
}

const todoschema = mongoose.model("todolist", todo);
module.exports = todoschema
