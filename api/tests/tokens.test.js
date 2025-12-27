const assert = require('node:assert');

if (!process.env.API_SERVER_HOST || !process.env.API_SERVER_PORT) {
    console.error("ERROR: Please define API_SERVER_HOST and API_SERVER_PORT environment variables.");
    process.exit(1);
}

const BASE_URL = `http://${process.env.API_SERVER_HOST}:${process.env.API_SERVER_PORT}/api`;
const TEST_USER = {
    username: `auth_user_${Date.now()}`,
    password: "securepassword123",
    info: {}
};

async function run() {
    console.log("--- Running Tokens (Auth) Tests ---");

    try {
        // Setup: Create a user first
        await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(TEST_USER)
        });

        // 1. Successful Login
        console.log("1. Testing valid login");
        const loginRes = await fetch(`${BASE_URL}/tokens`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: TEST_USER.username,
                password: TEST_USER.password
            })
        });

        assert.strictEqual(loginRes.status, 200, "Login failed");
        const tokenData = await loginRes.json();
        assert.ok(tokenData.id, "User ID not returned in login response");
        console.log("   PASS: Login successful");

        // 2. Invalid Login (Wrong Password)
        console.log("2. Testing invalid password");
        const failRes = await fetch(`${BASE_URL}/tokens`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: TEST_USER.username,
                password: "wrongpassword"
            })
        });

        // Expecting 404 Not Found
        assert.strictEqual(failRes.status, 404, "Invalid login should return 404");
        console.log("   PASS: Invalid login handled");

    } catch (error) {
        console.error("FAILED:", error.message);
        process.exit(1);
    }
}

run();
