const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/userRoutes");
const clients = require("./routes/clientsRoutes");
const secom = require("./routes/secomRoutes");
const token = require("./routes/tokenRoutes");
const initializeDb = require('./createInsuranceTypes')

const app = express();
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/test";

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const options = {
  useNewUrlParser: true
};

// Function to connect to the database
const conn = () => {
  mongoose.connect(mongoUri, options);
};
// Call it to connect
conn();

// Handle the database connection and retry as needed
const db = mongoose.connection;
db.on("error", err => {
  console.log("There was a problem connecting to mongo: ", err);
  console.log("Trying again");
  setTimeout(() => conn(), 5000);
});
db.once("open", () => {
  initializeDb();
  console.log("Successfully connected to mongo");
});


// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/clients", clients);
app.use("/api/secom", secom);
app.use("/api/token", token);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));