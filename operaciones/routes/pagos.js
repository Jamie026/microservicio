const express = require("express")
const pagos = express.Router()
const connection = require("../config/db");

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
pagos.post("/register", async (req, res) => {
    const { id_solicitud, metodo_pago, monto, estado_pago ,fecha_pago} = req.body;
    try {
        
        const [existingpagos] = await connection.query("SELECT * FROM pagos WHERE id_solicitud = ?", [id_solicitud]);
        if (existingpagos.length > 0)
            return res.status(409).json({ message: "Solicitud ya registrada" });

        // VALIDAR QUE LA SOLICITUD EXISTE A TRAVEZ DE MICROSERVICIO DE SOLICITUDES
        
        await connection.query("INSERT INTO pagos (id_solicitud, metodo_pago, monto, estado_pago ,fecha_pago) VALUES (?, ?, ?, ?)", [id_solicitud, metodo_pago, monto, estado_pago ,fecha_pago]);
        res.status(201).json({ message: "pago registrado correctamente." });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//ELIMINAR pago
pagos.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [pagos] = await connection.query("SELECT * FROM pagos");
        const user = pagos.filter(user => id == user.id_pago);
        if (user.length === 0)
            res.status(401).json({ message: "ID no registrado" })
        else{
            const [result] = await connection.query("DELETE FROM pagos WHERE id_pago = ?", [user[0].id_pago]);
            if (result.affectedRows === 0) 
                return res.status(404).json({ message: "pago no encontrado" });
            res.status(200).json({ message: "pago eliminado correctamente" });
        }
    } catch (error) {
        console.error("Error al eliminar pago:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = pagos;