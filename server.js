const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");  // Add CORS to handle cross-origin requests
const app = express();
const path = require('path');

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from the 'public' folder
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// MongoDB Connection
try {
  mongoose.connect("mongodb+srv://codingbits:Adarsh%40123@codingbits.h0231.mongodb.net/?retryWrites=true&w=majority&appName=CodingBits");
  console.log("Connected to database successfully");
} catch (error) {
  console.log(error);
  console.log("Could not connect to database!");
}

// Define Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email_id: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  qualification: { type: String, required: true },
  profession: { type: String, required: true },
  college: { type: String, required: true },
  linkedin_id: { type: String },
  exploration: { type: String, required: true },
  course: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Route to handle form submission
app.post("/submit-details", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send("User details saved successfully");
  } catch (error) {
    console.error(error);
    res.status(400).send("Error saving user details");
  }
});
app.get("/submit-details", (req, res) => {
  res.send("GET request to /submit-details is working. The server is connected!");
});
// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));