const express = require("express")
const productos = express.Router()
const connection = require("../config/db");

//OBTENER PRODUCTOS
productos.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Productos");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//REGISTRAR PRODUCTO
productos.post("/", async (req, res) => {
    const { nombre, precio } = req.body
    try {   
        await connection.query("INSERT INTO Productos (nombre, precio) VALUES (?, ?)", [nombre, precio]);
        res.status(201).json({ message: "Producto registrado correctamente." });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//ELIMINAR PRODUCTO
productos.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [productos] = await connection.query("SELECT * FROM Productos");
        const list = productos.filter(item => id == item.id_producto);
        if (list.length === 0)
            res.status(401).json({ message: "ID no registrado" })
        else{
            const [result] = await connection.query("DELETE FROM Productos WHERE id_producto = ?", [list[0].id_producto]);
            if (result.affectedRows === 0) 
                return res.status(404).json({ message: "Producto no encontrado" });
            res.status(200).json({ message: "Producto eliminado correctamente" });
        }
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = productos;