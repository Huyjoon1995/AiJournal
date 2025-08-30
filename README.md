# AI Journal Analyzer

A full-stack web application that uses AI to analyze journal entries and provide insights about mood, summary, and reflection.

## Features

- **Authentication**: Secure login with Auth0
- **Journal Entry**: Write and submit journal entries
- **AI Analysis**: Get AI-powered analysis of your journal entries
- **History**: View your journal analysis history
- **Database**: Persistent storage of journal entries and analysis

## Tech Stack

- **Frontend**: React + TypeScript + Material-UI
- **Backend**: FastAPI + Python + SQLAlchemy
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: Auth0
- **AI**: OpenAI GPT-3.5-turbo

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Auth0 account
- OpenAI API key

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd aijournal
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd src/backend
pip install -r requirements.txt
```

### 4. Environment Configuration

Create a `.env` file in the `src/backend` directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./journal.db
```

### 5. Auth0 Configuration

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new application (Single Page Application)
3. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
   - **Allowed Logout URLs**: `http://localhost:3000`
4. Create a new API:
   - **Name**: `AI Journal API`
   - **Identifier**: `http://localhost:8000`
   - **Signing Algorithm**: `RS256`

## Running the Application

### Start the Backend Server
```bash
cd src/backend
python main.py
```
The backend will be available at: http://localhost:8000

### Start the Frontend Development Server
```bash
npm start
```
The frontend will be available at: http://localhost:3000

## Available Scripts

### Frontend Commands
- `npm start` - Runs the React app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Backend Commands
- `python main.py` - Starts the FastAPI server
- `uvicorn main:app --reload --port 8000` - Alternative way to start with auto-reload

## API Endpoints

- `POST /analyze-journal` - Analyze a journal entry
- `GET /journal-entries` - Get user's journal entries
- `GET /docs` - API documentation (Swagger UI)

## Database Schema

### Users Table
- `id` (Primary Key)
- `auth0_id` (Unique Auth0 identifier)
- `email` (User email)
- `name` (User name)
- `picture` (Profile picture URL)

### Journal Analysis Table
- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `journal_text` (Original journal text)
- `mood` (AI-detected mood)
- `summary` (AI-generated summary)
- `reflection` (AI-generated reflection)
- `created_at` (Timestamp)

## Troubleshooting

### Common Issues

1. **"Consent required" error**: Make sure your Auth0 API is properly configured with the correct audience (`http://localhost:8000`)

2. **Database errors**: Ensure the database file has proper write permissions

3. **OpenAI API errors**: Check your API key and billing status

4. **CORS errors**: The backend is configured to allow all origins in development

## Development

The application uses:
- **SQLAlchemy** for database ORM
- **python-jose** for JWT token verification
- **Material-UI** for React components
- **Auth0 React SDK** for authentication

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
