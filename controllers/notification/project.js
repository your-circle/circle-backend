const { NotificationModel } = require("../../db/models/notifications");
const { ProjectAdd, ProjectJoin, UserInfo } = require("../../utils/const/notifications");

const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../utils/response_handler");

const { ProjectUpdateMessage } = require("../../utils/const/message");

const AddNotification = async (req, res, type) => {
  switch (type) {
    case ProjectAdd:
      AddMemberInProject(req, res, type);
      break;

    case ProjectJoin:
      AddJoinNotification(req, res, type);
      break;

    case UserInfo:
      break;

    default:
      break;
  }
};

const AddJoinNotification = async (req, res, type) => {
  const notificationsUser = await AddNotificationIfNotExits(req.projectCreator);

  const notification = {
    title: `peer ${req.rootUser.name} wants to join your ${req.projectTitle} project`,
    type: type,
    project: req.projectId,
  };

  notificationsUser.notifications.push(notification);
  (notificationsUser.isOpen = true),
    await notificationsUser.save((error) => {
      if (error) {
        return ErrorResponseHandler(res, 404, error._message);
      }

      return SuccessResponseHandler(res, 200, ProjectUpdateMessage);
    });
};

const AddMemberInProject = async (req, res, type) => {
  const notificationsUser = await AddNotificationIfNotExits(req.userID);

  const notification = {
    title: `You are know part this ${req.projectTitle} project`,
    type: type,
    project: req.projectId,
  };

  notificationsUser.notifications.push(notification);
  (notificationsUser.isOpen = true),
    await notificationsUser.save((error) => {
      if (error) {
        return ErrorResponseHandler(res, 404, error._message);
      }

      return SuccessResponseHandler(res, 200, ProjectUpdateMessage);
    });
};

const AddNotificationIfNotExits = async (id) => {
  let user = await GetNotificationUser(id);
  if (!user) {
    const newNotification = await NotificationModel({
      user: id,
      isOpen: false,
    });
    await newNotification.save();
    user = await GetNotificationUser(id);
  }
  return user;
};

const GetNotificationUser = async (id) => {
  const user = await NotificationModel.findOne({ user: id });
  return user;
};

exports.AddNotification = AddNotification;