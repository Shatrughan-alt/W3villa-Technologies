const express = require("express");
const routes = express.Router();
const todoschema = require("../Schema/schema")
const bcrypt = require("bcryptjs");
const ObjectId = require("mongodb").ObjectId;
const userAuth = require("../auth/userAuth")

routes.get("/userdata", userAuth, (req, res) => {
    res.send(req.rootUser)
})

routes.post("/register", async (req, res) => {
    const { userName, password } = req.body
    if (!userName || !password) {
        return res.status(422).json({ error: "Fill All The Fields" })
    }

    const alreadyuser = await todoschema.findOne({ userName })

    if (alreadyuser) {
        return res.status(400).json({ error: "Seller Already Present" })
    }
    else {
        const salt = await bcrypt.genSalt(10)
        const securePass = await bcrypt.hash(password, salt)
        const newUser = new todoschema({ userName, password: securePass })
        newUser.save();
        res.status(200).json(newUser)
    }
})


routes.post("/login", async (req, res) => {
    const { userName, password } = req.body
    if (!userName || !password) {
        return res.status(422).json({ error: "Fill All The Fields" })
    }
    try {
        const userPresent = await todoschema.findOne({ userName })
        if (!userPresent) {
            return res.status(400).json({ error: "Invalid Credentials" })
        }
        else {
            const validPass = await bcrypt.compare(password, userPresent.password)
            if (validPass) {
                const token = await userPresent.generateAuthToken();
                res.cookie("jwtoken", token)
                res.status(200).json("Login Success")
            }
            else {
                return res.status(400).json({ error: "Invalid Credentials" })
            }
        }
    } catch (error) {
        console.log(error);
    }
})



routes.post("/addtodo", userAuth, async (req, res) => {
    const { title, descreption } = req.body
    const todo_id = new ObjectId();
    if (!title) {
        return res.status(422).json({ error: "Fill All The Fields" })
    }

    try {
        const userPresent = await todoschema.findOne({ _id: req.userID })

        if (userPresent) {
            const newTodo = userPresent.todo.push({ title, todo_id, descreption });
            await userPresent.save();
            res.status(200).json({ message: "ToDo Add Success" })
        }
    } catch (error) {
        console.log(error);
    }
})



routes.delete("/deletetodo/:id", userAuth, async (req, res) => {
    const _id = req.params.id;
    console.log(_id);
    const user_id = req.userID;

    const deleteuser = await todoschema.updateOne({ _id: user_id }, { "$pull": { "todo": { _id: _id } } }, { safe: true, multi: true })
    if (!deleteuser ) {
        return res.status(400).send()
    }
    // res.status(200).json({ message: "UserDeletes" })
    res.status(200).send(req.rootUser);
    console.log("Deleted");
})




routes.patch("/updatetodo/:id", userAuth, async (req, res) => {
    const _id = req.params.id;
    const { title, descreption } = req.body;

    try {
        if (!title) {
            return res.status(422).json({ error: "Please fill all the fields" });
        }

        // Find the user's document and update the todo
        const user = await todoschema.findOne({ _id: req.userID });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const todoToUpdate = user.todo.find(todo => todo._id.toString() === _id);

        if (!todoToUpdate) {
            return res.status(404).json({ error: "Todo not found" });
        }

        todoToUpdate.title = title;
        todoToUpdate.descreption = descreption;

        user.markModified("todo");
        await user.save();

        res.status(200).json({ message: "Todo updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});







routes.get("/logoutuser", async (req, res) => {
    res.clearCookie("jwtoken", { path: "/" });
    // console.log("Logout");
    res.status(200).json({ message: "User Logout" })
})


module.exports = routes
