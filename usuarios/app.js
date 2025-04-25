const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.port || 3000;

const clientes = require("./routes/cliente");
const empleados = require("./routes/empleados");
const proveedores = require("./routes/proveedores");

app.use(cors());
app.use(express.json());
app.use("/clientes", clientes);
app.use("/empleados", empleados);
app.use("/proveedores", proveedores);

app.listen(PORT, () => {
    console.log("Server Listening in", PORT);
});