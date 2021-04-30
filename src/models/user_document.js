const dayjs = require("dayjs")();
const { DataTypes } = require("sequelize");

module.exports = (db) =>
  db.define(
    "cp_user_document",
    {
      id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.INTEGER(11), primaryKey: true },
      doc_type: { type: DataTypes.STRING(20) },
      user_doc_number: { type: DataTypes.STRING(100) },
      file_name: { type: DataTypes.STRING(100) },
      status: { type: DataTypes.TINYINT(4) },
      author: { type: DataTypes.INTEGER(11) },
      remarks: { type: DataTypes.STRING(255) },
      nameoncard: { type: DataTypes.STRING(250) },
      user_passport_file_number: { type: DataTypes.STRING(250) },
      status_system: { type: DataTypes.TINYINT(4) },
      linux_added_on: {
        type: DataTypes.INTEGER,
        defaultValue: dayjs.unix(),
        allowNull: true,
      },
      linux_modified_on: {
        type: DataTypes.INTEGER,
        defaultValue: dayjs.unix(),
      },
    },
    {
      timestamps: false,
      tableName: "cp_user_document",
    }
  );
