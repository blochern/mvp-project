// the main server file

// import dependencies

const express = require('express');
const dotenv = require('dotenv');

// activate express application
const app = express();

// configure dotenv
dotenv.config();

// declare port and database url variables
const port = process.env.PORT;
const database_url = process.env.DATABASE_URL;

// declare new pool
const { Pool } = require('pg');
const pool = new Pool ({
    connectionString: database_url
});

// 2. For this commit, all I want right now is the "get all" handler
// for later uses, replace "template" with the actual names of the items
app.get("/template", async (_, response) => {
    try {
        const results = await pool.query("select * from template;");
        if (!results.rowCount) {
            response.status(404).send("Not found!"); return;
        } else {
            response.status(200).json(results.rows); return;
        }
    }
    catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error!");
    }
});

// 2. Listener
app.listen(port, () => { console.log("Server is running, listening on port...", port )});