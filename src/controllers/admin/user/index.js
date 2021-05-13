const { userDocumentCondition } = require("../../../utilities/search");
const paginate = require("../../../utilities/pagination");
const Sequelize = require("sequelize");

/**
 *      User -
 *
 *      The User functions such as
 *      - getModules
 *      - login
 *      - getBankReport will go here
 *
 */
class User {
  // Takes instance of fastify/app, needed to connect to database
  constructor(app) {
    this.app = app;
    let { STAGE } = process.env;
    let cardplay = app[`db.${STAGE}cardplay`];
    this.user = require("../../../models/users")(cardplay);
    this.user_document = require("../../../models/user_document")(cardplay);
    this.document_type = require("../../../models/document_type")(cardplay);

    // const self = this;
    // (async function () {
    //   await self.user.sync({ alter: true });
    // })();
  }

  getUserDocumentList = async (req, reply) => {
    let result = null;
    let { page } = req.query ? req.query : 1;

    const count = await this.user_document.count({
      where: userDocumentCondition(req.query),
    });

    let { canPaginate, limit, offset, maxPages } = paginate(count, page, 10);

    if (!canPaginate) {
      reply.code(400).send({ message: `Please check your page number.` });
    }

    result = await this.user_document.findAll({
      limit,
      offset,
      order_by: [["linux_added_on", "desc"]],
      where: userDocumentCondition(req.query),
      attributes: [
        "user_id",
        "user_doc_number",
        "remarks",
        "nameoncard",
        "user_passport_file_number",
        "file_name",
        "linux_added_on",
        "linux_modified_on",
        [Sequelize.literal("user.user_name"), "user_name"],
        [Sequelize.literal("document_type.doc_name"), "doc_name"],
        [Sequelize.literal("modified_by.user_name"), "modified_by_user"],
        [
          Sequelize.literal(
            `(if (cp_user_document.status = 1, 'approved', 'pending'))`
          ),
          "status",
        ],
        [
          Sequelize.literal(
            `(if (cp_user_document.status_system = 1, 'approved', if(cp_user_document.status_system = 2, 'rejected', 'pending')))`
          ),
          "status_system",
        ],
      ],
      include: [
        {
          model: this.user,
          as: "user",
          attributes: [],
        },
        {
          model: this.document_type,
          as: "document_type",
          attributes: [],
        },
        {
          model: this.user,
          as: "modified_by",
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

module.exports = User;
