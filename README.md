# Scrapper Project

This project is a fullstack application designed to scrape data from Freepik, specifically targeting assets from the @freepik author. The scraped asset names will be saved in a CSV file, which will then be used to generate images using AI tools like Leonardo AI or Gemini.

## Project Structure

The project is divided into two main parts: the client and the server.

### Client

The client is built using React and TypeScript. It handles the user interface and communicates with the server to perform scraping and image generation tasks.

- **public/index.html**: Main HTML file for the React application.
- **src/components/App.tsx**: Main React component managing layout and routing.
- **src/services/api.ts**: Functions for making API calls to the backend.
- **src/App.tsx**: Entry point for the React application.
- **src/index.tsx**: Renders the main App component into the DOM.
- **src/styles/App.css**: CSS styles for the application.
- **package.json**: Configuration file for the client-side application.
- **tsconfig.json**: TypeScript configuration file for the client-side application.

### Server

The server is built using Node.js and TypeScript. It handles the scraping logic and serves the API endpoints for the client.

- **src/controllers/scrapperController.ts**: Contains methods for handling scraping requests.
- **src/routes/scrapperRoutes.ts**: Sets up routes for scraping functionality.
- **src/services/scrapperService.ts**: Methods for scraping data from Freepik.
- **src/utils/csvWriter.ts**: Utility functions for writing data to a CSV file.
- **src/index.ts**: Entry point for the Node.js server, setting up the Express app and routes.
- **package.json**: Configuration file for the server-side application.
- **tsconfig.json**: TypeScript configuration file for the server-side application.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd scrapper
   ```

2. **Install dependencies**:
   - For the client:
     ```
     cd client
     npm install
     ```
   - For the server:
     ```
     cd server
     npm install
     ```

3. **Run the server**:
   ```
   cd server
   npm start
   ```

4. **Run the client**:
   ```
   cd client
   npm start
   ```

## Usage

- Access the client application in your browser at `http://localhost:3000`.
- Use the provided UI to initiate scraping and image generation tasks.

## Future Enhancements

- Implement user authentication for personalized scraping.
- Add more options for image generation tools.
- Improve error handling and logging for scraping processes.

## License

This project is licensed under the MIT License.