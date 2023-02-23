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
    describe('GET /api', () => {
        test("should respond with a json object with a message key", () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then((response) => {
                    expect(response.body.msg).toBe('all ok')
                })
        })
    })

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
    })

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
                    })
                })
        })
    })

    describe('GET /api/articles', () => {
        test("should respond with a json object of articles", () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body}) => {
                    const {articles} = body;
                    expect(articles).toHaveLength(12)
                    articles.forEach((article) => {
                        expect(article).toHaveProperty('author', expect.any(String))
                        expect(article).toHaveProperty('title', expect.any(String))
                        expect(article).toHaveProperty('article_id', expect.any(Number))
                        expect(article).toHaveProperty('topic', expect.any(String))
                        expect(article).toHaveProperty('created_at', expect.any(String))
                        expect(article).toHaveProperty('votes', expect.any(Number))
                        expect(article).toHaveProperty('article_img_url', expect.any(String))
                        expect(article).toHaveProperty('comment_count', expect.any(Number))
                    })
                })
        })
    })

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
        })

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
    })

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
                    })
                })
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
    })
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
                        }))
                });
        });
        test("bad request code 400 not a valid user", () => {
            const comment = {
                username: "mike",
                body: "comment",
            };
            return request(app)
                .post("/api/articles/1/comments")
                .send(comment)
                .expect(400)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("bad request");
                });
        });

        test("bad request 400 invalid articleID", () => {
            const comment = {
                username: "mike",
                body: "comment"
            };
            return request(app)
                .post("/api/articles/9999999/comments")
                .send(comment)
                .expect(400)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("bad request");
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
        test("bad request 400 username is incorrect datatype", () => {
            const comment = {
                username: 64,
                body: 'comment',
            };
            return request(app)
                .post("/api/articles/1/comments")
                .send(comment)
                .expect(400)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("bad request");
                });
        });
    })
})