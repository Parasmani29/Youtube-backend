import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/asyncHandler.js";
import {User} from "../model/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"



const generateAccessAndRefereshTokens = async (userId)=>{
    try{
        const user = await User.findOne(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({validationBeforeSave:false})

        return {accessToken, refreshToken}

    }catch(error){
        throw new ApiError(500, "Something went wrong while generationg referesh and access token")

    }
}

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
    const {email, username, password} = req.body
    if(!username || !email){
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(400, "username does't exist")
    }

    const isPasswordValid = await user.isPasswordCorrect 
    (password)


    if(!isPasswordValid){
        throw new ApiError(401, "Password is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findOne(user._id).select("-password -refreshToken")

    //cokies

    const options = {
        httpOnly: true,
        secure : true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken").json(
        new ApiResponse(200, {
            user : loggedInUser, accessToken,
            refreshToken
        }, "user Logged In Successfully" 
        )
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    ) 
    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200).clearCookie("accessToken", options).json(new ApiResponse(200, {}, 
        "User Logout Successfully" ))
})


export {registerUser, loginUser, logoutUser}