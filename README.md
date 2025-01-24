# DetalBee Home Task

A full-stack project with a **Django backend** and a **React frontend**, orchestrated with Docker. This project enables efficient task management using SQLite as the database and includes containerized services for streamlined deployment.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technologies Used](#technologies-used)
3. [Setup and Installation](#setup-and-installation)
4. [Running the Application](#running-the-application)
5. [Testing](#testing)
6. [API Endpoints](#api-endpoints)
7. [Environment Variables](#environment-variables)

---

## Project Structure

```
DetalBee_HomeTask/
├── dailynotes_api/         # Django backend
│   ├── authentication/     # Authentication module
│   ├── notes/              # Notes application logic
│   ├── media/              # Uploaded media files
│   ├── DockerFile          # Dockerfile for the backend
│   ├── db.sqlite3          # SQLite database
│   ├── requirements.txt    # Backend dependencies
│   └── manage.py           # Django project entry point
├── dailynotes-ui/          # React frontend
│   ├── src/                # React source files
│   ├── DockerFile          # Dockerfile for the frontend
│   ├── package.json        # Frontend dependencies
│   └── build/              # Build files (after running npm build)
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # Project documentation
```

---

## Technologies Used

### Backend:
- **Django**: Python framework for the backend API.
- **SQLite**: Lightweight database for local development.
- **pytest**: Testing framework for the backend.

### Frontend:
- **React**: JavaScript library for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for styling.

### Deployment and Development:
- **Docker**: Containerization for the backend and frontend.
- **Docker Compose**: Simplified multi-service orchestration.

---

## Setup and Installation

### Prerequisites:
1. **Install Docker**: [Get Docker](https://www.docker.com/products/docker-desktop)
2. **Install Node.js**: [Get Node.js](https://nodejs.org/)

### Clone the Repository:
```bash
git clone https://github.com/your-username/DetalBee_HomeTask.git
cd DetalBee_HomeTask
```

---

## Running the Application

### Using Docker Compose:
1. **Build and start containers**:
   ```bash
   docker-compose up --build
   ```

2. **Access the application**:
   - **Frontend**: `http://localhost:3000`
   - **Backend**: `http://localhost:8000`

3. **Stopping containers**:
   ```bash
   docker-compose down
   ```

---

## Testing

### Backend (Django):
Run backend tests with `pytest`:
```bash
cd dailynotes_api
pytest
```

### Frontend (React):
Run frontend tests with `npm`:
```bash
cd dailynotes-ui
npm test
```

---

## API Endpoints

| Method | Endpoint               | Description             |
|--------|------------------------|-------------------------|
| POST   | `/api/auth/login`      | Log in a user           |
| GET    | `/api/notes/`          | Retrieve all notes      |
| POST   | `/api/notes/`          | Create a new note       |
| PUT    | `/api/notes/<id>`      | Update an existing note |
| DELETE | `/api/notes/<id>`      | Delete a note           |

---

## Environment Variables

### Backend (`dailynotes_api`):
Create a `.env` file in the `dailynotes_api` directory with the following:
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (`dailynotes-ui`):
Create a `.env` file in the `dailynotes-ui` directory with the following:
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

---


