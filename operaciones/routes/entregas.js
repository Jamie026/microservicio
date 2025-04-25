const express = require("express")
const entregas = express.Router()
const connection = require("../config/db");

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
entregas.post("/register", async (req, res) => {
    const { id_solicitud, direccion_entrega, fecha_estimada, fecha_entrega, estado_entrega } = req.body;
    try {
        const [existingentregas] = await connection.query("SELECT * FROM entregas WHERE id_solicitud = ?", [id_solicitud]);
        if (existingentregas.length > 0)
            return res.status(409).json({ message: "Solicitud ya registrada" });

        // VALIDAR QUE LA SOLICITUD EXISTE A TRAVEZ DE MICROSERVICIO DE SOLICITUDES
        const response_solicitud = await axios.get(`http://localhost:4000/solicitudes/${id_solicitud}`);
        const solicitud = response_solicitud.data;
        if (!solicitud) {
            res.status(404).json({ message: "Solicitud no encontrada" });
        }

        await connection.query("INSERT INTO entregas (id_solicitud, direccion_entrega, fecha_estimada, fecha_entrega, estado_entrega) VALUES (?, ?, ?, ?)", [id_solicitud, direccion_entrega, fecha_estimada, fecha_entrega, estado_entrega]);
        res.status(201).json({ message: "Entrega registrado correctamente." });
    } catch (error) {
        console.error("Error en registro:", error);
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