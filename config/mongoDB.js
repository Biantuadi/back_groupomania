require("dotenv").config( { path: "./config/.env" } );

const mongoose = require("mongoose");
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DBNAME;
const url = `mongodb+srv://${username}:${password}@cluster0.y0gnr7k.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected 👌"))
  .catch((err) => console.log("MongoDB Error 😤: " + err));

module.exports = mongoose;
