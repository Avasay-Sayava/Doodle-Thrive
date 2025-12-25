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

// Empty implemntation
