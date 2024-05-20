import express from "express"
import {getNews,getDetailnews,getCategorynews,getContactpage} from "../controllers/newsController.js"
import cacheMiddleware from "../middleware/cacheMiddleware.js"

const router=express.Router()


// router.get('/',(req,res)=>{
//     res.render('user/sample')
// })
router.get('/',getNews)

router.get('/detailnews/:slug',cacheMiddleware, getDetailnews)


router.get('/category',getCategorynews)

router.get('/contact',getContactpage)



export default router