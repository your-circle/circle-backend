const { forEach } = require("lodash");
const { NotificationModel } = require("../../db/models/notifications");

const GetNotification = async (req, res) => {
  try {
    var userId = req.userID;
    console.log(userId,req.rootUser);
    
    const NotificationList = await NotificationModel.findOne({user: userId});

  
    res.send({
      message: "Following are Notifications",
      data: NotificationList,
    });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const MarkNotification = async (req, res) => {
  try {
    var userId = req.userID;
    const Notification = await NotificationModel.findOne({
      user: userId,
    });

    if(!Notification){
      return res.status(404).send({message:"Notifications is Not fount"})
    }

    Notification.isOpen = false;

    await Notification.save()
   
    res.status(200).send({
      message: "Notifications are marked read",
      data: Notification,
    });

  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.GetNotification = GetNotification;
exports.MarkNotification = MarkNotification;
