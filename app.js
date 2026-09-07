
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('load',()=>{window.scrollTo(0,0);setTimeout(()=>window.scrollTo(0,0),0)});
window.addEventListener('beforeunload',()=>window.scrollTo(0,0));

(()=>{
  const root=document.documentElement;
  const intro=document.getElementById('intro');
  const count=document.getElementById('count');

  const headerBrandStyle=document.createElement('style');
  headerBrandStyle.textContent='header .logo .brand-work{color:#d9ff3f!important}';
  document.head.appendChild(headerBrandStyle);

  function setMainCtas(){
    const nav=document.querySelector('.navcta');
    if(nav) nav.textContent='Порахувати вартість ↗';

    const hero=document.querySelector('.hero .start a span:first-child');
    if(hero) hero.textContent='Порахувати вартість';

    document.querySelectorAll('#prices .pricecta').forEach(a=>{
      a.textContent='Порахувати вартість ↗';
    });

    document.querySelectorAll('#prices .price-preview').forEach(el=>el.remove());

    const submit=document.querySelector('#contact form button[type="submit"]');
    if(submit) submit.textContent='Порахувати вартість ↗';
  }
  setMainCtas();

  // WEBWORK is a one-person project: keep all author-side copy in first-person singular.
  const soloRules=[
    ['Що робимо','Що роблю'],
    ['Створюємо','Створюю'],
    ['Запускаємо','Запускаю'],
    ['Розвиваємо','Розвиваю'],
    ['Збираємо','Збираю'],
    ['Зробимо digital','Зроблю digital'],
    ['Після запуску ми не просто','Після запуску я не просто'],
    ['Ми дивимось','Я дивлюсь'],
    ['ми дивимось','я дивлюсь'],
    ['Ми відповімо','Я відповім'],
    ['ми відповімо','я відповім'],
    ['відповімо','відповім'],
    ['обговоримо','обговорю'],
    ['фіксуємо','фіксую'],
    ['визначимо','визначу'],
    ['можемо вносити ми','можу вносити'],
    ['підключимо','підключу'],
    ['підключаємо','підключаю'],
    ['працюємо','працюю'],
    ['робимо','роблю'],
    ['налаштовуємо','налаштовую'],
    ['аналізуємо','аналізую'],
    ['тестуємо','тестую'],
    ['оптимізуємо','оптимізую'],
    ['допомагаємо','допомагаю'],
    ['ведемо','веду'],
    ['готуємо','готую'],
    ['незалежна digital-студія','незалежний digital-спеціаліст']
  ];

  function soloText(text){
    let out=text;
    soloRules.forEach(([from,to])=>{out=out.split(from).join(to)});
    return out;
  }

  function applySoloCopy(scope=document.body){
    if(!scope)return;
    if(scope.nodeType===Node.TEXT_NODE){
      const next=soloText(scope.nodeValue||'');
      if(next!==scope.nodeValue)scope.nodeValue=next;
      return;
    }
    if(scope.nodeType!==Node.ELEMENT_NODE)return;
    if(['SCRIPT','STYLE','NOSCRIPT'].includes(scope.tagName))return;
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const parent=node.parentElement;
      if(parent&&['SCRIPT','STYLE','NOSCRIPT'].includes(parent.tagName))return;
      const next=soloText(node.nodeValue||'');
      if(next!==node.nodeValue)node.nodeValue=next;
    });
  }
  applySoloCopy();

  const soloObserver=new MutationObserver(mutations=>{
    mutations.forEach(m=>m.addedNodes.forEach(node=>applySoloCopy(node)));
  });
  if(document.body)soloObserver.observe(document.body,{childList:true,subtree:true});

  const legacyIntroText=document.querySelector('.intro-logo .wordclip')?.textContent?.replace(/\s/g,'')||'';
  const legacyBrand=/\bSHIFT\b/i.test(document.title)||legacyIntroText==='SHIFT';

  if(legacyBrand){
    try{
      localStorage.setItem('shift_intro_seen_v1','1');
      localStorage.setItem('webwork_intro_seen_v1','1');
      localStorage.setItem('webwork_intro_seen_v2','1');
    }catch(e){}

    root.classList.remove('show-intro');
    if(intro){intro.style.display='none';intro.remove()}

    const u=new URL(location.href);
    if(u.searchParams.get('wwfresh')!=='20260829b'){
      u.searchParams.set('wwfresh','20260829b');
      location.replace(u.toString());
      return;
    }

    document.title=document.title.replace(/\bSHIFT\b/gi,'WEBWORK');
    const desc=document.querySelector('meta[name="description"]');
    if(desc)desc.setAttribute('content',(desc.getAttribute('content')||'').replace(/\bSHIFT\b/gi,'WEBWORK'));
  }

  const firstVisit=!legacyBrand&&root.classList.contains('show-intro');
  if(firstVisit&&intro){
    let n=0;
    const timer=setInterval(()=>{
      n+=Math.ceil((100-n)*.17);if(n>=99)n=100;
      if(count)count.textContent=String(n).padStart(2,'0');
      if(n===100){
        clearInterval(timer);
        setTimeout(()=>{
          intro.classList.add('open');root.classList.remove('show-intro');
          try{localStorage.setItem('shift_intro_seen_v1','1');localStorage.setItem('webwork_intro_seen_v1','1');localStorage.setItem('webwork_intro_seen_v2','1')}catch(e){}
          setTimeout(()=>intro.remove(),1150);
        },220);
      }
    },55);
  }else if(intro){intro.remove()}

  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}
  }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(x=>io.observe(x));

  let last=0;
  const header=document.querySelector('header');
  addEventListener('scroll',()=>{
    const y=scrollY;
    if(header)header.style.transform=(y>last&&y>180)?'translateY(-120%)':'translateY(0)';
    last=y;
  },{passive:true});

  document.querySelectorAll('.case').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      if(innerWidth<900)return;
      const img=card.querySelector('img');if(!img)return;
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      img.style.transform=`scale(1.045) translate(${x*-10}px,${y*-8}px)`;
    });
    card.addEventListener('mouseleave',()=>{const img=card.querySelector('img');if(img)img.style.transform=''})
  });
})();

// Prevent the legacy SHIFT session loader from flashing.
try{sessionStorage.setItem('shift_boot_seen_v3','1')}catch(e){}

// Work section v27: mobile-first + clean concept previews + full-site mesh.
(()=>{const s=document.createElement('script');s.src='work-v23.js?v=20260907-w';s.defer=true;document.head.appendChild(s)})();

// WEBWORK support chat — website <-> Telegram bridge.
(()=>{if(document.querySelector('script[data-webwork-chat]'))return;const s=document.createElement('script');s.src='chat-widget.js?v=1';s.defer=true;s.dataset.webworkChat='1';document.head.appendChild(s)})();

// Direct contacts v55: phone, Telegram and email in the contact section.
(()=>{
  function mountDirectContacts(){
    const host=document.querySelector('#contact .ctabottom > div');
    if(!host || host.querySelector('.direct-contacts'))return;

    const box=document.createElement('div');
    box.className='direct-contacts';
    box.innerHTML=`
      <a href="tel:+380987064144" class="direct-contact-row" aria-label="Подзвонити 098 706 41 44">
        <span>Телефон</span><strong>098 706 41 44</strong><i>↗</i>
      </a>
      <a href="https://t.me/zaisan123" target="_blank" rel="noopener" class="direct-contact-row" aria-label="Написати в Telegram @zaisan123">
        <span>Telegram</span><strong>@zaisan123</strong><i>↗</i>
      </a>
      <a href="mailto:vodilazila@gmail.com" class="direct-contact-row" aria-label="Написати на vodilazila@gmail.com">
        <span>Email</span><strong>vodilazila@gmail.com</strong><i>↗</i>
      </a>`;
    host.appendChild(box);

    if(!document.getElementById('direct-contacts-style')){
      const style=document.createElement('style');
      style.id='direct-contacts-style';
      style.textContent=`
        .direct-contacts{margin-top:28px;border-top:1px solid rgba(10,10,11,.24);max-width:520px}
        .direct-contact-row{display:grid;grid-template-columns:90px minmax(0,1fr) 28px;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid rgba(10,10,11,.18);color:#0a0a0b;transition:transform .22s ease,opacity .22s ease}
        .direct-contact-row:hover{transform:translateX(6px);opacity:.72}
        .direct-contact-row span{font:700 10px/1 "DM Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.58}
        .direct-contact-row strong{font:700 clamp(17px,1.5vw,22px)/1.15 "Manrope",sans-serif;letter-spacing:-.025em;overflow-wrap:anywhere}
        .direct-contact-row i{font:600 20px/1 "Manrope",sans-serif;font-style:normal;text-align:right}
        @media(max-width:700px){.direct-contacts{margin-top:22px}.direct-contact-row{grid-template-columns:74px minmax(0,1fr) 24px;gap:10px;padding:13px 0}.direct-contact-row strong{font-size:16px}.direct-contact-row i{font-size:18px}}
      `;
      document.head.appendChild(style);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountDirectContacts,{once:true});
  else mountDirectContacts();
  setTimeout(mountDirectContacts,350);
  setTimeout(mountDirectContacts,1200);
})();
