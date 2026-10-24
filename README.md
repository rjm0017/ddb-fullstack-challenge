## D&D Character HP Mananger

This application is a simple API for managing a Dungeons and Dragons character's hitpoints and temporary hitpoints, with an associated web application for managing your HP with a UI.

The application includes an ExpressJS API backend for intitializing and storing character data, and for adding temporary hitpoints, and doing damage to your D&D Character.

The application also includes a ReactJS + TypeScript frontend to display your character's current health status, as well as a UI for modifying your character's HP by dealing damage to them, healing them, or providing them with temporary HP.

## Installation and Setup

### Backend

- From `ddb-backend-express` directory, run the following:

```
npm install
npm start
```

- The server will be running at `localhost:8080`
  > It is important to insure the server port is not changed! The frontend is assuming that the API will be located at port 8080

### Frontend

- From `ddb-frontend-react` directory, run the following:

```
npm install
npm run build
npm run preview
```

- Access the application at `localhost:4173` from your browser

  > Ensure the Express API is running locally before running the frontend application

  > Ensure that the frontend is running on the default port, otherwise requests from the frontend will encounter CORS errors and not function as intended
