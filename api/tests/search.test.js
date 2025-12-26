const assert = require('node:assert');

const BASE_URL = "http://api-server:3300/api";
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
        
        // 1. Create file with unique content
        console.log(`1. Creating file with content: ${uniqueString}`);
        const fileRes = await fetch(`${BASE_URL}/files`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({
                name: "search_me.txt",
                content: `Here is the ${uniqueString} you are looking for.`
            })
        });
        const fileId = fileRes.headers.get("Location").split('/').pop();

        // 2. Search for the unique string
        console.log("2. Searching for string");
        const searchRes = await fetch(`${BASE_URL}/search/${uniqueString}`, { headers: HEADERS });
        assert.strictEqual(searchRes.status, 200, "Search request failed");
        
        const results = await searchRes.json();
        assert.ok(Array.isArray(results), "Results should be an array");
        
        // Check if our file ID is in the results
        const found = results.some(item => {
            if (typeof item === 'string') return item === fileId;
            return item.id === fileId;
        });

        assert.ok(found, "Created file not found in search results");
        console.log("   PASS: File found via search");

    } catch (error) {
        console.error("FAILED:", error.message);
        process.exit(1);
    }
}

run();
