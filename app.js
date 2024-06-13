const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const { blogsmodel } = require("./models/blog")
const jwt=require("jsonwebtoken")
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

app.post("/signIn",(req,res)=>{
    let input=req.body
    blogsmodel.find({"emailid":req.body.emailid}).then(
        (response)=>{
            if (response.length>0) {
                let dbPassword=response[0].password
                console.log(dbPassword)
                bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
if (isMatch) {
    jwt.sign({email:input.emailid},"blog-app",{expiresIn:"1d"},(error,token)=>{
        if (error) {
            res.json({"status":"unable to create token"})
        } else {
            res.json({"status":"success","userid":response[0]._id,"token":token})
        }
    })
    
} else {
    res.json({"status":"incorrect password"})
}
                })
            } else {
                res.json({"status":"user doesn't exist"})
            }
        }
    ).catch()
})

app.listen(8081, () => {
    console.log("server started")
})