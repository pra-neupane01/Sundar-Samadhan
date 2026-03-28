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
const { notificationSchema } = require("./models/notificationModel");
const { municipalRequestSchema } = require("./models/municipalRequestModel");
const { checkOverdueComplaints } = require("./controllers/complaintController");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Static route for serving uploaded complaint/announcement images
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/v1/test", require("./routes/testRoute"));
app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/complaints", require("./routes/complaintRoute"));
app.use("/api/v1/announcements", require("./routes/announcementRoute"));
app.use("/api/v1/donations", require("./routes/donationRoute"));
app.use("/api/v1/user", require("./routes/userRoute"));
app.use("/api/v1/admin", require("./routes/adminRoute"));
app.use("/api/v1/notifications", require("./routes/notificationRoute"));

app.get("/", (req, res) => {
  res.status(200).send("Sundar Samadhan API is running");
});

const server = http.createServer(app);

// Socket.io initialization for real-time alerts and notifications
const io = new Server(server, {
  cors: {
    origin: "*", 
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
    
    // Trigger overdue check when officers/admin connect
    if (role === "municipal" || role === "admin") {
      checkOverdueComplaints(io);
    }
  });
});

// Inject io into app to access it from controllers
app.set("io", io);

const PORT = process.env.PORT || 4849;

/**
 * Initializes database schemas and starts the server
 */
const initializeDatabase = async () => {
  try {
    await userSchema();
    await complaintSchema();
    await announcementSchema();
    await donationSchema();
    await notificationSchema();
    await municipalRequestSchema();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("CRITICAL: Error initializing database schema:", error.message);
    process.exit(1);
  }
};

initializeDatabase();
