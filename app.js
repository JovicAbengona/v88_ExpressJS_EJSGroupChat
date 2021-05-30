const express = require("express");
const app = express();
const server = app.listen(8080, function(){
    console.log("Listening on 8080");
});
const moment = require("moment");
const io = require('socket.io')(server);

app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

let messages = [];

// TODO: Render index.ejs page for USER
app.get("/", (request, response) => {
    response.render("index");
});

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.emit("send_id", {id: socket.id});

    socket.on("send_message", function(data){
        messages_data = {
            id: socket.id,
            sender: data.form_data.sender,
            message: data.form_data.message,
            time: moment().format("h:mm A")
        }
        messages.push(messages_data);
        console.log(messages);
        io.emit("send_messages", messages);
    });

    io.emit("send_messages", messages);
});
