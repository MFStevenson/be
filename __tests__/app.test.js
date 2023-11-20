const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const topics = require("../db/data/test-data/topics");

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

  describe("GET /api", () => {
    test("GET 200: returns json object listing all endpoints with information about them", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toMatchObject({
            "GET /api": {
              description:
                "serves up a json representation of all the available endpoints of the api",
            },
          });
        });
    });
  });
});
