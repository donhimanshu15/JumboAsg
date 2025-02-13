Quiz Game Backend
This is the backend for a real-time quiz game where two players compete against each other. The backend is built using Node.js, MongoDB, and WebSockets. It supports user authentication, real-time question delivery, answer validation, scoring, and game session management.

Features
User Authentication:

Register and login with JWT-based authentication.

Game Session Management:

Start a new game session and match two players.

Real-Time Question Delivery:

Send questions to players in real-time using WebSockets.

Answer Validation and Scoring:

Validate player answers and update scores in real-time.

Result Calculation:

Determine the winner at the end of the game and store the results.



Setup Instructions
1. Clone the Repository
bash
Copy
git clone https://github.com/your-username/quiz-game-backend.git
cd quiz-game-backend
2. Install Dependencies
bash
Copy
npm install
3. Set Up Environment Variables
Create a .env file in the root directory and add the following variables:

env
Copy
PORT=3000
MONGODB_URI=mongodb://localhost:27017/quiz-game
JWT_SECRET=your_jwt_secret_key
4. Start MongoDB
Ensure MongoDB is running on your system. You can start it using:

bash
Copy
mongod
5. Run the Application
bash
Copy
node server.js
The backend will start at http://localhost:3000.

