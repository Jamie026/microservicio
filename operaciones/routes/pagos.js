const express = require("express")
const pagos = express.Router()
const connection = require("../config/db");
const axios = require("axios");

// OBTENER pagos
pagos.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM pagos");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener pagos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

pagos.procesarPagoInterno = async (id_solicitud, metodo_pago, monto) => {
    try {
        const [existingpagos] = await connection.query("SELECT * FROM pagos WHERE id_solicitud = ?", [id_solicitud]); //
        if (existingpagos.length > 0) {
            console.log("Solicitud", id_solicitud, "ya registrada en proceso de pago.");
            return; // Evitar duplicados
        }
        const response = await axios.get("http://localhost:4000/solicitudes/"); //
        const response_solicitud = response.data.filter(solicitud => solicitud.id_solicitud == id_solicitud);
        if (response_solicitud.length === 0) {
            throw new Error("Solicitud no encontrada para procesar pago.");
        }

        await connection.query("INSERT INTO pagos (id_solicitud, metodo_pago, monto) VALUES (?, ?, ?)", [id_solicitud, metodo_pago, monto]); //
        console.log("Pago registrado correctamente para la solicitud", id_solicitud);
    } catch (error) {
        console.error("Error en procesar pago para la solicitud", id_solicitud, error);
        throw error; 
    }
};

// La ruta POST ahora podría ser para un caso de uso manual o eliminarse si todo es por WebSocket
pagos.post("/", async (req, res) => {
    const { id_solicitud, metodo_pago, monto } = req.body;
    try {
        await pagos.procesarPagoInterno(id_solicitud, metodo_pago, monto);
        res.status(201).json({ message: "Pago registrado correctamente." });
    } catch (error) {
        console.error("Error en registrar pago:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// ELIMINAR pago
pagos.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [pagosExistentes] = await connection.query("SELECT * FROM pagos WHERE id_pago = ?", [id]); //
        if (pagosExistentes.length === 0)
            res.status(401).json({ message: "ID no registrado" })
        else {
            const [result] = await connection.query("DELETE FROM pagos WHERE id_pago = ?", [id]); //
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Pago no encontrado" });
            res.status(200).json({ message: "Pago eliminado correctamente" });
        }
    } catch (error) {
        console.error("Error al eliminar pago:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = pagos;