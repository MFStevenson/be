const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

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

  describe("GET /api/articles/:article_id", () => {
    test("GET 200: returns specific article when given valid id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(typeof body.article_id).toBe("number");
          expect(typeof body.title).toBe("string");
          expect(typeof body.topic).toBe("string");
          expect(typeof body.author).toBe("string");
          expect(typeof body.body).toBe("string");
          expect(typeof body.created_at).toBe("string");
          expect(typeof body.article_img_url).toBe("string");
          expect(typeof body.votes).toBe("number");
        });
    });

    test("GET 404: returns message saying id not found when id number is non-existant", () => {
      return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("id not found");
        });
    });

    test("GET 400: returns error message when invalid id is given", () => {
        return request(app)
          .get("/api/articles/pie")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Something wrong with input");
          });
      });
  });
});
