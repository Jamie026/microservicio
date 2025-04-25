const express = require("express")
const pagos = express.Router()
const connection = require("../config/db");
const axios = require("axios");

//OBTENER pagos
pagos.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM pagos");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener pagos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//REGISTRO pagos
pagos.post("/", async (req, res) => {
    const { id_solicitud, metodo_pago, monto } = req.body;
    try {
        const [existingpagos] = await connection.query("SELECT * FROM pagos WHERE id_solicitud = ?", [id_solicitud]);
        if (existingpagos.length > 0)
            return res.status(409).json({ message: "Solicitud ya registrada en proceso de pago." });

        // VALIDAR QUE LA SOLICITUD EXISTE A TRAVEZ DE MICROSERVICIO DE SOLICITUDES
        const response = await axios.get("http://localhost:4000/solicitudes/");
        const response_solicitud = response.data.filter(solicitud => solicitud.id_solicitud == id_solicitud);
        if (response_solicitud.length === 0)
            res.status(404).json({ message: "Solicitud no encontrada" });
        await connection.query("INSERT INTO pagos (id_solicitud, metodo_pago, monto) VALUES (?, ?, ?)", [id_solicitud, metodo_pago, monto]);
        res.status(201).json({ message: "Pago registrado correctamente." });
    } catch (error) {
        console.error("Error en registrar pago:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//ELIMINAR pago
pagos.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [pagos] = await connection.query("SELECT * FROM pagos WHERE id_pago = ?", [id]);
        if (pagos.length === 0)
            res.status(401).json({ message: "ID no registrado" })
        else {
            const [result] = await connection.query("DELETE FROM pagos WHERE id_pago = ?", [id]);
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