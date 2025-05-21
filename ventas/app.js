const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const http = require('http');
const { Server } = require("socket.io");

const PORT = process.env.port || 4000;

const productos = require("./routes/productos");
const inventarios = require("./routes/inventarios");
const solicitudes = require("./routes/solicitudes");

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use("/productos", productos);
app.use("/inventarios", inventarios);
app.use("/solicitudes", solicitudes);

server.listen(PORT, () => {
    console.log("Server Listening in", PORT);
});