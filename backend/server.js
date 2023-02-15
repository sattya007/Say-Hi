const path =require("path")//path use kori absolute path bar korar jonne
const express = require("express");//ei 2line diye app er moddhe express er sob functions niye nilam
const app=express();
const http=require("http");//http server banate http nite hobe
const server=http.Server(app);//sob kichu server er moddhe niye nilam...ekhon ekta server ache...jar moddhe express use korte pari, tai app pass korchi
const socket =require("socket.io");//socket server banate socket nite hobe 
const io=socket(server);// http r socket co-exist korche same port number e

server.listen(process.env.PORT||3000,()=>{//server listen korbe 3000 number port e
    console.log("run hoche");
});

function getCurrentUser(id){
    return users.find((data)=>{return data.id===id});
}
function userLeave(id)
{
    const idx=users.findIndex((data)=>{return data.id===id});
    if(idx!==-1)
    {
        const arr=users.splice(idx,1);
        console.log(arr[0]);
        return arr[0];
    }
}
app.use(express.static(__dirname + '/./frontend'))//express use kora kalin server k bolar jonne j tui jodi kono file na pash,tale tui __dirname + frontend er moddhe khujbi
app.get('/',function(req,res){
    res.sendFile(path.resolve(__dirname+'/./frontend/index.html'));//respond korte gele sendfile function absolute path chai 
})
const users=[];
io.on('connection',(socket)=>{//io.on holo listner je individual tab er information dai socket k
    socket.on('join room',({username,room})=>{//client er event , server ekhn dhorlo
        const id=socket.id;
        users.push({username,id,room});
        io.emit("update users",users.map((n)=>{
            return '<li>' + n.username+ '</li>';
        }))       
       //parameter assign kora holo users dictionary tai
        socket.broadcast.emit('new user join',{name: username,room: room});//server info(broadcast) patache baki client der j ekjon notun dhukeche , j client server k pathiyechilo sai client baad e
    });
    socket.on('disconnect',()=>{//jodi kono tab close hoi tale ekta client bar hoche etar mane server er kache ekta default event 'disconnect' cholejache
        const user=userLeave(socket.id);  
        console.log("user disonnected");
          io.emit("update users",users.map((n)=>{
            return '<li>' + n.username+ '</li>';})) 
        socket.broadcast.emit('user left',user.username);//disconnect korle , kon client ta cholejache seta pabar jonne amra 'users' array use korchi
       }); 
    socket.on("new-message",(message)=>{//server theke ekta notun message client e jabe
        const user=getCurrentUser(socket.id);
        let currentDate = new Date();
        let time= currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
        socket.broadcast.emit("message-receive",{message:message,name:user.username,time : time});//sob client e sai notun message ta broadcast hobe , server theke charar por
    });  
    socket.on("is typing",username=>{//server on dara sunche , client er chara ta(emit), client theke 'is typing' event sunche
        socket.broadcast.emit("someone is typing",username);//sai client baad e , baki client der server "someone is typing" event ta broad cast korbe
    })
    socket.on("not typing",(username)=>{
        socket.broadcast.emit("no one is typing",username);
    })
});
