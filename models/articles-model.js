const db = require("../db/connection");
const { checkTopicExists } = require("./topics-model");

exports.selectArticleById = (article_id) => {
  const queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, 
  CAST(COUNT(comments.article_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id
  `;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.selectArticles = (topic) => {

  if (topic) {
    return checkTopicExists(topic)
      .then(() => {
        const queryString = `SELECT * FROM articles WHERE topic = $1  ORDER BY created_at DESC`;

        return db.query(queryString, [topic]);
      })
      .then(({ rows }) => {
        return rows;
      });
  } else {
    const queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
    CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    GROUP BY comments.article_id, articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes 
    ORDER BY created_at DESC`;

    return db.query(queryString).then(({ rows }) => {
      return rows;
    });
  }
};

exports.checkArticleIdExists = (article_id) => {
  const queryString = `SELECT article_id FROM articles WHERE article_id = $1;`;
  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Article not found",
      });
    } else {
      return rows;
    }
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  const queryString = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;

  return db.query(queryString, [inc_votes, article_id]).then(({ rows }) => {
    if (rows[0].votes < 0) {
      return Promise.reject({ status: 400, msg: "Something wrong with input" });
    } else {
      return rows[0];
    }
  });
};
