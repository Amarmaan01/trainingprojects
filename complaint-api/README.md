
A backend REST API built with Node.js and Express.js for handling complaints.
## Features
 * In-memory data storage (no database)
 * ✅ Clean architecture with controllers and routes separation
 * ✅ ES Modules (import/export)
 * ✅ Middleware implementation (logger and auth)
 * ✅ RESTful API endpoints

## Project Structure
complaint-api/
├── server.js                    # Server entry point
├── app.js                       # Express app configuration
├── routes/
│   └── complaint.routes.js      # Route definitions
├── controllers/
│   └── complaint.controller.js  # Business logic
├── middleware/
│   ├── logger.middleware.js     # App-level logger
│   └── auth.middleware.js       # Router-level auth
└── package.json

### GET /complaints


**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Server Issue",
      "description": "Server is down",
      "status": "open"
    }
  ]
}
```

#### Create New Complaint
``` http
POST /complaints
Content-Type: application/json

{
  "title": "Server Issue",
  "description": "Server is not responding"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Complaint created successfully",
  "data": {
    "id": 1,
    "title": "Server Issue",
    "description": "Server is not responding",
    "status": "open"
  }
}
```