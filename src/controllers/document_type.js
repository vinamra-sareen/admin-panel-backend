const {documentTypeCondition} = require("../utilities/search");

/**
 *      DocumentTypeController -
 *
 *      All the CRUD operations are handled here only
 *      Only functions are available through which
 *      we will create interfaces
 *
 */
class DocumentTypeController {
  // Takes instance of fastify/app, needed to connect to database
  constructor(fastify) {
    let { STAGE } = process.env;
    this.document_type = require("../models/document_type")(fastify[`db.${STAGE}cardplay`]);
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
    if (req.validationError) {
      return req.validationError;
    }
    
    const res = await this.document_type.findAll();

    return {
      statusCode: 200,
      data: {
        document_type: res,
      },
      message: `Total ${res.length} found.`,
    };
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

    const [docType, created] = await this.document_type.findAll({
      where: documentTypeCondition(req),
    });

    return docType;
  };

}

module.exports = DocumentTypeController;
