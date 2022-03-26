const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config({ path: "./.env" });
require("./db/conn");


const app = express();
const authRouter = require("./router/auth");
const userRouter = require("./router/user");

const logRequestStart = (req, res, next) => {
  res.on('finish', () => {
      console.info(`${req.url} ${req.method} ${res.statusCode} ${res.statusMessage};`)
  })
  next()
}


app.use(cors());
app.use(express.json());
app.use(logRequestStart)




// we link the router files to make our route easy
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running at port no ${PORT}`);
});
