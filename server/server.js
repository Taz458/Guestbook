//essentially creating an API and getting values from sql database

import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Allow incoming requests from other people
app.use(express.json()); // Read incoming JSON

// Load environment variables from .env file
dotenv.config();

// Connect to the database using pg Pool
const db = new pg.Pool({
  connectionString: process.env.DB_CONN // Connection string from .env
});

// Root route
app.get("/", (req, res) => res.json("Welcome to the Guestbook App!"));

// GET all guestbook entries
app.get("/guestbook", async (req, res) => {  
    const result = await db.query("SELECT * FROM guestbook");
    res.json(result.rows);
});

app.delete("/guestbook/:id", async (req, res) => {
    console.log(req.params.id);
    
    const deleted = await db.query("DELETE FROM guestbook WHERE id = $1", [req.params.id]);

    res.json({ message: "Deleted", id: req.params.id });

});


app.post("/guestbook", async (req, res) => {
    const body = req.body;
    console.log(body);

    const nameFromClient = body.name;
    const reviewFromClient = body.review;

    // Use a safer parameterized query
    const data = await db.query(
        `INSERT INTO guestbook (name, review) VALUES ($1, $2) RETURNING *`,
        [nameFromClient, reviewFromClient]
    );

    res.json(data.rows[0]); // Send back the newly inserted row
});



// Start the server
app.listen(process.env.PORT || 4242, () => {
    console.log(`App running on ${process.env.PORT || 4242}`);
});

