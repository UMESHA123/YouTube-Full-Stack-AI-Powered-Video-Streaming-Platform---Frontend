import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  insertNotification,
  getMyNewVideoNotifications,
  getMyNotificationsPaginated,
} from "../controllers/Notification.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/create", insertNotification);
router.get("/my", getMyNotifications);
router.get("/my/paginated", getMyNotificationsPaginated);
router.get("/my/new-unread/notification", getMyNewVideoNotifications);//getMyNewVideoNotifications
router.get("/unread-count", getUnreadNotificationCount);
router.patch("/:notificationId/read", markNotificationAsRead);
router.patch("/read-all", markAllNotificationsAsRead);
router.delete("/:notificationId", deleteNotification);

export default router;
