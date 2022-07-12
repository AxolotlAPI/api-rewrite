# api-rewrite

## Getting started

To get started, simply install dependencies with `npm i` and create the database using `npm run createDatabase`, then run `npm run build` to compile the TypeScript code into JavaScript code or `npm start` to run the TypeScript code directly.



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the TypeScript code using the ts-node dependency.

[See more at https://www.npmjs.com/package/ts-node](https://www.npmjs.com/package/ts-node)

### `npm run build`

Compiles the TypeScript code to JavaScript code.

### `npm run createDatabase`

Creates a sample database from the `./json/facts.json` and `./json/pictures.json` files.



## Routes

### GET `/pictures/`

### POST `/pictures/`

### PATCH `/pictures/vote/up`

### PATCH `/pictures/vote/down`

### GET `/facts/`

Query fields: `amount`, `author`, `search`, `minScore`, `maxScore`

Rate limit: 120 requests per hour / 30 seconds between requests

Responses:
* (403 Forbidden) You're not allowed to request more than 100 facts at a time!
* (508 Loop Detected) No facts could be found for query ...
* (200 OK) *

### POST `/facts/`

Query fields: `content`, `author`

Rate limit: 1 request per day / 1 day between requests

Responses:
* (400 Bad Request) Missing fields.
* (400 Bad Request) This fact has already been submitted.
* (200 OK) *

### PATCH `/facts/vote/up`

Query fields: `id`

Rate limit: 1 request per hour / 1 hour between requests

Responses:
* (400 Bad Request) Invalid ID.
* (200 OK)
* (500 Internal Server Error) *

### PATCH `/facts/vote/down`

Query fields: `id`

Rate limit: 1 request per hour / 1 hour between requests

Responses:
* (400 Bad Request) Invalid ID.
* (200 OK)
* (500 Internal Server Error) *