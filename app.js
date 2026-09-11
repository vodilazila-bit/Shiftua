
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('load',()=>{window.scrollTo(0,0);setTimeout(()=>window.scrollTo(0,0),0)});
window.addEventListener('beforeunload',()=>window.scrollTo(0,0));

(()=>{
  const root=document.documentElement;
  const intro=document.getElementById('intro');
  const count=document.getElementById('count');

  // Compact floating header: keep the existing WEBWORK visual language,
  // only narrow it and keep the two useful section links.
  const compactHeaderStyle=document.createElement('style');
  compactHeaderStyle.textContent=`
    body>header{top:18px!important;left:0!important;right:0!important;padding:0!important;transform:none!important;transition:none!important}
    body>header .wrap{width:min(780px,calc(100% - 28px))!important;margin:0 auto!important}
    body>header .nav{padding:8px 9px 8px 15px!important}
    body>header .links{gap:22px!important}
    @media(max-width:760px){
      body>header{top:10px!important;padding:0!important}
      body>header .wrap{width:calc(100% - 20px)!important}
      body>header .nav{padding:7px 7px 7px 11px!important}
    }
  `;
  document.head.appendChild(compactHeaderStyle);

  document.querySelectorAll('.nav .links a').forEach(a=>{
    const href=a.getAttribute('href')||'';
    if(href!=='#services' && href!=='#prices') a.remove();
  });

  const headerBrandStyle=document.createElement('style');
  headerBrandStyle.textContent='header .logo .brand-work{color:#d9ff3f!important}';
  document.head.appendChild(headerBrandStyle);

  const navSlideStyle=document.createElement('style');
  navSlideStyle.textContent=`
    .nav .links a{opacity:0;transform:translateX(44px);will-change:transform,opacity}
    .nav-links-ready .nav .links a{animation:webwork-nav-slide .72s cubic-bezier(.16,1,.3,1) forwards}
    .nav-links-ready .nav .links a:nth-child(1){animation-delay:.00s}
    .nav-links-ready .nav .links a:nth-child(2){animation-delay:.07s}
    .nav-links-ready .nav .links a:nth-child(3){animation-delay:.14s}
    .nav-links-ready .nav .links a:nth-child(4){animation-delay:.21s}
    .nav-links-ready .nav .links a:nth-child(5){animation-delay:.28s}
    @keyframes webwork-nav-slide{from{opacity:0;transform:translateX(44px)}to{opacity:1;transform:translateX(0)}}
    @media(prefers-reduced-motion:reduce){.nav .links a{opacity:1!important;transform:none!important;animation:none!important}}
  `;
  document.head.appendChild(navSlideStyle);

  let navSlideStarted=false;
  function startNavSlide(){
    if(navSlideStarted)return;
    navSlideStarted=true;
    requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.add('nav-links-ready')));
  }

  function setMainCtas(){
    const nav=document.querySelector('.navcta');
    if(nav) nav.textContent='Порахувати вартість ↗';

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
          setTimeout(startNavSlide,260);
          try{localStorage.setItem('shift_intro_seen_v1','1');localStorage.setItem('webwork_intro_seen_v1','1');localStorage.setItem('webwork_intro_seen_v2','1')}catch(e){}
          setTimeout(()=>intro.remove(),1150);
        },220);
      }
    },55);
  }else{
    if(intro)intro.remove();
    setTimeout(startNavSlide,90);
  }

  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}
  }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(x=>io.observe(x));

  // Header stays attached to the viewport while the page moves, like the reference floating nav.
  const header=document.querySelector('header');
  if(header) header.style.transform='translateY(0)';

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
(()=>{const s=document.createElement('script');s.src='work-v23.js?v=20260908-compact-layout';s.defer=true;document.head.appendChild(s)})();
