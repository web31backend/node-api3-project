let express = require("express");
let morgan = require("morgan");
let helmet = require("helmet");
let cors = require("cors");
let userRoutes = require("../users/userRouter");

// starting server
// order matters!
let server = express();
server.use(express.json()); // integrated middleware;
server.use(helmet());
server.use(cors());
server.use(morgan("combined"));

server.use("/api/users", userRoutes);

server.get("/api", (req, res) => {
    res.status(200).json({ api: "UP, HI" });
})

module.exports = server;