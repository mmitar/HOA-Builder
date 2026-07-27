# Community Notes Application
A full-stack development exercise. Practical application of model relationships, coding principles, and lightweight technologies. 

**Technology requirements**
- Frontend: React or Next.js with TypeScript
- Backend: Python with FastAPI
- Database: SQLite or another simple persistent database

**Functional requirements**
The application must:
- Display a list of communities.
- Allow the user to select a community.
- Display the selected community’s existing notes.
- Allow the notes to be edited and saved.
- Save changes through the backend API.
- Preserve saved notes after the page is refreshed or the application is restarted.
- Display appropriate loading, success, and error states.
- Prevent blank notes from being saved.
- Limit notes to 500 characters.
- Include at least one backend automated test.

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
     . .venv/Scripts/activate
     ```

3. **Install Python dependencies**:
   ```bash
   pip install fastapi uvicorn sqlalchemy sqlmodel httpx2 pytest
   ```
   Run `pip config unset global.index-url` if your pip index needs to be reset.

   Unit Tests automatically run on server start-up . To indepedently run all tests: `python -m pytest tests`


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

## Project Features

- Persisted CRUD operations
- Decoupled MVC Framework
- Microservice architecture
- Single Page Application
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
- Success / Error notifications inform the user of the request result. Loading icons communicate data is getting fetched.
- Backend and Frontend can standup indepedently. UI is consistent between desktop and mobile view.
- Start with the backend as the foundation for content management and content delivery.

## Future Scope

- Pagination
- List Filters and Sorts
- JWT Authentication
- Configurable communitity ammenities, ammentity types, and community types.
- Selenium Regression Testing
- Meta-data and audit log history
- Access Control list
- Logger Framework
- Scoped CSS