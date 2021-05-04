const dayjs = require("dayjs")();
const { DataTypes, Sequelize } = require("sequelize");

module.exports = (db) =>
  db.define(
    "cp_user_banking_information_record",
    {
      id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.INTEGER(11) },
      first_name: { type: DataTypes.STRING(100) },
      last_name: { type: DataTypes.STRING(100) },
      account_number: { type: DataTypes.STRING(25) },
      bank_name: { type: DataTypes.STRING(250) },
      bank_address: { type: DataTypes.STRING(500) },
      branch_name: { type: DataTypes.STRING(250) },
      account_type: { type: DataTypes.STRING(25) },
      IFSC: { type: DataTypes.STRING(25) },
      user_document_type: { type: DataTypes.TINYINT(4) },
      user_document: { type: DataTypes.STRING(255), defaultValue: null },
      status: { type: DataTypes.TINYINT(4), defaultValue: 0 },
      remarks: { type: DataTypes.STRING(255) },
      linux_added_on: {
        type: DataTypes.INTEGER(11),
        defaultValue: dayjs.unix(),
      },
      modified_by: {
        type: DataTypes.INTEGER(11),
      },
      approved_by: {
        type: DataTypes.INTEGER(11),
      },
      modified_on: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()"
        ),
      },
      linux_modified_on: {
        type: DataTypes.INTEGER(11),
        defaultValue: dayjs.unix(),
      },
    },
    {
      timestamps: false,
      tableName: "cp_user_banking_information_record",
      indexes: [
        {
          unique: true,
          fields: ["user_id"],
        },
      ],
    }
  );
