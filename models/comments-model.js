const db = require("../db/connection");
const { checkArticleIdExists } = require("./articles-model");
const { checkUserExists } = require("./users-model");

exports.selectCommentsByArticleId = (article_id) => {
  const queryString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.insertNewComment = (article_id, newComment) => {
  const { username, comment } = newComment;

  if (!username)
    return Promise.reject({
      status: 400,
      msg: "Something wrong with input or body",
    });

  return checkArticleIdExists(article_id)
    .then(() => {
      return checkUserExists(username);
    })
    .then(() => {
      const queryString = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *; `;

      return db.query(queryString, [username, comment, article_id]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.checkCommentIdExists = (comment_id) => {
  const queryString = `SELECT comment_id FROM comments WHERE comment_id = $1;`;
  return db.query(queryString, [comment_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "no comment found at id given",
      });
    } else {
      return rows;
    }
  });
};

exports.removeCommentById = (comment_id) => {
  const queryString = "DELETE FROM comments WHERE comment_id = $1;";

  return db.query(queryString, [comment_id]);
};
