// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

function GetAllUsers() {


$.ajax({
    url: "/Home/GetAllUsers",
    method: "GET",
    success: function (data) {
        console.log(data);
        let content = "";
        for (var i = 0; i < data.length; i++) {
            let disconnectDate = new Date(data[i].disConnectTime);
            let dateContent = '';


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
            <p class='card-text mt-2'>${dateContent}</p>
</div>
</div>`
            content += item;
        }

        $("#allusers").html(content);
    }
})

}