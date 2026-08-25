(()=>{
  const faviconHref='/favicon.svg?v=1';
  const existing=document.querySelector('link[rel="icon"],link[rel="shortcut icon"]');
  if(existing){
    existing.setAttribute('href',faviconHref);
    existing.setAttribute('type','image/svg+xml');
  }else{
    const icon=document.createElement('link');
    icon.rel='icon';
    icon.type='image/svg+xml';
    icon.href=faviconHref;
    document.head.appendChild(icon);
  }
  if(!document.querySelector('link[rel="shortcut icon"]')){
    const shortcut=document.createElement('link');
    shortcut.rel='shortcut icon';
    shortcut.type='image/svg+xml';
    shortcut.href=faviconHref;
    document.head.appendChild(shortcut);
  }
})();

(()=>{
  const ui=document.createElement('style');
  ui.textContent=`
    #siteMesh{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:1;filter:brightness(1.18) contrast(1.08)}
    body>header,body>main,body>footer{position:relative;z-index:1}
    .hero .grid{display:none!important}
    .hero:before{background:radial-gradient(circle at 77% 24%,rgba(85,112,255,.18),transparent 29%),radial-gradient(circle at 20% 68%,rgba(255,81,58,.10),transparent 27%),rgba(10,10,11,.58)!important}
    @media(min-width:761px){.hero-top{transform:translateY(-92px)}}
    .deliverables{background:rgba(10,10,11,.88)!important}
    .growth{background:rgba(18,18,21,.82)!important}
    .faq{background:rgba(17,17,20,.88)!important}
    .prices{background:rgba(10,10,11,.35)}
    .what{background:rgba(241,239,232,.96)!important}
    .ticker{background:rgba(10,10,11,.58)}

    #concepts .kicker{color:#d9ff3f!important;font-size:12px!important;font-weight:800!important;letter-spacing:.16em!important}
    #concepts .section-title{line-height:.94!important;color:#fff!important}
    #concepts .section-title em{color:#d9ff3f!important}
    #concepts .section-head{margin-bottom:40px!important}

    .startBrief{margin:0 0 34px;border:1px solid rgba(255,255,255,.13);border-radius:24px;overflow:hidden;background:rgba(255,255,255,.025)}
    .startBriefHead{display:flex;justify-content:space-between;gap:24px;align-items:end;padding:24px 28px;border-bottom:1px solid rgba(255,255,255,.12)}
    .startBriefHead span{font:700 12px/1.2 "DM Sans",sans-serif;text-transform:uppercase;letter-spacing:.12em;color:#fff}
    .startBriefHead p{margin:0;color:#8e8e95;font-size:12px;line-height:1.5;max-width:430px}
    .startBriefGrid{display:grid;grid-template-columns:repeat(3,1fr)}
    .startBriefItem{min-height:120px;padding:22px 28px;border-right:1px solid rgba(255,255,255,.1);border-bottom:1px solid rgba(255,255,255,.1)}
    .startBriefItem:nth-child(3n){border-right:0}.startBriefItem:nth-child(n+4){border-bottom:0}
    .startBriefItem small{display:block;color:#d9ff3f;font:700 9px/1.2 "DM Sans",sans-serif;letter-spacing:.13em;text-transform:uppercase;margin-bottom:10px}
    .startBriefItem b{display:block;color:#fff;font:600 18px/1.1 "Manrope",sans-serif;letter-spacing:-.025em;margin-bottom:7px}
    .startBriefItem p{margin:0;color:#919198;font-size:11px;line-height:1.5}

    /* v41: one standalone arrow across growth and brief cards */
    .growthitem,.startBriefItem{position:relative;overflow:hidden}
    .sectionGlyph{display:block;color:#d9ff3f;transition:transform .32s cubic-bezier(.2,.8,.2,1),opacity .28s}
    .sectionGlyph svg{width:100%;height:100%;display:block;overflow:visible}
    .sectionGlyph path{fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:square;stroke-linejoin:miter;vector-effect:non-scaling-stroke}
    #growth .growthitem .sectionGlyph{position:absolute;right:20px;top:20px;width:38px;height:38px}
    #growth .growthitem:hover .sectionGlyph{transform:translate(4px,-4px)}
    .startBriefItem{padding-right:72px}
    .startBriefItem .sectionGlyph{position:absolute;right:24px;top:22px;width:28px;height:28px;color:#d9ff3f;opacity:.82}
    .startBriefItem:hover .sectionGlyph{transform:translate(3px,-3px);opacity:1}

    .modernCta{display:inline-flex!important;align-items:center!important;justify-content:space-between!important;gap:14px!important;transition:transform .28s cubic-bezier(.2,.8,.2,1),background-color .28s,color .28s,border-color .28s!important}
    .modernCta .modernArrow{width:34px;height:34px;flex:0 0 34px;border-radius:50%;display:inline-grid;place-items:center;background:#d9ff3f;color:#0a0a0b;transition:transform .32s cubic-bezier(.2,.8,.2,1),background-color .28s,color .28s}
    .modernCta .modernArrow svg{width:15px;height:15px;display:block;overflow:visible}
    .modernCta:hover{transform:translateY(-2px)}
    .modernCta:hover .modernArrow{transform:rotate(45deg) scale(1.07)}
    .navcta.modernCta{padding:8px 9px 8px 20px!important;min-height:54px!important;border-radius:999px!important;box-shadow:0 0 0 1px rgba(255,255,255,.13) inset!important}
    .navcta.modernCta .modernArrow{width:38px;height:38px;flex-basis:38px;background:#101012;color:#fff}
    .navcta.modernCta:hover{background:#d9ff3f!important;color:#0a0a0b!important}
    .navcta.modernCta:hover .modernArrow{background:#0a0a0b;color:#d9ff3f}
    .pricecta.modernCta,.z34Btn.modernCta{padding-right:9px!important}
    .case-open.modernCta{width:max-content}

    @media(max-width:760px){
      #concepts .section-head{margin-bottom:28px!important}
      .startBriefHead{display:block;padding:20px}.startBriefHead p{margin-top:9px}
      .startBriefGrid{grid-template-columns:1fr 1fr}
      .startBriefItem{padding:19px 58px 19px 20px;min-height:112px}
      .startBriefItem .sectionGlyph{right:15px;top:17px;width:24px;height:24px}
      #growth .growthitem .sectionGlyph{right:17px;top:17px;width:32px;height:32px}
      .startBriefItem:nth-child(3n){border-right:1px solid rgba(255,255,255,.1)}
      .startBriefItem:nth-child(2n){border-right:0}
      .startBriefItem:nth-child(n+4){border-bottom:1px solid rgba(255,255,255,.1)}
      .startBriefItem:nth-child(n+5){border-bottom:0}
      .modernCta .modernArrow{width:30px;height:30px;flex-basis:30px}
      .navcta.modernCta{padding:7px 8px 7px 15px!important;min-height:48px!important}
      .navcta.modernCta .modernArrow{width:34px;height:34px;flex-basis:34px}
    }
  `;
  document.head.appendChild(ui);

  document.getElementById('heroMesh')?.remove();
  document.getElementById('siteMesh')?.remove();

  const canvas=document.createElement('canvas');
  canvas.id='siteMesh';
  document.body.prepend(canvas);
  const ctx=canvas.getContext('2d');
  if(!ctx)return;

  let w=0,h=0,dpr=1,raf=0;
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    dpr=Math.min(devicePixelRatio||1,1.65);
    w=innerWidth;
    h=innerHeight;
    canvas.width=Math.round(w*dpr);
    canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function point(u,z,t){
    const cx=w*.5,p=1.08+z*.26; // keep the animated grid wider than the viewport at every depth
    let x=cx+(u-.5)*w*p;
    const horizon=-h*.10;
    const base=horizon+Math.pow(z,1.15)*h*1.25; // extend the grid beyond both vertical viewport edges
    const sp=(u-.5)*Math.PI*2;
    const s=t*.00030,s2=t*.00017;
    const w1=Math.sin(sp*1.55+z*5.1+s);
    const w2=Math.sin(sp*3.15-z*7.3-s2);
    const w3=Math.cos(sp*.78+z*8.9+s*.55);
    const amp=h*(.025+.125*Math.pow(z,.92));
    const y=base+amp*(w1*.62+w2*.25+w3*.20);
    x+=Math.sin(z*8.5+sp*.7+s2)*(2+8*z);
    return[x,y];
  }

  function draw(t=0){
    ctx.clearRect(0,0,w,h);
    ctx.lineCap='round';
    ctx.lineJoin='round';
    const rows=innerWidth<760?38:48;
    const cols=innerWidth<760?44:72;
    for(let r=0;r<rows;r++){
      const z=r/(rows-1);ctx.beginPath();
      for(let c=0;c<=cols;c++){const[x,y]=point(c/cols,z,t);c?ctx.lineTo(x,y):ctx.moveTo(x,y)}
      const a=.055+.235*Math.pow(z,1.08);ctx.strokeStyle=`rgba(224,228,233,${a.toFixed(3)})`;ctx.lineWidth=.55+.55*z;ctx.stroke();
    }
    for(let c=0;c<=cols;c++){
      const u=c/cols;ctx.beginPath();
      for(let r=0;r<rows;r++){const[x,y]=point(u,r/(rows-1),t);r?ctx.lineTo(x,y):ctx.moveTo(x,y)}
      const edge=Math.abs(u-.5)*2,a=.07+.11*(1-edge*.55);ctx.strokeStyle=`rgba(220,224,230,${a.toFixed(3)})`;ctx.lineWidth=.55;ctx.stroke();
    }
    if(!reduceMotion)raf=requestAnimationFrame(draw);
  }

  resize();
  addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw(performance.now())},{passive:true});
  draw(performance.now());
})();

// v48 — restored the original softer animated grid brightness.
(()=>{
  const navLinks=document.querySelector('.nav .links');
  if(navLinks&&!navLinks.querySelector('a[href="#contact"]')){
    const contactLink=document.createElement('a');
    contactLink.href='#contact';
    contactLink.textContent='Контакти';
    navLinks.appendChild(contactLink);
  }

  const arrowMarkup='<span class="modernArrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

  function modernizeArrows(){
    document.querySelectorAll('a,button,.case-open').forEach(el=>{
      if(el.classList.contains('modernCta'))return;
      if(!el.textContent.includes('↗'))return;
      el.innerHTML=el.innerHTML.replace(/↗/g,'').replace(/<span[^>]*>\s*<\/span>/g,'');
      el.classList.add('modernCta');
      el.insertAdjacentHTML('beforeend',arrowMarkup);
    });
  }

  function sectionGlyph(paths){
    return '<span class="sectionGlyph" aria-hidden="true"><svg viewBox="0 0 36 36">'+paths+'</svg></span>';
  }

  function installSectionVisuals(){
    const arrow='<path d="M7 29L29 7"/><path d="M18 7H29V18"/>';
    document.querySelectorAll('#growth .growthitem,.startBriefItem').forEach(el=>{
      const existing=el.querySelector('.sectionGlyph');
      if(existing)existing.remove();
      el.insertAdjacentHTML('afterbegin',sectionGlyph(arrow));
    });
  }

  function applySiteTweaks(){
    const conceptKicker=document.querySelector('#concepts .kicker');
    const conceptTitle=document.querySelector('#concepts .section-title');
    if(conceptKicker)conceptKicker.textContent='03.2 / КОНЦЕПТИ';
    if(conceptTitle)conceptTitle.innerHTML='Варіанти концептів:<br><em>сайти під ваш бізнес.</em>';

    const priceCopy=document.querySelector('#prices .section-copy');
    if(priceCopy)priceCopy.textContent='Приблизні пакети послуг. Остаточна ціна залежить від обсягу сторінок, функцій, інтеграцій та контенту.';

    const processWrap=document.querySelector('#process .wrap');
    const processHead=processWrap?.querySelector('.section-head');
    if(processWrap&&processHead&&!processWrap.querySelector('.startBrief')){
      const brief=document.createElement('div');
      brief.className='startBrief reveal on';
      brief.innerHTML=`
        <div class="startBriefHead"><span>Що потрібно від вас на старті</span><p>Достатньо коротко відповісти на ці пункти — структуру, сценарій і технічні рішення вже збираємо ми.</p></div>
        <div class="startBriefGrid">
          <div class="startBriefItem"><small>01</small><b>Бізнес</b><p>Чим займаєтесь, що продаєте або які послуги надаєте.</p></div>
          <div class="startBriefItem"><small>02</small><b>Мета</b><p>Заявки, продажі, презентація компанії, запуск реклами чи інша задача.</p></div>
          <div class="startBriefItem"><small>03</small><b>Аудиторія</b><p>Хто ваш клієнт і на яку географію працює бізнес.</p></div>
          <div class="startBriefItem"><small>04</small><b>Матеріали</b><p>Логотип, фото, тексти, прайс або каталог. Якщо чогось немає — скажіть.</p></div>
          <div class="startBriefItem"><small>05</small><b>Орієнтири</b><p>Конкуренти та 2–3 сайти, які подобаються або точно не подобаються.</p></div>
          <div class="startBriefItem"><small>06</small><b>Рамки</b><p>Бажаний термін запуску та приблизний бюджетний орієнтир.</p></div>
        </div>`;
      processHead.insertAdjacentElement('afterend',brief);
    }

    document.querySelectorAll('.z34DoneItem h4').forEach(h=>{
      if(h.textContent.includes('Видно не кліки'))h.textContent='Бачимо, яка реклама дає продажі';
    });
    document.querySelector('.z34Bottom')?.remove();
    modernizeArrows();
    installSectionVisuals();
  }

  applySiteTweaks();

  const load=(src,key)=>new Promise((resolve,reject)=>{
    if(key&&document.querySelector(`script[data-${key}]`)){resolve();return;}
    const el=document.createElement('script');
    el.src=src;el.defer=true;
    if(key)el.dataset[key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]='1';
    el.onload=resolve;el.onerror=reject;
    document.head.appendChild(el);
  });

  // Lead form stays local so form changes are not blocked by jsDelivr cache.
  load('form-handler.js?v=38','shift-form-handler').catch(()=>{});

  const start=document.querySelector('script[data-zaisun-case-v28]')
    ? Promise.resolve()
    : load('zaisun-case-v28.js?v=38','zaisun-case-v28');

  start.then(()=>load('zaisun-case-v31.js?v=42','zaisun-case-v31')).then(()=>{
    applySiteTweaks();
    setTimeout(applySiteTweaks,150);
  }).catch(()=>{});
})();
