const assert = require('node:assert');

if (!process.env.API_SERVER_HOST || !process.env.API_SERVER_PORT) {
    console.error("ERROR: Please define API_SERVER_HOST and API_SERVER_PORT environment variables.");
    process.exit(1);
}

const BASE_URL = `http://${process.env.API_SERVER_HOST}:${process.env.API_SERVER_PORT}/api`;
const CREDENTIALS = {
    username: `searcher_${Date.now()}`,
    password: "password123"
};

const HEADERS = { "Username": CREDENTIALS.username, "Password": CREDENTIALS.password, "Content-Type": "application/json" };

async function run() {
    console.log("--- Running Search Tests ---");

    try {
        await fetch(`${BASE_URL}/users`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...CREDENTIALS, info: {} }) });

        const uniqueString = `needle_${Date.now()}`;
        const uniqueName = `search_me_${Date.now()}.txt`;
        
        // 1. Create file with unique content
        console.log(`1. Creating file with content: ${uniqueString}`);
        const fileRes = await fetch(`${BASE_URL}/files`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({
                name: uniqueName,
                content: `Here is the ${uniqueString} you are looking for.`
            })
        });
        const fileId = fileRes.headers.get("Location").split('/').pop();

        // 2. Search for the unique string
        console.log("2. Searching for string");
        let searchRes = await fetch(`${BASE_URL}/search/${uniqueString}`, { headers: HEADERS });
        assert.strictEqual(searchRes.status, 200, "Search request failed");
        
        let results = await searchRes.json();
        let found = Object.keys(results).some(file => file === fileId);
        assert.ok(found, "Created file not found in search results");
        console.log("   PASS: File found via search");

        // 3. Search for a string in file name
        console.log("3. Searching for string in name");
        searchRes = await fetch(`${BASE_URL}/search/${uniqueName}`, { headers: HEADERS });
        assert.strictEqual(searchRes.status, 200, "Search request failed");

        results = await searchRes.json();
        found = Object.keys(results).some(file => file === fileId);
        assert.ok(found, "Created file not found in search results by name");
        console.log("   PASS: File found via name search");

    } catch (error) {
        console.error("FAILED:", error.message);
        process.exit(1);
    }
}

run();
