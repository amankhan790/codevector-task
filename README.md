# CodeVector Products API

A small Node.js backend to browse ~200,000 products with fast, stable pagination and optional category filtering. Includes a minimal web UI for browsing.

## Features

- **Large dataset** — Seed script inserts 200,000 products in batches (5,000 per batch)
- **Newest first** — Products sorted by `updatedAt` (most recently updated first)
- **Category filter** — Filter by Electronics, Books, Clothing, Sports, or Home
- **Cursor pagination** — Fast on large collections; no slow `skip`/`offset`
- **Stable while data changes** — New or updated products do not cause duplicates or skipped rows while browsing
- **Indexed queries** — MongoDB compound indexes for unfiltered and category-filtered pagination
- **Health check** — `GET /health` reports API and database status
- **Browse UI** — Simple table at `/` with category filter and Previous/Next navigation

## Tech stack

- Node.js + Express
- MongoDB + Mongoose
- Vanilla HTML/JS UI (static)

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd codeVector Task
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

For MongoDB Atlas, allow your IP under **Network Access** (or `0.0.0.0/0` for development).

### 3. Seed the database

Inserts 200,000 products. If products already exist, numbering continues from the current count (e.g. after 200,000 → starts at Product 200001).

```bash
npm run seed
```

To insert fewer products, change `TOTAL_TO_INSERT` in `src/seed.js` before running seed.

### 4. Run locally

**Production:**

```bash
npm start
```

**Development (auto-reload):**

```bash
npm run dev
```

Server runs on `http://localhost:3000` (or `PORT` from environment).

## API endpoints

### List products

```
GET /api/products
```

**Query parameters:**

| Parameter  | Required | Default | Description                                      |
|------------|----------|---------|--------------------------------------------------|
| `limit`    | No       | `20`    | Page size (min `1`, max `100`)                   |
| `category` | No       | —       | Filter by category (e.g. `Electronics`)          |
| `cursor`   | No       | —       | Opaque token from previous response `nextCursor` |

**Example requests:**

```bash
# First page
GET /api/products?limit=20

# Filter by category
GET /api/products?category=Books&limit=20

# Next page (use nextCursor from previous response)
GET /api/products?limit=20&cursor=eyJ1cGRhdGVkQXQiOi...
```

**Example response:**

```json
{
  "products": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Product 200000",
      "category": "Sports",
      "price": 10026,
      "createdAt": "2026-06-23T15:10:18.000Z",
      "updatedAt": "2026-06-23T15:10:18.000Z"
    }
  ],
  "nextCursor": "eyJ1cGRhdGVkQXQiOi...",
  "hasMore": true
}
```

**Error responses:**

| Status | When                          |
|--------|-------------------------------|
| `400`  | Invalid `cursor`              |
| `500`  | Internal server error         |

## Web UI

Open the root URL in a browser after starting the server:

```
http://localhost:3000
```

Use the category dropdown and **Apply** to filter. **Previous** / **Next** navigate pages using the same cursor pagination as the API.

## Project structure

```
├── public/
│   └── index.html          # Browse UI
├── src/
│   ├── controller/
│   │   └── product.controller.js
│   ├── db/
│   │   └── db.js           # MongoDB connection
│   ├── model/
│   │   └── product.model.js
│   ├── routes/
│   │   ├── health.route.js
│   │   └── product.route.js
│   ├── seed.js             # Database seed script
│   └── app.js
├── server.js
├── render.yaml
└── package.json
```

## Pagination design

Pagination uses a **cursor** based on `(updatedAt, _id)` instead of page numbers or offsets.

- **Fast** — MongoDB uses indexes; no scanning skipped rows
- **Stable** — If new products are added while a user browses, they only appear on future pages; already-fetched pages do not shift or duplicate

## Scripts

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm start`    | Start the server                     |
| `npm run dev`  | Start with nodemon (dev)             |
| `npm run seed` | Seed / append products to MongoDB    |
