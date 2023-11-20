const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  const queryString = `SELECT * FROM articles WHERE article_id = $1`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.selectArticles = () => {
  const queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
  CAST(COUNT(comments.article_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY comments.article_id, articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes
  ORDER BY created_at DESC
  `;

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};
