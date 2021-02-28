const express = require("express");
const app = express();
const port = 9999;
const cors = require("cors");
app.use(express.json()); // added body key to req
require("dotenv").config();
const InitialPageRoutes = require('./Routes/InitialPageRoutes');
const HomePageRoutes = require('./Routes/HomePageRoutes');

app.use(
  cors({
    credentials: true,
    origin: process.env.FrontendURL,
  })
);

app.set("trust proxy", 1);

app.use("/home", HomePageRoutes);
app.use("/", InitialPageRoutes);

app.listen(process.env.PORT || port, () =>
  console.log(`App listening on port ${port}!`)
);

module.exports = app;
