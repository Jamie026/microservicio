const express = require("express")
const clientes = express.Router()
const connection = require("../config/db");
const { encriptar } = require("./../auth/bcrypt")

//OBTENER CLIENTES
clientes.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Clientes");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//LOGUEO CLIENTE
clientes.post("/login", async (req, res) => {
    const { usuario } = req.body;
    try {
        const [clientes] = await connection.query("SELECT * FROM Clientes");
        const validation = clientes.filter(user => user.usuario === usuario);
        if (validation.length === 0)
            res.status(401).json({ message: "Usuario no registrado" })
        else
            res.status(200).json({ message: "Login correcto" });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//REGISTRO CLIENTE
clientes.post("/register", async (req, res) => {
    const { nombre, usuario, clave } = req.body;
    try {
        const hash_clave = encriptar(clave);
        const [existingclientes] = await connection.query("SELECT * FROM Clientes WHERE usuario = ?", [usuario]);
        if (existingclientes.length > 0)
            return res.status(409).json({ message: "Usuario ya registrado" });
        await connection.query("INSERT INTO Clientes (nombre, usuario, clave) VALUES (?, ?, ?)", [nombre, usuario, hash_clave]);
        res.status(201).json({ message: "Cliente registrado correctamente." });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//ELIMINAR CLIENTE
clientes.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [clientes] = await connection.query("SELECT * FROM Clientes");
        const user = clientes.filter(user => id === user.id);
        if (user.length === 0)
            res.status(401).json({ message: "ID no registrado" })
        else{
            const [result] = await connection.query("DELETE FROM Clientes WHERE id = ?", [user[0].id]);
            if (result.affectedRows === 0) 
                return res.status(404).json({ message: "Cliente no encontrado" });
            res.status(200).json({ message: "Cliente eliminado correctamente" });
        }
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = clientes;