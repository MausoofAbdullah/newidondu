import mongoose from "mongoose";
const {ObjectId}=mongoose.Schema;


const addSchema=mongoose.Schema(
    {
        
        title: String,
        addnumber:Number,
       
        image1:String,
        image2:String,
        images:[String],
       
    //   views:Number,
       
            date:String,
        

        // reports working
    
   
    },
    {
        timestamps:true
    }
)

const addModel=mongoose.model("adds",addSchema)
export default addModel

// async function generateUniqueId() {
//     const count = await NewsModel.countDocuments();
//     return 100 + count;
// }

// async function generateUniqueId() {
//     const lastDocument = await NewsModel.findOne().sort({ _id: -1 });
//     const lastId = lastDocument ? parseInt(lastDocument._id.toString().slice(-4)) : 0;
//     return lastId + 1;
// }
// async function generateUniqueId() {
//     const count = await NewsModel.countDocuments();
//     const lastDocument = await NewsModel.findOne().sort({ _id: -1 });
//     const lastId = lastDocument ? parseInt(lastDocument._id.toString().slice(-4)) : 0;
//     const uniqueId = lastId + 1+100+count 
//     return  uniqueId
// }