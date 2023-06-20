﻿// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


function SendRequest(id) {
    $.ajax({
        url: `/Home/SendFollow/${id}`,
        method: "GET",
        success: function (data) {
            let item = `<div class="alert alert-success">
        Your friend request sent successfully
</div>`;
            SendFollowCall(id);
            GetAllUsers();
            $("#request").html(item);
        },
        error: function (err) {
        }
    })
}

function UnFollowCall(id) {

    $.ajax({
        url: "/Home/Unfollow/" + id,
        method: "GET",
        success: function (data) {
            GetMyRequests();
            GetAllUsers();
            SendFollowCall(id);
        },
        error: function (err) {
            alert(err);
        }
    })
}

function SendMessage(receiverId, senderId) {
    //console.log("HERE"); \
    //console.
    //const audioUrl = window.location.origin + '/simple-notification-152054.mp3';
    //const audio = new Audio(audioUrl);
    //audio.play();
    playSound();

    let content = document.getElementById('message-input');

    let obj = {
        receiverId: receiverId,
        senderId: senderId,
        content: content.value
    };

    $.ajax({
        url: `/Home/AddMessage`,
        method: "POST",
        data:obj,
        success: function (data) {
            GetMessageCall(receiverId, senderId);
            content.value = "";
        },
        error: function (err) {
        }
    })
}

function playSound() {
    // Create an AudioContext instance
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Define the frequency and duration of the tone
    const frequency = 800; // Frequency in Hz
    const duration = 200; // Duration in milliseconds

    // Create an OscillatorNode
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = frequency;

    // Connect the oscillator to the audio output
    oscillator.connect(audioContext.destination);

    // Start the oscillator
    oscillator.start();

    // Stop the oscillator after the specified duration
    setTimeout(() => {
        oscillator.stop();
    }, duration);
}

function DeclineRequest(id,senderId) {
    $.ajax({
        url: `/Home/DeclineRequest/${id}`,
        method: "GET",
        success: function (data) {
            let item = `<div class="alert alert-danger">
        You decline request.
</div>`;
            SendDeclineCall(senderId);
            GetAllUsers();
            $("#request").html(item);
        },
        error: function (err) {
        }
    })
}


function AcceptRequest(id,id2, requestId) {
    $.ajax({
        url: `/Home/AcceptRequest?userId=` + id + "&requestId=" + requestId,
        method: "GET",
        success: function (data) {
            let item = `<div class="alert alert-success">
        You accept request successfully.
</div>`;
            GetAllUsers();
            SendFollowCall(id);
            SendFollowCall(id2);
            GetMyRequests();
            GetAllUsers();
            $("#request").html(item);
        },
        error: function (err) {
        }
    })
}


function DeleteRequest(id, requestId) {
    $.ajax({
        url: `/Home/DeleteRequest?requestId=` + requestId,
        method: "GET",
        success: function (data) {
            SendFollowCall(id);
            GetMyRequests();
            GetAllUsers();
            $("#request").html("");
        },
        error: function (err) {
        }
    })
}

function GetMessages(receiverId,senderId) {
    $.ajax({
        url: `/Home/GetAllMessages?receiverId=${receiverId}&senderId=${senderId}`,
        method: "GET",
        success: function (data) {
            let content = "";
            for (var i = 0; i < data.length; i++) {
                if (receiverId == data[i].receiverId) {
                    let item = `<section   style='display:flex;margin-top:25px;border:2px solid springgreen;
margin-left:100px;border-radius:20px 0 0 20px;padding:20px;width:50%;'>
                        <h5>
                            ${data[i].content}
                            </h5>
                            <p>
                                ${data[i].dateTime}
                            </p>
                        </section>`;
                    content += item;
                }
                else { 
                    let item = `<section    style='display:flex;margin-top:25px;border:2px solid springgreen;
margin-left:0px;border-radius:0 20px 20px 0;width:50%;padding:20px;'>
                        <h5>
                            ${data[i].content}
                            </h5>
                            <p>
                                ${data[i].dateTime}
                            </p>
                        </section>`;
                    content += item;
                }
            }
            console.log(data);
            $("#currentMessages").html(content);
        }
    })
  
}

function GetMyRequests() {
    $.ajax({
        url: "/Home/GetAllRequests",
        method: "GET",
        success: function (data) {

            let content = "";
            let subContent = "";
            for (var i = 0; i < data.length; i++) {
                if (data[i].status == "Request") {
                    subContent = `<div class='card-body'>
                    <button onclick="AcceptRequest('${data[i].senderId}','${data[i].receiverId}',${data[i].id})" class='btn btn-success'>Accept</button>
                    <button class='btn btn-outline-secondary' onclick="DeclineRequest(${data[i].id},'${data[i].senderId}')">Decline</button>
                        </div>`;
                }
                else {
                    subContent = `<div class='card-body' >
                            <button onclick="DeleteRequest('${data[i].receiverId}',${data[i].id})" class='btn btn-warning'>Delete </button>
</div>`;
                }

                let item = `<div class='card' style='width:15rem;' >
                            <div class='card-body'>
                <h5 class='card-title'>Friend Request</h5>
    </div>  
                <ul class='list-group list-group-flush'>
                <li class='list-group-item'>${data[i].content} </li>
</ul>
${subContent}
</div>
`;
                content += item;
            }
            console.log("Requests");
            console.log(data);
            $("#requests").html(content);
        }
    })
}

GetMyRequests();


function GetFriends() {

    $.ajax({
        url: "/Home/GetMyFriends",
        method: "GET",
        success: function (data) {
            let content = "";
            for (var i = 0; i < data.length; i++) {
                let css = 'border:3px solid springgreen';
                if (!data[i].yourFriend.isOnline) {
                    css = 'border:3px solid red';
                }
                let item = `<section style="display:flex;width:300px;border:2px solid springgreen;margin-top:10px;
padding:15px;
border-radius:15px;">
        <img style='width:60px;height:60px;border-radius:50%;${css}' src='/images/${data[i].yourFriend.imageUrl}'/>
<section style="margin-left:20px;" >
<h4>${data[i].yourFriend.userName}</h4>
<a class='btn btn-outline-success mt-2 mx-auto'  href='/Home/GoChat/${data[i].yourFriendId}' >Go Chat</a>
</section>
</section>
   `
                content += item;
            }

            $("#friends").html(content);
        }
    })

}



function GetAllUsers() {

    $.ajax({
        url: "/Home/GetAllUsers",
        method: "GET",
        success: function (data) {
            let content = "";
            for (var i = 0; i < data.length; i++) {
                let disconnectDate = new Date(data[i].disConnectTime);
                let dateContent = '';

                let subContent = "";
                if (data[i].hasRequestPending) {
                    subContent = `<button class='btn btn-outline-secondary'>Already Sent</button>`;
                }

                else {
                    if (data[i].isFriend) {

                        subContent = `<button  class='btn btn-outline-secondary' onClick=UnFollowCall('${data[i].id}')> UnFollow</button>`
                    }
                    else {

                subContent = `<button onclick="SendRequest('${data[i].id}')" class='btn btn-outline-primary'> Follow</button>`
                    }
                }

                let style = '';
                if (data[i].isOnline) {
                    style = 'border:5px solid springgreen;';
                }
                else {
                    let currentDate = new Date();
                    let diffTime = Math.abs(currentDate - disconnectDate);
                    let diffMinutes = Math.ceil(diffTime / (1000 * 60));
                    if (diffMinutes >= 60) {
                        diffMinutes = Math.ceil(diffMinutes / 60);
                        dateContent = `<span class='btn btn-warning' >Left ${diffMinutes} hours ago</span>`;
                    }
                    else {
                        dateContent = `<span class='btn btn-warning' >Left ${diffMinutes} minutes ago</span>`;
                    }
                    style = 'border:5px solid red;';
                }

                let item = `<div class='card' style='width:14rem;margin:5px;'>
                        <img style='${style}width:220px;height:220px;' src='/images/${data[i].imageUrl}' />
            <div class='card-body'>
            <h5 class='card-title'>${data[i].userName}</h5>
            <p class='card-text'>${data[i].email}</p>
${subContent}
            <p class='card-text mt-2'>${dateContent}</p>
</div>
</div>`
                content += item;
            }

            $("#allusers").html(content);
            GetFriends();
        }
    })

}