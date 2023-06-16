// the main server file

// import dependencies

const express = require('express');
const dotenv = require('dotenv');

// activate express application
const app = express();

// configure dotenv
dotenv.config();

// declare new pool
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.static("public"));

// get all route
app.get("/vehicles", async (_, response) => {
    try {
        const results = await pool.query("SELECT * FROM vehicles;");
        response.json(results.rows); return;
    }
    catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error!");
    }
});

// 2. Listener
app.listen(process.env.PORT, () => { console.log("Server is running, listening on port...", process.env.PORT) });