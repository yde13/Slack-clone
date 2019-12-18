const socket = io.connect('http://localhost:3000')
const channels = document.querySelectorAll('.channel');
let chatMessages = document.getElementById('messages');
const createChannelInput = document.getElementsByClassName("createChannel__input")[0];
const channelsContainer = document.getElementsByClassName("channels__container")[0];
const tBodyChannel = document.getElementById('tbody_channels');
const headerName = document.getElementById('header__name');
const nrOfMembers = document.getElementById('nrOfMembers');
const nrOfMembersH1 = document.getElementById('nrOfMembersH1');
const innerContainer = document.getElementsByClassName('inner__container')[0];
let username = document.getElementById('username').innerText;
const directMessages = document.querySelectorAll(".directMessage");
const directMessageContainer = document.querySelector(".directMessage__container");
let createdDirectMessage = document.querySelectorAll('.createdDirectMessage');
const messageContainer = document.getElementById('messages')
const textContainer = document.getElementsByClassName('text')[0];
const msgInput = document.getElementById('msgInput');
let channelIDButton; 
let editMsgID;

createdDirectMessage.forEach(directMessage => {
    directMessage.addEventListener('click', (e) => {
        addRemoveActive(e, e.target.innerText, e.target.attributes[0].value, 'directMessage' );
    });
})

function addRemoveActive(e,username,id,checkValue ){
    console.log(id);
    let createdDirectMessage = document.querySelectorAll('.createdDirectMessage');
    document.querySelectorAll('.channel').forEach(directMessage => { directMessage.classList.remove('active'); });
    createdDirectMessage.forEach(channel => { channel.classList.remove('active'); });
    e.target.classList.add('active');
    joinChannel(username, id, checkValue);
}

socket.on('change_message', (data) => {
    document.getElementById(data.editMsgID).childNodes[2].innerText = data.newMessage;
    document.getElementById('changedValue').value = "";
});

socket.on('display_typing', (data) => {
    if(data.enteredValue == ""){
        document.getElementById('isTyping').innerText = "";
    }else{
        document.getElementById('isTyping').innerText = data.username + " skriver..."
    }
    
});

socket.on('add_directMessage',(data) => {
    let name;
    if(username.toLowerCase() == data.targetUsername){
        name = data.username;
    }else{
        name = data.targetUsername;
    }
    let linkElement = document.createElement('a');
    linkElement.setAttribute("name", data.targetID);
    linkElement.classList.add('createdDirectMessage');
    linkElement.innerText = name;
    linkElement.addEventListener('click', (e) => {
        addRemoveActive(e, e.target.innerText, e.target.attributes[0].value, 'directMessage' );
    })
    directMessageContainer.append(linkElement);
});

socket.on('remove_message', (data) => {
    document.getElementById(data.messageID).outerHTML = "";
})

socket.on('send_message', (data) => {
    let HTML;
    let messageElement = document.createElement('DIV');
    messageElement.classList.add('text-container');
    if(username == data.username){
        HTML = `<div class = "icon-container">
            <a name = ${data.msgID} class="fas fa-pen editMessage"></a>
            <a name = ${data.msgID} class="fas fa-trash-alt"></a>
        </div>`
    }else{
        HTML = ``;
    }
    messageElement.innerHTML = 
    `<div class = "title">
    <p class = "chat-name">${data.username}
        <span class = "chat-time">${data.time}</span>
    </p>
    ${HTML}
    </div>
    <div class = "chat-message">
        ${data.text}
    </div>`;
    messageElement.setAttribute('id',data.msgID)
    messageContainer.append(messageElement)
    textContainer.scrollTop = textContainer.scrollHeight;
    document.getElementById('isTyping').innerText = "";
    if(username.toLowerCase() == data.username.toLowerCase()){
        document.getElementsByName(data.msgID)[0].addEventListener('click', () => {
            editMsgID = data.msgID;
            editMessageContainer.style.display = "block";
            overlay.style.display = "block";
        });
        document.getElementsByName(data.msgID)[1].addEventListener('click', () => {
            $.ajax({
                url: 'http://localhost:3000/chat/message/delete/' + data.msgID,
                method: 'DELETE',
           }).done(function(status){
                socket.emit('delete_message', {messageID: data.msgID, channelID: channelIDButton});
           });
        });
    }    
})

/* Checking against the DB if the channel name is available for the current user */ 
createChannelInput.addEventListener('input', (e) => {
    const searchValue = e.target.value;
    $.ajax({
        url: 'http://localhost:3000/chat/check-new-channel',
        method: 'POST',
        data: {'searchChannel': searchValue}
    }).done(function (data) {
        if(!data.status){
            errorText.innerText = data.error;
            successText.style.display = "none";
            errorText.style.display = "block";
            createChannelBtn.disabled = true;
        }else{
            successText.innerText = data.success;
            successText.style.display = "block";
            errorText.style.display = "none";
            createChannelBtn.disabled = false;
        }
    })
});

channels.forEach(channel => {
    channel.addEventListener('click', (e) => {
        addRemoveActive(e, e.target.innerText, e.target.attributes[0].value, 'channels' );
    })
});

/* If the user clicks the "join channel", then we get the available channels.*/ 
joinChannelBtn.addEventListener('click', () => {
    channels.forEach(channel => {
        channel.classList.remove('active');
    });
    $.ajax({
        url: 'http://localhost:3000/chat/all-channels',
        method: 'GET',
    }).done(function (data) {
        tBodyChannel.innerHTML = "";
       data.map(channel => {
            let trTag = document.createElement('tr');
            trTag.classList.add('table-row-all-channels');
            trTag.innerHTML = '<td><a class = "channels">' + channel.name + '</a><input name =' + channel._id + ' type = "button" value = "Join"></td>';
            tBodyChannel.append(trTag);
            let allChannelsData = document.getElementsByName(channel._id);
            allChannelsData.forEach(channels => {
                channels.addEventListener('click', () => {
                    joinChannel(channel.name,channel._id, 'channels')
                })
            })
       });
    });
});

/* If the user clicks the join channel or sidebar channel */
function joinChannel(nameChannel,channelID, checkChoice){
    document.getElementById('isTyping').innerText = "";
    msgInput.value = "";
    console.log(channelID)
    channelIDButton = channelID;
    chatMessages.innerHTML = "";
    socket.emit('reset_users_channel', {socketID: socket.id, username: username})
    socket.emit('join_channel', {channelID: channelID, socketID: socket.id, username: username});
    socket.on('numberOfUsers', (users) => {
        nrOfMembers.innerHTML = '<i class="far fa-user"></i>' + users.numberOfUsers;
        nrOfMembersH1.innerHTML = '<i class="far fa-user"></i>' + users.numberOfUsers + ' - Members online';
        innerContainer.innerHTML = "";
        users.memberList.map(member => {
            let h1Tag = document.createElement('H1');
            h1Tag.innerText = member;
            innerContainer.append(h1Tag);
        });
    });
    $.ajax({
        url:'http://localhost:3000/chat/messages/' + channelID ,
        method: 'GET'
    }).done(function(data){
        if(checkChoice == 'channels'){
            headerName.innerText = "#" + nameChannel;
            data.map(message => {
                reCreateMsg(message);
            });
        }
        else{
            headerName.innerText = nameChannel;
            data.map(message => {
                reCreateMsg(message);
            });
        }
        exitBtn[0].click();
        textContainer.scrollTop = textContainer.scrollHeight;
    });
} 

function reCreateMsg(message){
    let HTML;
    let messageElement = document.createElement('DIV');
    messageElement.classList.add('text-container');
    if(username.toLowerCase() == message.username){
        HTML = `<div class = "icon-container">
            <a name = ${message._id} class="fas fa-pen editMessage"></a>
            <a name = ${message._id} class="fas fa-trash-alt"></a>
        </div>`
    }else{
        HTML = ``;
    }
    messageElement.innerHTML = 
    `<div class = "title">
    <p class = "chat-name">${message.username}
        <span class = "chat-time">${message.time}</span>
    </p>
    ${HTML}
    </div>
    <div class = "chat-message">
        ${message.text}
    </div>`;
    messageElement.setAttribute('id',message._id)
    messageContainer.append(messageElement)
    if(username.toLowerCase() == message.username){
        document.getElementsByName(message._id)[0].addEventListener('click', () => {
            let prevMessage = document.getElementById(message._id).childNodes[2].innerText.replace(/\s/g, "");
            document.getElementById('changedValue').value = prevMessage;
            editMsgID = message._id;
            editMessageContainer.style.display = "block";
            overlay.style.display = "block";
        });
        document.getElementsByName(message._id)[1].addEventListener('click', () => {
            $.ajax({
                url: 'http://localhost:3000/chat/message/delete/' + message._id,
                method: 'DELETE',
           }).done(function(data){
                socket.emit('delete_message', {messageID: message._id, channelID: channelIDButton});
           });
        });

    }
}
/* If the user clicks the "create" new channel btn, we sending the information to the client server */
createChannelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let name = document.getElementsByClassName('createChannel__input')[0].value;
    let description = document.getElementsByClassName('createChannel__input')[1].value;
    $.ajax({
        url:'http://localhost:3000/chat/new-channel',
        method: 'POST',
        data: {
            name: name,
            description: description
        }
    }).done(function(data){
        if(data.status){
            let linkTag = document.createElement('a');
            linkTag.innerHTML = '<i class = "fas fa-hashtag"></i>' + name;
            linkTag.classList.add('channel');
            linkTag.setAttribute('name', data.id);
            linkTag.addEventListener('click', (e) => {
                console.log("här")
                addRemoveActive(e, e.target.innerText ,e.target.attributes[0].value, 'channels' );
            })
            channelsContainer.append(linkTag);
            exitBtn[1].click();
        }
    });
})

    
   
    
    

