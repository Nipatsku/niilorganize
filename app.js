const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/database");

mongoose.connect(config.database);
mongoose.connection.on("connected", () => {
  console.log(`Connected to database ${config.database}`);
});

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/meeting", require("./routes/meeting"));
app.use("/api/vote", require("./routes/vote"));
app.use(express.static(path.join(__dirname, "public", "browser")));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'browser', 'index.html'));
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
