require("dotenv").config(); // Load environment variables right at startup
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");
const globalRouter = require("./routes");

const app = express();

// 1. Connect to the Database
connectDB();

// 2. Setup Global Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allows frontend connection
app.use(express.json()); // Parses incoming JSON body requests (Crucial for CRUD)
app.use(cookieParser()); // Parses cookies for security authentication later

// 3. Mount all API Routes
app.use(
  "/certificates",
  express.static(path.join(__dirname, "../public/certificates")),
);
app.use("/api/v1", globalRouter);

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
