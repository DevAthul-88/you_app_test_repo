## Folder Structure
```
repo/
│-- frontend/   # Next.js application
│-- backend/    # NestJS API
```

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

### 2. Setup Frontend (Next.js)
```bash
cd frontend
npm install  # Install dependencies
npm run dev  # Start development server
```
By default, the frontend runs on `http://localhost:3000`.

### 3. Setup Backend (NestJS)
```bash
cd ../backend
npm install  # Install dependencies
npm run start:dev  # Start development server
```
By default, the backend runs on `http://localhost:5000`.

## Authentication Status
- **NestJS API for authentication is not yet implemented in the frontend.**
- Currently, the frontend does not interact with the backend for auth.
- Future updates will include integrating Next.js with the NestJS API for authentication.

## Environment Variables
Each app requires environment variables. Create a `.env` file in both `frontend/` and `backend/` folders.

### Frontend (`frontend/.env`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (`backend/.env`)
```
PORT=5000
DATABASE_URL=your_database_url_here
JWT_SECRET=your_secret_key
```
