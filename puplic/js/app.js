let status = document.getElementById('status')
let inputMsg = document.getElementById('msgInp')
let SendBtn = document.getElementById('sendMsg')
let findBtn = document.getElementById('findStr')
let leaveBtn = document.getElementById('leaveBtn')
let msgContainer = document.getElementById('msgContainer')
disableForm(true,false,true)
let mode = 'leave'; // three modes [waitMode , leave, chatting]


let socket = io();
socket.on('connect', () => {
  console.log("new user is connected - Client -")
  setTimeout(() => {
    findBtn.addEventListener('click', ()=>{
      if(mode === 'leave'){
        status.innerHTML = `<div class="status-message muted"><div class="muteMsg">Please wait...connecting you to stranger</div><div class="loader"></div></div>`
          msgContainer.innerHTML = "";
          socket.emit('findStr');
      }else{
        return undefined
      }
    })
  }, 1500);
})

// function to disable buttuns
function disableForm(sendBol,FindBol, LeaveBol){
  SendBtn.disabled = sendBol
  findBtn.disabled = FindBol
  leaveBtn.disabled = LeaveBol
}


// ============ Search About Stranger ================
socket.on('canWriteNow', (data)=>{
  if(data.message === 'Please wait...connecting you to stranger'){
    status.innerHTML = `<div class="status-message muted"><div class="muteMsg">${data.message}</div><div class="loader"></div></div>`
    disableForm(true, true, true)
    mode = 'waitMode'
  }
  socket.on('toast', data =>{
    status.innerHTML = `<div class="status-message success">${data.message}</div>`
    disableForm(false , true, false)
    inputMsg.focus();
    mode = 'chatting'
  })
})

// ==================== Find Stranger =================




// ==================== Messenger Section =======================


inputMsg.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    SendBtn.click();
  }
});
function sendMessageToUi(){
  socket.emit('toServerMsg', inputMsg.value);
  inputMsg.value = '';
  inputMsg.focus();
};

SendBtn.addEventListener('click',()=>{
  if(mode === 'chatting' && inputMsg.value.trim() !== ''){
    sendMessageToUi()
  }else{
    return undefined
  }
})
socket.on('viewMsg', (data, windowID) =>{
  if(windowID === socket.id){
    msgContainer.innerHTML += `<li class='msg me'>${data}</li>`
  }else{
    msgContainer.innerHTML += `<li class='msg he'>${data}</li>`
  }
})
scrollChat()



// =============== WHEN USERS ARE TYPING ==================


// ----------->     TYPE YOU CODE HERE.........  


// function to scroll when update messages
function scrollChat(){
  msgContainer.addEventListener('DOMNodeInserted' ,()=> {
    msgContainer.scrollTo(0,msgContainer.scrollHeight);
  })
}

// =================== Leave Section ================

leaveBtn.addEventListener('click', ()=>{
  if(mode === 'chatting'){
    socket.emit('leave')
    mode = 'leave'
  }else{
    return undefined
  }
})

socket.on('leave',(data)=>{
  status.innerHTML = `<div class="status-message">${data.message}</div>`;
  disableForm(true,false, true)
  mode = 'leave'
})

