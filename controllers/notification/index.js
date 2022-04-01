const { forEach } = require("lodash");
const { NotificationModel } = require("../../db/models/notifications");

const GetNotification = async (req, res) => {
  try {
    console.log(req.rootUser);
    var username = req.rootUser.name;
    const NotificationList = await NotificationModel.find({
      name: username,
    });

    res.send({
      message: "Following are user projects",
      data: NotificationList,
    });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const MarkNotification = async (req, res) => {
  try {
    var username = req.rootUser.name;
    const NotificationList = await NotificationModel.find({
      name: username,
    });

    NotificationList.forEach(function (NotificationList) {
      NotificationList.isOpen = true;
    });

    res.status(200).send({
      message: "Notifications are marked read",
      data: NotificationList,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.GetNotification = GetNotification;
exports.MarkNotification = MarkNotification;
