const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors());

const FilesRouter = require("./routes/files");
const TokensRouter = require("./routes/tokens");
const SearchRouter = require("./routes/search");
const UsersRouter = require("./routes/users");

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/api/files", FilesRouter);
app.use("/api/tokens", TokensRouter);
app.use("/api/search", SearchRouter);
app.use("/api/users", UsersRouter);
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

app.use(express.json());

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

const port = process.argv[4];
if (!port) throw new Error("Arguments must be: <server_host> <server_port> <api_port> <timeout>");
app.listen(port);
