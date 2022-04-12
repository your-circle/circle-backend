const { forEach } = require("lodash");
const { NotificationModel } = require("../../db/models/notifications");
const { GetSkipAndLimit } = require("../helper/limit");
const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../utils/response_handler");

const {
  NotificationListMessage,
  NotificationMarkAsReadMessage,
  NotificationNotFoundMessage,
} = require("../../utils/message");

const GetNotification = async (req, res) => {
  try {
    var userId = req.userID;
    let { size, sort } = req.query;
    const { skip, limit } = GetSkipAndLimit(size);
    // console.log(userId, req.rootUser);

    // const Notifications = await NotificationModel.findOne({
    //   user: userId,
    // });
    // .skip(skip)
    // .limit(limit);

    const aggregate = await NotificationModel.aggregate([
      { $match: { user: userId } },
      { $project: { _id: 0, notifications: 1 } },
      { $skip: 2 },
      { $limit: 2 },
    ]).unwind("notifications");

    // const list = Array.from(Notifications.notifications)
    //   .reverse()
    //   .slice(skip, skip + limit);

    // const Notifications = await NotificationModel.findOne({ user: userId });

    return SuccessResponseHandler(res, 200, NotificationListMessage, {
      // _id: Notifications._id,
      notifications: aggregate,
    });
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

exports.GetNotification = GetNotification;
exports.MarkNotification = MarkNotification;
