# UFC Betting System

## Points Calculation System

The system automatically calculates points for users based on their betting predictions compared to actual fight results.

### How Points Are Awarded

For each fight prediction, users can earn points based on the following criteria:

- **10 points** for correctly predicting the winner
- **5 points** for correctly predicting the method of victory (KO, submission, decision, etc.)
- **5 points** for correctly predicting the round in which the fight ended

### API Endpoints

#### Calculate Points for an Event
```
POST /api/pontos
Content-Type: application/json

{
  "id_evento": 1
}
```

This endpoint:
1. Retrieves all actual results for the specified event from `tbl_vencedores_ufc`
2. Retrieves all user bets for the event from `tbl_apostas_ufc`
3. Compares each user's predictions with actual results
4. Awards points based on correct predictions
5. Updates each user's total points in `tbl_cliente`

#### Get Points for a Specific Client
```
GET /api/pontos/{id_cliente}
```

Returns the current points for a specific client.

#### Get Ranking of All Clients
```
GET /api/pontos/ranking/todos
```

Returns a list of all clients ordered by points (highest to lowest).

### Database Tables

- `tbl_apostas_ufc`: User betting predictions
- `tbl_vencedores_ufc`: Actual fight results
- `tbl_cliente`: User information with points

### Example Usage

1. After an event ends, add the actual results to `tbl_vencedores_ufc`
2. Call the points calculation endpoint with the event ID
3. The system will automatically calculate and update all user points
4. Use the ranking endpoint to display leaderboards

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