const { DataTypes } = require("sequelize");

const UserClubTier = (db) =>
  db.define(
    "cp_user_club_tier",
    {
      club_id: {
        type: DataTypes.INTEGER(2),
        primaryKey: true,
        autoIncrement: true,
      },
      club_name: { type: DataTypes.STRING(30) },
      init_rake: { type: DataTypes.INTEGER(11) },
      hurdle_factor: { type: DataTypes.DOUBLE(11, 2) },
      final_rake: { type: DataTypes.DOUBLE(11, 2) },
      total_wager: { type: DataTypes.DOUBLE(11, 2) },
      loyalty_point_start: { type: DataTypes.INTEGER(11) },
      loyalty_point_end: { type: DataTypes.INTEGER(11) },
      club_tier_rate: { type: DataTypes.DOUBLE(3, 2) },
    },
    {
      timestamps: false,
      tableName: "cp_user_club_tier",
    }
  );

module.exports = (db) => UserClubTier(db);
