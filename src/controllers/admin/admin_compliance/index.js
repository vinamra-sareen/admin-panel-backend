const {
  userBankingInformationRecordCondition,
} = require("../../../utilities/search");
const paginate = require("../../../utilities/pagination");
const Sequelize = require("sequelize");

/**
 *      AdminController -
 *
 *      The admin functions such as
 *      - getModules
 *      - login
 *      - getBankReport will go here
 *
 */
class AdminCompliance {
  // Takes instance of fastify/app, needed to connect to database
  constructor(app) {
    this.app = app;
    let { STAGE } = process.env;
    let cardplay = app[`db.${STAGE}cardplay`];
    this.user = require("../../../models/users")(cardplay);
    this.user_banking_information_record =
      require("../../../models/user_banking_information_record")(cardplay);

    // const self = this;
    // (async function () {
    //   await self.user.sync({ alter: true });
    // })();
  }

  getBankReport = async (req, reply) => {
    let result = null;
    let { page } = req.query ? req.query : 1;

    const count = await this.user_banking_information_record.count({
      where: userBankingInformationRecordCondition(req.query),
    });

    let { canPaginate, limit, offset, maxPages } = paginate(count, page, 10);

    if (!canPaginate) {
      reply.code(400).send({ message: `Please check your page number.` });
    }

    result = await this.user_banking_information_record.findAll({
      limit,
      offset,
      order_by: [["linux_added_on", "desc"]],
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
        ],
        [Sequelize.literal("user.user_name"), "user_name"],
        [Sequelize.literal("approved_by_user.user_name"), "approved_by"],
        [Sequelize.literal("requested_by.user_name"), "requested_by"],
      ],
      include: [
        {
          model: this.user,
          as: "user",
          attributes: [],
        },
        {
          model: this.user,
          as: "approved_by_user",
          attributes: [],
        },
        {
          model: this.user,
          as: "requested_by",
          attributes: [],
        },
      ],
    });

    reply.code(200).send({
      curr_page: page,
      total_pages: maxPages,
      total_records: count,
      result,
    });
  };
}

module.exports = AdminCompliance;
