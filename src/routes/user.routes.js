    import { Router } from "express";
    import { registerUser,loginUser,logoutUser } from "../controllers/user.controller.js";
    import { upload } from "../middlewares/multer.middleware.js";
    import { VerifyJWTtoken } from "../middlewares/Auth.js"
    const router=Router()

    router.post(
        "/register",
        upload.fields([
            {
                name:"avatar",
                maxCount:1
            },
            {
                name:"coverImage",
                maxCount:1   
            }
        ]),
        registerUser)
    
    router.post(
        "/loginUser",
        loginUser
    )

    router.post(
        "/logOut",
        VerifyJWTtoken,
        logoutUser
    )


    export default router