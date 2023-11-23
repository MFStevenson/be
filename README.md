# Northcoders News API

## About

This project creates an API to a reddit like server. The data stored on the server concerns articles, comments topics and users. Users are allowed to post or delete comments on specific articles and articles will have a topic assigned to them.

## File Set Up
After cloning the project, before running you will have to first create the two following files in the top level directory:
.env.test
.env.development

In '.env.test' set the PGDATABASE to 'nc_news_test'
In '.env.development' set the PGDATABASE to 'nc_news'

## Running of Scripts to Set Up

First ensure you have all of the dependencies by running 'npm i' This will install all of the packages required to run the project.

Once this has been complete then run the setup-dbs script using 'npm run setup-dbs'.

Finally to seed the database run the seeding script using 'npm run seed'

Once this has all been completed you are all set up and ready to run the project.

## Minimum requirements
node: v20.8.0
postgres: 14.9

