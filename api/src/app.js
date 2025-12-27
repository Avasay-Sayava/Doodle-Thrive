const express = require("express");
const app = express();

const FilesRouter = require("./routes/files");
const TokensRouter = require("./routes/tokens");
const SearchRouter = require("./routes/search");
const UsersRouter = require("./routes/users");

app.use(express.json());
app.use("/api/files", FilesRouter);
app.use("/api/tokens", TokensRouter);
app.use("/api/search", SearchRouter);
app.use("/api/users", UsersRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

const port = process.argv[4];
if (!port) throw new Error("Arguments must be: <server_host> <server_port> <api_port> <timeout>");
app.listen(port);
