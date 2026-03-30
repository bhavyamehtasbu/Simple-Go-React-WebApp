Perfect! Here’s your README section with the new features integrated in a way that fits cleanly with the existing structure:

---

# Simple-Go-React-WebApp - User Security Audit Dashboard

This project has two parts:

* `frontend`: React app for viewing and exporting user security data.
* `backend`: Go API that serves user records from a local JSON data source.

## Setup Instructions

### Prerequisites

* Node.js 18+ and npm
* Go 1.21+

### Install Dependencies

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Prepare backend modules:

```bash
cd backend
go mod tidy
```

## How to Run Frontend and Backend Locally

Run each service in its own terminal.

### Terminal 1: Start Backend

```bash
cd backend
go run .
```

Backend will run on `http://localhost:8080`.
API endpoint: `http://localhost:8080/api/users`

### Terminal 2: Start Frontend

```bash
cd frontend
npm start
```

### Terminal 3: Run Tests

```bash
cd backend
go test ./services -v
```

Frontend will run on `http://localhost:3000`.
The frontend fetches data from `http://localhost:8080/api/users`.

## Design / Architecture Notes and Tradeoffs

* Separation of concerns: Backend handles data loading and API delivery; frontend handles display, filtering, sorting, and export.
* Backend routing: Routes are registered centrally in `backend/routes/routes.go`, which keeps `main.go` focused on server setup.
* Data source choice: Backend reads from a local `db.json`, which is simple for local development but not ideal for concurrent writes or production persistence.
* CORS policy: CORS currently allows all origins (`*`) for easy local integration; this should be restricted in production.
* API configuration: Frontend currently calls a hardcoded backend URL (`http://localhost:8080`), which is easy locally but less flexible than environment-based config.
* Client-side operations: Filtering/sorting/export are done in the browser for simplicity and responsiveness on small datasets; for larger datasets, server-side pagination/filtering would scale better.

## Features Added

* **Password Age Highlighting**
  Users who have accessed their password more than **90 days ago** are visually highlighted in the dashboard, making it easy to identify potential security risks.

* **Column Sorting**
  Added sorting functionality across **all columns**, allowing users to quickly organize and analyze data based on different attributes (e.g., last login, username, risk level).

* **Export to Excel**
  Users can now export the displayed dataset to an **Excel file**, enabling offline analysis and reporting.
