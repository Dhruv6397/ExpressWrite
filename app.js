require("dotenv").config()
const path = require('path')
const express = require('express')
const mongoose = require("mongoose")
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const cookieParser = require('cookie-parser')
const Blog = require('./models/blog')


const { checkForAuthenticationCookie } = require('./middlewares/authentication')
const app = express()
const PORT = process.env.PORT || 8000

//mongoose.connect("mongodb://localhost:27017/youblog")

mongoose.connect(process.env.MONGO_URL)

 
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))
app.use(express.static(path.resolve('./public')))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))

app.get('/',async (req,res)=>{
    const allBlogs = await Blog.find({})
    res.render("home",{
        user:req.user,
        blogs:allBlogs
    })
}) 

app.use('/user',userRoute)
app.use('/blog',blogRoute)
app.listen(PORT, 
    ()=> console.log(`server started PORT : ${PORT}`)
)
