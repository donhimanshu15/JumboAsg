const http = require("http");
const socketIo = require("socket.io");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const GameSession = require("./models/GameSession");
const Question = require("./models/Question");
const dotenv = require("dotenv");

dotenv.config();
const connect_db = async () => {
    try {
      const connect = await mongoose.connect(`${process.env.MONGODB_URI}`);
      console.log("connected to mongo db");
    } catch (error) {
      console.log("error connecting to database", error.message);
    }
  };
  connect_db();
const app = require("./app");
const server = http.createServer(app);


const wss = new WebSocket.Server({ server });
const currentQuestionIndex = {};

wss.on("connection", (socket) => {
  console.log("New client connected");


  socket.on("message", async (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === "join") {
        const { gameSessionId, playerId } = message;
        console.log(`Player ${playerId} joined game session ${gameSessionId}`);

      
        const gameSession = await GameSession.findById(gameSessionId);
        if (!gameSession) {
          throw new Error("Game session not found");
        }


        currentQuestionIndex[gameSessionId] = 0;

        const firstQuestionId = gameSession.questions[0];
        const firstQuestion = await Question.findById(firstQuestionId);

        socket.send(
          JSON.stringify({
            type: "question:send",
            gameSessionId,
            question: firstQuestion,
          })
        );
      }


      if (message.type === "answer:submit") {
        const { gameSessionId, playerId, answer } = message;

        const gameSession = await GameSession.findById(gameSessionId);
        const questionId = gameSession.questions[currentQuestionIndex[gameSessionId]];
        const question = await Question.findById(questionId);


        if (answer === question.correctAnswer) {
          if (playerId === gameSession.player1.toString()) {
            gameSession.scores.player1++;
          } else if (playerId === gameSession.player2.toString()) {
            gameSession.scores.player2++;
          }
        }

        await gameSession.save();

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "score:update",
                gameSessionId,
                scores: gameSession.scores,
              })
            );
          }
        });

   
        currentQuestionIndex[gameSessionId]++;

 
        if (currentQuestionIndex[gameSessionId] === gameSession.questions.length) {

          const winner =
            gameSession.scores.player1 > gameSession.scores.player2
              ? gameSession.player1
              : gameSession.scores.player2 > gameSession.scores.player1
              ? gameSession.player2
              : null;

          gameSession.winner = winner;
          await gameSession.save();

    
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "game:end",
                  gameSessionId,
                  winner,
                  scores: gameSession.scores,
                })
              );
            }
          });
        } else {
    
          const nextQuestionId = gameSession.questions[currentQuestionIndex[gameSessionId]];
          const nextQuestion = await Question.findById(nextQuestionId);
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "question:send",
                  gameSessionId,
                  question: nextQuestion,
                })
              );
            }
          });
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
      socket.send(
        JSON.stringify({
          type: "error",
          message: error.message,
        })
      );
    }
  });

  // Handle client disconnection
  socket.on("close", () => {
    console.log("Client disconnected");
  });
});


server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
