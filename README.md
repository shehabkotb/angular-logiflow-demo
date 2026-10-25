# LogiFlow

A small inventory / warehouse dashboard built with Angular, made as a demo project.
You can log in, see stock numbers on the dashboard, manage products (search, filter,
sort, add, edit, delete), follow shipments and edit supplier contacts.
The data comes from a local fake REST API (`json-server`) that reads `db.json`.

## Stack

- Angular 19 - standalone components, signals, `@if` / `@for` / `@switch`
- RxJS
- Bootstrap 5 (CSS only) + SCSS
- json-server 0.17 as the mock backend
- Jasmine + Karma for unit tests, ESLint for linting

## Getting started

You need [Node.js](https://nodejs.org/) (LTS).

```bash
npm install

# terminal 1 - mock API on http://127.0.0.1:3000
npm run api

# terminal 2 - app on http://127.0.0.1:4200
npm start
```

Open http://127.0.0.1:4200 and log in with `admin` / `admin123`.

The API has to be running, otherwise the pages show "Could not load data".
Adding, editing and deleting products writes to `db.json` - run `git checkout db.json`
to get the original data back.

## Scripts

| Command         | What it does                         |
|-----------------|--------------------------------------|
| `npm start`     | Dev server on http://127.0.0.1:4200  |
| `npm run api`   | json-server on http://127.0.0.1:3000 |
| `npm test`      | Unit tests (Karma + Chrome)          |
| `npm run lint`  | ESLint                               |

## Project structure

```
db.json              mock data (products, shipments, suppliers)
src/app/
  core/              auth service, guard, interceptor, notifications
  models/            Product, Shipment, Supplier
  services/          inventory, shipment and supplier services
  shared/            card, modal, notification banner, stock highlight directive
  validators/        SKU validator
  layout/            sidebar + header
  pages/             login, dashboard, inventory, shipments, suppliers
```
