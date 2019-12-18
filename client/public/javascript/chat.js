const messageForm = document.getElementById('send')
const messageInput = document.getElementById('msgInput')

var today = new Date()
var time = today.getHours() + ":" + (today.getMinutes()<10?'0':'') + today.getMinutes()


messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    sendMessage(username,message,channelIDButton)
    messageInput.value = '';
    document.getElementById('isTyping').innerText = "";
})

function sendMessage(username,message,channelID) {
    $.ajax({
        url: 'http://localhost:3000/chat/new-message',
        method: 'POST',
        data: 
        {
            channelID: channelID,
            username: username,
            time: time,
            text: message
        }
    }).done(function(data){
        socket.emit('create_message', {channelID: channelID, username: username, time: time, text: message, msgID: data.id})
    });
}
