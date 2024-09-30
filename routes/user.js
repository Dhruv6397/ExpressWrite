const {Router} = require('express')
const User = require('../models/user.js') 
const router = Router() 
const path = require('path')
const multer = require('multer')
const Blog = require('../models/blog.js')
const {checkForAuthenticationCookie} = require('../middlewares/authentication.js')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/images`))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`  
      cb(null, filename)
    }
})
 
const upload = multer({ storage: storage })

router.use(checkForAuthenticationCookie('token'));


router.get('/signin',(req,res)=>{
    return res.render('signin')
})

router.get('/signup',(req,res)=>{
    return res.render('signup')
})



router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect('/')
})

router.get('/:id', async (req, res) => {
    const userId = req.params.id
    const blogs = await Blog.find({createdBy:userId}).populate("createdBy")
    
    if (!req.user) {
        return res.redirect('/user/signin'); 
    }
    res.render('userProfile', {
        user: req.user,
        blogs:blogs
    });
});

router.post('/signup',upload.single('profileImageURL'), async (req,res)=>{
    const {fullName,email,password} = req.body
    await User.create({
        fullName,
        email,
        password,
        profileImageURL:`/images/${req.file.filename}`
    })
    return res.redirect("/user/signin")
}) 
 
router.post('/signin', async (req,res)=>{
    try{
        const {email,password} = req.body
        const token = await User.matchPasswordAndGenerateToken(email,password)
        return res.cookie('token',token).redirect('/')
    }catch(e){
        return res.render('signin',{
            error:"Incorrect Email or Password"
        })
    } 
})

module.exports = router
