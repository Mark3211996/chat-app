const express = require("express");
const path = require("path");

const app = express()
const server = require("http").createServer(app);
const mysql = require("mysql2");

const con = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database:"chatapp"

});

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/public")));

io.on("connection",function(socket){
    socket.on("newuser",function(username){
        socket.broadcast.emit("update",username ,+ " ", + "is now joined the conversation");
    });
    socket.on("exituser",function(username){
        socket.broadcast.emit("update",username ,+ " " ,+ "is now left the conversation");
    });
    socket.on("chat",function(message){
        socket.broadcast.emit("chat",message);
    });

});

// login ============================================================================================
app.get("/login", (req, res) =>{
    res.sendFile(__dirname + "../chatroom/login/login.html");
});

app.post("/login", (req, res) =>{

    const { userName, user_password } = req.body;

    const sql = "SELECT user_id, user_name FROM user WHERE userName = ? AND user_password = ?";

    con.query(sql, [userName, user_password], (err, result) =>{

        console.log(result);

        if(!err){
            if(result.length > 0){
                return res.status(200).json({message: result, codeNumber: 1});
            }

            return res.status(200).json({message: "Invalid username or password", codeNumber: 0});
        }

        return res.status(500).json({message: "Server Error"});
    });

});

// register =====================================================================================
app.get("/register", (req, res) =>{
    res.sendFile(__dirname + "../chatroom/register/register.html");
});


app.post("/register", (req, res) =>{

    const { user_name, user_email, user_password } = req.body;

    const sql = "INSERT INTO user(user_name, user_email, user_password) VALUES(?, ?, ?)";

    con.query(sql, [user_name, user_email, user_password], (err, result) =>{

        if(!err){
            return res.status(200).json({message: "Registered successfully"});
        }

        return res.status(500).json({message: "Server error"});

    });

});


server.listen(5000);