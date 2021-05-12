const dayjs = require("dayjs");
const { result } = require("lodash");
const Sequelize = require("sequelize");
const {
  userBankingInformationRecordCondition,
} = require("../utilities/search");
/**
 *      UserBankingInformationRecordController -
 *
 *      All the CRUD operations are handled here only
 *      Only functions are available through which
 *      we will create interfaces
 *
 */
class UserBankingInformationRecordController {
  // Takes instance of fastify/app, needed to connect to database
  constructor(fastify) {
    let { STAGE } = process.env;
    this.user_banking_information_record = require("../models/user_banking_information_record")(
      fastify[`db.${STAGE}cardplay`]
    );
    this.User = require("../models/users")(fastify[`db.${STAGE}cardplay`]);
  }

  getBankReport = async (req, reply) => {
    let result = null;
    result = await this.user_banking_information_record.findAll({
      where: userBankingInformationRecordCondition(req.query),
      attributes: [
        "first_name",
        "last_name",
        "account_number",
        "IFSC",
        "account_type",
        "modified_on",
        [
          Sequelize.literal(
            `(if (cp_user_banking_information_record.status = 1, 'approved', 'rejected'))`
          ),
          "status",
        ],
        [
          Sequelize.literal(
            `(from_unixtime(cp_user_banking_information_record.linux_added_on))`
          ),
          "linux_added_on", 
        ]
      ],
      include: [
        {
          model: this.User,
          as: "user",
          attributes: ["user_name"],
        },
        {
          model: this.User,
          as: "approved_by_user",
          attributes: ["user_name"],
        },
        {
          model: this.User,
          as: "requested_by",
          attributes: ["user_name"],
        },
      ],
    });

    reply.code(200).send({ result });
  };
}

module.exports = UserBankingInformationRecordController;
