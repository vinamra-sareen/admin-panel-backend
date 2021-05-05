const {
  userBankingInformationRecordCondition,
} = require("../utilities/search");
const paginate = require("../utilities/pagination");
const { Op, Sequelize } = require("sequelize");
const dayjs = require("dayjs");
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
    this.users = require("../models/users")(fastify[`db.${STAGE}cardplay`]);
    this.sequelize = fastify[`db.${STAGE}cardplay`];
    // const self = this;
    // (async function () {
    //   await self.user.sync({ alter: true });
    // })();
  }

  /**
   *
   *  Get All document types
   *
   *
   * @param {*} req
   * @param {*} reply
   *
   */

  findAll = async (req) => {
    // if (req.validationError) {
    //   return req.validationError;
    // }

    // const { page = 1 } = req;
    // const count = await this.user_banking_information_record.count();

    //  // Pagination
    // const { canPaginate, limit, offset, maxPages } = paginate(count, page, 5);

    // if (!canPaginate) {
    //   return {
    //     statusCode: 200,
    //     message: `The page you are trying to go doesn\'t exist, Make sure the page you are trying to reach is in range 1-${maxPages}`,
    //   };
    // }
    //  //Pagination ends here

    const res = await this.sequelize.query(
      `select br.user_id, br.modified_by,  br.linux_added_on, br.first_name, br.last_name, br.account_number, br.account_type,
       br.IFSC , br.modified_on ,if(br.status = 1, 'approved', 'rejected') as status, 
       (select user_name from cp_user where user_id=br.user_id) as user_name,
       (select user_name from cp_user where user_id=br.approved_by) as approved_by,
       (select user_name from cp_user where user_id=br.modified_by) as requested_by 
       from cp_user_banking_information_record br
       where (br.status = 1 or br.status = 2)
       order by id desc`
    // , {bind: {user_id: '' , from_date: '', to_date: ''}} 
    );

    return {res: res[0]};
  };

  /**
   *
   *  Find by role modules
   *
   *
   * @param {*} req
   * @param {*} reply
   *
   */
  findBy = async (req) => {
    if (req.validationError) {
      return req.validationError;
    }

    // const res = await this.user_banking_information_record.findAll({
    //   include: [
    //     {
    //       model: this.users,
    //       where: {
    //         user_id: "2703202",
    //       },
    //     },
    //   ],
    //   where: userBankingInformationRecordCondition(req),
    // });
    let {user_id = null, from_date = null, to_date = null} = req;
    from_date = from_date !== null ? dayjs(from_date).unix() : from_date;
    to_date = to_date !== null ? dayjs(to_date).unix() : to_date;

    const res = await this.sequelize.query(
      `select br.user_id, br.modified_by,  br.linux_added_on, br.first_name, br.last_name, br.account_number, br.account_type,
       br.IFSC , br.modified_on , if(br.status = 1, 'approved', 'rejected') as status, 
       (select user_name from cp_user where user_id=br.user_id) as user_name,
       (select user_name from cp_user where user_id=br.approved_by) as approved_by,
       (select user_name from cp_user where user_id=br.modified_by) as requested_by 
       from cp_user_banking_information_record br
       ${user_id != null ? `where br.user_id = ${user_id} and (br.status = 1 or br.status = 2)` : `where (br.status = 1 or br.status = 2)`}
       ${(from_date != null || to_date != null)  ? `and br.linux_added_on between ${from_date} and ${to_date}` : ''}
       order by id desc`
    // , {bind: {user_id: '' , from_date: '', to_date: ''}} 
    );

    return {res: res[0]};
  };
}

module.exports = UserBankingInformationRecordController;
