"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
exports.initializeInvoiceModel = initializeInvoiceModel;
const sequelize_1 = require("sequelize");
// Definição do modelo Invoice
class Invoice extends sequelize_1.Model {
}
exports.Invoice = Invoice;
// Função para inicializar o modelo Invoice
function initializeInvoiceModel(sequelize) {
    Invoice.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        no_cliente: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true, // Permitir valores nulos
        },
        mes_referencia: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        energia_eletrica_kwh: {
            type: sequelize_1.DataTypes.INTEGER,
        },
        energia_eletrica_valor: {
            type: sequelize_1.DataTypes.DOUBLE,
        },
        energia_sceee_kwh: {
            type: sequelize_1.DataTypes.INTEGER,
        },
        energia_sceee_valor: {
            type: sequelize_1.DataTypes.DOUBLE,
        },
        energia_compensada_kwh: {
            type: sequelize_1.DataTypes.INTEGER,
        },
        energia_compensada_valor: {
            type: sequelize_1.DataTypes.DOUBLE,
        },
        contrib_ilum_publica: {
            type: sequelize_1.DataTypes.DOUBLE,
        },
        valor_total: {
            type: sequelize_1.DataTypes.DOUBLE,
        },
        nome_uc: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        distribuidora: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        pdf_url: {
            type: sequelize_1.DataTypes.STRING, // Armazena a URL do arquivo PDF
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Invoice',
        tableName: 'Invoices',
        timestamps: true,
    });
    return Invoice;
}
