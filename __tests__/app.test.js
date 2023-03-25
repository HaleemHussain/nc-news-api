const app = require('../app.js');
const request = require('supertest');
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {topicData, userData, articleData, commentData} = require("../db/data/test-data");


afterAll(() => {
    db.end();
});

beforeEach(() => {
    return seed({topicData, userData, articleData, commentData});
});

describe('app', () => {
    describe("GET /api", () => {
        test("200: responds with endpoints object", () => {
            return request(app)
                .get("/api")
                .expect(200)
                .then(({ type, body }) => {
                    const { endpoints } = body;
                    expect(endpoints).toEqual(endpoints);
                    expect(type).toBe("application/json");
                });
        });
    });

    describe('GET /api/not-an-endpoint', () => {
        test("should respond with 404 not found if given incorrect path", () => {
            return request(app)
                .get("/api/not-an-endpoint")
                .expect(404)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("not found");
                });
        });
    });

    describe('GET /api/topics', () => {
        test("should respond with a json object of topics", () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({body}) => {
                    const {topics} = body;
                    topics.forEach((topic) => {
                        expect(topic).toHaveProperty('description', expect.any(String))
                        expect(topic).toHaveProperty('slug', expect.any(String))
                    });
                });
        });
    });

    describe('GET /api/articles', () => {
        test("200: responds with an array of article objects", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const {articles} = body;
                    expect(articles).toHaveLength(12);
                    expect(articles).toBeInstanceOf(Array);
                    articles.forEach((article) => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                article_id: expect.any(Number),
                                title: expect.any(String),
                                topic: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(String),
                            })
                        );
                    });
                });
        });
        describe("article queries", () => {
            test("200: should respond with array sorted by article_id, order defaults to descending", () => {
                return request(app)
                    .get("/api/articles?sort_by=article_id")
                    .expect(200)
                    .then(({body}) => {
                        const {articles} = body;
                        expect(articles).toBeInstanceOf(Array);
                        expect(articles).toBeSortedBy("article_id", {descending: true});
                    });
            });
            test("200: should respond with array ordered by ascending, sort_by defaults to created_at", () => {
                return request(app)
                    .get("/api/articles?order=asc")
                    .expect(200)
                    .then(({body}) => {
                        const {articles} = body;
                        expect(articles).toBeInstanceOf(Array);
                        expect(articles).toBeSortedBy("created_at", {ascending: true});
                    });
            });
            test("200: should respond with array of one cat article object when filtered by topic cats", () => {
                return request(app)
                    .get("/api/articles?topic=cats")
                    .expect(200)
                    .then(({body}) => {
                        const {articles} = body;
                        expect(articles).toHaveLength(1);
                        expect(articles[0]).toEqual(
                            expect.objectContaining({
                                article_id: 5,
                                title: "UNCOVERED: catspiracy to bring down democracy",
                                topic: "cats",
                                author: "rogersop",
                                body: "Bastet walks amongst us, and the cats are taking arms!",
                                comment_count: "2",
                                created_at: expect.any(String),
                                votes: 0,
                            })
                        );
                    });
            });
            test("200: for multiple queries, should respond with an array of mitch article objects, sorted by article_id with order ascending", () => {
                return request(app)
                    .get("/api/articles?topic=mitch&sort_by=article_id&order=asc")
                    .expect(200)
                    .then(({body}) => {
                        const {articles} = body;
                        expect(articles).toBeInstanceOf(Array);
                        expect(articles).toBeSortedBy("article_id", {ascending: true});
                        articles.forEach((article) => expect(article.topic).toBe("mitch"));
                    });
            });
            test("400: stops invalid sort_by queries and responds with bad request", () => {
                return request(app)
                    .get("/api/articles?sort_by=quantity")
                    .expect(400)
                    .then(({body}) => {
                        const {msg} = body;
                        expect(msg).toBe("bad request: cannot sort by 'quantity'");
                    });
            });
            test("400: stops invalid order queries and responds with bad request", () => {
                return request(app)
                    .get("/api/articles?order=rupaul")
                    .expect(400)
                    .then(({body}) => {
                        const {msg} = body;
                        expect(msg).toBe(
                            "bad request: cannot order by 'rupaul', ASC or DESC only"
                        );
                    });
            });
        });
    });

    describe('GET /api/articles/:article_id', () => {
        test("should respond with a json object of an article", () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({body}) => {
                    const {article} = body;
                    expect(article.article_id).toBe(1);
                    expect(article).toHaveProperty('author', expect.any(String))
                    expect(article).toHaveProperty('title', expect.any(String))
                    expect(article).toHaveProperty('body', expect.any(String))
                    expect(article).toHaveProperty('topic', expect.any(String))
                    expect(article).toHaveProperty('created_at', expect.any(String))
                    expect(article).toHaveProperty('votes', expect.any(Number))
                    expect(article).toHaveProperty('article_img_url', expect.any(String))
                });
        });

        test("invalid ID: 400 Bad Request", () => {
            return request(app)
                .get("/api/articles/notanid")
                .expect(400)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("bad request");
                });
        });
        test("resource that does not exist: 404 Not Found", () => {
            return request(app)
                .get("/api/articles/646464")
                .expect(404)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("No article found for article_id: 646464");
                });
        });
    });

    describe('GET /api/articles/:article_id/comments', () => {
        test("should respond with a json object of an comments", () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({body}) => {
                    const {comments} = body;
                    expect(comments).toHaveLength(11)
                    comments.forEach((comment) => {
                        expect(comment).toHaveProperty('comment_id', expect.any(Number))
                        expect(comment).toHaveProperty('votes', expect.any(Number))
                        expect(comment).toHaveProperty('created_at', expect.any(String))
                        expect(comment).toHaveProperty('author', expect.any(String))
                        expect(comment).toHaveProperty('body', expect.any(String))
                        expect(comment).toHaveProperty('article_id', expect.any(Number))
                    });
                });
        });
        test("invalid ID: 400 Bad Request", () => {
            return request(app)
                .get("/api/articles/notanid/comments")
                .expect(400)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("bad request");
                });
        });
        test("resource that does not exist: 404 Not Found", () => {
            return request(app)
                .get("/api/articles/646464/comments")
                .expect(404)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("No comments found for article_id: 646464");
                });
        });
        test("no comments for an article that exists 404 Not Found", () => {
            return request(app)
                .get("/api/articles/2/comments")
                .expect(404)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("No comments found for article_id: 2");
                });
        });
    });
    describe("POST /api/articles/:article_id/comments", () => {
        test('comment is posted and the response is the comment 201', () => {
            const userComment = {
                username: "butter_bridge",
                body: "wow comment"
            }
            return request(app)
                .post('/api/articles/1/comments')
                .send(userComment)
                .expect(201)
                .then(({body}) => {
                    const {comment} = body;
                    expect(comment).toMatchObject(
                        expect.objectContaining({
                            article_id: 1,
                            author: "butter_bridge",
                            body: "wow comment",
                            comment_id: 19,
                            created_at: expect.any(String),
                            votes: 0,
                        }));
                });
        });
        test("not found code 404 not a valid user", () => {
            const comment = {
                username: "mike",
                body: "comment",
            };
            return request(app)
                .post("/api/articles/1/comments")
                .send(comment)
                .expect(404)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("not found");
                });
        });

        test("not found 404 invalid articleID", () => {
            const comment = {
                username: "mike",
                body: "comment"
            };
            return request(app)
                .post("/api/articles/9999999/comments")
                .send(comment)
                .expect(404)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("not found");
                });
        });

        test("bad request 400 missing some input fields", () => {
            const comment = {body: 'comment'};
            return request(app)
                .post("/api/articles/1/comments")
                .send(comment)
                .expect(400)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("bad request");
                });
        });
        test("bad request 400 missing all input fields", () => {
            const comment = {};
            return request(app)
                .post("/api/articles/1/comments")
                .send(comment)
                .expect(400)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("bad request");
                });
        });
        test("bad request 404 username is incorrect datatype", () => {
            const comment = {
                username: 64,
                body: 'comment',
            };
            return request(app)
                .post("/api/articles/1/comments")
                .send(comment)
                .expect(404)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("not found");
                });
        });
    });
    describe("PATCH /api/artices/:articled_id", () => {
        test("article up-voted by 1 status 200 response is updated article", () => {
            const updatedArticle = {
                inc_votes: 1,
            };
            return request(app)
                .patch("/api/articles/1")
                .send(updatedArticle)
                .expect(200)
                .then(({body}) => {
                    const {article} = body;
                    expect(article).toEqual({
                        article_id: 1,
                        article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: expect.any(String),
                        votes: 101,
                    });
                });
        });
        test("article down-voted by 1 status 200 response is updated article", () => {
            const updatedArticle = {
                inc_votes: -1,
            };
            return request(app)
                .patch("/api/articles/1")
                .send(updatedArticle)
                .expect(200)
                .then(({body}) => {
                    const {article} = body;
                    expect(article).toEqual({
                        article_id: 1,
                        article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: expect.any(String),
                        votes: 99,
                    });
                });
        });
        test("not found 404 invalid articleID", () => {
            const updatedArticle = {
                inc_votes: "1",
            };
            return request(app)
                .post("/api/articles/9999999")
                .send(updatedArticle)
                .expect(404)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("not found");
                });
        });
        test("invalid ID: 400 Bad Request id not a number", () => {
            const updatedArticle = {
                inc_votes: "1",
            };
            return request(app)
                .patch("/api/articles/notanid")
                .send(updatedArticle)
                .expect(400)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("bad request");
                });
        });
        test("bad request 400 inc_votes is incorrect datatype", () => {
            const updatedArticle = {
                inc_votes: "string",
            };
            return request(app)
                .patch("/api/articles/1")
                .send(updatedArticle)
                .expect(400)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("bad request");
                });
        });
        test("bad request 400 no body missing input field", () => {
            const updatedArticle = {};
            return request(app)
                .patch("/api/articles/1")
                .send(updatedArticle)
                .expect(400)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("bad request");
                });
        });
    });
    describe('GET /api/users', () => {
        test("should respond with a json object of users", () => {
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(({body}) => {
                    const {users} = body;
                    expect(users).toHaveLength(4)
                    users.forEach((user) => {
                        expect(user).toHaveProperty('username', expect.any(String))
                        expect(user).toHaveProperty('name', expect.any(String))
                        expect(user).toHaveProperty('avatar_url', expect.any(String))
                    });
                });
        });
    });
    describe("DELETE /api/comments/:comment_id", () => {
        test("status: 204, responds with an empty body", () => {
            return request(app)
                .delete("/api/comments/1")
                .expect(204)
                .then(({ body }) => {
                    expect(body).toEqual({});
                });
        });
        test("404: resource does not exist, responds with not found", () => {
            return request(app)
                .delete("/api/comments/999999")
                .expect(404)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("No comment found for comment_id: 999999");
                });
        });
        test("400: invalid comment_id, responds with bad request ", () => {
            return request(app)
                .delete("/api/comments/notanid")
                .expect(400)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("bad request");
                });
        });
    });
});