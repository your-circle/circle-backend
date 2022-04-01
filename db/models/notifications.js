const mongoose = require("mongoose");
const { Schema } = mongoose;


const notificationsSchema = new Schema({
  user: String,
  notifications: [
    {
      title: String,
      type: {
        type: String,
        enum: ["project", "user-info"],
        message: "{VALUE} is not supported",
      },
      project: { type: Schema.Types.ObjectId, ref: 'PROJECT' }
    },
  ],
  isOpen: Boolean,
});


const NotificationModel = mongoose.model("Notification", notificationsSchema);
exports.NotificationModel = NotificationModel;
