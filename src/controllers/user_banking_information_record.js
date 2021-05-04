// const {userBankingInformationRecordCondition} = require("../utilities/search");
const paginate =require('../utilities/pagination')
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
    this.user_banking_information_record = require("../models/user_banking_information_record")(fastify[`db.${STAGE}cardplay`]);
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
    
    const { page = 1 } = req;
    const count = await this.user_banking_information_record.count();

     // Pagination
    const { canPaginate, limit, offset, maxPages } = paginate(count, page, 5);

    if (!canPaginate) {
      return {
        statusCode: 200,
        message: `The page you are trying to go doesn\'t exist, Make sure the page you are trying to reach is in range 1-${maxPages}`,
      };
    }
     //Pagination ends here 

    const res = await this.user_banking_information_record.findAll({
      limit,
      offset
    });

    return {res, total_pages: maxPages, current_page: page };
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

    const [res, created] = await this.user_banking_information_record.findAll({
      // where: userBankingInformationRecordCondition(req),
    });

    return res;
  };

}

module.exports = UserBankingInformationRecordController;
