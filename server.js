const express = require("express");
const cors = require('cors');
const routes = require('./routes')
const config = require("./configuration/config");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middlewares 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors({
  origin: '*'
}));

// routes
app.use(routes)


// custom error handler
app.use(errorHandler);

const PORT = config.port;
const dbURL = config.dbURL;

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`server running on port : ${PORT}`)))
  .catch((err) => console.log(err));