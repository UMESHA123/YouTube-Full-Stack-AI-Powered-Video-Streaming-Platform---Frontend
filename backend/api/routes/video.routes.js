import { Router } from 'express';
import {
    deleteVideo,
    generateAPrompt,
    generatePromptResponse,
    getAllVideos,
    getVideoById,
    getVideoTranscript,
    manualAnsGenerator,
    publishAVideo,
    startLiveStream,
    endLiveStream,
    getSuggestedVideoTopics,
    searchVideos,
    togglePublishStatus,
    updateThumbnail,
    updateVideo,
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); //  Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(updateVideo);
router.route("/result/search_query").get(searchVideos);
router.route("/topics/suggestions").get(getSuggestedVideoTopics);
router.route("/live/start").post(startLiveStream);
router.route("/live/end/:videoId").patch(endLiveStream);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/transcript/:videoId").get(getVideoTranscript); 
router.route("/prompts").post(generateAPrompt); 
router.route("/prompts/response").post(generatePromptResponse); 
router.route("/manual-query/response").post(manualAnsGenerator);
router.route("/thumbnail/:videoId").patch(upload.single("thumbnail"),updateThumbnail);// upload.single("thumbnail"),
export default router
