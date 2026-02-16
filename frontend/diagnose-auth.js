const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split(/\r?\n/).forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2) {
                    process.env[parts[0].trim()] = parts.slice(1).join('=').trim();
                }
            });
        }
    } catch (e) {}
}

async function diagnose() {
    loadEnv();
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const tables = ['user', 'session', 'account', 'verification'];
        console.log("--- Better Auth Deep Diagnosis ---");
        
        for (const table of tables) {
            console.log(`\nChecking table: [${table}]`);
            const res = await pool.query(
                "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1", 
                [table]
            );
            
            if (res.rows.length === 0) {
                console.log(`❌ Table '${table}' is empty or does not exist!`);
                continue;
            }

            res.rows.forEach(row => {
                console.log(` - ${row.column_name} (${row.data_type})`);
            });
        }

        console.log("\n--- Checking for existing sessions ---");
        const sessionCount = await pool.query("SELECT COUNT(*) FROM session");
        console.log(`Total sessions in DB: ${sessionCount.rows[0].count}`);

    } catch (err) {
        console.error("\n❌ DIAGNOSIS FAILED:", err.message);
    } finally {
        await pool.end();
    }
}

diagnose();
