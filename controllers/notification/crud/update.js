const { NotificationModel } = require("../../../db/models/notifications");
const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../../utils/response_handler");

const {
  NotificationMarkAsReadMessage,
  NotificationNotFoundMessage,
} = require("../../../utils/const/message");


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


exports.MarkNotification = MarkNotification;
