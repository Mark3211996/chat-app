const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

app.use(cors());

const server = http.createserver(app);

server.listen(3001,() =>{
    console.log("server running");
});