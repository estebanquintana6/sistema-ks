const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/userRoutes");
const clients = require("./routes/clientsRoutes");
const token = require("./routes/tokenRoutes");
const insuranceTypes = require('./routes/insuranceTypesRoutes')
const companies = require('./routes/companiesRoutes')
const insurances = require('./routes/insurancesRoutes')
const tasks = require('./routes/tasksRoutes')
const invoices = require('./routes/invoicesRoutes');
const sinesters = require('./routes/sinesterRoutes');
const emails = require('./routes/emailRoutes');

const bulk = require('./routes/bulkRoutes');

const initializeDb = require('./createInsuranceTypes');
const initializeEmails = require('./createEmails');

const app = express();
const regular_jobs = require('./node_regular_job')
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/test";
const fileUpload = require('express-fileupload');


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
  initializeEmails();
  console.log("Successfully connected to mongo");
});

// Passport middleware
app.use(passport.initialize());

let j = regular_jobs.j;
// Passport config
require("./config/passport")(passport);

// Routes
app.use(fileUpload({ debug: false, createParentPath: true }));
app.use("/api/users", users);
app.use("/api/clients", clients);
app.use("/api/token", token);
app.use('/api/insurance_types', insuranceTypes);
app.use('/api/companies', companies);
app.use('/api/insurances', insurances);
app.use('/api/tasks', tasks);
app.use('/api/invoices', invoices);
app.use('/api/emails', emails);

app.use('/api/bulk', bulk);

app.use('/api/sinesters', sinesters);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));