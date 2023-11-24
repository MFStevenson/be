const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpointsJSON = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("nc-news", () => {
  test("GET 404: returns 404 given wrong path", () => {
    return request(app)
      .get("/api/not-a-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("path not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("GET 200: returns all of the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(4);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api", () => {
  test("GET 200: returns json object listing all endpoints with information about them", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toMatchObject(endpointsJSON);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET 200: returns specific article when given valid id", () => {
    const expectedArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T21:11:00.000Z",
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject(expectedArticle);
      });
  });

  test("GET 404: returns message saying id not found when id number is non-existant", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article at id not found");
      });
  });

  test("GET 400: returns error message when invalid id is given", () => {
    return request(app)
      .get("/api/articles/pie")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input or body");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET 200: returns comments about the given article", () => {
    const expectedOutput = [
      {
        comment_id: 16,
        body: "This is a bad article name",
        votes: 1,
        author: "butter_bridge",
        article_id: 6,
        created_at: "2020-10-11T16:23:00.000Z",
      },
    ];

    return request(app)
      .get("/api/articles/6/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual(expectedOutput);
      });
  });

  test("GET 200: returns comments about a given article with the most recent comments first", () => {
    const expectedOutput = [
      {
        comment_id: 10,
        body: "git push origin master",
        votes: 0,
        author: "icellusedkars",
        article_id: 3,
        created_at: "2020-06-20T08:24:00.000Z",
      },
      {
        comment_id: 11,
        body: "Ambidextrous marsupial",
        votes: 0,
        author: "icellusedkars",
        article_id: 3,
        created_at: "2020-09-20T00:10:00.000Z",
      },
    ];

    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual(expectedOutput);
        expect(comments).toBeSortedBy("created_at");
      });
  });

  test("GET 200: returns empty array when no comments are found at a valid id", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });

  test("GET 404: returns error message when article_id given has no comments as id does not exist", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("GET 400: returns error message saying something wrong with input when article_id could not be correctly interpreted", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input or body");
      });
  });
});

describe("GET api/articles", () => {
  test("GET 200: returns with all articles sorted via date in descending order when no query given", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.comment_count).toBe("number");
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET 200: returns comments about the given article", () => {
    const expectedOutput = [
      {
        comment_id: 16,
        body: "This is a bad article name",
        votes: 1,
        author: "butter_bridge",
        article_id: 6,
        created_at: "2020-10-11T16:23:00.000Z",
      },
    ];

    return request(app)
      .get("/api/articles/6/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual(expectedOutput);
      });
  });

  test("GET 200: returns comments about a given article with the most recent comments first", () => {
    const expectedOutput = [
      {
        comment_id: 10,
        body: "git push origin master",
        votes: 0,
        author: "icellusedkars",
        article_id: 3,
        created_at: "2020-06-20T08:24:00.000Z",
      },
      {
        comment_id: 11,
        body: "Ambidextrous marsupial",
        votes: 0,
        author: "icellusedkars",
        article_id: 3,
        created_at: "2020-09-20T00:10:00.000Z",
      },
    ];

    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual(expectedOutput);
        expect(comments).toBeSortedBy("created_at");
      });
  });

  test("GET 200: returns empty array when no comments are found at a valid id", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });

  test("GET 404: returns error message when article_id given has no comments as id does not exist", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("GET 400: returns error message saying something wrong with input when article_id could not be correctly interpreted", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input or body");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST 201: posts the user's comment", () => {
    const newComment = { username: "butter_bridge", comment: "test comment" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { postedComment } = body;
        expect(postedComment.article_id).toBe(1);
        expect(postedComment.body).toBe(newComment.comment);
      });
  });

  test("POST 400: returns an error message stating that the user is missing input data when no username", () => {
    const newCommentNoUser = { comment: "test comment" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newCommentNoUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input or body");
      });
  });

  test("POST 400: returns an error message stating that the user is missing input data when no comment", () => {
    const newCommentNoComment = { username: "butter_bridge" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newCommentNoComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input or body");
      });
  });

  test("POST 400: returns an error message when trying to post a comment at an invalid id", () => {
    const newComment = { username: "butter_bridge", comment: "test comment" };
    return request(app)
      .post("/api/articles/err/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input or body");
      });
  });

  test("POST 404: returns an error message when user does not exist", () => {
    const newComment = { username: "testUser", comment: "test comment" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username not found");
      });
  });

  test("POST 404: returns an error message when a user tries to add a comment at an id that does not exist", () => {
    const newComment = { username: "butter_bridge", comment: "test comment" };

    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/users", () => {
  test("GET 200: returns all of the users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE 204: deletes the comment at the given id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("DELETE 400: returns error message when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/not")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input or body");
      });
  });

  test("DELETE 404: returns error message when given a comment id that does not exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no comment found at id given");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH 200: Returns the updated article with the votes incremented by the given amount", () => {
    const updatedData = { inc_votes: 10 };
    const expectedArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T21:11:00.000Z",
      votes: 110,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .patch("/api/articles/1")
      .send(updatedData)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toEqual(expectedArticle);
      });
  });

  test("PATCH 200: Returns the updated article with the votes decremented by the given amount", () => {
    const updatedData = { inc_votes: -10 };
    const expectedArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T21:11:00.000Z",
      votes: 90,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .patch("/api/articles/1")
      .send(updatedData)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toEqual(expectedArticle);
      });
  });

  test("PATCH 200: Returns the updated article and allows votes to be 0", () => {
    const updatedData = { inc_votes: -100 };
    const expectedArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T21:11:00.000Z",
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .patch("/api/articles/1")
      .send(updatedData)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toEqual(expectedArticle);
      });
  });

  test("PATCH 404: Returns an error when the article_id does not exist", () => {
    const updatedData = { inc_votes: -10 };

    return request(app)
      .patch("/api/articles/1000")
      .send(updatedData)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("PATCH 400: Returns an error when the article_id is invalid", () => {
    const updatedData = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/coffee")
      .send(updatedData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input or body");
      });
  });

  test("PATCH 400: Returns an error when the decrement value is not a number", () => {
    const updatedData = { inc_votes: true };

    return request(app)
      .patch("/api/articles/1")
      .send(updatedData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input or body");
      });
  });

  test("PATCH 400: Returns an error when the votes would go below 0 with the given decrement value", () => {
    const updatedData = { inc_votes: -110 };

    return request(app)
      .patch("/api/articles/1")
      .send(updatedData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input");
      });
  });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("GET 200: returns article at specific ID with added comment_count", () => {
    const expectedArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T21:11:00.000Z",
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      comment_count: 11,
    };
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(expectedArticle);
      });
  });
});

describe("GET /api/users/:username", () => {
  test("GET 200: returns the user when given a valid username", () => {
    const expected = {
      username: "butter_bridge",
      name: "jonny",
      avatar_url:
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
    };
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual(expected);
      });
  });

  test("GET 404: returns an error message when the user does not exist", () => {
    return request(app)
      .get("/api/users/not_a_user")
      .expect(404)
      .then(({ body }) => expect(body.msg).toBe("username not found"));
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("GET 200: returns the comment with incremented vote", () => {
    const updatedData = { inc_votes: 10 };
    const expected = {
      comment_id: 1,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 26,
      author: "butter_bridge",
      article_id: 9,
      created_at: "2020-04-06T13:17:00.000Z",
    };

    return request(app)
      .patch("/api/comments/1")
      .send(updatedData)
      .expect(200)
      .then(({ body }) => {
        const { updatedComment } = body;
        expect(updatedComment).toEqual(expected);
      });
  });

  test("GET 200: returns the comment with decremented vote", () => {
    const updatedData = { inc_votes: -10 };
    const expected = {
      comment_id: 1,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 6,
      author: "butter_bridge",
      article_id: 9,
      created_at: "2020-04-06T13:17:00.000Z",
    };

    return request(app)
      .patch("/api/comments/1")
      .send(updatedData)
      .expect(200)
      .then(({ body }) => {
        const { updatedComment } = body;
        expect(updatedComment).toEqual(expected);
      });
  });

  test("GET 200: returns the comment with 0 votes", () => {
    const updatedData = { inc_votes: -16 };
    const expected = {
      comment_id: 1,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 0,
      author: "butter_bridge",
      article_id: 9,
      created_at: "2020-04-06T13:17:00.000Z",
    };

    return request(app)
      .patch("/api/comments/1")
      .send(updatedData)
      .expect(200)
      .then(({ body }) => {
        const { updatedComment } = body;
        expect(updatedComment).toEqual(expected);
      });
  });

  test("GET 400: returns an error when the user tries to decrement the votes by a number greater than the current votes", () => {
    const updatedData = { inc_votes: -26 };
    return request(app)
      .patch("/api/comments/1")
      .send(updatedData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input");
      });
  });

  test("GET 400 returns an error message when the comment_id is invalid", () => {
    const updatedData = { inc_votes: 10 };

    return request(app)
      .patch("/api/comments/boo")
      .send(updatedData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input or body");
      });
  });

  test("GET 404: returns an error messae when the comment_id is not found", () => {
    const updatedData = { inc_votes: -26 };
    return request(app)
      .patch("/api/comments/1000")
      .send(updatedData)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no comment found at id given");
      });
  });
});

describe("POST /api/articles", () => {
  test("POST 201: returns the posted article to the user", () => {
    const new_article = {
      author: "rogersop",
      title: "new article",
      body: "content",
      topic: "mitch",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .post("/api/articles")
      .send(new_article)
      .expect(201)
      .then(({ body }) => {
        const { postedArticle } = body;

        expect(postedArticle).toMatchObject({
          article_id: expect.any(Number),
          votes: 0,
          author: "rogersop",
          title: "new article",
          body: "content",
          topic: "mitch",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          created_at: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });
  test("POST 201: returns the posted article when article_img_url not provided", () => {
    const new_article = {
      author: "lurker",
      title: "new article",
      body: "content",
      topic: "cats",
    };

    return request(app)
      .post("/api/articles")
      .send(new_article)
      .expect(201)
      .then(({ body }) => {
        const { postedArticle } = body;

        expect(postedArticle).toMatchObject({
          article_id: expect.any(Number),
          votes: 0,
          author: "lurker",
          title: "new article",
          body: "content",
          topic: "cats",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          created_at: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });

  test("POST 404: returns an error message if the user does not exist", () => {
    const new_article = {
      author: "boop",
      title: "new article",
      body: "content",
      topic: "cats",
    };

    return request(app)
      .post("/api/articles")
      .send(new_article)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username not found");
      });
  });

  test("POST 404: returns an error message if the user provides a topic that does not exist", () => {
    const new_article = {
      author: "butter_bridge",
      title: "new article",
      body: "content",
      topic: "music",
    };

    return request(app)
      .post("/api/articles")
      .send(new_article)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic does not exist");
      });
  });

  test("POST 400: returns an error message if the user does not provide all of the relevant information", () => {
    const new_article = {
      title: "new article",
      body: "content",
      topic: "cats",
    };

    return request(app)
      .post("/api/articles")
      .send(new_article)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username not found");
      });
  });
});

describe("POST /api/topics", () => {
  test("POST 201: returns the posted topic to the user when given valid information", () => {
    const newTopic = { slug: "new topic", description: "a new topic" };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        const { newTopic } = body;
        expect(newTopic).toEqual({
          slug: "new topic",
          description: "a new topic",
        });
      });
  });

  test("POST 400: returns an error when the user tries to post a topic that already exists", () => {
    const newTopic = { slug: "mitch", description: "a new topic" };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input or body");
      });
  });

  test("POST 400: returns an error when the user does not provide a d topic", () => {
    const newTopic = { description: "a description" };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input or body");
      });
  });

  test("POST 400: returns an error when the user does not provide a description of the topic", () => {
    const newTopic = { slug: "mitch" };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Something wrong with input or body");
      });
  });
});

describe("Queries", () => {
  describe("GET api/articles?topic", () => {
    test("GET 200: return the articles of a specific topic to a user when given a topic that exists", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              title: expect.any(String),
              topic: "mitch",
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              article_img_url: expect.any(String),
            });
          });
        });
    });

    test("GET 200: returns an empty array when given a topic that exists but has no articles", () => {
      return request(app)
        .get("/api/articles?topic=sabrina")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toEqual([]);
        });
    });

    test("GET 404: returns an error message when the topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=john")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Topic does not exist");
        });
    });
  });
  describe("GET api/articles?sort_by&&order", () => {
    test("GET 200: sorts all of the articles by created_at in descending order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(13);
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    }),
      test("GET 200: sorts all of the articles by a given field in descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBe(13);
            expect(articles).toBeSortedBy("title", { descending: true });
          });
      }),
      test("GET 200: returns all of the articles by a given field in ascending order", () => {
        return request(app)
          .get("/api/articles?sort_by=author&&order=asc")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBe(13);
            expect(articles).toBeSortedBy("author");
          });
      }),
      test("GET 400: returns an error message when user provides a bad input value for sort_by", () => {
        return request(app)
          .get("/api/articles?sort_by=hello")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query");
          });
      }),
      test("GET 400: returns an error message when user provides a bad input value for order", () => {
        return request(app)
          .get("/api/articles?sort_by=body&&order=green")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query");
          });
      });
  });
});
