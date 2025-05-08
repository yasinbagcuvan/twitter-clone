import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "from", select: "username profileImg" });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotifications controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this notification" });
    }
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotification controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNotificationCount = async (req, res) => {
  const userId = req.user._id;
  const count = await Notification.countDocuments({ to: userId, read: false });
  res.status(200).json({ count });
};

export const markNotificationsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    // Kullanıcıya ait tüm bildirimleri okundu olarak işaretle
    const updatedNotifications = await Notification.updateMany(
      { to: userId, read: true }, // Kullanıcıya ait ve okunmamış bildirimleri bul
      { $set: { read: false } } // 'read' alanını true olarak güncelle
    );
    console.log("Updated notifications: ", updatedNotifications);
    const unreadNotifications = await Notification.find({
      to: userId,
      read: true,
    });

    const notificationCount = await Notification.countDocuments({
      to: userId,
      read: true,
    });
    console.log("Notification count: ", notificationCount);

    console.log("Unread notifications:", unreadNotifications);
    if (updatedNotifications.modifiedCount === 0) {
      return res.status(404).json({ error: "No unread notifications found" });
    }

    // Başarılı bir şekilde güncellenmiş bildirimlerin sayısını döndür
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.log("Error in markNotificationsRead controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
