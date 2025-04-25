const express = require("express")
const solicitudes = express.Router()
const connection = require("../config/db");
const axios = require("axios");

//OBTENER SOLICITUDES
solicitudes.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Solicitudes");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//REGISTRAR SOLICITUD
solicitudes.post("/", async (req, res) => {
    const { clienteId, fecha } = req.body
    try {
        const response = await axios.get("http://localhost:3000/clientes");
        const clientes = response.data;

        const filtro = clientes.filter(cliente => cliente.id_cliente == clienteId);
        if(filtro.length === 0)
            res.status(404).json({ message: "Cliente no encontrado" });
        else {
            await connection.query("INSERT INTO Solicitudes (id_cliente, fecha) VALUES (?, ?)", [clienteId, fecha]);
            res.status(201).json({ message: "Solicitud creada" });
        }
    } catch (error) {
        console.error("Error al crear solicitud:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//OBTENER PRODUCTOS EN UNA SOLICITUD
solicitudes.get("/producto", async (req, res) => {
    const { solicitudId } = req.body;
    try {
        const [detalles] = await connection.query("SELECT * FROM producto_solicitud WHERE id_solicitud = ?", [solicitudId]);
        if(detalles.length === 0)
            res.status(404).json({ message: "Solicitud no encontrada" });
        else
            res.status(200).json(detalles);
    } catch (error) {
        
    }
})

//REGISTRAR PRODUCTO EN UNA SOLICITUD
solicitudes.post("/producto", async (req, res) => {
    const { productoId, solicitudId, cantidad } = req.body;
    try {
        const [solicitudes] = await connection.query("SELECT * FROM Solicitudes WHERE id_solicitud = ?", [solicitudId]);
        const [productos] = await connection.query("SELECT * FROM Productos WHERE id_producto = ?", [productoId]);
        const [inventario] = await connection.query("SELECT * FROM Inventario WHERE id_producto = ?", [productoId]);

        if(productos.length === 0 || solicitudes.length === 0)
            res.status(404).json({ message: "Solicitud o producto no encontrado" });
        else {
            if(inventario.length === 0)
                res.status(404).json({ message: "Producto no registrado en el inventario" });
            else{
                if(inventario[0].stock < cantidad)
                    res.status(400).json({ message: "No hay stock disponible de ese producto" });
                else{
                    await connection.query("INSERT INTO producto_solicitud (id_solicitud, id_producto, cantidad) VALUES (?, ?, ?)", [solicitudId, productoId, cantidad]);
                    await connection.query("UPDATE Inventario SET stock = ? WHERE id_producto = ?", [inventario[0].stock - cantidad, productoId])
                    res.status(201).json({ message: "Producto agregado a la solicitud." });
                }
            }
        }

    } catch (error) {
        console.error("Error al agregar producto a la solicitud:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
})

//Eliminar un detalle de la solicitud
solicitudes.delete("/producto/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [detalles] = await connection.query("SELECT * FROM producto_solicitud WHERE id_producto_solicitud = ?" , [id]);
        if (detalles.length === 0)
            res.status(401).json({ message: "ID no registrado" })
        else{
            const [result] = await connection.query("DELETE FROM producto_solicitud WHERE id_producto_solicitud = ?", [id]);
            if (result.affectedRows === 0) 
                return res.status(404).json({ message: "Detalle no encontrado" });
            res.status(200).json({ message: "Detalle eliminado correctamente" });
        }
    } catch (error) {
        console.error("Error al eliminar detalle:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
})

module.exports = solicitudes;