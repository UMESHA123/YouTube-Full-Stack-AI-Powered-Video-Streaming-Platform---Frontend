import { Router } from 'express';
import {
    addComment,
    CommentPromptGenerater,
    deleteComment,
    generateManualQueryAns,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);
router.route("/c/manual-response/:videoId").get(generateManualQueryAns);
router.route("/c/prompt/:videoId").get(CommentPromptGenerater);
export default router