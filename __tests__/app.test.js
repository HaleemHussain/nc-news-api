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
                    console.log(articles);
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
})