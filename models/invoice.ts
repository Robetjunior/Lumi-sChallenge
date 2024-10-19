import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

// Definição dos atributos do modelo Invoice
interface InvoiceAttributes {
  id: number;
  no_cliente: string;
  mes_referencia: string;
  energia_eletrica_kwh: number;
  energia_eletrica_valor: number;
  energia_sceee_kwh: number;
  energia_sceee_valor: number;
  energia_compensada_kwh: number;
  energia_compensada_valor: number;
  contrib_ilum_publica: number;
  valor_total: number;
  nome_uc: string;
  distribuidora: string;
  pdf_url: string;
}

// Tipagem para criação do modelo (campos opcionais durante a criação)
interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id'> {}

// Definição do modelo Invoice
export class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes>
  implements InvoiceAttributes {
  public id!: number;
  public no_cliente!: string;
  public mes_referencia!: string;
  public energia_eletrica_kwh!: number;
  public energia_eletrica_valor!: number;
  public energia_sceee_kwh!: number;
  public energia_sceee_valor!: number;
  public energia_compensada_kwh!: number;
  public energia_compensada_valor!: number;
  public contrib_ilum_publica!: number;
  public valor_total!: number;
  public nome_uc!: string;
  public distribuidora!: string;
  public pdf_url!: string; // Adicionando a nova propriedade

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Função para inicializar o modelo Invoice
export function initializeInvoiceModel(sequelize: Sequelize) {
  Invoice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      no_cliente: {
        type: DataTypes.STRING,
        allowNull: true, // Permitir valores nulos
      },
      mes_referencia: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      energia_eletrica_kwh: {
        type: DataTypes.INTEGER,
      },
      energia_eletrica_valor: {
        type: DataTypes.DOUBLE,
      },
      energia_sceee_kwh: {
        type: DataTypes.INTEGER,
      },
      energia_sceee_valor: {
        type: DataTypes.DOUBLE,
      },
      energia_compensada_kwh: {
        type: DataTypes.INTEGER,
      },
      energia_compensada_valor: {
        type: DataTypes.DOUBLE,
      },
      contrib_ilum_publica: {
        type: DataTypes.DOUBLE,
      },
      valor_total: {
        type: DataTypes.DOUBLE,
      },
      nome_uc: {
        type: DataTypes.STRING, 
        allowNull: true,
      },
      distribuidora: {
        type: DataTypes.STRING, 
        allowNull: true,
      },
      pdf_url: {
        type: DataTypes.STRING, // Armazena a URL do arquivo PDF
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Invoice',
      tableName: 'Invoices',
      timestamps: true,
    }
  );
  
  return Invoice;
}
