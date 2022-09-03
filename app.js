const express = require("express");
const app = express();

const userRoute = require("./routes/user");
const eventRoute = require("./routes/event");

const mongoose = require("mongoose");

const mongoDBLocalURL = "mongodb://127.0.0.1:27017/sankana";
const dbUrl = process.env.MONGODB_URL || mongoDBLocalURL;

const port = process.env.PORT || 5000;

mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", (err, db) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MongoDB database connection established successfully");
  }
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/event", eventRoute);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});
