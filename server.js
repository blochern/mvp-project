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
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.use(express.static("public"));

// 2. For this commit, all I want right now is the "get all" handler
// for later uses, replace "template" with the actual names of the items
app.get("/template", async (_, response) => {
    try {
        const results = await pool.query("SELECT * FROM template;");
        response.json(results.rows); return;
    }
    catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error!");
    }
});

// 2. Listener
app.listen(process.env.PORT, () => { console.log("Server is running, listening on port...", process.env.PORT) });