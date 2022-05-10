const {DataModel} =require("../../../db/models/data")
const {
    SuccessResponseHandler,
    ErrorResponseHandler,
  } = require("../../../utils/response_handler");
  
const {
    DataUpdateMessage
} = require("../../../utils/const/message");

const UpdateData = async(req,res) =>{
    try{
        const {type,tech,open_to,need}= req.body;
        const update_data=await DataModel.findOneAndUpdate({type},{tech,open_to,need});

        return SuccessResponseHandler(
            res,
            200,
            DataUpdateMessage,
            update_data
        );
        
    }catch(e){
        return ErrorResponseHandler(res, 404, e.message);
    }
}

exports.UpdateData=UpdateData;

