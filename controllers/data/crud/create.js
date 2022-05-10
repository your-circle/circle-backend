const {DataModel} =require("../../../db/models/data")
const {
    SuccessResponseHandler,
    ErrorResponseHandler,
  } = require("../../../utils/response_handler");

const {
    DataAddedMessage
} = require("../../../utils/const/message");

const CrateData = async(req,res) =>{
    try{
        const {type,tech,open_to,need}= req.body;

        const new_data=new DataModel({type,tech,open_to,need});

        await new_data.save(async (e) => {
            if (e) {
              return res.status(404).send({ message: e });
            }
            return SuccessResponseHandler(res, 200, DataAddedMessage,new_data);
         });
        
    }catch(e){
        return ErrorResponseHandler(res, 404, e.message);
    }
}

exports.CrateData=CrateData;

