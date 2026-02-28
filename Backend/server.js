const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const { userSchema } = require("./models/userSchema");
const { complaintSchema } = require("./models/complaintsModel");
const { announcementSchema } = require("./models/announcementModel");
const { donationSchema } = require("./models/donationModel");
const { checkOverdueComplaints } = require("./controllers/complaintController");

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
app.use("/api/v1/announcements", require("./routes/announcementRoute"));
app.use("/api/v1/donations", require("./routes/donationRoute"));
app.use("/api/v1/admin", require("./routes/adminRoute"));

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

io.on("connection", (socket) => {
  socket.on("joinUser", (userId) => {
    socket.join(userId);
  });

  socket.on("joinWard", (wardNumber) => {
    socket.join(`ward_${wardNumber}`);
  });

  socket.on("joinRole", (role) => {
    socket.join(`${role}_room`);
  });

  checkOverdueComplaints(io);
});

// Make io globally available
app.set("io", io);

const PORT = process.env.PORT || 4849;

const initializeDatabase = async () => {
  try {
    await userSchema();
    await complaintSchema();
    await announcementSchema();
    await donationSchema();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing database schema:", error.message);
    process.exit(1);
  }
};

initializeDatabase();
