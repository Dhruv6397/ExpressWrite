const {Router} = require('express')
const multer = require('multer')
const Blog = require('../models/blog.js') 
const path = require('path')
const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`  
      cb(null, filename)
    }
})
 
const upload = multer({ storage: storage })

router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user:req.user,
    })
})
 

router.post('/',upload.single('coverImage'),async (req,res)=>{
    const {title,body} = req.body
    const blog = await Blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverImageUrl:`/uploads/${req.file.filename}`,


    })
    return res.redirect(`/blog/${blog._id}`)
}) 
 

module.exports = router