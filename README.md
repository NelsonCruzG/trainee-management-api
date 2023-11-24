# Trainee program management API

Description:
**_This project allows its users to manage the trainee program. Depending on their roles they can carry out tasks such as creating executions, programs, modules, assignments, themes, resources and perform actions with them._**

## Core:

- NestJs v8.1.5🐱
- Typeorm v0.2.41 🔥
- dotenv v10.0
- Docker v20.10.10🐋
- Docker-compose v1.29.2🚢
- Pg 8.7.1 🐘
- Swagger-ui-express v4.2.0
- NodeJs v16.10.0 🍃

## How install?

Clone github repo then install

```bash
$ npm install
```

## How to run migrations?

Generate a migration

```bash
$ npm run migration:generte {name_migration}
```

Run migration

```bash
$ npm run migration:run
```

Revert migration

```bash
$ npm run migration:revert
```

## How to use Docker-compose?

Build the container

```bash
$ docker-compose build
```

Start docker-compose

```bash
$ docker-compose up
```

Remove the container

```bash
$ docker-compose down
```

## How to log in?

`http://127.0.0.0:8080/login`
