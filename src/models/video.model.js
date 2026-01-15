import mongoose,{Aggregate, Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { aggregate } from "mongose/models/user_model";


const VideoSchema=new Schema({
   videoFiles:{
    type:String, //cloudinary URL
    required:true
   },
   thumbnail:{
     type:String,
     required:true
   },
   title:{
    type:String,
    required:true
   },
   description:{
    type:String,
    required:true
   },
   duration:{
    type:Number,
    requied:true
   },
   view:{
    type:Number,
    default:0
   },
   isPublsihed:{
    type:Boolean,
    default:true
   },
   owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   }

},{
    timestamps:true
})

VideoSchema.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",VideoSchema)