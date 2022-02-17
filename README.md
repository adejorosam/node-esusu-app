# Esusu app



## How To Run
1. Start by installing all dependencies by running `npm install`
2. Next create a `.env` file at the postgres of the project and copy everything from `.env.example`
3. copy files from `.env.example` to `.env` using `cp .env.example .env`then populate it with required values where necessary.
5. Run migrations by running `sequelize db:migrate` to set up your database

> **Note:** please ensure that you have postgres installed locally and is running.

## Important Commands
- run `npm i` or `npm install` to install all dependencies
- run `sequelize db:migrate` to to run migration so as to set up database
- run `npm start` to start the development server
