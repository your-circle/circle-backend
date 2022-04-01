const { NotificationModel } = require("../../db/Schema");

const GetNotification = async (req, res) => {
  try {
    const NotificationList = await NotificationModel.find({});
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
    var id = req.params.id;
    const hasNotification = await NotificationModel.findById(id);

    if (hasNotification) {
      hasNotification.isOpen = true;
      res.status(200);
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.GetNotification = GetNotification;
exports.MarkNotification = MarkNotification;
