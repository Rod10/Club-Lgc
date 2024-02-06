/* eslint-disable-next-line max-lines-per-function */
module.exports = (sequelize, DataTypes) => {
    /* eslint-disable no-magic-numbers */
  const Session = sequelize.define("Session", {
    id: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    pisteId: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
    },
    data: {
      type: DataTypes.TEXT,
      get() {
        const val = this.getDataValue("data");
        if (!val || !val.length) return {};
        return JSON.parse(val);
      },
      set(val) {
        this.setDataValue("data", JSON.stringify(val));
      },
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    tableName: "SESSION",
    createdAt: "creationDate",
  });
    /* eslint-enable no-magic-numbers */

  Session.associate = models => {
    Session.Piste = Session.belongsTo(models.Piste, {
      as: "piste",
      foreignKey: {
        name: "pisteId",
        allowNull: false,
        onDelete: "CASCADE",
      },
    });
  };

  return Session;
};
