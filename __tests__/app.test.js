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
    describe('/api', () => {
        test("should respond with a json object with a message key", () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then((response) => {
                    expect(response.body.msg).toBe('all ok')
                })
        })
    })

    describe('/api/topics', () => {
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

    describe('/api/articles', () => {
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

    describe('/api/articles/:article_id', () => {
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
        //404 non existent id
        //400 not a number
        test("invalid ID: 400 Bad Request", () => {
            return request(app)
                .get("/api/articles/notanid")
                .expect(400)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("bad request");
                });
        });
        test("resource that does not exist: 404 Not Found", () => {
            return request(app)
                .get("/api/articles/646464")
                .expect(404)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("No article found for article_id: 646464");
                });
        });
    })

    describe('error handling', () => {
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
})