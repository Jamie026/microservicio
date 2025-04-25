const express = require("express")
const inventarios = express.Router()
const connection = require("../config/db");

//OBTENER INVENTARIOS
inventarios.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Inventario");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener inventarios:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//REGISTAR EN INVENTARIO
inventarios.post("/", async (req, res) => {
    const { productoId, stock } = req.body;
    try {
        const [productos] = await connection.query("SELECT * FROM Productos");
        const filtroProducto = productos.filter(producto => producto.id_producto == productoId);
        
        if(filtroProducto.length === 0)
            res.status(404).json({ message: "Producto no encontrado" });
        else {
            const [inventarios] = await connection.query("SELECT * FROM Inventario WHERE id_producto = ?", [productoId]);
            if(inventarios.length > 0)
                res.status(400).json({ message: "Producto ya en el inventario" });
            else{
                await connection.query("INSERT INTO Inventario (id_producto, stock) VALUES (?, ?)", [productoId, stock]);
                res.status(201).json({ message: "Producto agregado al inventario." });
            }
        }
    } catch (error) {
        console.error("Error al agregar en el inventario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = inventarios;