import { Model, DataTypes, Sequelize } from 'sequelize';

// Interface para tipar o modelo
interface InvoiceAttributes {
  no_cliente: string | null;
  mes_referencia: string | null;
  energia_eletrica_kwh: number | null;
  energia_eletrica_valor: number | null;
  energia_sceee_kwh: number | null;
  energia_sceee_valor: number | null;
  energia_compensada_kwh: number | null;
  energia_compensada_valor: number | null;
  contrib_ilum_publica: number | null;
  valor_total: number | null;
}

class Invoice extends Model<InvoiceAttributes> implements InvoiceAttributes {
  no_cliente!: string | null;
  mes_referencia!: string | null;
  energia_eletrica_kwh!: number | null;
  energia_eletrica_valor!: number | null;
  energia_sceee_kwh!: number | null;
  energia_sceee_valor!: number | null;
  energia_compensada_kwh!: number | null;
  energia_compensada_valor!: number | null;
  contrib_ilum_publica!: number | null;
  valor_total!: number | null;

  static associate(models: any) {
    // Definir associações, se necessário
  }
}

// Inicializar o modelo
const initializeInvoiceModel = (sequelize: Sequelize) => {
  Invoice.init(
    {
      no_cliente: {
        type: DataTypes.STRING,
        allowNull: true, // Permitir null
      },
      mes_referencia: {
        type: DataTypes.STRING,
        allowNull: true, // Permitir null
      },
      energia_eletrica_kwh: {
        type: DataTypes.FLOAT,
        allowNull: true, // Permitir null
      },
      energia_eletrica_valor: {
        type: DataTypes.FLOAT,
        allowNull: true, // Permitir null
      },
      energia_sceee_kwh: {
        type: DataTypes.FLOAT,
        allowNull: true, // Permitir null
      },
      energia_sceee_valor: {
        type: DataTypes.FLOAT,
        allowNull: true, // Permitir null
      },
      energia_compensada_kwh: {
        type: DataTypes.FLOAT,
        allowNull: true, // Permitir null
      },
      energia_compensada_valor: {
        type: DataTypes.FLOAT,
        allowNull: true, // Permitir null
      },
      contrib_ilum_publica: {
        type: DataTypes.FLOAT,
        allowNull: true, // Permitir null
      },
      valor_total: {
        type: DataTypes.FLOAT,
        allowNull: true, // Permitir null
      },
    },
    {
      sequelize,
      modelName: 'Invoice',
    }
  );

  return Invoice;
};

export { Invoice, initializeInvoiceModel };
