import axios from "axios";
import { toast } from '@chatui/core';
let APPID = "658a0987";
let serverUrl="http://192.168.164.69:8080"
//解决跨域后，sessionid丢失
axios.defaults.withCredentials = true;

let getUrl=async () => {
    let res,data;
    await axios.get(serverUrl+"/api/getTicket").then(async re => {
        data=re.data;
    }).catch(e=>{
        toast.fail(e.message)
    })
    await axios.post(serverUrl + "/api/getUrl", {"data": JSON.stringify(data)}).then(r => {
        res = r.data
    }).catch(e => {
        toast.fail(e.message)
    })
    return res;
}
function preSend(question){
    const frame = {};
    const header={};
    const chat={};
    const parameter={};
    const payload={};
    const message={};
    const text={};
    const ja=[];
    header["app_id"]=APPID;
    header["uid"]="123456789";
    chat["domain"]="general";
    chat["random_threshold"]=0;
    chat["max_tokens"]=1024;
    chat["auditing"]="default";
    parameter["chat"]=chat;
    text["role"]="user";
    text["content"]=question;
    ja[0]=text;
    message["text"]=ja;
    payload["message"]=message;
    frame["header"]=header;
    frame["parameter"]=parameter;
    frame["payload"]=payload;
    return JSON.stringify(frame);
}
export {
    preSend,getUrl
}
