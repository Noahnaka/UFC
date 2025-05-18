# UFC API Project

## Dependencies

### Core Dependencies
```bash
npm install express dotenv swagger-ui-express swagger-jsdoc cors pg jsonwebtoken bcrypt axios cheerio
```

- `express`: Web framework
- `dotenv`: Environment variables management
- `swagger-ui-express`: Swagger UI for API documentation
- `swagger-jsdoc`: Swagger documentation generator
- `cors`: Cross-Origin Resource Sharing
- `pg`: PostgreSQL client
- `jsonwebtoken`: JWT authentication
- `bcrypt`: Password hashing
- `axios`: HTTP client
- `cheerio`: HTML parsing

### Development Dependencies
```bash
npm install nodemon --save-dev
```

- `nodemon`: Auto-restart server during development

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
```

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the server:

For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm start
```

3. Access Swagger UI:
```
http://localhost:3000/api/docs
```

## Project Structure

```
├── backend/
│   ├── control/         # Controllers
│   ├── middleware/      # Middleware functions
│   ├── model/          # Database models
│   └── router/         # API routes
├── Servidor.js         # Main server file
├── app.js             # Express application setup
└── .env               # Environment variables
```

## API Documentation

The API documentation is available through Swagger UI at `/api/docs` when the server is running. The documentation is automatically generated from the JSDoc comments in the route files. 