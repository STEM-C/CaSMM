# Server

The server is composed of two parts: the admin panel and the api. It is built on top of [Strapi](https://strapi.io/documentation/3.0.0-beta.x/getting-started/introduction.html), a headless content management system. The file structure is documented [here](https://strapi.io/documentation/3.0.0-beta.x/concepts/file-structure.html#files-structure).

<br/>

## Setup

### Installation

#### Server

`yarn install`

#### Database 

1. Create a new container for the db `docker run --name strapi-dev -p 3306:3306 -e MYSQL_ROOT_PASSWORD=pass -d mysql:latest  `

2. Login to the running instance `docker exec -it strapi-dev bin/bash`
3. Login to MySQL `mysql -u root -p` 
4. Alter the connection settings `ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'pass';`
5. Create the database `create database strapi;`
6. Exit out to the host terminal `exit` (twice)
7. Import the database `docker exec -i strapi-dev mysql -uroot -ppass strapi < /Path/to/file/strapi.sql`

### Developing

`yarn develop`

<br/>

## API `/`

Built with [Node](https://nodejs.org/en/), [Koa](https://github.com/koajs/koa#readme), and [Bookshelf](https://bookshelfjs.org/), the REST API enables CRUD functionality with the application's content. Authentication is enabled via JWTs. The current database is sqlite3 running locally.

### Entity Relationships

The content available via the API is modeled as follows. 

![ER Digram](er_diagram.png)

### Endpoints

Each endpoint corresponds to an entity from the ER digram, a content type in the admin panel, a folder in the `./api` directory, and a database table. 

| Endpoint            | Note |
| ------------------- | ---- |
| activities          |      |
| blocks              |      |
| blocks-categories   |      |
| complexities        |      |
| difficulties        |      |
| learning-categories |      |
| models              |      |
| topics              |      |
| types               |      |

Each and every endpoint can be interacted with by using the following method and path combinations. 

| Method | Path              | Description           |
| ------ | ----------------- | --------------------- |
| GET    | /{endpoint}       | Get a list of entries |
| GET    | /{endpoint}/:id   | Get a specific entry  |
| GET    | /{endpoint}/count | Count entries         |
| POST   | /{endpoint}       | Create a new entry    |
| DELETE | /{endpoint}/:id   | Delete an entry       |
| PUT    | /{endpoint}/:id   | Update an entry       |

Read the full [documentation](https://strapi.io/documentation/3.0.0-beta.x/content-api/api-endpoints.html#api-endpoints) on the api endpoints.

<br/>

## Admin Panel `/admin`

Built with [React](https://reactjs.org/) and served by [Node](https://nodejs.org/en/), the admin panel allows for full customization of the server. Here you can create new content types and their corresponding endpoints, configure roles and permissions, and much more. The interface itself can be customized and configured as needed.

Read the full [documentation](https://strapi.io/documentation/3.0.0-beta.x/admin-panel/customization.html) on the admin panel.