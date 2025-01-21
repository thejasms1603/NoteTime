const connectToDatabase = require("./mongodb/dbconnect");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const app = express();
const PORT = 8080;

const User = require("./models/user.model");
const Note = require("./models/note.model");

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

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: true, message: "Access Token Required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ error: true, message: "Invalid Access Token" });
  }
};


// Routes

//Create Account
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

//Login
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

//Get User
app.get("/get-user", authenticateToken, async (req, res) =>{
  const {user} = req.user;
  const isUser = await User.findOne({_id: user._id});
  if(!isUser)
  {
    return res.sendStatus(401);
  }
  return res.json({
    user: {
      fullName : isUser.fullName,
      email:isUser.email,
      "_id": isUser._id,
      "created-on":isUser.createdOn
    },
    message:""
  })
});


// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, description, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({
      error: true,
      message: "Title is required",
    });
  }

  if (!description) {
    return res.status(400).json({
      error: true,
      message: "Description is required",
    });
  }

  try {
    console.log("User:", user); // Debugging user object
    const note = new Note({
      title,
      description,
      tags: tags || [],
      userId: user._id,
    });
    const savedNote = await note.save();
    return res.json({
      error: false,
      note: savedNote,
      message: "Note Added Successfully",
    });
  } catch (error) {
    console.error("Error while saving note:", error); // Log the error
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//Edit Note
app.put('/edit-note/:noteId', authenticateToken, async(req,res)=>{
  const noteId = req.params.noteId;
  const {title,description, tags, isPinned} = req.body;
  const {user} = req.user;
  
  if(!title && !description && !tags)
  {
    return res.status(400).json({
      error:true,
      message:"No Changes Provided"
    });
  }

  try{
    const note = await Note.findOne({_id: noteId, userId: user._id});
    if(!note)
    {
      return res.status(404).json({error:true, message:"Note not found"});
    }

    if(title) note.title = title;
    if(description) note.description = description;
    if(tags) note.tags = tags;
    if(isPinned) note.isPinned = isPinned;
    await note.save();

    return res.json({
      error:false,
      note,
      message:"Note Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error:true,
      message:"Internal server error"
    });
  }
})

// Get Notes
app.get('/get-all-notes/', authenticateToken, async (req,res)=>{
  const { user} = req.user;
  try{
    const notes = await Note.find({userId:user._id}).sort({isPinned:-1});
    return res.json({
      error:false,
      notes,
      message:"All notes retrieved successfully"
    });
  } catch(error){
    return res.status(500).json({
      error:true,
      message:"Internal Server Error",
    })
  }
})

//Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req,res)=>{
  const noteId = req.params.noteId;
  const {user} = req.user;
  try {
    const note = await Note.findOne({_id:noteId, userId:user._id});
    if(!note)
    {
      return res.status(404).json({
        error:true,
        message:"Note not found"
      });
    }
    await Note.deleteOne({_id:noteId, userId:user._id});
    return res.json({
      error:false,
      message:"Note deleted successfully"
    });
  } catch(error){
    res.status(404).json({
      error:true,
      message:"Internal server error"
    });
  }
})

// Update IsPinned Value
app.put('/update-note-pinned/:noteId', authenticateToken, async (req,res)=>{
  const noteId = req.params.noteId;
  const {isPinned} = req.body;
  const {user} = req.user;

  try{
    const note = await Note.findOne({_id:noteId, userId: user._id});
    if(!note)
    {
      res.status(404).json({
        error:true,
        message:"Note not found"
      });
    }
    note.isPinned = isPinned || false;
    await note.save();

    return res.json({
      error:false,
      note,
      message:"Note updated successfully"
    });
  } catch(error)
  {
    return res.status(500).json({
      error:true,
      message:"Internal Server Error"
    });
  }
})
// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

module.exports = app;
