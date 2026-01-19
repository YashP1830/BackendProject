import { asyncHandeler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadFileonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"

const generateRefreshTokenandAccessToken=async (user_id)=>{
    const user=await User.findById(user_id)
    const accessToken=user.generateAccessToken()
    const RefreshToken=user.generateRefreshToken()

    user.refreshToken = RefreshToken;
    await user.save({validateBeforeSave:false})

    return {accessToken,RefreshToken}
}

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

const loginUser=asyncHandeler(async (req,res)=>{

    const {username,password,email}=req.body;

    if(!username && !email)
    {
        throw new ApiError(400,"Please enter the Username and Password")
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user)
    {
        throw new ApiError(404,"User is Not Registered")
    }

    const isPasswordcorrect=await user.isPasswordCorrect(password)
    
    if(!isPasswordcorrect)
    {
        throw new ApiError(401,"Password is Invalid")
    }
    
    const {accessToken,RefreshToken}=await generateRefreshTokenandAccessToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const option={
        httpOnly:true,
        secure:true
    }
    
    return res
    .status(200)
    .cookie("acccesToken",accessToken,option)
    .cookie("RefreshToken",RefreshToken,option)
    .json(
         new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,
                RefreshToken
            },
            "User is Login Successfully"

         )
    )

})

const logoutUser = asyncHandeler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("RefreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccesToken=asyncHandeler(async (req,res)=>{

    const incomingRefreshToken=req.cookies.RefreshToken || req.body.RefreshToken

    if(!incomingRefreshToken)
    {
        throw new ApiError(401,"unauthorized Request")

    }

    const decodedRefreshToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

    const user=await User.findById(decodedRefreshToken?._id)

    if(!user)
    {
        throw new ApiError(401,"Invalid Refresh Token")
    }

    if(incomingRefreshToken!==user.refreshToken)
    {
        throw new ApiError(401,"Refresh Token is expired or used")
    }

    const options = {
            httpOnly: true,
            secure: true
        }
    
    const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
    )
})

export {registerUser,loginUser,logoutUser}