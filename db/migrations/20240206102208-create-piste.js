module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable("PISTE", {
    ID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER(20),
    },
    PATH: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    DALLES: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER(20),
    },
    TOURS: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER(20),
    },
    CREATION_DATE: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    MODIFICATION_DATE: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    DELETED_ON: {
      allowNull: true,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, _Sequelize) => queryInterface.dropTable("PISTE"),
};
