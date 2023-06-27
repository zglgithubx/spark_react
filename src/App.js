
import './App.css';
import React, {useEffect} from 'react';
import '@chatui/core/es/styles/index.less';
// 引入组件
import Chat, {Bubble, toast, useMessages} from '@chatui/core';
// 引入样式
import '@chatui/core/dist/index.css';

import {websocket,createWebSocket,sendMessage,answer,isEnd,initConst} from "./utils/websocket";
import {getUrl} from "./utils/request";


const initialMessages = [
  {
    type: 'text',
    content: { text: '你好，我是星火助理，你的贴心小助手~' },
    user: { avatar: '//117.50.162.61:3000/new-avatar.png' },
  }
];

const App = () => {
  useEffect(()=>{
    //完成之后执行一次
    create();
  },[])
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);
  function create(){
    getUrl().then(res=>{
      const reg = RegExp(/https/);
      if(reg.test(res)){
        const mes=res.replace("https:","wss:");
        createWebSocket(mes)
      }
    })
  }
  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function handleQuickReplyClick(item) {
    handleSend('text', item.name);
  }
  function handleSend(type, val) {
    if(websocket==undefined){
      toast.fail("无法连接服务，请刷新页面")
      return;
    }
    if(websocket.readyState>=2){
      toast.fail("连接已断开，请刷新页面")
      return;
    }
    if (type === 'text' && val.trim()) {
      //右边的消息
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
        user: { avatar: '//gw.alicdn.com/tfs/TB1U7FBiAT2gK0jSZPcXXcKkpXa-108-108.jpg' }
      });
      setTyping(true);
      sendMessage(val);
      //接收消息
      let timer=setInterval(function (){
        if(isEnd){
          clearInterval(timer);
          appendMsg({
            type: 'text',
            content: { text: answer },
            user: { avatar: '//117.50.162.61:3000/new-avatar.png' },
          })

        }
      },500);
      initConst();
      getUrl().then(res=>{
        const reg = RegExp(/https/);
        if(reg.test(res)){
          const mes=res.replace("https:","wss:");
          createWebSocket(mes)
        }
      })

    }
  }

  function renderMessageContent(msg) {
    const { content } = msg;
    return <Bubble content={content.text} />;
  }

  return (
    <Chat
      navbar={{ title: '星火助理' }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
    />);
};

export default App;
