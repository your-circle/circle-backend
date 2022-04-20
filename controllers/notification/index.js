const { forEach } = require("lodash");
const { NotificationModel } = require("../../db/models/notifications");
const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../utils/response_handler");

const {
  NotificationListMessage,
  NotificationMarkAsReadMessage,
  NotificationNotFoundMessage,
} = require("../../utils/message");
const { GetSkipAndLimit } = require("../helper/limit");

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

const MarkNotification = async (req, res) => {
  try {
    var userId = req.userID;
    const Notification = await NotificationModel.findOne({
      user: userId,
    });

    if (!Notification) {
      return ErrorResponseHandler(res, 404, NotificationNotFoundMessage);
    }

    Notification.isOpen = false;

    await Notification.save();

    return SuccessResponseHandler(
      res,
      200,
      NotificationMarkAsReadMessage,
      Notification
    );
  } catch (error) {
    return ErrorResponseHandler(res, 404, e.message);
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
exports.MarkNotification = MarkNotification;
exports.StatusNotification = StatusNotification;
