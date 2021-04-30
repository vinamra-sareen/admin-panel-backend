  exports.userDocParams = {
      type: "object",
      properties: {
        user_id: {type: 'number'},
        doc_type: { type: "number" },
      },
      required: ['user_id', 'doc_type']
  }
  