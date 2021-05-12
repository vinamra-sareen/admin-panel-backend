const { DataTypes } = require("sequelize");

module.exports = (db) => {
  const RoleModules = db.define(
    "cp_role_modules",
    {
      role_module_id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      role_id: { type: DataTypes.INTEGER(11) },
      module_id: { type: DataTypes.INTEGER(11) },
      action_allowed: { type: DataTypes.ENUM, values: ["view", "extended"] },
      modified_on: { type: DataTypes.DATE, defaultValue: Date.now },
    },
    {
      timestamps: false,
      tableName: "cp_role_modules",
    }
  );


  // this.modules = require("../../models/modules")(db);

  // RoleModules.hasMany(this.modules, {
  //   as: "modules",
  //   foreignKey: "module_id",
  //   sourceKey: "module_id",
  // });

  return RoleModules;
};
