const express = require("express");
const app = express();

const userRoute = require("./routes/user");
const eventRoute = require("./routes/event");

const mongoose = require("mongoose");
const url = `mongodb+srv://root:WOsk76rQtgzYfUa0@cluster0.bzpen.mongodb.net/sankana`;

const port = process.env.PORT || 5000;

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

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
  console.log("Server is listening on port 5000.");
});
