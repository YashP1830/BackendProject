import { asyncHandeler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadFileonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
const registerUser=asyncHandeler(async(req,res)=>{
    //get user detail from frontend
    //validaion -not empty
    //check if user already exist: username,email
    //check for images,check for avatar
    //upload on cloundinary,avatar
    //create user object -create entry in db
    //remove password and refresh token field from the response
    //check for user creation
    

//STEP-1 using OBJECT deconstruction extract information from Frontend USING req.body
//------>>>>>>>
    console.log("FILES:", req.files);  

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    
    
    if(!avatarLocalPath)
    {
        throw new ApiError(400,"Avatar file is required")
    }

    

    const{fullname,email,username,password}=req.body
    console.log(`fullname is: ${fullname}`)
///--->>>>>>>>

    // if(fullname===""){
    //     throw new ApiError(400,"fullname is required")
    // }

    if(
        [fullname,email,username,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser =await User.findOne({
        $or :[{email},{username}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or usename already exists")
    }
//STEP-4 Just like req.body multer gives us req.files to access the PATH of LOCAL STORAGE of avatar or cover image
    
    const avatar=await uploadFileonCloudinary(avatarLocalPath)
    const coverImage=await uploadFileonCloudinary(coverImageLocalPath)
    

    
    

    if(!avatar)
    {
        throw new ApiError(400,"Avatar file is required")
    }

    const user =await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const CreatedUser=await User.findById(user._id).select("-password -refreshToken")

    if(!CreatedUser)
    {
        throw new ApiError(500,"Something went wrong while Regestring the User")
    }

    return res.status(201).json(
        new ApiResponse(200,CreatedUser,"A new USER is registerd SUCCESSFULLY")
    )
})


export {registerUser}