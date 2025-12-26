const assert = require('node:assert');

const BASE_URL = "http://api-server:3300/api";
const CREDENTIALS = {
    username: `file_tester_${Date.now()}`,
    password: "password123"
};

const HEADERS = {
    "Username": CREDENTIALS.username,
    "Password": CREDENTIALS.password,
    "Content-Type": "application/json"
};

async function run() {
    console.log("--- Running Files Tests ---");

    try {
        // Setup: Create user
        await fetch(`${BASE_URL}/users`, { method: "POST", headers: HEADERS, body: JSON.stringify({ ...CREDENTIALS, info: {} }) });

        // 1. Create Folder
        console.log("1. Creating a folder");
        const folderRes = await fetch(`${BASE_URL}/files`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({ name: "my_docs" })
        });
        assert.strictEqual(folderRes.status, 201);
        const folderId = folderRes.headers.get("Location").split('/').pop();
        console.log("   PASS: Folder created:", folderId);

        // 2. Create File inside Folder
        console.log("2. Creating a file inside folder");
        const fileRes = await fetch(`${BASE_URL}/files`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({
                name: "notes.txt",
                parent: folderId,
                content: "Initial Content"
            })
        });
        assert.strictEqual(fileRes.status, 201);
        const fileId = fileRes.headers.get("Location").split('/').pop();
        console.log("   PASS: File created:", fileId);

        // 3. Get File Content
        console.log("3. Retrieving file content");
        const getRes = await fetch(`${BASE_URL}/files/${fileId}`, { headers: HEADERS });
        const fileData = await getRes.json();
        assert.strictEqual(fileData.content.trim(), "Initial Content");
        assert.strictEqual(fileData.parent, folderId);
        console.log("   PASS: Content verified");

        // 4. Update File
        console.log("4. Updating file content");
        const updateRes = await fetch(`${BASE_URL}/files/${fileId}`, {
            method: "PATCH",
            headers: HEADERS,
            body: JSON.stringify({ content: "Updated Content" })
        });
        assert.strictEqual(updateRes.status, 200);
        
        // Verify update
        const verifyRes = await fetch(`${BASE_URL}/files/${fileId}`, { headers: HEADERS });
        const verifyData = await verifyRes.json();
        assert.strictEqual(verifyData.content.trim(), "Updated Content");
        console.log("   PASS: Update verified");

        // 5. Delete File
        console.log("5. Deleting file");
        const delRes = await fetch(`${BASE_URL}/files/${fileId}`, { method: "DELETE", headers: HEADERS });
        assert.strictEqual(delRes.status, 204);
        
        // Verify deletion
        const checkRes = await fetch(`${BASE_URL}/files/${fileId}`, { headers: HEADERS });
        assert.notStrictEqual(checkRes.status, 200, "File should not be retrievable");
        console.log("   PASS: Deletion verified");

    } catch (error) {
        console.error("FAILED:", error.message);
        process.exit(1);
    }
}

run();