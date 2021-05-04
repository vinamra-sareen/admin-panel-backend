const { Op } = require("sequelize");

const userCondition = (fields) => {
  let {
    user_id = null,
    user_name = null,
    email = null,
    status = null,
    is_admin = null
  } = fields;

  return {
    [Op.and]: [
      user_id != null
        ? {
            user_id: {
              [Op.eq]: user_id,
            },
          }
        : "",
      user_name != null
        ? {
            user_name: {
              [Op.like]: `%${user_name}%`,
            },
          }
        : "",
      email != null
        ? {
            email: {
              [Op.like]: `%${email}%`,
            },
          }
        : "",
      status != null
        ? {
            status: {
              [Op.like]: `%${status}%`,
            },
          }
        : "",
      is_admin != null
        ? {
            is_admin: {
              [Op.like]: `%${is_admin}%`,
            },
          }
        : ""
    ],
  };
};

const modulesCondition = (fields) => {
  let {
    module_id = null,
    module_name = null,
    access_type = null,
    navigation_name = null,
    status = null,
    parent_module_id = null
  } = fields;

  return {
    [Op.and]: [
      status != null
        ? {
            status: {
              [Op.eq]: status,
            },
          }
        : "",
      module_id != null
        ? {
            module_id: {
              [Op.eq]: module_id,
            },
          }
        : "",
      parent_module_id != null
        ? {
          parent_module_id: {
              [Op.eq]: parent_module_id,
            },
          }
        : "",
      module_name != null
        ? {
            module_name: {
              [Op.like]: `%${module_name}%`,
            },
          }
        : "",
      access_type != null
        ? {
            access_type: {
              [Op.like]: `%${access_type}%`,
            },
          }
        : "",
      navigation_name != null
        ? {
            navigation_name: {
              [Op.like]: `%${navigation_name}%`,
            },
          }
        : "",
    ],
  };
} 

const roleModulesCondition = (fields) => {
  let {
    role_module_id = null,
    role_id = null,
    module_id = null,
    action_allowed = null,
  } = fields;

  return {
    [Op.and]: [
      role_module_id != null
        ? {
            role_module_id: {
              [Op.eq]: role_module_id,
            },
          }
        : "",
      role_id != null
        ? {
          role_id: {
            [Op.eq]: role_id,
          },
        }
        : "",
      module_id != null
        ? {
          module_id: {
            [Op.eq]: module_id,
          },
        }
        : "",
      action_allowed != null
        ? {
            action_allowed: {
              [Op.like]: `%${action_allowed}%`,
            },
          }
        : "",
    ],
  };
}

const userRoleCondition = (fields) => {
  let {
    user_id = null,
    user_role_id = null,
  } = fields;

  return {
    [Op.and]: [
      user_id != null
        ? {
            user_id: {
              [Op.eq]: user_id,
            },
          }
        : "",
      user_role_id != null
        ? {
          user_role_id: {
            [Op.eq]: user_role_id,
          },
        }
        : "",
    ],
  };
}

const documentTypeCondition = (fields) => {
  let {
    doc_id = null,
    doc_name = null,
    status = null
  } = fields;

  return {
    [Op.and]: [
      doc_id != null
        ? {
            doc_id: {
              [Op.eq]: doc_id,
            },
          }
        : "",
      doc_name != null
        ? {
          doc_name: {
            [Op.like]: doc_name,
          },
        }
        : "",
      status != null
      ? {
          status: {
            [Op.eq]: status,
          },
        }
      : "",
    ],
  };
}

const userDocumentCondition = (fields) => {
  let {
    id = null,
    user_id = null,
    doc_type = null,
    user_doc_number = null,
    file_name = null,
    status = null,
    author = null,
    user_passport_file_number = null 
  } = fields;

  return {
    [Op.and]: [
      id != null
        ? {
            id: {
              [Op.eq]: id,
            },
          }
        : "",
      user_id != null
        ? {
            user_id: {
              [Op.eq]: user_id,
            },
          }
        : "",
      doc_type != null
        ? {
          doc_type: {
            [Op.eq]: doc_type,
          },
        }
        : "",
      user_doc_number != null
      ? {
          user_doc_number: {
            [Op.eq]: user_doc_number,
          },
        }
      : "",
      file_name != null
        ? {
          file_name: {
            [Op.like]: file_name,
          },
        }
        : "",
      status != null
        ? {
          status: {
            [Op.eq]: status,
          },
        }
        : "",
      author != null
        ? {
          author: {
            [Op.eq]: author,
          },
        }
        : "",
      user_passport_file_number != null
        ? {
          user_passport_file_number: {
            [Op.like]: user_passport_file_number,
          },
        }
        : "",  
    ],
  };
}


module.exports = {
  userCondition,
  modulesCondition,
  roleModulesCondition,
  userRoleCondition,
  documentTypeCondition,
  userDocumentCondition
};
