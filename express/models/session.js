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
    session: {
      type: DataTypes.TEXT,
      get() {
        const val = this.getDataValue("session");
        if (!val || !val.length) return {};
        return JSON.parse(val);
      },
      set(val) {
        this.setDataValue("session", JSON.stringify(val));
      },
    },
    transponders: {
      type: DataTypes.TEXT,
      get() {
        const val = this.getDataValue("transponders");
        if (!val || !val.length) return {};
        return JSON.parse(val);
      },
      set(val) {
        this.setDataValue("transponders", JSON.stringify(val));
      },
    },
    laps: {
      type: DataTypes.TEXT,
      get() {
        const val = this.getDataValue("laps");
        if (!val || !val.length) return {};
        return JSON.parse(val);
      },
      set(val) {
        this.setDataValue("laps", JSON.stringify(val));
      },
    },
    sessionDate: {
      type: DataTypes.DATE,
      allowNull: false,
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
    tableName: "SESSION",
    createdAt: "creationDate",
    updatedAt: "modificationDate",
    deletedAt: "deletedOn",
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
