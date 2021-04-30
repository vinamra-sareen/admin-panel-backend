const crypto = require("crypto");

const encrypt = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

module.exports = {
  encrypt,
  // decrypt,
};
