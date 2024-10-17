module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      no_cliente: {
        type: Sequelize.STRING
      },
      mes_referencia: {
        type: Sequelize.STRING
      },
      energia_eletrica_kwh: {
        type: Sequelize.FLOAT
      },
      energia_eletrica_valor: {
        type: Sequelize.FLOAT
      },
      energia_sceee_kwh: {
        type: Sequelize.FLOAT
      },
      energia_sceee_valor: {
        type: Sequelize.FLOAT
      },
      energia_compensada_kwh: {
        type: Sequelize.FLOAT
      },
      energia_compensada_valor: {
        type: Sequelize.FLOAT
      },
      contrib_ilum_publica: {
        type: Sequelize.FLOAT
      },
      valor_total: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Invoices');
  }
};
