
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('load',()=>{window.scrollTo(0,0);setTimeout(()=>window.scrollTo(0,0),0)});
window.addEventListener('beforeunload',()=>window.scrollTo(0,0));

(()=>{
  const root=document.documentElement;
  const intro=document.getElementById('intro');
  const count=document.getElementById('count');

  // Compact floating header: keep the existing WEBWORK visual language,
  // remove the full-width header strip and keep the pill fixed to the viewport.
  const compactHeaderStyle=document.createElement('style');
  compactHeaderStyle.textContent=`
    body>header{
      position:fixed!important;
      z-index:1000!important;
      top:18px!important;
      left:0!important;
      right:0!important;
      width:100%!important;
      height:auto!important;
      padding:0!important;
      margin:0!important;
      background:transparent!important;
      border:0!important;
      box-shadow:none!important;
      transform:translateY(0)!important;
      transition:none!important;
    }
    body>header .wrap{width:min(780px,calc(100% - 28px))!important;margin:0 auto!important}
    body>header .nav{padding:8px 9px 8px 15px!important}
    body>header .links{gap:22px!important;color:#f4f4f4!important}
    body>header .links a{color:#f4f4f4!important}

    /* The long message in the black services card needs calmer proportions. */
    body .whatcard h3.whatcard-long{
      font-size:clamp(38px,4.15vw,64px)!important;
      line-height:.96!important;
      letter-spacing:-.06em!important;
      max-width:10.8ch!important;
    }
    body .whatcard h3.whatcard-long .whatcard-accent{
      display:block;
      margin-top:.12em;
      color:#d9ff3f;
      font-size:.82em;
      line-height:1.02;
      letter-spacing:-.045em;
    }
    body .whatcard p.whatcard-old-copy{display:none!important}

    /* SHIFT case */
    .shiftcase{padding-top:96px!important}
    .shiftcase-preview{display:block;position:relative;border:1px solid rgba(255,255,255,.14);border-radius:18px;overflow:hidden;background:#111;color:#fff;text-decoration:none;min-height:420px}
    .shiftcase-browser{display:flex;align-items:center;gap:7px;padding:12px 15px;border-bottom:1px solid rgba(255,255,255,.14);background:#141416}
    .shiftcase-browser i{width:9px;height:9px;border-radius:50%;background:#2e2e33;display:block}
    .shiftcase-browser span{margin-left:9px;font-size:11.5px;color:#85858c;font-family:ui-monospace,monospace}
    .shiftcase-screen{min-height:370px;display:flex;flex-direction:column;justify-content:space-between;padding:34px;background:radial-gradient(circle at 78% 22%,rgba(85,112,255,.34),transparent 30%),radial-gradient(circle at 20% 78%,rgba(217,255,63,.13),transparent 27%),#0d0d0f}
    .shiftcase-kicker{font:700 10px/1 "DM Sans",sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#8a8a91}
    .shiftcase-title{font:700 clamp(48px,6vw,86px)/.82 "Manrope",sans-serif;letter-spacing:-.075em;margin:0;text-transform:uppercase}
    .shiftcase-title em{font-style:normal;color:#d9ff3f}
    .shiftcase-bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;color:#a8a8ae;font-size:13px;line-height:1.45}
    .shiftcase-open{display:inline-flex;align-items:center;justify-content:center;padding:11px 16px;border-radius:999px;background:#fff;color:#111;font-weight:800;font-size:11px;white-space:nowrap}

    @media(max-width:760px){
      body>header{top:4px!important;padding:0!important}
      body>header .wrap{width:calc(100% - 8px)!important}
      body>header .nav{
        display:flex!important;
        flex-wrap:nowrap!important;
        align-items:center!important;
        justify-content:space-between!important;
        gap:6px!important;
        padding:6px 6px 6px 8px!important;
      }
      body>header .logo{
        flex:0 0 auto!important;
        gap:5px!important;
        font-size:14px!important;
      }
      body>header .logo .shiftmark{
        width:30px!important;
        height:22px!important;
      }
      body>header .links{
        display:flex!important;
        flex:0 1 auto!important;
        width:auto!important;
        min-width:0!important;
        justify-content:center!important;
        align-items:center!important;
        gap:10px!important;
        padding:0!important;
        margin-left:auto!important;
      }
      body>header .links a{
        display:block!important;
        white-space:nowrap!important;
        font-size:10.5px!important;
        line-height:1.2!important;
        color:#f4f4f4!important;
      }
      body>header .links a:nth-child(n+3){display:none!important}
      body>header .navcta{
        flex:0 0 auto!important;
        white-space:nowrap!important;
        padding:9px 10px!important;
        font-size:9.5px!important;
      }

      /* Two visual blank lines below the floating header, tighter gap above animation. */
      body main .hero{padding-top:132px!important}
      body main .hero-inner{
        min-height:0!important;
        justify-content:flex-start!important;
      }
      body main .hero-title{margin:25px 0 2px!important}
      body main .hero-cards{margin-top:0!important;gap:30px!important}

      body .whatcard h3.whatcard-long{
        font-size:9.6vw!important;
        line-height:.98!important;
        max-width:11.2ch!important;
      }
      body .whatcard h3.whatcard-long .whatcard-accent{
        font-size:.84em!important;
      }
      .shiftcase{padding-top:68px!important}
      .shiftcase-preview{min-height:330px}
      .shiftcase-screen{min-height:282px;padding:22px}
      .shiftcase-title{font-size:15vw}
      .shiftcase-bottom{font-size:11px}
      .shiftcase-open{padding:9px 12px;font-size:10px}
    }
  `;
  document.head.appendChild(compactHeaderStyle);

  const headerLinks=document.querySelector('.nav .links');
  if(headerLinks){
    headerLinks.innerHTML='<a href="#services">Послуги</a><a href="#prices">Ціни</a>';
    const trimHeaderLinks=()=>{
      [...headerLinks.querySelectorAll('a')].slice(2).forEach(a=>a.remove());
    };
    trimHeaderLinks();
    new MutationObserver(trimHeaderLinks).observe(headerLinks,{childList:true});
  }

  const serviceCardTitle=document.querySelector('.whatcard h3');
  if(serviceCardTitle){
    serviceCardTitle.classList.add('whatcard-long');
    serviceCardTitle.innerHTML='Від структури<br>й дизайну<br><span class="whatcard-accent">до запуску та<br>просування.</span>';
  }
  const serviceCardCopy=document.querySelector('.whatcard p');
  if(serviceCardCopy) serviceCardCopy.classList.add('whatcard-old-copy');

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

  const zaisunCase=document.querySelector('#work.realcase');
  if(zaisunCase && !document.getElementById('shift-case')){
    const shiftCase=document.createElement('section');
    shiftCase.className='realcase shiftcase';
    shiftCase.id='shift-case';
    shiftCase.innerHTML=`
      <div class="wrap">
        <div class="rc-head reveal">
          <div><div class="kicker">03.1 / Наш проєкт</div><span class="rc-badge">Живий сайт</span></div>
          <p class="section-copy">Ще один живий проєкт у портфоліо WEBWORK — з акцентом на сучасну подачу, анімації та адаптив.</p>
        </div>
        <div class="rc-grid reveal">
          <div class="rc-copy">
            <h3>SHIFT</h3>
            <p class="rc-sub">Кастомний сайт із сучасною візуальною системою, плавними переходами та адаптацією під телефон.</p>
            <div class="rc-block"><div class="rc-label">Що зроблено</div><ul>
              <li>Структура сторінки та логіка переходів</li>
              <li>Індивідуальна подача без готового шаблону</li>
              <li>Анімації та мікровзаємодії</li>
              <li>Повна мобільна адаптація</li>
            </ul></div>
            <div class="rc-block"><div class="rc-label">Розробка</div><ul>
              <li><b>Чистий код</b> без конструктора</li>
              <li>Оптимізована структура та швидке завантаження</li>
              <li>Готовність до подальшого розвитку</li>
            </ul></div>
            <a class="rc-link" href="https://shiftua.com/" target="_blank" rel="noopener">shiftua.com ↗</a>
          </div>
          <div>
            <a class="shiftcase-preview" href="https://shiftua.com/" target="_blank" rel="noopener" aria-label="Відкрити SHIFT">
              <div class="shiftcase-browser"><i></i><i></i><i></i><span>shiftua.com</span></div>
              <div class="shiftcase-screen">
                <div class="shiftcase-kicker">WEBWORK / LIVE PROJECT</div>
                <h3 class="shiftcase-title">SHIFT<br><em>UA</em></h3>
                <div class="shiftcase-bottom"><span>Кастомний сайт<br>Анімації / адаптив / чистий код</span><span class="shiftcase-open">Відкрити сайт ↗</span></div>
              </div>
            </a>
            <p class="rc-note">Натисніть на прев’ю, щоб відкрити живий сайт.</p>
          </div>
        </div>
      </div>`;
    zaisunCase.insertAdjacentElement('afterend',shiftCase);
    shiftCase.querySelectorAll('.reveal').forEach(x=>io.observe(x));
  }

  // Header stays attached to the viewport at all times.
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
