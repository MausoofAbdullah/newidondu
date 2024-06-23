import express from "express"
import {addCategory, addNews, getCategory,adminRegister,adminLogin,
  getAdmin,getadminLogin,adminLogout,viewNews,editNews,updateNews, getAdvertisement, postAdvertisement, viewAdds,blockNews, unblockNews} from "../controllers/AdminController.js"

import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from 'cloudinary';
import multer from "multer"

import dotenv from "dotenv";

import path from 'path'
import authMiddleware from "../middleware/authmiddleware.js";
dotenv.config();

const router=express.Router()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

// Set up multer storage and limits
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/images'); // Set your upload directory
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     },
//   });

const createUploadMiddleware = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB limit
    },
  });

  return upload.fields([{name:'image1'},{name:"image2"},{name:"images",maxCount:5}]);
};
 
router.get('/',authMiddleware,getadminLogin)
router.post('/',adminLogin)
router.get('/admin-news',authMiddleware,getAdmin)
// router.get('/admin-news',authMiddleware,getAdmin)
router.post('/admin-addnews',authMiddleware,createUploadMiddleware('news'),addNews)
// router.post('/addarticles',upload.array('images', 5),addArticles)
// router.get('/',getNews)
// router.get('/article',getArticles)
router.post('/categories',authMiddleware,addCategory)
router.get('/categories',authMiddleware,getCategory)
// router.get('/detailnews/:id',getDetailnews)


router.get('/viewnewsList',authMiddleware,viewNews)
router.get('/editNews/:id',authMiddleware,editNews)
router.post('/updateNews/:id',authMiddleware, createUploadMiddleware('news'),updateNews)
router.get('/blockNews/:id',authMiddleware,blockNews)
router.get('/unblockNews/:id',authMiddleware,unblockNews)

router.get('/advertisement',authMiddleware,getAdvertisement)
router.post('/add-advertisement',authMiddleware,createUploadMiddleware('advertisements'),postAdvertisement)
router.get('/viewAdds',authMiddleware,viewAdds)

router.post('/register',adminRegister)
router.post('/login',adminLogin)
router.get('/logout',adminLogout)



export default router
