import { Route } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const route = Route()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

router.Route("/logout").post(verifyJWT, logoutUser){
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        }
    )
}






export default route