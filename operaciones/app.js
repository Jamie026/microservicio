const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const ioClient = require("socket.io-client");

const PORT = process.env.port || 5000;

const pagosRouter = require("./routes/pagos");
const entregasRouter = require("./routes/entregas");

app.use(cors());
app.use(express.json());

const socket = ioClient("http://localhost:4000");

socket.on("connect", () => {
    console.log("Conectado al microservicio de ventas por WebSocket");
});

socket.on("solicitudLista", async (data) => {
    console.log("Solicitud lista para procesar recibida:", data.id_solicitud);
    try {
        const solicitudId = data.id_solicitud;

        await pagosRouter.procesarPagoInterno(solicitudId, "Tarjeta", 100);

        await entregasRouter.procesarEntregaInterna(solicitudId, "Direccion Ejemplo", "2025-12-31");

        console.log(`Solicitud ${solicitudId} procesada (pago y entrega)`);
    } catch (error) {
        console.error(`Error al procesar solicitud ${data.id_solicitud}:`, error);
    }
});

app.use("/pagos", pagosRouter);
app.use("/entregas", entregasRouter);

app.listen(PORT, () => {
    console.log("Server Listening in", PORT);
});