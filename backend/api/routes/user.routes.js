import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory, 
    updateAccountDetails,
    removeVideoFromWatchHistory,
    clearAllVideoFromWatchHistory,
    addVideoToWatchLater,
    removeVideoFromWatchLater,
    clearWatchLater,
    getWatchLaterVideos,
    getUserById,
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

router.get("/users/:userId", getUserById);

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)
router.route("/history/remove/v/:videoId").get(verifyJWT, removeVideoFromWatchHistory)
router.route("/history/remove/v/all").delete(verifyJWT, clearAllVideoFromWatchHistory)

router.route("/watch-later/add/:videoId").post(verifyJWT, addVideoToWatchLater);
router.route("/watch-later/remove/:videoId").delete(verifyJWT, removeVideoFromWatchLater);
router.route("/watch-later/clear").delete(verifyJWT, clearWatchLater);
router.route("/watch-later/videos").get(verifyJWT, getWatchLaterVideos);

export default router