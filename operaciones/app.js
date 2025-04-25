const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.port || 3001;

const pagos = require("./routes/pagos");
const entregas = require("./routes/entregas");


app.use(cors());
app.use(express.json());
app.use("/pagos", pagos);
app.use("/entregas", entregas);


app.listen(PORT, () => {
    console.log("Server Listening in", PORT);
});