const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  const queryString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "no comments found at id given" });
    } else {
      return rows;
    }
  });
};
