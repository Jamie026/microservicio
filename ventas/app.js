const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.port || 4000;

const productos = require("./routes/productos");
const inventarios = require("./routes/inventarios");
const solicitudes = require("./routes/solicitudes");

app.use(cors());
app.use(express.json());
app.use("/productos", productos);
app.use("/inventarios", inventarios);
app.use("/solicitudes", solicitudes);

app.listen(PORT, () => {
    console.log("Server Listening in", PORT);
});