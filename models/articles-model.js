const db = require("../db/connection");
const { validateQuery } = require("../db/seeds/utils");
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

exports.selectArticles = (topic, sort_by, order) => {
  if (!sort_by) sort_by = "created_at";
  if (!order) order = "desc";

  if (!validateQuery(sort_by, order)) {
    return Promise.reject({ status: 400, msg: "invalid query" });
  } else {
    if (topic) {
      return checkTopicExists(topic)
        .then(() => {
          const queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE topic = $1 GROUP BY comments.article_id, articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes ORDER BY ${sort_by} ${order}`;

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
      ORDER BY ${sort_by} ${order}`;

      return db.query(queryString).then(({ rows }) => {
        return rows;
      });
    }
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
      return db
        .query(
          `UPDATE articles SET votes = 0 WHERE article_id = $1 RETURNING *;`,
          [article_id]
        )
        .then(() => {
          return Promise.reject({
            status: 400,
            msg: "Something wrong with input",
          });
        });
    } else {
      return rows[0];
    }
  });
};

exports.insertArticle = (
  author,
  title,
  body,
  topic,
  article_img_url = "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
) => {
  const queryString = `INSERT INTO articles (author, title, body, topic, article_img_url, votes, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;

  return db
    .query(queryString, [
      author,
      title,
      body,
      topic,
      article_img_url,
      (votes = 0),
      (created_at = new Date()),
    ])
    .then(({ rows }) => {
      return rows[0];
    })
    .then((rows) => {
      return this.selectArticleById(rows.article_id);
    })
    .then((rows) => {
      return rows;
    });
};

exports.removeArticle = (article_id) => {
  const queryString = `DELETE FROM articles WHERE article_id = $1`;

  return db.query(queryString, [article_id]);
};
