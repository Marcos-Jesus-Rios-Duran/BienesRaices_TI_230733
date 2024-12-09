import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Propiedad = db.define('propiedades', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    habitaciones: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estacionamiento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    calle: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    lat: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    lng: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    publicado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    tipo_establecimiento: {
        type: DataTypes.ENUM('venta', 'renta'),
        defaultValue: 'venta',
        allowNull: false
    },
    precioID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    categoriaID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuarioID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

export default Propiedad;
