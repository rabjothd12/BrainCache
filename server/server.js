const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

//Middleware
app.use(cors({
  origin: "*", // for now (later restrict to Vercel)
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

//Test Route
app.get("/", (req, res) => {
    res.send("Welcome to the Blog App API");
});

//DB Connection
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

//Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});