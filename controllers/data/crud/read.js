const {DataModel} =require("../../../db/models/data")
const {
    SuccessResponseHandler,
    ErrorResponseHandler,
  } = require("../../../utils/response_handler");

const {
    AllDataMessage
} = require("../../../utils/const/message");


const GetAllData = async(req,res) =>{
    try{
        const data_list=await DataModel.findOne({type:req.params.type});
        return SuccessResponseHandler(res, 200, AllDataMessage, data_list);
    }catch(e){
        return ErrorResponseHandler(res, 404, e.message);
    }
}

exports.GetAllData=GetAllData;