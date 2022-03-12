require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3001,
  dbURL: process.env.DATABASE_URL
};

module.exports = config;