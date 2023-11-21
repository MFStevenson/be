const db = require("../db/connection");

exports.checkUserExists = (username) => {
  const queryString = `SELECT username FROM users WHERE username = $1;`;

  return db.query(queryString, [username]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "username not found",
      });
    } else {
      return rows;
    }
  });
};
