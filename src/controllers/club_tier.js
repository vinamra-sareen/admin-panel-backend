const paginate = require("../utilities/pagination");

/**
 *      ClubTierController -
 *
 *      All the CRUD operations are handled here only
 *      Only functions are available through which
 *      we will create interfaces
 *
 */
class ClubTierController {
  // Takes instance of fastify/app, needed to connect to database
  constructor(fastify) {
    let { STAGE } = process.env;
    this.tier = require("../models/club_tier")(fastify[`db.${STAGE}cardplay_rummy`]);
    // const self = this;
    // (async function () {
    //   await self.user.sync({ alter: true });
    // })();
  }

  /**
   *
   *  Get All Tiers
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
    
    const [tiers, created] = await this.tier.findAll();
    return tiers;
  };

}

module.exports = ClubTierController;
