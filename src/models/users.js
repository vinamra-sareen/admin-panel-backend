const dayjs = require("dayjs")();
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const { encrypt } = require("../utilities/");
const _ = require("lodash");

module.exports = (db) => {
  const User = db.define(
    "cp_user",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_name: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      status: {
        type: DataTypes.ENUM,
        values: [
          "active",
          "inactive",
          "facebook",
          "guest",
          "blocked",
          "deleted",
          "temp blocked",
          "fixed block",
        ],
      },
      device_id: { type: DataTypes.STRING, defaultValue: null },
      referred_by: { type: DataTypes.STRING, defaultValue: null },
      is_admin: {
        type: DataTypes.ENUM,
        values: ["Y", "N", "T"],
        defaultValue: null,
      },
      ip_address: { type: DataTypes.STRING },
      is_modify: { type: DataTypes.ENUM, values: ["0", "1"] },
      last_login: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      linux_added_on: {
        type: DataTypes.INTEGER,
        defaultValue: dayjs.unix(),
        allowNull: true,
      },
    },
    {
      tableName: "cp_user",
      createdAt: "added_on",
      updatedAt: "modified_on",
      indexes: [
        {
          unique: false,
          fields: [
            "user_name",
            "referred_by",
            "email",
            "is_modify",
            "linux_added_on",
          ],
        },
      ],
      classMethods: {
        associate: function (models) {
          // User.hasMany(models.UserBankingInformationRecord, { foreignKey: "user_id" });
        },
      },
    }
  );

  this.user_role = require("../models/user_role")(db);
  User.hasOne(this.user_role, {
    as: "role",
    foreignKey: "user_id",
    sourceKey: "user_id",
  });

  // Login functionality
  User.login = async ({ user_name, password }) => {
    const [user, created] = await User.findAll({
      where: { user_name: user_name },
      attributes: [
        "user_name",
        "user_id",
        "is_admin",
        ["password", "pass"],
        [Sequelize.literal("role.user_role_id"), "role_id"],
      ],
      include: [
        {
          model: this.user_role,
          as: "role",
          attributes: [],
        },
      ],
    });

    if (user != null) {
      const hash = encrypt(password);
      let { pass } = user.dataValues;

      //  Check if encrypted password match
      if (hash == pass) {
        return { status: "success", ..._.omit(user.dataValues, ["pass"]) };
      } else {
        return { status: "fail", user_name };
      }
    } else {
      return { status: "fail", user_name };
    }
  };

  return User;
};
