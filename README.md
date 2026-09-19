# Splitwise MVP

A simple expense sharing API built with Node.js, Express, PostgreSQL, and Prisma.

## Setup

```bash
1. npm install
```

2. Configure environment:
   Create a `.env` file from `.env.example` and add your PostgreSQL connection URL:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/splitwise"
```

3. Run migrations:

```bash
npx prisma migrate dev --name init
```

4. Create test users:

```bash
node createTestUsers.js
```

5. Start server:

```bash
npm run dev
```

## Authentication

As per the requirements, no full auth layer is implemented. Pass the user ID in the request header:

`x-user-id: <user_uuid>`

## API Endpoints

### Users

- `GET /api/v1/users/me` - View current user profile
- `PUT /api/v1/users/me` - Update email or default currency
- `DELETE /api/v1/users/me` - Delete user account

### Expenses

- `POST /api/v1/expenses` - Create an expense with split members
- `GET /api/v1/expenses` - List all expenses (supports `?filter=current_month`, `last_month`, `date_range&from=YYYY-MM-DD&to=YYYY-MM-DD`)
- `GET /api/v1/expenses/:id` - View single expense details
- `PUT /api/v1/expenses/:id` - Update expense and splits (creator only)
- `DELETE /api/v1/expenses/:id` - Delete expense (creator only)

### Balances

- `GET /api/v1/balances` - View net balances owed to/by all other users
