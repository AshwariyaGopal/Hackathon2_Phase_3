const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local to avoid needing the 'dotenv' module
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const [key, ...value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.join('=').trim();
                }
            });
        }
    } catch (e) {
        console.error("Error parsing .env.local:", e.message);
    }
}

async function testConnection() {
    loadEnv();
    console.log("Testing Frontend Database Connection...");
    
    if (!process.env.DATABASE_URL) {
        console.error("❌ FAILURE: DATABASE_URL not found in .env.local");
        return;
    }

    console.log("URL detected. Attempting to connect...");
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const res = await pool.query('SELECT NOW()');
        console.log("✅ SUCCESS: Connected to database!");
        console.log("Database time:", res.rows[0].now);
    } catch (err) {
        console.error("❌ FAILURE: Could not connect to database.");
        console.error("Error details:", err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
