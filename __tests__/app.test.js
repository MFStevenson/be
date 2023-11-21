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
        expect(topics.length).toBe(3);
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
        expect(article).toEqual(expectedArticle);
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
        expect(body.msg).toBe("no article found at id given");
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
          expect(body.msg).toBe("no article found at id given");
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
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Something wrong with input or body");
        });
    });

    test("POST 400: returns an error message when a user tries to add a comment at an id that does not exist", () => {
      const newComment = { username: "butter_bridge", comment: "test comment" };

      return request(app)
        .post("/api/articles/1000/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Something wrong with input or body");
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
  describe("DELETE /api/comments/:commend_id", () => {
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
  

});

