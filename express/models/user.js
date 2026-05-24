/* eslint-disable no-magic-numbers, max-lines-per-function */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    needPasswordChange: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    modificationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    tableName: "USER",
    createdAt: "creationDate",
    updatedAt: "modificationDate",
  });

  User.prototype.toJSON = function toJSON() {
    const values = {...this.get()};

    delete values.password;

    return values;
  };

  return User;
};
