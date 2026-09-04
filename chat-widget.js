(()=>{
  const ENDPOINT='https://script.google.com/macros/s/AKfycbxqmI7d5yqpwn2xtVlUhWwSViv1lK-KsAfLe-sG2lomRvcsjBLaFGu2dvPcfGbO9P4Q/exec';
  const SESSION_KEY='webwork_chat_session_v1';
  const HISTORY_KEY='webwork_chat_history_v1';
  const LAST_KEY='webwork_chat_last_v1';
  const MAX_HISTORY=60;

  const uid=()=>{
    try{return crypto.randomUUID().replace(/-/g,'')}catch(e){}
    return 'ww'+Date.now().toString(36)+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
  };

  let session='';
  try{session=localStorage.getItem(SESSION_KEY)||''}catch(e){}
  if(!session){session=uid();try{localStorage.setItem(SESSION_KEY,session)}catch(e){}}

  let history=[];
  try{history=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]')||[]}catch(e){history=[]}
  let lastId=Number(localStorage.getItem(LAST_KEY)||0)||0;
  let open=false;
  let unread=0;

  const style=document.createElement('style');
  style.textContent=`
    #wwChatLauncher{position:fixed;right:22px;bottom:22px;z-index:99980;border:0;border-radius:999px;background:#d9ff3f;color:#0a0a0b;box-shadow:0 16px 42px rgba(0,0,0,.28);font:700 14px/1 "DM Sans",sans-serif;padding:0 18px;height:54px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:.2s transform,.2s box-shadow}
    #wwChatLauncher:hover{transform:translateY(-2px);box-shadow:0 20px 48px rgba(0,0,0,.34)}
    #wwChatLauncher .ww-bubble{width:22px;height:22px;border-radius:7px;background:#0a0a0b;color:#fff;display:grid;place-items:center;font-size:13px}
    #wwChatLauncher .ww-unread{display:none;position:absolute;right:-3px;top:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:99px;background:#fff;color:#0a0a0b;border:2px solid #0a0a0b;font:800 10px/16px "DM Sans",sans-serif;text-align:center}
    #wwChatLauncher.has-unread .ww-unread{display:block}
    #wwChat{position:fixed;right:22px;bottom:88px;z-index:99981;width:min(380px,calc(100vw - 28px));height:520px;max-height:calc(100vh - 116px);background:#111214;border:1px solid rgba(255,255,255,.14);border-radius:22px;box-shadow:0 28px 80px rgba(0,0,0,.48);overflow:hidden;display:none;flex-direction:column;color:#fff;font-family:"DM Sans",sans-serif}
    #wwChat.open{display:flex}
    .ww-head{display:flex;align-items:center;justify-content:space-between;padding:16px 17px;border-bottom:1px solid rgba(255,255,255,.10);background:#151619}
    .ww-brand{display:flex;align-items:center;gap:10px}.ww-dot{width:9px;height:9px;border-radius:50%;background:#d9ff3f;box-shadow:0 0 0 5px rgba(217,255,63,.11)}
    .ww-brand b{display:block;font:800 13px/1.1 Manrope,sans-serif;letter-spacing:.02em}.ww-brand small{display:block;margin-top:4px;color:#8f9097;font-size:11px}
    .ww-close{width:34px;height:34px;border:1px solid rgba(255,255,255,.12);border-radius:11px;background:transparent;color:#c9cad0;font-size:19px;cursor:pointer}
    .ww-messages{flex:1;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:linear-gradient(180deg,#111214 0%,#0d0e10 100%)}
    .ww-welcome{max-width:88%;padding:12px 13px;border-radius:15px 15px 15px 5px;background:#1b1d20;color:#e4e5e9;font-size:13px;line-height:1.45;border:1px solid rgba(255,255,255,.08)}
    .ww-msg{max-width:86%;padding:10px 12px;border-radius:15px;font-size:13px;line-height:1.43;white-space:pre-wrap;word-break:break-word}
    .ww-msg.visitor{align-self:flex-end;background:#d9ff3f;color:#111214;border-bottom-right-radius:5px}
    .ww-msg.admin{align-self:flex-start;background:#202226;color:#f3f3f4;border:1px solid rgba(255,255,255,.09);border-bottom-left-radius:5px}
    .ww-time{display:block;margin-top:5px;font-size:9px;opacity:.58}
    .ww-compose{padding:12px;border-top:1px solid rgba(255,255,255,.10);background:#151619}
    .ww-compose-row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end}
    #wwChatInput{width:100%;min-height:46px;max-height:110px;resize:none;box-sizing:border-box;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:#0e0f11;color:#fff;padding:13px 13px;font:500 13px/1.4 "DM Sans",sans-serif;outline:none}
    #wwChatInput:focus{border-color:rgba(217,255,63,.6)}#wwChatInput::placeholder{color:#707178}
    #wwChatSend{height:46px;border:0;border-radius:14px;background:#d9ff3f;color:#0a0a0b;padding:0 15px;font:800 12px/1 "DM Sans",sans-serif;cursor:pointer}
    #wwChatSend:disabled{opacity:.55;cursor:wait}
    .ww-note{margin:8px 2px 0;color:#707178;font-size:9.5px;line-height:1.35}
    .ww-status{padding:0 16px 10px;color:#8b8c92;font-size:10px;min-height:14px;background:#151619}
    @media(max-width:640px){#wwChatLauncher{right:14px;bottom:14px;height:52px;padding:0 16px}#wwChat{right:8px;bottom:76px;width:calc(100vw - 16px);height:min(560px,calc(100vh - 90px));max-height:none;border-radius:20px}}
  `;
  document.head.appendChild(style);

  const launcher=document.createElement('button');
  launcher.id='wwChatLauncher';
  launcher.type='button';
  launcher.setAttribute('aria-label','Відкрити чат WEBWORK');
  launcher.innerHTML='<span class="ww-bubble">↗</span><span>Написати нам</span><span class="ww-unread">0</span>';

  const panel=document.createElement('section');
  panel.id='wwChat';
  panel.setAttribute('aria-label','Чат WEBWORK');
  panel.innerHTML=`
    <div class="ww-head">
      <div class="ww-brand"><span class="ww-dot"></span><div><b>WEBWORK</b><small>Відповідь з’явиться прямо тут</small></div></div>
      <button class="ww-close" type="button" aria-label="Закрити чат">×</button>
    </div>
    <div class="ww-messages" id="wwMessages"><div class="ww-welcome">Вітаю. Напишіть коротко, що потрібно: сайт, реклама, оцінка вартості або інше питання. Я відповім вам прямо в цьому чаті.</div></div>
    <div class="ww-compose">
      <div class="ww-compose-row"><textarea id="wwChatInput" maxlength="1500" placeholder="Напишіть повідомлення…"></textarea><button id="wwChatSend" type="button">Надіслати</button></div>
      <div class="ww-note">Не надсилайте паролі, дані карток або іншу секретну інформацію.</div>
    </div>
    <div class="ww-status" id="wwChatStatus"></div>`;

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  const messagesEl=panel.querySelector('#wwMessages');
  const input=panel.querySelector('#wwChatInput');
  const sendBtn=panel.querySelector('#wwChatSend');
  const statusEl=panel.querySelector('#wwChatStatus');
  const unreadEl=launcher.querySelector('.ww-unread');

  const saveHistory=()=>{
    history=history.slice(-MAX_HISTORY);
    try{localStorage.setItem(HISTORY_KEY,JSON.stringify(history))}catch(e){}
  };

  const fmtTime=(ts)=>{
    try{return new Date(ts||Date.now()).toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'})}catch(e){return''}
  };

  const addMessage=(role,text,ts,serverId,save=true)=>{
    const item={role,text:String(text||''),ts:ts||Date.now(),serverId:serverId||0};
    if(serverId && history.some(x=>Number(x.serverId)===Number(serverId))) return;
    history.push(item);
    const el=document.createElement('div');
    el.className='ww-msg '+(role==='admin'?'admin':'visitor');
    el.textContent=item.text;
    const t=document.createElement('span');t.className='ww-time';t.textContent=fmtTime(item.ts);el.appendChild(t);
    messagesEl.appendChild(el);
    messagesEl.scrollTop=messagesEl.scrollHeight;
    if(save)saveHistory();
  };

  history.forEach(m=>addMessage(m.role,m.text,m.ts,m.serverId,false));

  const setUnread=(n)=>{
    unread=Math.max(0,n||0);
    launcher.classList.toggle('has-unread',unread>0);
    unreadEl.textContent=String(Math.min(unread,99));
  };

  const toggle=(value)=>{
    open=typeof value==='boolean'?value:!open;
    panel.classList.toggle('open',open);
    launcher.setAttribute('aria-expanded',String(open));
    if(open){setUnread(0);setTimeout(()=>input.focus(),80);poll();}
  };

  launcher.addEventListener('click',()=>toggle());
  panel.querySelector('.ww-close').addEventListener('click',()=>toggle(false));

  const postMessage=async()=>{
    const text=input.value.trim();
    if(!text)return;
    input.value='';
    addMessage('visitor',text,Date.now(),0,true);
    sendBtn.disabled=true;statusEl.textContent='Надсилаємо…';
    try{
      await fetch(ENDPOINT,{
        method:'POST',mode:'no-cors',keepalive:true,
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body:JSON.stringify({type:'chat_message',session:session,message:text,page:location.href})
      });
      statusEl.textContent='Надіслано. Відповідь з’явиться тут.';
      setTimeout(()=>{if(statusEl.textContent.startsWith('Надіслано'))statusEl.textContent=''},3000);
    }catch(e){
      statusEl.textContent='Не вдалося надіслати. Спробуйте ще раз.';
    }finally{sendBtn.disabled=false;input.focus();}
  };

  sendBtn.addEventListener('click',postMessage);
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();postMessage()}});

  const jsonp=(url,timeout=9000)=>new Promise((resolve,reject)=>{
    const cb='wwchat_'+Date.now()+'_'+Math.random().toString(36).slice(2);
    const script=document.createElement('script');
    let done=false;
    const finish=(fn,arg)=>{if(done)return;done=true;clearTimeout(timer);delete window[cb];script.remove();fn(arg)};
    window[cb]=data=>finish(resolve,data);
    script.onerror=()=>finish(reject,new Error('jsonp_error'));
    const timer=setTimeout(()=>finish(reject,new Error('timeout')),timeout);
    script.src=url+(url.includes('?')?'&':'?')+'callback='+encodeURIComponent(cb);
    document.head.appendChild(script);
  });

  let polling=false;
  async function poll(){
    if(polling)return;
    polling=true;
    try{
      const url=ENDPOINT+'?action=chat_poll&session='+encodeURIComponent(session)+'&after='+encodeURIComponent(lastId)+'&admin_only=1';
      const data=await jsonp(url);
      if(data&&data.ok&&Array.isArray(data.messages)){
        let newCount=0;
        data.messages.forEach(m=>{
          const id=Number(m.id)||0;
          if(id>lastId)lastId=id;
          if(m.role==='admin'){
            addMessage('admin',m.message,m.timestamp,id,true);
            newCount++;
          }
        });
        try{localStorage.setItem(LAST_KEY,String(lastId))}catch(e){}
        if(newCount&&!open)setUnread(unread+newCount);
      }
    }catch(e){}finally{polling=false;}
  }

  poll();
  setInterval(()=>{if(document.visibilityState==='visible')poll()},open?4000:7000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')poll()});
})();
