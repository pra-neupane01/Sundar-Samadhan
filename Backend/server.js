const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const { userSchema } = require("./models/userSchema");
const { complaintSchema } = require("./models/complaintsModel");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1/test", require("./routes/testRoute"));
app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/complaints", require("./routes/complaintRoute"));

app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // change in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Basic socket connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Make io globally available
app.set("io", io);

const PORT = process.env.PORT || 4849;

const initializeDatabase = async () => {
  try {
    await userSchema();
    await complaintSchema();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing database schema:", error.message);
    process.exit(1);
  }
};

initializeDatabase();
