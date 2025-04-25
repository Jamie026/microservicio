const express = require("express")
const proveedores = express.Router()
const connection = require("../config/db");
const { encriptar } = require("./../auth/bcrypt")

//OBTENER PROVEEDORES
proveedores.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Proveedores");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener proveedores:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//LOGUEO PROVEEDORES
proveedores.post("/login", async (req, res) => {
    const { usuario } = req.body;
    try {
        const [proveedores] = await connection.query("SELECT * FROM Proveedores");
        const validation = proveedores.filter(user => user.usuario === usuario);
        if (validation.length === 0)
            res.status(401).json({ message: "Usuario no registrado" })
        else
            res.status(200).json({ message: "Login correcto" });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//REGISTRO PROVEEDORES
proveedores.post("/register", async (req, res) => {
    const { nombre, usuario, clave, pais, email } = req.body;
    try {
        const hash_clave = encriptar(clave);
        const [existingProveedores] = await connection.query("SELECT * FROM Proveedores WHERE usuario = ?", [usuario]);
        if (existingProveedores.length > 0)
            return res.status(409).json({ message: "Usuario ya registrado" });
        await connection.query("INSERT INTO Proveedores (nombre, usuario, clave, pais, email) VALUES (?, ?, ?, ?, ?)", [nombre, usuario, hash_clave, pais, email]);
        res.status(201).json({ message: "Proveedor registrado correctamente." });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//ELIMINAR PROVEEDORES
proveedores.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [proveedores] = await connection.query("SELECT * FROM Proveedores");
        const user = proveedores.filter(user => id == user.id_proveedor);
        if (user.length === 0)
            res.status(401).json({ message: "ID no registrado" })
        else{
            const [result] = await connection.query("DELETE FROM Proveedores WHERE id_proveedor = ?", [user[0].id_proveedor]);
            if (result.affectedRows === 0) 
                return res.status(404).json({ message: "Proveedor no encontrado" });
            res.status(200).json({ message: "Proveedor eliminado correctamente" });
        }
    } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = proveedores;