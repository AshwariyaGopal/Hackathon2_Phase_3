const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const lines = envContent.split(/\r?\n/);
            lines.forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join('=').trim();
                    process.env[key] = value;
                }
            });
        }
    } catch (e) {
        console.error("Env Load Error:", e.message);
    }
}

async function checkSchema() {
    loadEnv();
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is missing in .env.local");
        return;
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Checking for Better Auth tables...");
        const tables = ['user', 'session', 'account', 'verification'];
        
        for (const table of tables) {
            const res = await pool.query(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)", 
                [table]
            );
            const exists = res.rows[0].exists;
            console.log(`Table '${table}': ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
            
            if (exists && table === 'user') {
                const cols = await pool.query(
                    "SELECT column_name FROM information_schema.columns WHERE table_name = 'user'"
                );
                console.log("User columns:", cols.rows.map(r => r.column_name).join(', '));
            }
        }
    } catch (err) {
        console.error("Execution Error:", err.message);
    } finally {
        await pool.end();
    }
}

checkSchema();
