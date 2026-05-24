/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable("USER", {
    ID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER(20),
    },
    USERNAME: {
      allowNull: false,
      type: Sequelize.STRING(100),
      unique: true,
    },
    PASSWORD: {
      allowNull: false,
      type: Sequelize.STRING(100),
    },
    NEED_PASSWORD_CHANGE: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
    },
    CREATION_DATE: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    MODIFICATION_DATE: {
      allowNull: true,
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface, _Sequelize) => queryInterface.dropTable("USER"),
};
