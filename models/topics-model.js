const db = require("../db/connection");

exports.selectTopics = () => {
  const queryString = `SELECT * FROM topics`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.checkTopicExists = (slug) => {
  const queryString = `SELECT slug FROM topics where slug = $1`;
  return db.query(queryString, [slug]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Topic does not exist",
      });
    } else {
      return rows;
    }
  });
};

exports.insertTopic = (slug, description) => {
  if (!slug || !description)
    return Promise.reject({
      status: 400,
      msg: "Something wrong with input or body",
    });

  const queryString = `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`;

  return db.query(queryString, [slug, description]).then(({ rows }) => {
    return rows[0];
  });
};
