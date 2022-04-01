const { NotificationModel } = require("../../db/models/notifications");
const {ProjectAdd,ProjectJoin,UserInfo}= require("./const")



const AddNotification=async (req,res,type) => {

    

    switch (type) {
        case ProjectAdd:
            
            break;
    
        case ProjectJoin:
            AddJoinNotification(req,res,type);
            break;
    
        case UserInfo:
            
            break;
    
        default:
            break;
    }
}


const AddJoinNotification= async (req,res, type) => {
    const notificationsUser=await AddNotificationIfNotExits(req.projectCreator);

    const notification={
        title:`peer ${req.rootUser.name} wants to join your ${req.projectTitle} project`,
        type:type,
        project:req.projectId
    }
    console.log(notification);

    notificationsUser.notifications.push(notification)
    notificationsUser.isOpen=true,
    await notificationsUser.save((error)=>{

        if(error){
            return res.status(404).send({ message: err });
        }
        
        return res.status(200).send({ message:"Join request made successfully"})

    })

}




const AddNotificationIfNotExits=async (id) => {

    let user=await GetNotificationUser(id);
    if(!user){
        
        const newNotification=await NotificationModel({user:id,isOpen:false})
        await newNotification.save();
        user=await GetNotificationUser(id);
    }
    return user;
}

const GetNotificationUser = async (id)=>{
    const user=await NotificationModel.findOne({user:id});
    return user;
}


exports.AddNotification=AddNotification;