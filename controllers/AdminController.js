import categoryModel from "../models/categoryModel.js";
import NewsModel from "../models/newsModel.js";
import ArticleModel from "../models/articleModel.js";
import UserModel from "../models/userModel.js";
import adminModel from "../models/adminModel.js";
import dotenv from "dotenv"
import timeago from 'timeago.js';
import { slugify } from 'transliteration';


import mongoose from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import addModel from "../models/addModel.js";



dotenv.config()
const serverPublic="https://res.cloudinary.com/dkeb469sv/image/upload/v1703658754/"
export const adminRegister = async (req, res,next) => {
 

   const {firstname, lastname,username} = req.body
        const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;
  
    const newAdmin = new adminModel({firstname,lastname,username,password:hashedPass});
  
  //  const newAdmin= new UserModel({username,password,...req.body});
   // const {username,password,...rest}=new UserModel(req.body)
    
   //const newAdmin={username,password,...rest}

   
  
    try {
    
      const admin = await newAdmin.save();
   
  
   
      res.status(200).json({ admin });
    } catch (error) {
      // res.status(500).json({ message: error.message });
   next(error)
    }
  };
export const getadminLogin=async(req,res,next)=>{
 
  if(!req.user.email){
    const message = req.query.message || '';
    const admins=req.user.email
      
    res.render('admin/admin-login',{admin:true,admins})
  }

  res.redirect('/admin/admin-news')
}

  export const adminLogin = async (req, res,next) => {
    const { username,password} = req.body;

  
    try {
      const admin = await adminModel.findOne({username});
     
  
      if (admin) {
        const validity = await bcrypt.compare(password, admin.password);
  
        if (!validity) {
          // res.status(400).json("Wrong password");
          res.redirect('/admin?message=Invalid%20username%20or%20password');
        } else {
          const token = jwt.sign(
            {
                email: admin.username,
              id: admin._id,
            },
            process.env.JWT_KEY,
            { expiresIn: "24h" }
          );
   
          res.cookie('token', token);

          // Redirect to the add-news page on successful login
          res.redirect('/admin/admin-news');
          
          // res.status(200).json({admin,token });
        }
      } else {
        // res.status(404).json("User does not exists");
        res.render('admin/admin-login', { message: 'Invalid username' })
      }
    } catch (error) {
      // res.status(500).json({ message: error.message });
    next(error)
    }
  };

  export const getAdmin=async(req,res,next)=>{
    const category = await categoryModel.find().exec()
    const admins=req.user.email

    res.render('admin/addnews',{category,admin:true,admins})
  }
//create new post

export const addNews= async(req,res,next)=>{
  const totalCount = await NewsModel.countDocuments();

    // Increment the count by one to get the next article number
    const articleNumber = totalCount + 101;
 
 
    const { _id,title,url,subtitle, category, date, body ,imagetitle1,imagetitle2,secondparagraph,thirdparagraph,isBreaking,twitterLink} = req.body;
   console.log(twitterLink,"url")
    const videoID = getYouTubeVideoID(url);
  
    const dateString = date
    
  const dateObject = new Date(dateString);
  const formattedDate = dateObject.toLocaleDateString();
  // console.log(formattedDate,"date")
  

  
    const imageFiles = req.files;
    const kannadaTitle = title.slice(0,20);
    const   kannadaTitles = slugify(kannadaTitle, {seperator:" - ",   lowercase: true });
 
const slug=kannadaTitles+"-n0-"+articleNumber
console.log(slug,"sssssss")
    

    // Create a new NewsModel instance with the extracted data
    const newNews = new NewsModel({
      title,
      videoID,
      subtitle,
      category,
      date:formattedDate,
      body,
      image1: imageFiles['image1']?.[0].filename, // Get the filename for image1
      image2: imageFiles['image2']?.[0].filename, // Get the filename for image2
      images: imageFiles['images']?.map(file => file.filename), 
      imagetitle1,
      imagetitle2,
      secondparagraph,
      thirdparagraph,
      slug,
      isBreaking,
      twitterLink
    });

    try {
        const sluf=await newNews.save()
        
        res.redirect('/admin/admin-news')
        // res.status(200).json(newNews)
    } catch (error) {
        // res.status(500).json(error)
        console.log(error,'erer')
 next(error)

    }
}

// export const addArticles= async(req,res)=>{
//   console.log(req.body,'reqqhy')
//     const { title, category, date, body ,imagetitle,secondparagraph} = req.body;
//     const dateString = date
    
//   const dateObject = new Date(dateString);
//   const formattedDate = dateObject.toLocaleDateString();

   
//     const imageFiles = req.files;

//     // Create a new NewsModel instance with the extracted data
//     const newNews = new ArticleModel({
//       title,
//       category,
//       date:formattedDate,
//       body,
//       images: imageFiles.map((file) => file.filename),
//       imagetitle,
//       secondparagraph
//     });

//     try {
//         await newNews.save()
//         res.status(200).json(newNews)
//     } catch (error) {
//         res.status(500).json(error)
//     }
// }

// export const getArticles=async(req,res)=>{
//     try {
//         const news=await ArticleModel.find().sort({ createdAt: -1 }).limit(4).exec()
       
       
//        return res.status(200).json(news)
//     } catch (error) {
//         console.log(error,'ere')
//     }
// }

export const addCategory=async(req,res,next)=>{
  
    const cat= new categoryModel(req.body)
    const {category}=req.body
   
    try {
        const catExists = await categoryModel.findOne({ cat });
        if(catExists){
            res.status(500).json("already exists")
        }
        await cat.save()
        res.redirect('/admin/categories')
        // res.status(200).json(cat)
    } catch (error) {
        // res.status(500).json(error)
   next(error)

        
    }
}

export const getCategory=async(req,res,next)=>{
    try {
        
        const catDetails = await categoryModel.find().exec()
      
        const admins=req.user.email
    res.render('admin/categorypage',{catDetails,admin:true,admins})
      // return res.status(200).json(catDetails)
    } catch (error) {
   next(error)
        
    }

}


export const viewNews=async(req,res,next)=>{
  try {
    const allnews=await NewsModel.find().sort({ createdAt: -1 }).exec()
    const admins=req.user.email

    res.render('admin/viewNews',{admin:true,allnews,admins})
  } catch (error) {
    next(error)
  }
}

export const editNews=async(req,res,next)=>{
  try {

    const id=req.params.id

    const news=await NewsModel.findOne({_id:id})
    const category = await categoryModel.find().exec()
   

    res.render('admin/editNews',{news,admin:true,category})
  } catch (error) {
    next(error)
  }
}

export const updateNews=async(req,res,next)=>{
  const id=req.params.id
 
  const { _id,title,subtitle, category, date, body ,imagetitle1,imagetitle2,secondparagraph,thirdparagraph} = req.body;
    
    const dateString = date
    
  const dateObject = new Date(dateString);
  const formattedDate = dateObject.toLocaleDateString();
  const imageFiles = req.files;
    


  try {
    const updatedNews=await NewsModel.updateOne({_id:id},{
      $set:{
        title,
        subtitle,
        category,
        date:formattedDate,
        body,
        image1: imageFiles['image1']?.[0].filename, // Get the filename for image1
        image2: imageFiles['image2']?.[0].filename, // Get the filename for image2
        images: imageFiles['images']?.map(file => file.filename), 
        imagetitle1,
        imagetitle2,
        secondparagraph,
        thirdparagraph
      }
    })

    
    res.redirect('/admin/viewnewsList')
  } catch (error) {
    next(error)
    
  }
}


export const blockNews=async(req,res)=>{
  console.log("odf")
  try {
    const newsId=req.params.id
    console.log(newsId,"id")

    
    console.log(req.body,"blicing")
    await NewsModel.updateOne({_id:newsId},
    {
      $set:{
        isActive:false
      }
    })
    res.redirect('/admin/viewnewsList')
  } catch (error) {
    next(error)
  }
}
export const unblockNews=async(req,res)=>{
  try {
    const newsId=req.params.id
    
    console.log(req.body,"unblicing")
    await NewsModel.updateOne({_id:newsId},
    {
      $set:{
        isActive:true
      }
    })
    res.redirect('/admin/viewnewsList')
  } catch (error) {
    next(error)
  }
}

export const getAdvertisement=async(req,res)=>{
  console.log("advertisement")
  res.render('admin/advertisement',{admin:true})
}

export const postAdvertisement=async(req,res)=>{
  console.log("postadd")
  
  // (req.body,"req")
  const { _id,title, date, addnumber} = req.body;
    
  const dateString = date
  
const dateObject = new Date(dateString);
const formattedDate = dateObject.toLocaleDateString();
// console.log(formattedDate,"date")



  const imageFiles = req.files;



  

  // Create a new NewsModel instance with the extracted data
  const newAdd = new addModel({
    title,
    addnumber,
    date:formattedDate,
  
    image1: imageFiles['image1']?.[0].filename, // Get the filename for image1
    image2: imageFiles['image2']?.[0].filename, // Get the filename for image2
    images: imageFiles['images']?.map(file => file.filename), 
 
  });

  try {
      const sluf=await newAdd.save()
      
      res.redirect('/admin/advertisement')
      // res.status(200).json(newNews)
  } catch (error) {
      // res.status(500).json(error)
      console.log(error,'erer')
next(error)

  }
}

export const viewAdds=async(req,res,next)=>{
  try {
    const allAdds=await addModel.find().sort({ createdAt: -1 }).exec()
    const admins=req.user.email

    res.render('admin/view-advertisement',{admin:true,allAdds,admins})
  } catch (error) {
    next(error)
  }
}

 //logout functions
 export const adminLogout=async(req,res)=>{
  res.clearCookie('token')
  res.redirect('/admin')
 }


//creating a function to return the html based on the route

function getYouTubeVideoID(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const matches = url.match(regex);
  return matches ? matches[1] : null;
}
