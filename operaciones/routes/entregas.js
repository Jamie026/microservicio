const express = require("express")
const entregas = express.Router()
const connection = require("../config/db");
const axios = require("axios");

//OBTENER entregas
entregas.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM entregas");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener entregas:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//REGISTRO Entrega
entregas.post("/", async (req, res) => {
    const { id_solicitud, direccion_entrega, fecha_estimada } = req.body;
    try {
        const [existingentregas] = await connection.query("SELECT * FROM entregas WHERE id_solicitud = ?", [id_solicitud]);
        if (existingentregas.length > 0)
            return res.status(409).json({ message: "Solicitud ya registrada" });

        // VALIDAR QUE LA SOLICITUD EXISTE A TRAVEZ DE MICROSERVICIO DE SOLICITUDES
        const response = await axios.get("http://localhost:4000/solicitudes/");
        const response_solicitud = response.data.filter(solicitud => solicitud.id_solicitud == id_solicitud);
        if (response_solicitud.length === 0)
            res.status(404).json({ message: "Solicitud no encontrada" });

        await connection.query("INSERT INTO entregas (id_solicitud, direccion_entrega, fecha_estimada) VALUES (?, ?, ?)", [id_solicitud, direccion_entrega, fecha_estimada]);
        res.status(201).json({ message: "Entrega registrada correctamente." });
    } catch (error) {
        console.error("Error en registro de entrega:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


//Actualizar Entrega
entregas.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { direccion_entrega, fecha_estimada, fecha_entrega, estado_entrega } = req.body;
    try {
        const [existingEntregas] = await connection.query("SELECT * FROM entregas WHERE id_entrega = ?", [id]);
        if (existingEntregas.length == 0)
            return res.status(409).json({ message: "Entrega no encontrada" });

        await connection.query(
            "UPDATE Entregas SET direccion_entrega = ?, fecha_estimada = ?, fecha_entrega = ?, estado_entrega = ? WHERE id_entrega = ?",
            [direccion_entrega, fecha_estimada, fecha_entrega, estado_entrega, id]
        );
        res.status(201).json({ message: "Entrega modifica correctamente." });
    } catch (error) {
        console.error("Error al actualizar entrega:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//ELIMINAR Entrega
entregas.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [entregas] = await connection.query("SELECT * FROM entregas");
        const user = entregas.filter(user => id == user.id_entrega);
        if (user.length === 0)
            res.status(401).json({ message: "ID no registrado" })
        else {
            const [result] = await connection.query("DELETE FROM entregas WHERE id_entrega = ?", [user[0].id_entrega]);
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Entrega no encontrado" });
            res.status(200).json({ message: "Entrega eliminado correctamente" });
        }
    } catch (error) {
        console.error("Error al eliminar Entrega:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = entregas;