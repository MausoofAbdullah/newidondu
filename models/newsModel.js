import mongoose from "mongoose";
const {ObjectId}=mongoose.Schema;
import {marked} from 'marked'
// import slugify from "slugify";
import speakingurl from 'speakingurl';
// import slugify from 'slug';
// import { slugify,slugifyUrl } from "transliteration";
import { slugify } from 'transliteration';

const newsSchema=mongoose.Schema(
    {
        
        title: String,
        isBreaking:{
            type:Boolean,
            default:false
        },
        subtitle:String,
        category:String,
        image1:String,
        image2:String,
        images:[String],
        imagetitle1:String,
        imagetitle2:String,
    //   views:Number,
       
            date:String,
            body:String,
            secondparagraph:String,
            thirdparagraph:String,
         views:{
            type:Number,
            default:0
         },

        // reports working
        reports:{
            type: Array,
            default: [],
          },
          reportcount:{
            type:Number,
            default:0
          },
          slug:{
            type:String,
            required:true,
            unique:true
          }

   
    },
    {
        timestamps:true
    }
)
newsSchema.pre('validate',async function(next){
    if(this.title){
        const kannadaTitle = this.title.slice(0,20);
     const   kannadaTitles = slugify(kannadaTitle, {seperator:" - ",   lowercase: true });

        const uniqueId =await generateUniqueId()
        console.log(uniqueId,"ud")
 this.slug = kannadaTitles+"-no-"+uniqueId
//  this.slug = slugify(kannadaTitle, { lowercase: true });
// console.log(slug,"sofd");
    }
    next()
})
const NewsModel=mongoose.model("posts",newsSchema)
export default NewsModel

async function generateUniqueId() {
    const count = await NewsModel.countDocuments();
    return 100 + count;
}