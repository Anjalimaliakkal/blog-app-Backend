const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const { blogsmodel } = require("./models/blog")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://anjali2003:anjali2003@cluster0.wy6js.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async(password) => {
const salt = await bcrypt.genSalt(10)
return bcrypt.hash(password,salt)
}



app.post("/signUp", async(req, res) => {

    let input = req.body
    let hashedpassword=await generateHashedPassword(input.password)
    console.log(hashedpassword)
    input.password=hashedpassword
    let blog=new blogsmodel(input)
    blog.save()
    res.json({ "status": "success" })
})

app.listen(8081, () => {
    console.log("server started")
})