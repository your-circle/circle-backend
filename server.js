const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());


dotenv.config({ path: './.env' });
require('./db/conn');

const app = express(); 
const authRouter=require('./router/auth');

app.use(express.json());



// we link the router files to make our route easy 
app.use('/auth',authRouter);


const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`);
})