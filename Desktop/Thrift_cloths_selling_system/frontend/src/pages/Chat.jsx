import { useEffect,useState,useRef } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import { Send,ArrowLeft } from 'lucide-react';
const socket=io('http://localhost:5000');
const Chat=()=>{
const {sellerId}=useParams();
const navigate=useNavigate();
const {user}=useAuth();
const [messages,setMessages]=useState([]);
const [chats,setChats]=useState([]);
const [text,setText]=useState('');
const [activeChat,setActiveChat]=useState(sellerId||null);
const bottomRef=useRef(null);
useEffect(()=>{if(user)socket.emit('join',user._id);api.get('/chat/chats').then(r=>setChats(r.data));},[user]);
useEffect(()=>{if(activeChat)api.get('/chat/'+activeChat).then(r=>setMessages(r.data));},[activeChat]);
useEffect(()=>{socket.on('receive_message',msg=>{if(msg.sender._id===activeChat||msg.receiver._id===activeChat)setMessages(p=>[...p,msg]);});return()=>{socket.off('receive_message');};},[activeChat]);
useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'});},[messages]);
const send=()=>{if(!text.trim()||!activeChat)return;socket.emit('send_message',{senderId:user._id,receiverId:activeChat,content:text});setText('');};
return <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-8rem)]">
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
<div className="card md:col-span-1 overflow-auto">
<h2 className="font-semibold mb-4">Messages</h2>
{chats.length===0?<p className="text-gray-500 text-sm">No conversations.</p>:
<div className="space-y-2">{chats.map(c=><button key={c.user._id} onClick={()=>setActiveChat(c.user._id)} className={'w-full text-left p-3 rounded-lg flex items-center gap-3 '+(activeChat===c.user._id?'bg-orange-50 border border-primary':'hover:bg-gray-50')}>
<div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">{c.user.name[0]}</div>
<div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{c.user.name}</p><p className="text-xs text-gray-500 truncate">{c.lastMessage}</p></div>
{c.unseenCount>0&&<span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{c.unseenCount}</span>}
</button>)}</div>}
</div>
<div className="card md:col-span-2 flex flex-col">
<div className="flex items-center gap-2 mb-4 border-b pb-3">
<button onClick={()=>navigate(-1)} className="md:hidden"><ArrowLeft size={20}/></button>
<h2 className="font-semibold">{activeChat?(chats.find(c=>c.user._id===activeChat)?.user.name||'Chat'):'Select a conversation'}</h2>
</div>
<div className="flex-1 overflow-auto space-y-3 mb-4">
{messages.map(m=><div key={m._id} className={'flex '+(m.sender._id===user._id?'justify-end':'justify-start')}>
<div className={'max-w-[70%] p-3 rounded-xl text-sm '+(m.sender._id===user._id?'bg-primary text-white rounded-br-none':'bg-gray-100 text-gray-800 rounded-bl-none')}>
<p>{m.content}</p>
<p className={'text-xs mt-1 '+(m.sender._id===user._id?'text-orange-100':'text-gray-400')}>{new Date(m.createdAt).toLocaleTimeString()}{m.seen&&m.sender._id===user._id?' Seen':''}</p>
</div>
</div>)}
<div ref={bottomRef}></div>
</div>
{activeChat&&<div className="flex gap-2">
<input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} className="input flex-1" placeholder="Type a message..." />
<button onClick={send} className="btn-primary px-4"><Send size={18}/></button>
</div>}
</div>
</div>
</div>;};export default Chat;