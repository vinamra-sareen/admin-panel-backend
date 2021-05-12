const { DataTypes } = require("sequelize");

module.exports = (db) => {
  const Modules = db.define(
    "cp_modules",
    {
      module_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      module_name: { type: DataTypes.STRING(100) },
      description: { type: DataTypes.STRING(255) },
      access_type: {
        type: DataTypes.ENUM,
        values: ["admin", "private", "public"],
      },
      parent_module_id: { type: DataTypes.INTEGER(11) },
      is_navigation: { type: DataTypes.ENUM, values: ["Y", "N"] },
      navigation_name: { type: DataTypes.STRING(50) },
      sequence: { type: DataTypes.INTEGER(11) },
      parent_link: { type: DataTypes.STRING(100), defaultValue: null },
      module_link: { type: DataTypes.STRING, defaultValue: null },
      tags: { type: DataTypes.STRING, defaultValue: null },
      server: { type: DataTypes.INTEGER(2) },
      status: { type: DataTypes.INTEGER(2) },
    },
    {
      timestamps: false,
      tableName: "cp_modules",
    }
  );

  // this.modules = require("../models/modules")(db);

  // Modules.hasOne(this.modules, {
  //   as: "user",
  //   foreignKey: "user_id",
  //   sourceKey: "user_id",
  // });

  return Modules;
};
