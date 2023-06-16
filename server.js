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
app.get("/vehicles", async (request, response) => {
    try {
        const results = await pool.query("SELECT * FROM vehicles;");
        response.json(results.rows); return;
    }
    catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error!");
    }
});

// get single vehicle by id
app.get("/vehicles/:id", async (request, response) => {
    const { id } = request.params;
    try {
        const results = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
        if (results.rowCount === 0) {
            response.status(404).send("Not found"); return;
        }
        else {
            response.status(200).json(results.rows[0]); return
        }
    }
    catch (err) {
        console.error(error.message);
        response.status(500).send("Internal Server Error");
    }
});


// 2. Listener
app.listen(process.env.PORT, () => { console.log("Server is running, port...", process.env.PORT) });