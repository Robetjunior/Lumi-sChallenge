"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Invoice extends sequelize_1.Model {
    static associate(models) {
        // Definir associações, se necessário
    }
}
// Inicializar o modelo
exports.default = (sequelize) => {
    Invoice.init({
        no_cliente: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        mes_referencia: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        energia_eletrica_kwh: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        energia_eletrica_valor: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        energia_compensada_kwh: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        energia_compensada_valor: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        contrib_ilum_publica: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Invoice',
    });
    return Invoice;
};
