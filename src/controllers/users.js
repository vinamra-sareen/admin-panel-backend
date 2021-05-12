const { Op } = require("sequelize");
const { userCondition } = require("../utilities/search");
const { encrypt } = require('../utilities/crypto');
/**
 *      UserController -
 *
 *      All the CRUD operations are handled here only
 *      Only functions are available through which
 *      we will create interfaces
 *
 */
class UserController {
  // Takes instance of fastify/app, needed to connect to database
  constructor(fastify) {
    let { STAGE } = process.env;
    this.user = require("../models/users")(fastify[`db.${STAGE}cardplay`]);
    // const self = this;
    // (async function () {
    //   await self.user.sync({ alter: true });
    // })();
  }

  // Login
  login = async (req) => {
    const { user_name, password } = req;
    const [user, created] = await this.user.findAll({
      where: {user_name: user_name}
    });


    if(user != null) {
      const hash = encrypt(password);
      //  Check if encrypted password match 
      if (hash === user.password) {
        // generate token 
        const {is_admin, user_name, user_id } = user;
        // const token = createToken(user);

        return { statusCode: 200, message: "Logged In !", user_name, is_admin, user_id };
      } else {
        return { statusCode: 201 };
      }
    } else {
      return { statusCode: 201 };
    }
  };

  /**
   *
   *  Get All Users
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

    const users = await this.user.findAll();

    return users;
  };

  /**
   *
   * Get Users By conditions
   *
   * @param {user_id, user_name, email, status, is_admin } req
   * @param {statusCode, data, message} reply
   *
   *
   */
  findBy = async (req) => {
    if (req.validationError) {
      return req.validationError;
    }

    const [user, created] = await this.user.findAll({
      where: userCondition(req),
    });

    return user;
  };

  /**
   *
   * Insert more than 50,000 items at once, increase factor of 500
   *
   *
   * @param {*} req
   *
   */
  bulkCreate = async (req) => {
    if (req.validationError) {
      return req.validationError;
    }

    // const data = require("../../data/movies.json");
    const result = await this.user.bulkCreate(data);
    return {
      statusCode: 200,
      data: result,
      message: `${result.length} ${
        result.length > 1 ? `users have been ` : `user is`
      } created ! `,
    };
  };

  /**
   *
   * Create or update user
   *
   *
   * @param {title, genre, release_date ...} req
   *
   */
  createOrUpdate = async (req) => {
    // Validate the response and body of route, helps achieve higher throughput
    // if pre-initialzed
    if (req.validationError) {
      return req.validationError;
    }

    // First check, if user exist
    const [user, created] = await this.user.findOrCreate({
      where: { email: { [Op.like]: req.email } },
      defaults: { ...req },
    });

    // If true, user created
    if (created) {
      return { statusCode: 200, message: "User created !", data: user };
    } else {
      // Otherwise, update user details and send appropriate response
      //   req.linux_modified_on = this.dayjs.unix();
      req.modified_on = this.dayjs.format("YYYY-MM-DD HH:mm:ss");
      req.is_modify = 1;
      await this.user.update(
        { ...req },
        {
          where: { email: req.email },
        }
      );
      return {
        statusCode: 201,
        message: "User details updated !",
        data: user,
      };
    }
  };

  /**
   *
   * Delete user
   *
   *
   * @param {*} req
   *
   */
  delete = async (req) => {
    if (req.validationError) {
      return req.validationError;
    }

    const { user_id = null, email = null } = req;
    const res = await this.user.destroy({
      where: { [Op.or]: [{ [Op.eq]: user_id }, { [Op.eq]: email }] },
    });
    if (res == 0) {
      return {
        statusCode: 202,
        data: res,
        message: `No user found.`,
      };
    }
    return { statusCode: 202, data: res, message: `Delete profile.` };
  };
}

module.exports = UserController;
