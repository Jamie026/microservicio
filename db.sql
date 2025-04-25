
-- // -------------------- USUARIOS
USE usuarios;

CREATE TABLE empleados (
    id_empleado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    clave VARCHAR(100) NOT NULL
);

CREATE TABLE proveedores (
    id_proveedor INT PRIMARY KEY AUTO_INCREMENT,
    pais VARCHAR(100) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    clave VARCHAR(100) NOT NULL
);

CREATE TABLE clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    usuario VARCHAR(100) NOT NULL UNIQUE, 
    clave VARCHAR(100) NOT NULL
);


-- // -------------------- VENTAS
USE ventas;

CREATE TABLE productos (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    precio INT NOT NULL
);

CREATE TABLE inventario (
    id_inventario INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    stock INT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE solicitudes (
    id_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,  -- LO COMPLETAMOS POR MICROSERVICIO
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'pendiente'
);

CREATE TABLE producto_solicitud (
    id_producto_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    id_solicitud INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);


-- // -------------------- OPERACIONES
USE operaciones;

CREATE TABLE pagos (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    id_solicitud INT NOT NULL,            -- LO COMPLETAMOS POR MICROSERVICIO
    metodo_pago VARCHAR(50) NOT NULL,     -- ej. 'tarjeta', 'efectivo', 'transferencia'
    monto INT NOT NULL,
    estado_pago VARCHAR(50) DEFAULT 'pendiente',  -- 'pendiente', 'pagado', 'fallido'
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE entregas (
    id_entrega INT PRIMARY KEY AUTO_INCREMENT,
    id_solicitud INT NOT NULL,               -- LO COMPLETAMOS POR MICROSERVICIO
    direccion_entrega VARCHAR(255) NOT NULL,
    fecha_estimada DATE,
    fecha_entrega DATE,
    estado_entrega VARCHAR(50) DEFAULT 'pendiente'  -- 'pendiente', 'en camino', 'entregado', 'cancelado'
);

USE ventas;

ALTER TABLE solicitudes DROP COLUMN id_entrega;