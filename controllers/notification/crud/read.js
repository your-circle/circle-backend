const { NotificationModel } = require("../../../db/models/notifications");
const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../../utils/response_handler");

const {
  NotificationListMessage,
} = require("../../../utils/const/message");
const { GetSkipAndLimit } = require("../../../utils/helper/limit");


const GetNotification = async (req, res) => {
  try {
    var userId = req.userID;
    // console.log(userId, req.rootUser);

    const { skip, limit } = GetSkipAndLimit(req);

    const Notifications = await NotificationModel.findOne({
      user: userId,
    }).sort({ createdAt: -1 });

    if (Notifications == null) {
      return SuccessResponseHandler(res, 200, NotificationListMessage, []);
    }

    Notifications.isOpen = false;

    await Notifications.save();

    const list = Array.from(Notifications.notifications)
      .reverse()
      .slice(skip, skip + limit);

    Notifications.notifications = list;

    return SuccessResponseHandler(
      res,
      200,
      NotificationListMessage,
      Notifications
    );
  } catch (error) {
    return ErrorResponseHandler(res, 404, error.message);
  }
};

const StatusNotification = async (req, res) => {
  try {
    var userId = req.userID;
    const Notification = await NotificationModel.findOne({
      user: userId,
    });

    if (!Notification) {
      return SuccessResponseHandler(res, 200, NotificationListMessage, false);
    }

    return SuccessResponseHandler(
      res,
      200,
      NotificationListMessage,
      Notification.isOpen
    );
  } catch (error) {
    return ErrorResponseHandler(res, 404, e.message);
  }
};

exports.GetNotification = GetNotification;
exports.StatusNotification = StatusNotification;
