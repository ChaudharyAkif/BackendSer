const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const todoRoutes = require("./routes/todoroutes")
const authRoutes = require("./routes/Authroutes")
const ConnectDb = require("./config/db")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || "https://backend-server-smoky.vercel.app/"

// Middleware
app.use(
  cors({
     origin: "https://backend-todos-6pc2.vercel.app",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes
app.use("/api/", todoRoutes)
app.use("/auth", authRoutes)

// Database connection

ConnectDb()

app.get("/", (req, res) => {
  res.json({ message: "Todo API with Authentication is running!" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

// app.use("*", (req, res) => {
//   res.status(404).json({ error: "Route not found" })
// })

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
