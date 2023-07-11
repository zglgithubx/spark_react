import {preSend} from "./request"
let websocket, lockReconnect = false;
// eslint-disable-next-line react-hooks/rules-of-hooks
let answer="";
let isEnd=false;
let createWebSocket = (url) => {
    websocket = new WebSocket(url);
    websocket.onopen = function () {
        heartCheck.reset().start();
    }
    websocket.onerror = function () {
        reconnect(url);
    };
    websocket.onclose = function (e) {
        console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
    }
    websocket.onmessage=(event)=> {
        const response = JSON.parse(event.data);
        //event 为服务端传输的消息，在这里可以处理
        if (0 === response.header.code) {
            const pl = response.payload;
            const temp = pl.choices.text;
            const jo = temp[0];
            answer+=jo.content;
            if (2 === response.header.status) {
                isEnd=true;
                // websocket.close();
            }
        } else {
            console.log("返回结果有误："+response.header.code+","+response.header.message)
        }
    }
}
let initConst=()=>{
    answer="";
    isEnd=false;
}
let sendMessage=(question)=>{
    websocket.send(preSend(question))
}
let reconnect = (url) => {
    if (lockReconnect) return;
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(function () {
        createWebSocket(url);
        lockReconnect = false;
    }, 4000);
}
let heartCheck = {
    timeout: 60000, //60秒
    timeoutObj: null,
    reset: function () {
        clearInterval(this.timeoutObj);
        return this;
    },
    start: function () {
        this.timeoutObj = setInterval(function () {
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            websocket.send("HeartBeat");
        }, this.timeout)
    }
}
//关闭连接
let closeWebSocket=()=> {
    websocket && websocket.close();
}
export {
    websocket,
    createWebSocket,
    closeWebSocket,
    sendMessage,
    answer,
    isEnd,
    initConst
};

