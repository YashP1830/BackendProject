import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt, { hash } from "bcrypt"
const UserSchema=new Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,//cloudinary  url 
        required:true
    },
    coverImage:{
        type:String// cloudinary url
    },  
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }],
    password:{
        type:String,
        required:[true,"Password is Required"]
    },
    refreshToken:{
        type:String
    }
},{
    timestamps:true
});

UserSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)

})

UserSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

UserSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id: this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullname
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}
UserSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id: this._id
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}


export const User=mongoose.model("User",UserSchema);

