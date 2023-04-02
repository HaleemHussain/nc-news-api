# Northcoders News API

This API is for a news website. It has the functionality to access and manipulate articles, comments, topics and users.

This API is built with Node.js and Express. The data is stored in PostgreSQL Database. It is hosted on render and can be accessed at: https://nc-news-o54u.onrender.com/api

The Frontend is hosted at https://haleemnews.netlify.app/.

## Installation

### Requirements

This project was built with Node.js v19.2.0 and PostgreSQL v14.7.

### Setup environment variables

After cloning the repo you will need to two `.env` files at the root level for your project: `.env.test` and `.env.development`. Ensure that these are the same as the database names set in the `setup.sql` which can be found in the `db` directory. In `.env.test`, add `PGDATABASE=<database_name_here_test>` and in `.env.development` add `PGDATABASE<database_name_here>`

These will automatically be ignored in the .gitignore file.


### Instructions

To set up and test this project:

1. Clone the repository and cd into the directory

2. Run `npm install --production=false` to install the project and developer dependencies

3. Make sure that the database names you have chosen are correct in the `setup.sql` file in the `db` directory they should also match the database names you have chosen in the `.env` files. 

4. Then run the setup.sql file using the command `npm run setup-dbs` in the package.json file set in the scripts.

5. To run the app, use: `npm start`. The default port is set to 9090.

6. To test the app, use: `npm test`

## Usage

### Endpoints Index

1. GET /api/topics
2. GET /api/articles
3. GET /api/articles/:article_id
4. GET /api/articles/:article_id/comments
5. PATCH /api/articles/:article_id
6. POST /api/articles/:article_id/comments
7. GET /api/users
8. DELETE /api/comments/:comment_id

To see a more detailed look at the endpoints with examples head over to  https://nc-news-o54u.onrender.com/api
