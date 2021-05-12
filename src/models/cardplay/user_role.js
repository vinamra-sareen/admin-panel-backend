const { DataTypes } = require("sequelize");

const UserRole = (db) =>
  db.define(
    "cp_user_role",
    {
      id: {
        type: DataTypes.INTEGER(2),
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.INTEGER(11) },
      user_role_id: { type: DataTypes.INTEGER(11) },
      modified_on: { type: DataTypes.DATE, defaultValue: Date.now },
    },
    {
      timestamps: false,
      tableName: "cp_user_role",
    }
  );

module.exports = (db) => UserRole(db);
