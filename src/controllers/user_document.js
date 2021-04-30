const {userDocumentCondition} = require("../utilities/search");

/**
 *      UserDocumentController -
 *
 *      All the CRUD operations are handled here only
 *      Only functions are available through which
 *      we will create interfaces
 *
 */
class UserDocumentController {
  // Takes instance of fastify/app, needed to connect to database
  constructor(fastify) {
    let { STAGE } = process.env;
    this.user_document = require("../models/user_document")(fastify[`db.${STAGE}cardplay`]);
    // const self = this;
    // (async function () {
    //   await self.user.sync({ alter: true });
    // })();
  }

  /**
   *
   *  Get All document
   *
   *
   * @param {*} req
   * @param {*} reply
   *
   */

  findAll = async (req) => {
    if (req.validationError) {
      return req.validationError;
    }
    
    const res = await this.user_document.findAll();

    return {
      statusCode: 200,
      data: {
        user_document: res,
      },
      message: `Total ${res.length} found.`,
    };
  };

  /**
   *
   *  Find by user document
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

    const [userDoc, created] = await this.user_document.findAll({
      where: userDocumentCondition(req),
    });

    return userDoc;
  };

}

module.exports = UserDocumentController;
