import asyncHandler from "../utilities/asyncHandler.utility.js";
import ApiError from "../utilities/ApiError.utility.js"; 
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import process from "process";

export const verifyJWT = asyncHandler(async (req,res,next) => {
try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401, "Unauthorized Request")
        }
        const decToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }
        req.user = user;
        next()
    
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid Access Token")
}})