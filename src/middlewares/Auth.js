import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";
import jwt from "jsonwebtoken"

export const VerifyJWTtoken=asyncHandeler(async (req,res)=>{
    
        try {
            const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

            if(!token)
            {
                throw new ApiError(401,"Unauthorized Acess")
            }

            const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

            const user=await User.findById(decodedtoken?._id).select("-password -refreshToken")

            if(!user)
            {
                throw new ApiError(401,"Invalid Access Token")

            }
            req.user=user
            

        } catch (error) {
            throw new ApiError(401,error?.message || "Invalid  access Token")
        }
})