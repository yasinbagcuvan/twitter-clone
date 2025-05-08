import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  deleteNotifications,
  getNotifications,
  deleteNotification,
  getNotificationCount,
  markNotificationsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.delete("/:id", protectRoute, deleteNotification);
router.get("/count", protectRoute, getNotificationCount);
router.post("/mark-read", protectRoute, markNotificationsRead);

export default router;
