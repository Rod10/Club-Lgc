module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable("SESSION", {
    ID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER(20),
    },
    PISTE_ID: {
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "PISTE",
        key: "ID",
      },
      type: Sequelize.INTEGER(20),
    },
    DATA: {type: Sequelize.TEXT},
    CREATION_DATE: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, _Sequelize) => queryInterface.dropTable("SESSION"),
};
