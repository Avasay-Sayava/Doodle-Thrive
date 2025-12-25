const assert = require('node:assert');

const BASE_URL = "http://api-server:3300/api";
const USER_A = { username: `owner_${Date.now()}`, password: "password" };
const USER_B = { username: `guest_${Date.now()}`, password: "password" };

// Helper to get ID
async function createUser(u) {
    const res = await fetch(`${BASE_URL}/users`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...u, info: {} })
    });
    return res.headers.get("Location").split('/').pop();
}

async function run() {
    console.log("--- Running Permissions Tests ---");

    try {
        const idA = await createUser(USER_A);
        const idB = await createUser(USER_B);
        
        const HEADERS_A = { "Username": USER_A.username, "Password": USER_A.password, "Content-Type": "application/json" };

        // Setup: User A creates a file
        const fileRes = await fetch(`${BASE_URL}/files`, {
            method: "POST",
            headers: HEADERS_A,
            body: JSON.stringify({ name: "shared.txt", content: "secret" })
        });
        const fileId = fileRes.headers.get("Location").split('/').pop();

        // 1. Add Permission for User B
        console.log("1. Adding permission");
        const addPermRes = await fetch(`${BASE_URL}/files/${fileId}/permissions`, {
            method: "POST",
            headers: HEADERS_A,
            body: JSON.stringify({
                options: {
                    [idB]: { read: true, write: false, permissions: { read: true, write: false } }
                }
            })
        });
        assert.strictEqual(addPermRes.status, 201);
        const permId = addPermRes.headers.get("Location").split('/').pop();
        console.log("   PASS: Permission added");

        // 2. Get Permissions
        console.log("2. Getting permissions");
        const getRes = await fetch(`${BASE_URL}/files/${fileId}/permissions`, { headers: HEADERS_A });
        const perms = await getRes.json();
        // Checking status is 200
        assert.strictEqual(getRes.status, 200);
        console.log("   PASS: Permissions retrieved");

        // 3. Update Permission
        console.log("3. Updating permission");
        const updateRes = await fetch(`${BASE_URL}/files/${fileId}/permissions/${permId}`, {
            method: "PATCH",
            headers: HEADERS_A,
            body: JSON.stringify({
                options: {
                    [idB]: { read: true, write: true, permissions: { read: true, write: true } }
                }
            })
        });
        assert.strictEqual(updateRes.status, 200);
        console.log("   PASS: Permission updated");

        // 4. Delete Permission
        console.log("4. Deleting permission");
        const delRes = await fetch(`${BASE_URL}/files/${fileId}/permissions/${permId}`, {
            method: "DELETE",
            headers: HEADERS_A
        });
        assert.strictEqual(delRes.status, 204);
        console.log("   PASS: Permission deleted");

    } catch (error) {
        console.error("FAILED:", error.message);
        process.exit(1);
    }
}

run();
