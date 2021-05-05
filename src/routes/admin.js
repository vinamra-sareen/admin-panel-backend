const { userDocParams } = require('../schemas/admin');
const UserController = require("../controllers/users");
const DocumentTypeController = require("../controllers/document_type");
const UserDocumentController = require("../controllers/user_document");
const UserBankingInformationRecordController = require("../controllers/user_banking_information_record");

/*
 *     All the routes related to user, will be available below
 *     We pass the instance of fastify to User controller
 *     to be able to connect to database
 */

module.exports = function (instance, opts, done) {
  const userController = new UserController(instance);
  const userDocumentController = new UserDocumentController(instance);
  const documentTypeController = new DocumentTypeController(instance);
  const userBankingInformationRecordController = new UserBankingInformationRecordController(instance);

  // Route to find based on conditions.
  instance.get("/userDocumentList", {
    // Used to validate and serialize response and body
    schema: { query: userDocParams },
    preValidation: [instance.authenticate, instance.isAdmin],
    // Handles the operation
    handler: async (req, reply) => {
      let result = null;
      
      // Get user Document
      const userDoc = await userDocumentController.findBy({...req.query});
      
      // Get User Info
      const user = await userController.findBy({ ... req.query });
      if(user != null) {
        userDoc.dataValues['user_name'] = user.user_name;  
      }

      // Get document type
      const doc_id = userDoc.doc_type;
      if(userDoc != null) {
        let docType = await documentTypeController.findBy({ doc_id });
        if(docType != null){
          userDoc.dataValues["doc_name"] = docType.doc_name;
          result = { user_doc: userDoc };
        }
      }
      reply.send(result);
    },
  });

  // Route to find based on conditions.
  instance.get("/get_bank_details_report", {
    // Used to validate and serialize response and body
    schema: { },
    preValidation: [instance.authenticate, instance.isAdmin],
    // Handles the operation
    handler: async (req, reply) => {
      let result = null;
      
      if(Object.keys(req.query).length > 0){
        result = await userBankingInformationRecordController.findBy({ ...req.query });
      } else {
        result = await userBankingInformationRecordController.findAll();
      }
      
      reply.code(200).send(result);
    },
  });
  
  done();
};
