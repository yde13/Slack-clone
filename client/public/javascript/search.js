const directMessageInput = document.getElementsByClassName('createDirectMessage__input')[0];

/* Checking against the DB if the room name is available for the current user */ 
directMessageInput.addEventListener('input', (e) => {
    const searchValue = e.target.value;
    $.ajax({
        url: 'http://localhost:3000/chat/check-new-directMessage',
        method: 'POST',
        data: {'searchDirectMessage': searchValue}
    }).done(function (data) {
        let tr = document.querySelectorAll(".table-row");
        let index = 0;
        let maxRange = data.length;
        tr.forEach(row => {
            if(maxRange == 0){
                row.style.display = "none";
            }else{
                if(data[index].username == row.innerText.toLowerCase().replace(/\s/g, "")){
                    row.style.display = "block";
                    index++;
                    if(index == maxRange){
                        index = 0;
                    }
                }
                else{
                    row.style.display = "none";
                }
            }
        });
    });
});


