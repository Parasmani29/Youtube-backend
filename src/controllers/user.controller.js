import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/asyncHandler.js";
import {User} from "../model/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"




const registerUser = asyncHandler( async (req, res) =>{
    // response.status(200).json({
    //     message: "ok"

    // })
    const {fullName, email, username, password} = req.body 
    console.log("email", email);


    if ([fullName, email, username, password].some ((field) => field.trim() === "")
        ) {
    throw new ApiError (400, "All fields are required")
     

    }
    const existedUser = User.findOne({

        $or:[{username}, {email}]
    })
    if (existedUser){
        throw new ApiError(409, "User with email or username")
    }

   const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is Require")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "avatar file is required")
    }



        


} )

const loginUser = asyncHandler(async (req, res) => {
    
})


export {registerUser, loginUser}