const {
  modulesCondition,
  roleModulesCondition,
  userDocumentCondition,
  userBankingInformationRecordCondition,
} = require("../../utilities/search");
const paginate = require("../../utilities/pagination");
const _ = require("lodash");
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
class AdminController {
  // Takes instance of fastify/app, needed to connect to database
  constructor(app) {
    this.app = app;
    let { STAGE } = process.env;
    let cardplay = app[`db.${STAGE}cardplay`];
    this.modules = require("../../models/modules")(cardplay);
    // this.user = require("../../models/users")(cardplay);
    this.user = require('../../models/users')(cardplay);
    this.user_document = require("../../models/user_document")(cardplay);
    this.document_type = require("../../models/document_type")(cardplay);
    this.role_modules = require("../../models/role_modules")(cardplay);
    this.user_banking_information_record = require("../../models/user_banking_information_record")(
      cardplay
    );

    // const self = this;
    // (async function () {
    //   await self.user.sync({ alter: true });
    // })();
  }

  getModules = async (req, reply) => {
    const { role_id } = await this.app.decodedToken(req);

    if (role_id != 1) {
      let condition = {};
      if (Object.keys(req.query).length > 0) {
        condition = _.omit(req.query, ["module_id"]);
      }

      condition.role_id = role_id;
      let mCondition = null;

      const role_modules = await this.role_modules.findAll({
        where: roleModulesCondition(condition),
        attributes: ["module_id"],
      });

      let module_ids = _.map(role_modules, "module_id");

      mCondition = {
        parent_link: "",
        status: 1,
        module_id: module_ids,
        parent_module_id: req.query.module_id ? req.query.module_id : 0,
      };

      const modules = await this.modules.findAll({
        where: modulesCondition(mCondition),
        order: [["navigation_name", "ASC"]],
        attributes: ["navigation_name", "module_link", "module_id"],
      });

      reply.code(200).send({ modules });
    } else {
      let condition = null;
      condition = {
        status: 1,
        parent_module_id: req.query.module_id ? req.query.module_id : 0,
      };

      const modules = await this.modules.findAll({
        where: modulesCondition(condition),
        order: [["navigation_name", "asc"]],
        attributes: ["module_id", "navigation_name", "module_link"],
      });

      reply.code(200).send({ modules });
    }
  };

  getUserDocumentList = async (req, reply) => {
    let result = null;
    let { page } = req.query ? req.query : 1;
    
    const count = await this.user_document.count({ where: userDocumentCondition(req.query) });
    
    let { canPaginate, limit, offset, maxPages } = paginate(count, page, 10);

    if(!canPaginate){
        reply.code(400).send({message: `Please check your page number.`})
    }

    result = await this.user_document.findAll({
      limit,
      offset,
      order_by: [['linux_added_on', 'desc']],
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

    reply.code(200).send({ curr_page: page, total_pages: maxPages, total_records: count, result });
  };

  getBankReport = async (req, reply) => {
    let result = null;
    let { page } = req.query ? req.query : 1;
    
    const count = await this.user_banking_information_record.count({ where: userBankingInformationRecordCondition(req.query) });
    
    let { canPaginate, limit, offset, maxPages } = paginate(count, page, 10);

    if(!canPaginate){
        reply.code(400).send({message: `Please check your page number.`})
    }

    result = await this.user_banking_information_record.findAll({
      limit,
      offset,
      order_by: [['linux_added_on', 'desc']],
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

    reply.code(200).send({ curr_page: page, total_pages: maxPages, total_records: count, result });
  };
}

module.exports = AdminController;
