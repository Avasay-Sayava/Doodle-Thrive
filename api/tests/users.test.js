const assert = require('node:assert');

if (!process.env.API_SERVER_HOST || !process.env.API_SERVER_PORT) {
    console.error("ERROR: Please define API_SERVER_HOST and API_SERVER_PORT environment variables.");
    process.exit(1);
}

const BASE_URL = `http://${process.env.API_SERVER_HOST}:${process.env.API_SERVER_PORT}/api`;
const TEST_USER = {
    username: `testuser_${Date.now()}`,
    password: "password1234",
    info: {
        image: "data:image/png;base64,SOMEBASE64DATA=",
        description: "Test User Description"
    }
};

async function run() {
    console.log("--- Running Users Tests ---");

    try {
        // 1. Create User
        console.log(`1. Creating user: ${TEST_USER.username}`);
        const createRes = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(TEST_USER)
        });

        assert.strictEqual(createRes.status, 201, "Failed to create user");
        const location = createRes.headers.get("Location");
        assert.ok(location, "Location header missing");
        
        const userId = location.split('/').pop();
        console.log("   PASS: User created with ID:", userId);

        // 2. Get User
        console.log("2. Fetching user info");
        const getRes = await fetch(`${BASE_URL}/users/${userId}`);
        assert.strictEqual(getRes.status, 200, "Failed to get user");
        
        const userData = await getRes.json();
        assert.strictEqual(userData.username, TEST_USER.username, "Username mismatch");
        assert.strictEqual(userData.info.description, TEST_USER.info.description, "Description mismatch");
        assert.strictEqual(userData.id, userId, "ID mismatch");
        
        // Ensure password is not returned
        assert.strictEqual(userData.password, undefined, "Security: Password should not be returned");
        console.log("   PASS: User info verified");

    } catch (error) {
        console.error("FAILED:", error.message);
        process.exit(1);
    }
}

run();
