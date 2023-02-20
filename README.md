We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).



To use this project you will have to set the .env.test and .env.development files to PGDATABASE=database_name_here.

Then run the setup.sql file using the command 'npm run setup-dbs' in the package.json file set in the scripts.

