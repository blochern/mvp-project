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

// setting up the 'public' file and express.json() parser
app.use(express.static("public"), express.json());

// get all route
app.get("/vehicles", async (request, response) => {
    try {
        const results = await pool.query("SELECT * FROM vehicles ORDER BY id ASC;");
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
            response.status(200).json(results.rows[0]); return;
        }
    }
    catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error");
    }
});

// get vehicle(s) by search
app.get('/vehicle_search', async (request, response) => {
    const { search } = request.body;
    try {
        const results = await pool.query('SELECT * FROM vehicles WHERE name LIKE %$1%', [search]);
        if (results.rowCount === 0) {
            response.status(404).send("Not found"); return;
        }
        else {
            response.status(200).json(results.rows); return;
        }
    }
    catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error");
    }
});

// post one
app.post("/vehicles", async (request, response) => {
    const { name, tech_level, weapon_type, cost, faction, stealth } = request.body;
    if (!name || isNaN(+tech_level) || !weapon_type || isNaN(+cost) || !faction || (typeof stealth) !== 'boolean') {
        response.status(400).send("Invalid name, tech_level, weapon_type, cost, faction, or stealth"); return;
    }
    try {
        const results = await pool.query(
            "INSERT INTO vehicles (name, tech_level, weapon_type, cost, faction, stealth) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [name, tech_level, weapon_type, cost, faction, stealth]
        );
        if (results.rowCount === 0) {
            response.status(500).send("Could not POST to /vehicles"); return;
        }
        else {
            response.status(201).json(results.rows[0]); return;
        }
    }
    catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error");
    }
});

// put one
app.put("/vehicles/:id", async (request, response) => {
    // for now, update will require all properties to be validated
    const { id } = request.params; const { name, tech_level, weapon_type, cost, faction, stealth } = request.body;
    if (!name || isNaN(+tech_level) || !weapon_type || isNaN(+cost) || !faction || (typeof stealth) !== 'boolean') {
        response.status(400).send("Invalid name, tech_level, weapon_type, cost, faction, or stealth"); return;
    }
    try {
        const results = await pool.query(
            "UPDATE vehicles SET name = $1, tech_level = $2, weapon_type = $3, cost = $4, faction = $5, stealth = $6 WHERE id = $7 RETURNING *",
            [name, tech_level, weapon_type, cost, faction, stealth, id]
        );
        if (results.rowCount === 0) {
            response.status(404).send("Not found"); return;
        }
        else {
            response.json(results.rows[0]); return;
        }
    }
    catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error");
    }
});

// delete one
app.delete('/vehicles/:id', async (request, response) => {
    const { id } = request.params;
    try {
        const results = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
        if (results.rowCount === 0) {
            response.status(404).send("Not found"); return;
        }
        else {
            response.status(200).json(results.rows[0]); return;
        }
    }
    catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error");
    }
});

// 2. Listener
app.listen(process.env.PORT, () => { console.log("Server is running, port...", process.env.PORT) });