const express = require("express");
const router = express.Router();

const { Authenticate } = require("../middleware/authenticate")

const { 
    GetAllData,
    CrateData,
    UpdateData
} = require("../controllers/data/index").functions;


router.get("/get/:type",Authenticate, GetAllData);
// router.post("/create",Authenticate, CrateData);
// router.post("/update", Authenticate, UpdateData);

module.exports = router;
