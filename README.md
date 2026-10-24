## D&D Character HP Mananger

This application includes a simple API for managing a Dungeons and Dragons character's hitpoints and temporary hitpoints.

The application includes an ExpressJS backend for intitializing and storing character data, and an API for healing, adding temporary hitpoints, and doing damage to your D&D Character

The application also includes a ReactJS frontend to both display your character's current health status, as well as a UI for modifying your character's HP by dealing damage to them, healing them, or providing them with temporary HP.

### Setup Backend

- From `ddb-backend-express` directory, run `npm install`, then `npm start`
- The server will be running at `localhost:8080`
  > It is important to insure the server port is not changed! The frontend is assuming that the API will be located at port 8080

### Setup Frontend

- From `ddb-frontend-react` directory, run `npm install`, then `npm start`
- Access the application at `localhost:5173` from your browser
  > Be sure that the Express API is running locally before running the frontend application
  > Ensure that the frontend is running on the default port 5173, otherwise requests from the frontend will encounter CORS errors and not function as intended
