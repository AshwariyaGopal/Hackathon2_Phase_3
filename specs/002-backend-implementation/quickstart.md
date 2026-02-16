# Backend Implementation Quickstart

**Feature**: Backend Complete Implementation & Frontend Integration
**Branch**: `002-backend-implementation`

## Prerequisites

- Python 3.12+
- `pip` or `poetry`
- Neon PostgreSQL account and `DATABASE_URL`
- `BETTER_AUTH_SECRET` (shared with frontend)

## Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install fastapi uvicorn sqlmodel python-dotenv pyjwt passlib[bcrypt] psycopg
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` root:
   ```env
   DATABASE_URL=your_neon_db_url
   BETTER_AUTH_SECRET=your_shared_secret
   BETTER_AUTH_URL=http://localhost:3000
   ```

## Development

1. **Start the FastAPI server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

2. **Access API Documentation**:
   Visit `http://localhost:8000/docs` in your browser.

## Integration Testing

To test with the frontend:
1. Ensure the backend is running on port 8000.
2. Start the Next.js frontend on port 3000.
3. Login via the frontend UI.
4. Verify that task operations from the UI are reflected in the database.
