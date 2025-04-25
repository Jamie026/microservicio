const express = require("express")
const empleados = express.Router()
const connection = require("../config/db");
const { encriptar } = require("./../auth/bcrypt")

//OBTENER EMPLEADOS
empleados.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Empleados");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener empleados:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//LOGUEO EMPLEADO
empleados.post("/login", async (req, res) => {
    const { usuario } = req.body;
    try {
        const [empleados] = await connection.query("SELECT * FROM Empleados");
        const validation = empleados.filter(user => user.usuario === usuario);
        if (validation.length === 0)
            res.status(401).json({ message: "Usuario no registrado" })
        else
            res.status(200).json({ message: "Login correcto" });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//REGISTRO EMPLEADO
empleados.post("/register", async (req, res) => {
    const { nombre, usuario, clave, email } = req.body;
    try {
        const hash_clave = encriptar(clave);
        const [existingEmpleados] = await connection.query("SELECT * FROM Empleados WHERE usuario = ?", [usuario]);
        if (existingEmpleados.length > 0)
            return res.status(409).json({ message: "Usuario ya registrado" });
        await connection.query("INSERT INTO Empleados (nombre, usuario, clave, email) VALUES (?, ?, ?, ?)", [nombre, usuario, hash_clave, email]);
        res.status(201).json({ message: "Empleado registrado correctamente." });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//ELIMINAR EMPLEADO
empleados.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [empleados] = await connection.query("SELECT * FROM Empleados");
        const user = empleados.filter(user => id == user.id_empleado);
        if (user.length === 0)
            res.status(401).json({ message: "ID no registrado" })
        else{
            const [result] = await connection.query("DELETE FROM Empleados WHERE id_empleado = ?", [user[0].id_empleado]);
            if (result.affectedRows === 0) 
                return res.status(404).json({ message: "Empleado no encontrado" });
            res.status(200).json({ message: "Empleado eliminado correctamente" });
        }
    } catch (error) {
        console.error("Error al eliminar empleado:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = empleados;