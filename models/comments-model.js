const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  const queryString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.insertNewComment = (article_id, newComment) => {
  const { username, comment } = newComment;
  
  const queryString = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *; `;

  return db
    .query(queryString, [username, comment, article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};
