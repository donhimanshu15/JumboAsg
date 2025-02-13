const WebSocket = require("ws");

// Replace with your server URL
const socket = new WebSocket("ws://localhost:3000");
console.log("🚀 ~ socket:", socket)

// Handle connection open
socket.on("open", () => {
  console.log("Connected to WebSocket server");

  // Simulate joining a game session
  socket.send(
    JSON.stringify({
      type: "join",
      gameSessionId: "6649cf0c10b20100122345680",
      playerId: "6649cf0c10b20100122345678",
    })
  );
});

// Handle incoming messages
socket.on("message", (data) => {
  const message = JSON.parse(data);
  console.log("Received message:", message);

  if (message.type === "question:send") {
    // Simulate answering a question
    const answer = "Paris"; // Replace with actual answer
    socket.send(
      JSON.stringify({
        type: "answer:submit",
        gameSessionId: "6649cf0c10b20100122345680",
        playerId: "6649cf0c10b20100122345678",
        answer: answer,
      })
    );
  } else if (message.type === "game:end") {
    console.log("Game ended. Winner:", message.winner);
  }
});

// Handle errors
socket.on("error", (error) => {
  console.error("WebSocket error:", error);
});

// Handle connection close
socket.on("close", () => {
  console.log("WebSocket connection closed");
});