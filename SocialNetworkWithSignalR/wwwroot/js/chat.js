"use strict"

var connection = new signalR.HubConnectionBuilder().withUrl("/chathub").build();

connection.start().then(function () {
    console.log("Connected");
    GetAllUsers();
}).catch(function (err) {
    return console.error(err.toString());
})

connection.on("Connect", function (info) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.innerHTML = `<span style='color:springgreen;'>${info}</span>`;
    GetAllUsers();
})

connection.on("Disconnect", function (info) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.innerHTML = `<span style='color:red;'>${info}</span>`;
    GetAllUsers();
})

connection.on("ReceiveNotification", function () {
    alert("Accepted");
    GetMyRequests();
})

GetMyRequests();

async function SendFollowCall(id) {
    await connection.invoke("SendFollow", id);
}

