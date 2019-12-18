const showChannelContainer = document.getElementsByClassName('createChannel')[0];
const showDirectMessageContainer = document.getElementsByClassName('createDirectMessage')[0];
const createChannelContainer = document.getElementById("createChannel__container")
const createDirectMessageContainer = document.getElementById("createDirectMessage__container");
const overlay = document.getElementsByClassName('overlay')[0];
const errorText = document.getElementById('createChannel__error');
const successText = document.getElementById('createChannel__success');
const directMessageError = document.getElementById('createDirectMessage__error');
const joinChannelBtn = document.getElementById('joinChannelBtn');
const showAllChannelsContainer = document.getElementById('showChannels__container');
const editMessageContainer = document.getElementById('editMessage__container');
// const deleteMessageBtn = document.getElementById('deleteMessage');
// const editMessageBtn = document.getElementById('editMessage');
const cancelBtn = document.getElementById('cancel');

const exitBtn = document.querySelectorAll('.fa-times');

cancelBtn.addEventListener('click', () => {
    editMessageContainer.style.display = "none";
    overlay.style.display = "none";
})

joinChannelBtn.addEventListener('click', () => {
    showAllChannelsContainer.style.display = "block";
    overlay.style.display = "block";
});


showChannelContainer.addEventListener('click', () => {
    createChannelContainer.style.display = "block";
    overlay.style.display = "block";
});

showDirectMessageContainer.addEventListener('click', () => {
    createDirectMessageContainer.style.display = "block";
    overlay.style.display = "block";
});

overlay.addEventListener('click', () => {
    createChannelContainer.style.display = "none";
    createDirectMessageContainer.style.display = "none";
    showAllChannelsContainer.style.display = "none";
    showMembersContainer.style.display = "none";
    overlay.style.display = "none";
    errorText.innerText = "";
    successText.innerText = "";
    directMessageError.innerText = "";
    editMessageContainer.style.display = "none";
})

exitBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        createChannelContainer.style.display = "none";
        createDirectMessageContainer.style.display = "none";
        showAllChannelsContainer.style.display = "none";
        showMembersContainer.style.display = "none";
        overlay.style.display = "none";
        errorText.innerText = "";
        successText.innerText = "";
        directMessageError.innerText = "";
        editMessageContainer.style.display = "none";
    })
});


  