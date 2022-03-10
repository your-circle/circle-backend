const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));


let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000
}
app.listen(port, function() {
  console.log("Server started");
});