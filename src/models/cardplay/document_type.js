const { DataTypes } = require("sequelize");

const DocumentType = (db) =>
  db.define(
    "cp_document_type",
    {
      doc_id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      doc_name: { type: DataTypes.STRING(50) },
      status: { type: DataTypes.TINYINT(1) },
    },
    {
      timestamps: false,
      tableName: "cp_document_type",
    }
  );

module.exports = (db) => DocumentType(db);
