const socket=io();
const users=[];
const {username,room}=Qs.parse(location.search,{//url er moddhe username r room niche
    ignoreQueryPrefix:true//operator gulo k avoid korche
});
$("#room-name")[0].innerText=room;
socket.emit('join room',{username,room});//client even charche, username r room holo parameter
socket.on('new user join',({name,room})=>{//server theke client details ta pelo
    let currentDate = new Date();
    let time= currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    append(null,`${name} has joined the chat`,time,'middle');//ei function ta notun client er notification append korche 
})
socket.on('user left',(username)=>{//if a user left the chat then we need to inform the server and have the details
    let currentDate = new Date();
    let time= currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    append(null,`${username} has left the chat`,time,'middle')
})
function append(user,message,time,position){
    if(position === 'middle')//if someone joied or left then position will be at middle
    {
        const new_element= `<div class ="message">
        <p class = "meta center-text"> ${message} <span> ${time} </span></p>
            </div>`;
        $(".chat-messages").append($(new_element));                       
    }   
    else if(position==="right-align")//client will message at right-side and client's message will be at message variable
    {
        console.log("aaa");
        const new_element= `
        <div>
            <div class="bubble bubble-bottom-left right-align">
            <p class="text"> ${message} </p>
            </div>
        <p class="meta-2 right-align"><span> ${user} ${time} </span> </p>
        </div>`;
        $(".chat-messages").append($(new_element)); 

    }
    else if(position==="left-top")//another person will message to the client and it will show at lefthand side
    {
        console.log("yfghyjfv");
        const new_element= `
        <div>
            <div class="bubble bubble-bottom-left">
            <p class="text"> ${message} </p>
            </div>
        <p class="meta-2"><span> ${user} ${time} </span> </p>
        </div>`;
        $(".chat-messages").append($(new_element)); 
    }
}
$("#chat-form").on('submit',(e)=>{//submit is a event where a message is sent and after that it will be displayed
    e.preventDefault();
    const message=$("#msg").val();
    console.log(message);
    if(message)
    {
    let currentDate = new Date();
    let time= currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    append(username,message,time,"right-align");
    $("#msg").val("");
    socket.emit("new-message",message);
    }
})
socket.on("message-receive",(copy_data)=>{
    append(copy_data.name,copy_data.message,copy_data.time,"left-top");
})
setInterval(()=>{//specific time borabor call back function call kore
    if($("#msg").val())//emit event pathabe jodi client input e kichu lekhe
    {
        socket.emit("is typing",username);//likhle 'is typing' event r tar sathe username o server k pathabe emit er maddhome
    }
    else{
        socket.emit("not typing",username);//kichu na likhle 'is not typing' event r tar sathe username o server k pathabe emit er maddhome

    }
},50);
socket.on("someone is typing",username=>{//client side er j socket ta ache , se sunbe(on) server side er socket theke(emit)
    if( $(".isTyping")[0].innerText===""){//prothom bar er jonne
    $(".isTyping")[0].innerText=`${username} is typing...`;//client jodi kichu lekhe, tale seta show korbe r kono blink o hobena
    }
})
socket.on("no one is typing",(username)=>{
    $(".isTyping")[0].innerText="";//jodi kono kichu na lekha thake..tale null e as usual dekhabe but still ota amader initialize korte hobe
});
socket.on("update users",(dataList)=>{
    const userlist=dataList.join("");
    $("#users")[0].innerHTML=userlist;
})