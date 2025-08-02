const express = require("express");
const app = express();
const router = require("./routes/router");
const path = require("node:path");
const cors = require("cors");

const allowList = [
  "http://localhost:5173",
];

const corsOptions = {
  origin: allowList,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.set("view engine", "ejs");
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
