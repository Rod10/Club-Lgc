/* eslint-disable-next-line max-lines-per-function */
module.exports = (sequelize, DataTypes) => {
    /* eslint-disable no-magic-numbers */
  const Piste = sequelize.define("Piste", {
    id: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    dalles: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
    },
    tours: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
    },
    path: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    modificationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    tableName: "PISTE",
    createdAt: "creationDate",
    updatedAt: "modificationDate",
    deletedAt: "deletedOn",
  });
    /* eslint-enable no-magic-numbers */

  Piste.associate = models => {
    Piste.Session = Piste.hasMany(models.Session, {
      as: "session",
      foreignKey: "pisteId",
    });
  };

  return Piste;
};
