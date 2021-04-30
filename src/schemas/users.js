const commonProperties = {
    properties: {
      password: { type: "string" },
      user_name: { type: "string" },
      email: { type: "string" },
    },
  };
  
  exports.createResponseOpts = {
    "2xx": {
      type: "object",
      properties: {
        message: { type: "string" },
        data: {
          type: "object",
          ...commonProperties,
        },
      },
      required: ["message", "data"],
    },
  };
  
  exports.createBodyOpts = {
    type: "object",
    ...commonProperties,
    required: [
      "user_name",
      "password",
      "email",
    ],
  };
  
  exports.deleteResponseOpts = {
    "2xx": {
      type: "object",
      properties: {
        message: { type: "string" },
      },
      required: ["message"],
    },
  };
  
  exports.deleteBodyOpts = {
    type: "object",
    properties: {
      username: { type: "string" },
    },
    required: ["username"],
  };

  exports.findByParamsOpts = {
      type: "object",
      properties: {
        user_id: {type: 'string'},
        user_name: { type: "string" },
        email: { type: "string" },
        status: {type: 'string'},
        is_admin: {type: 'string'}
      }
  }
  