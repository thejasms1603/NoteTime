const connectToDatabase = require("./mongodb/dbconnect");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { z } = require("zod"); // Import zod

const app = express();
const PORT = 8080;

const User = require("./models/user.model");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
connectToDatabase();

// Define Zod Schemas
const userCreationSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const userLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Zod Validation Middleware
const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // Validate the request body
    next(); // Proceed if validation passes
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: err.errors.map((e) => e.message).join(", "), // Combine all error messages
    });
  }
};

// Routes
app.post(
  "/create-account",
  validateRequest(userCreationSchema),
  async (req, res) => {
    try {
      const { fullName, email, password } = req.body;

      // Check if the user already exists
      const isUser = await User.findOne({ email });
      if (isUser) {
        return res.status(400).json({
          error: true,
          message: "User already exists",
        });
      }

      // Save new user to the database
      const user = new User({ fullName, email, password });
      await user.save();

      const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "360000m",
      });

      return res.status(201).json({
        error: false,
        message: "Account Created Successfully",
        accessToken,
        user: { fullName, email },
      });
    } catch (err) {
      console.error("Error Creating User:", err);
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  }
);

app.post("/login", validateRequest(userLoginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in the database
    const userInfo = await User.findOne({ email });
    if (!userInfo) {
      return res.status(400).json({
        error: true,
        message: "User not found",
      });
    }

    // Verify credentials
    if (userInfo.password === password) {
      const accessToken = jwt.sign(
        { user: userInfo },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "36000m",
        }
      );
      return res.status(200).json({
        error: false,
        message: "Login Successful",
        accessToken,
        email,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: "Invalid Credentials",
      });
    }
  } catch (err) {
    console.error("Error Logging In:", err);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

module.exports = app;
