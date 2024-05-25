import categoryModel from "../models/categoryModel.js";
import NewsModel from "../models/newsModel.js";
import ArticleModel from "../models/articleModel.js";
import UserModel from "../models/userModel.js";
import dotenv from "dotenv"
import timeago from 'timeago.js';
import moment from 'moment'
import addModel from "../models/addModel.js";


const serverPublic="https://res.cloudinary.com/dkeb469sv/image/upload/v1703658754/"






export const getNews=async(req,res,next)=>{
    
  console.log("some")
    const currentPath = req.path;
    const cDate = moment();
    const currentDate = cDate.format('MMMM DD dddd YYYY')
    
    
    
    try {
        // throw new Error("Something went wrong!");
      const perPage = 9;
      const page = req.query.page || 1;
        const news=await NewsModel.find().sort({ createdAt: -1 }).skip((page - 1) * perPage) .limit(perPage).exec()
        const allnews=await NewsModel.find().sort({ createdAt: -1 }).limit(10).exec()

        const category = await categoryModel.find().exec()
        
        const totalNewsCount = await NewsModel.countDocuments();
        const totalPages = Math.ceil(totalNewsCount / perPage);

        const formattedNews = news.map(obj => {
          // Assuming 'date' property contains the date in the format '3/2/2024'
          const dateParts = obj.date.split('/');
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          const month = parseInt(dateParts[0]) - 1; // Subtract 1 to convert from 1-based to 0-based index
          const day = parseInt(dateParts[1]);
          const year = parseInt(dateParts[2]);
          const formattedDate = `${monthNames[month]} ${day} ${year}`;
      
          // Update the object with the formatted date
          return { ...obj, ...obj.date= formattedDate };
      });
        
        // console.log(resultDate,'dad');
 
      //   const formattedNews = news.map((item) => {
      //     return {
      //         ...item.toObject(),
      //         time: timeago.format(item.createdAt),
              
      //     };
      // });
      news.forEach(newsItem => {
        
        newsItem.shortp = truncateToWords(newsItem.body);
        //  newsItem.date=formattedNews.date
      });
    
  

        function truncateToWords(str) {
          // const words = str.split(/\s+/);
          const truncatedWords = str.slice(0 , 200);
          
          return truncatedWords;
        }
    
    


function truncateToThreeWords(str) {
  

  // Truncate to three words
  const truncatedString = str.slice(0, 150)

  return truncatedString;

}
const previousPage = Math.max(1, page - 1);
const nextPage = Math.max(1, page + 1);

    // Pagination for trending news
    const trendingPerPage = 8; // Set the number of trending news items per page
    const trendingPage = req.query.trendingPage || 1;

    const trendingNews = await NewsModel.find()
        .sort({ createdAt: -1 })
        .skip((trendingPage - 1) * trendingPerPage)
        .limit(trendingPerPage)
        .exec();

    const trendingTotalCount = await NewsModel.countDocuments();
    const trendingTotalPages = Math.ceil(trendingTotalCount / trendingPerPage);


    const previousNews = await NewsModel.findOne({ createdAt: { $lt: news.createdAt } }).sort({ createdAt: -1 }).exec() ||await NewsModel.findOne().sort({ createdAt: -1 }).exec();
      

    // Get the next news
    const nextNews = await NewsModel.findOne({ createdAt: { $gt: news.createdAt } }).sort({ createdAt: 1 }).exec() || await NewsModel.findOne().sort({ createdAt: 1 }).exec();

    const allAdds=await addModel.find().sort({ createdAt: 1 }).exec()
    const addNumberOne = allAdds.find(add => add.addnumber === 1);
    const filteredAdds = allAdds.filter(add => add.addnumber !== 1);

        res.render('user/newsHome',{news,allnews,previousNews,nextNews,category,totalPages, page ,previousPage,nextPage, trendingNews, trendingTotalPages, trendingPage,currentPath,currentDate,allAdds:filteredAdds,addNumberOne})
        
      //  return res.status(200).json(news)
    } catch (error) {
        console.log(error,"errrr")
        // res.status(error.status || 500).send({
        //     error: {
        //       status: error.status || 500,
        //       message: error.message || "Internal Server Error",
        //     },
        //   });
        next(error)
    }
}



export const getDetailnews=async(req,res,next)=>{
    try {
        const { id } = req.params;
        
        const {slug} =req.params
        console.log(slug,"slugin dets")
        const page = req.query.page || 1;
        const cDate = moment();
        const currentDate = cDate.format('MMMM DD dddd YYYY')

        
       
        
        // console.log(id,"id")
        const news = await NewsModel.findOne({slug:slug});
      //   if (news) {
      //     news.views += 1; // Increment the view count
      //     await news.save(); // Save the updated news article with the incremented view count
      // }



    //   if (!req.session.viewedArticles) {
    //     req.session.viewedArticles = {}; // Initialize the viewedArticles object in the session
    // }

    // if (!req.session.viewedArticles[slug]) {
    //     // Find the news article by its slug
    //     const news = await NewsModel.findOne({ slug });

    //     // If the article is found, increment its view count
    //     if (news) {
    //         news.views += 1; // Increment the view count
    //         await news.save(); // Save the updated news article with the incremented view count
    //     }

    //     // Mark the article as viewed in the user's session to prevent duplicate views
    //     req.session.viewedArticles[slug] = true;
    // }
    

   
     
    
        news.shortD=truncateBody(news?.body);
        function truncateBody(str) {
            // const words = str.split(/\s+/);
            const truncatedWords = str?.slice(0, 80);
            
            return truncatedWords;
          }

          const dateString = news.date;
const dateParts = dateString.split('/'); // Split the date string into parts
 // Split the date string into parts
const month = parseInt(dateParts[0]) - 1; // Subtract 1 from month as it is zero-indexed
const day = parseInt(dateParts[1]);
const year = parseInt(dateParts[2]);

const formattedDate = new Date(year, month, day);
const monthName = formattedDate.toLocaleDateString('en-US', { month: 'long' });
const dayOfMonth = formattedDate.getDate();
const dayOfWeek = formattedDate.toLocaleDateString('en-US', { weekday: 'long' });
const fullYear = formattedDate.getFullYear();

const resultDate = `${monthName} ${dayOfMonth} ${dayOfWeek} ${fullYear}`;



        // const fullNews=await NewsModel.find().sort({ createdAt: -1 }).limit(4).exec()

        // const timead=timeago.format(news.createdAt);
       
      
        //   news.shortp = truncateToWords(news.body);
        

        // function truncateToWords(str) {
        //   // const words = str.split(/\s+/);
        //   const truncatedWords = str.slice(0, 100);
          
        //   return truncatedWords;
        // }
        
    
        const previousNews = await NewsModel.findOne({ createdAt: { $lt: news.createdAt } }).sort({ createdAt: -1 }).exec() ||await NewsModel.findOne().sort({ createdAt: -1 }).exec();
        previousNews.shortp = truncateToWords(previousNews.title);
        


        // Get the next news
        const nextNews = await NewsModel.findOne({ createdAt: { $gt: news.createdAt } }).sort({ createdAt: 1 }).exec() 
    
      
      const img=news?.images
     
if(nextNews){

  nextNews.shortp = truncateToWords(nextNews?.title);
}
        

      function truncateToWords(str) {
        // const words = str.split(/\s+/);
        const truncatedWords = str?.slice(0, 80);
        
        return truncatedWords;
      }
       
        if (!news) {
          
          return res.status(404).json({
            message: "no blogs for this user",
          });
        }
           
   // Pagination for trending news
   const previousPage = Math.max(1, page - 1);
const nextPage = Math.max(1, page + 1);
console.log(nextPage,"nexxxxxxxxt")
   const trendingPerPage = 8; // Set the number of trending news items per page
   const trendingPage = req.query.trendingPage || 1;

   const trendingNews = await NewsModel.find()
       .sort({ createdAt: -1 })
       .skip((trendingPage - 1) * trendingPerPage)
       .limit(trendingPerPage)
       .exec();
       trendingNews.forEach(newsItem => {
        newsItem.shortp = truncateToWords(newsItem.title);
      });
   const trendingTotalCount = await NewsModel.countDocuments();
   const trendingTotalPages = Math.ceil(trendingTotalCount / trendingPerPage);
   const allnews=await NewsModel.find().sort({ createdAt: -1 }).limit().exec()
   allnews.forEach(newsItem => {
    newsItem.shortp = truncateToWords(newsItem.title);
  });

  const allAdds=await addModel.find().sort({ createdAt: -1 }).exec()
  const addNumberOne = allAdds.find(add => add.addnumber === 1);
  const filteredAdds = allAdds.filter(add => add.addnumber !== 1);

   
        res.render('user/singlePage',{user:true,addNumberOne,allAdds:filteredAdds,news,img,resultDate,previousNews,nextNews,currentDate,allnews, trendingNews, trendingTotalPages, trendingPage,previousPage,nextPage})

        // return res.status(200).json(news);
      } catch (error) {
        console.log(error,"errrrr")
        // return res.status(400).json({
        //   message: "error while getting single blog",
        //   error,
        // });
     next(error)
     

      }
  
}


export const getCategorynews=async(req,res,next)=>{
   
    const cDate = moment();
    const currentDate = cDate.format('MMMM DD dddd YYYY')
   
    try {
        
        let category = req.query.category;
      
        const currentPath = req.path;
        const perPage = 9;
        const page = req.query.page || 1;
          const cnews=await NewsModel.find({ category }).sort({ createdAt: -1 }).skip((page - 1) * perPage) .limit(perPage).exec()
        
          
          
        const news=await NewsModel.find().sort({ createdAt: -1 }).skip((page - 1) * perPage) .limit(perPage).exec()
         
          const showCategory= await categoryModel.find().exec()
          
          const totalNewsCount = await NewsModel.countDocuments();
          const totalPages = Math.ceil(totalNewsCount / perPage);
  
          cnews.forEach(newsItem => {
            newsItem.shortp = truncateToWords(newsItem.body);
          });
   
          const formattedNews = news.map((item) => {
            return {
                ...item.toObject(),
                timeAgo: timeago.format(item.createdAt),
            };
        });
      
      
  
          function truncateToWords(str) {
            // const words = str.split(/\s+/);
            const truncatedWords = str.slice(0 , 100);
            
            return truncatedWords;
          }
      
      
  
  
  function truncateToThreeWords(str) {
    
  
    // Truncate to three words
    const truncatedString = str.slice(0, 150)
  
    return truncatedString;
  
  }
  const previousPage = Math.max(1, page - 1);
  const nextPage = Math.max(1, page + 1);
  
      // Pagination for trending news
      const trendingPerPage = 9; // Set the number of trending news items per page
      const trendingPage = req.query.trendingPage || 1;
  
      const trendingNews = await NewsModel.find()
          .sort({ createdAt: -1 })
          .skip((trendingPage - 1) * trendingPerPage)
          .limit(trendingPerPage)
          .exec();
  
      const trendingTotalCount = await NewsModel.countDocuments();
      const trendingTotalPages = Math.ceil(trendingTotalCount / trendingPerPage);
  
      
  const allAdds=await addModel.find().sort({ createdAt: -1 }).exec()
  const addNumberOne = allAdds.find(add => add.addnumber === 1);
  const filteredAdds = allAdds.filter(add => add.addnumber !== 1);

  
          res.render('user/category',{user:true,addNumberOne,allAdds:filteredAdds,news:formattedNews,category,totalPages, page ,previousPage,nextPage, trendingNews, trendingTotalPages, trendingPage,currentPath,currentDate,cnews})
          
        //  return res.status(200).json(news)
      } catch (error) {
          next(error)
          console.log(error,'ere')

      }
}


export const getContactpage=async(req,res,next)=>{
  try {
    res.render('user/contact',{user:true})
  } catch (error) {
    next(error)
  }
}

