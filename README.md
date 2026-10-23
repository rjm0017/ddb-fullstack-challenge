### Setup Backend

- From backend directory, run `npm install`, then `node start`
- Default port is 8080, can be changed with an .env file with a PORT variable if needed
  - Be sure to create the .env in the backend directory if doing so
    > Do not set this port to 5173, or the frontend application will not run properly

### Setup Frontend

- Run `npm install` from the `frontend` directory
- Start the app by running `npm start` from the `frontend` directory
- Access the application at `localhost:5173` from your browser
  > Be sure that the Express API is running locally before running the frontend application, and ensure it is not running on port 5173
  > Also ensure that the frontend is running on the default port 5173, otherwise requests from the frontend will likely encounter CORS errors, and not function as intended
