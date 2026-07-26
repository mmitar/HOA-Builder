# Community Notes Application
A full-stack development exercise. Practical application of model relationships, coding principles, and lightweight technologies.

> SETUP Instructions Below

## Project Features

- CRUD operations
- Decoupled MVC Framework
- Microservices
- Mobile Friendly
- Functional Requirements enforced client-side and server-side
- Parent-child relationship mapping
- Re-usable infrastructure
- CORS Compliance

## Development Methodology

- DRY principles, encapsulation, and separation of concerns.
- Explicit type casting and business logic so the intepreter can validate payload and automatically update API documentation.
- Testing affected functionality after every code change.
- Features are loosely coupled and relatively independent despite utility functions and single source db connections.
- Error messages are clear and raise the respective error.
- Backend and Frontend can standup indepedently. UI is consistent between desktop and mobile view.
- Start with the backend as the foundation for content management and content delivery.

## User Flow

- User opens the app
  - Frontend loads `/communities`
  - Community list renders
- User selects a community
  - Frontend requests `GET /communities/{community_id}`
  - Detail panel shows community fields
  - User can:
    - Edit community
      - Form submits `PUT /communities/{community_id}`
      - Backend validates `community_notes` length
    - Delete community
      - Confirm dialog sends `DELETE /communities/{community_id}`
- User creates a new community
  - Fill the form
  - Submit sends `POST /communities`
  - Backend rejects duplicate `name`
- Backend startup
  - Initializes SQLite schema
  - Optionally seeds mock data in DEV mode

---

## Setup

This project uses SQLite for the database (stored as a `.db` artifact locally) and loads with mock data during initialization. Follow the steps below to get both the backend and frontend running.

### Prerequisites
- Python 3.10+ (tested with Python 3.14)
- Node.js 16+ and npm
- Git

### Backend Setup

1. **Create a virtual environment** (optional but recommended for containerization):
   ```bash
   cd backend
   python -m venv .venv
   ```

2. **Activate the virtual environment**:
   - On macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```
   - On Windows:
     ```bash
     .venv\Scripts\activate
     ```

3. **Install Python dependencies**:
   ```bash
   pip install fastapi uvicorn sqlalchemy sqlmodel
   ```

4. **Run the backend server**:
   ```bash
   pwd # nav to backend directory if not `cd backend`
   python main.py
   ```
   The API will be available at `http://localhost:8000` with documentation at `http://localhost:8000/docs`.

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the front end**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

---

## Run Unit Tests
    ```bash
    pip install httpx2
    pip install pytest
    cd backend
    python -m pytest tests
    ```
---

## Future Scope

- Pagination
- List Filters and Sorts
- Address Validation
- JWT Authentication
- Configurable communitity ammenities, ammentity types, and community types.
- Selenium Regression Testing
- Meta-data and audit log history
- Access Control list based on operations
- Revise Notes API foreign key constriant checks