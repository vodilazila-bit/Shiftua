(()=>{
  // v27: mobile-first polish, clean concept previews, session loader and full-site mesh.
  const ui=document.createElement('style');
  ui.textContent=`
    #siteMesh{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:1;filter:brightness(1.18) contrast(1.08)}
    body>header,body>main,body>footer{position:relative;z-index:1}
    .hero .grid{display:none!important}.hero:before{background:radial-gradient(circle at 77% 24%,rgba(85,112,255,.18),transparent 29%),radial-gradient(circle at 20% 68%,rgba(255,81,58,.10),transparent 27%),rgba(10,10,11,.58)!important}
    .deliverables{background:rgba(10,10,11,.88)!important}.growth{background:rgba(18,18,21,.82)!important}.faq{background:rgba(17,17,20,.88)!important}.prices{background:rgba(10,10,11,.35)}.what{background:rgba(241,239,232,.96)!important}.ticker{background:rgba(10,10,11,.58)}

    /* compact, clean portfolio cards */
    .concept-case{isolation:isolate;background:#111!important}
    .concept-case>img,.concept-case>.concept-slide{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;opacity:0!important;transform:scale(1.035)!important;transition:opacity .85s ease,transform 6.5s linear!important;filter:saturate(.9) contrast(1.02)!important;z-index:0}
    .concept-case>img.active,.concept-case>.concept-slide.active{opacity:1!important;transform:scale(1)!important}
    .concept-case:after{z-index:1!important;background:linear-gradient(to top,rgba(0,0,0,.76) 0%,rgba(0,0,0,.34) 30%,transparent 58%)!important}
    .concept-case .case-meta,.concept-case .case-bottom,.concept-case .case-open{opacity:0;transform:translateY(24px);transition:opacity .58s ease,transform .7s cubic-bezier(.2,.8,.2,1)}
    .concept-case .case-bottom{transition-delay:.08s}.concept-case .case-open{transition-delay:.15s}
    .concept-case.is-copy-visible .case-meta,.concept-case.is-copy-visible .case-bottom,.concept-case.is-copy-visible .case-open{opacity:1;transform:none}
    .concept-case .case-meta{top:20px!important;left:22px!important;right:22px!important;font-size:9px!important;color:rgba(255,255,255,.82)!important}
    .concept-case .case-bottom{left:22px!important;right:22px!important;bottom:22px!important;gap:18px!important;align-items:flex-end!important}
    .concept-case h3{font-size:clamp(38px,4.6vw,66px)!important;line-height:.86!important;max-width:7ch!important;text-shadow:0 2px 20px rgba(0,0,0,.28)}
    .concept-case p{max-width:250px!important;font-size:12px!important;line-height:1.42!important;color:rgba(255,255,255,.8)!important}
    .concept-case .case-open{top:18px!important;right:18px!important;bottom:auto!important;padding:9px 13px!important;border-radius:999px!important;background:#d9ff3f!important;color:#0a0a0b!important;font-size:10px!important;font-weight:800!important;letter-spacing:.04em!important;text-transform:uppercase!important;box-shadow:0 8px 28px rgba(0,0,0,.18)!important}
    .concept-case:hover .case-open{color:#0a0a0b!important;transform:translateY(-2px)!important}

    /* session loader for returning visitors */
    #shiftBoot{position:fixed;inset:0;z-index:10050;background:#080809;color:#fff;display:grid;place-items:center;overflow:hidden;transition:opacity .55s ease,visibility .55s ease}
    #shiftBoot.done{opacity:0;visibility:hidden}
    .shiftBootCore{display:flex;align-items:center;gap:14px;font:800 clamp(42px,8vw,88px)/1 Manrope,sans-serif;letter-spacing:-.07em}
    .shiftBootMark{width:.9em;height:.9em;display:block}.shiftBootMark svg{display:block;width:100%;height:100%}
    .shiftBootMeta{position:absolute;left:22px;right:22px;bottom:22px;display:grid;grid-template-columns:1fr minmax(120px,220px) 34px;gap:16px;align-items:center;color:#74747b;font:700 9px/1.2 "DM Sans",sans-serif;letter-spacing:.12em;text-transform:uppercase}
    .shiftBootBar{height:2px;background:#222225;overflow:hidden}.shiftBootBar i{display:block;height:100%;width:0;background:#d9ff3f;animation:shiftBootLoad 1.15s ease forwards}@keyframes shiftBootLoad{to{width:100%}}

    @media(max-width:760px){
      .wrap{width:calc(100% - 28px)!important}.block,.cases,.deliverables{padding:66px 0!important}header{padding:8px 0!important}.nav{padding:7px 7px 7px 11px!important}.logo{font-size:16px!important}.logo .shiftmark{width:23px!important;height:23px!important}.navcta{padding:10px 11px!important;font-size:10px!important}.links{display:none!important}
      .hero{min-height:auto!important;padding:90px 0 18px!important}.hero-inner{min-height:calc(100svh - 108px)}.hero-top{display:block!important}.hero-copy{max-width:100%!important;font-size:13.5px!important;line-height:1.5!important}.hero-title{font-size:17.8vw!important;line-height:.83!important;margin:25px 0 18px!important;letter-spacing:-.075em!important}.hero-cards{grid-template-columns:1fr!important;gap:9px!important}.visual{height:168px!important;border-radius:20px!important}.start{height:150px!important;padding:18px!important;border-radius:20px!important}.start h3{font-size:23px!important}.visualcopy{left:14px!important;right:14px!important;bottom:12px!important}
      .section-head{grid-template-columns:1fr!important;gap:15px!important;margin-bottom:30px!important}.section-title{font-size:12.8vw!important;line-height:.92!important}.section-copy{font-size:13px!important;line-height:1.5!important}.kicker{font-size:9px!important}
      .whatgrid{grid-template-columns:1fr!important;gap:16px!important}.whatcard{position:relative!important;top:auto!important;min-height:300px!important;padding:22px!important}.whatcard h3{font-size:11vw!important}.service{grid-template-columns:28px 1fr 18px!important;gap:10px!important;padding:18px 0!important}.service h3{font-size:8.5vw!important}.service p{grid-column:2/-1!important;font-size:13px!important}.service:hover{padding-left:0!important}
      .deliver-grid{grid-template-columns:1fr!important}.deliver-card{min-height:190px!important;padding:20px!important}.casegrid{grid-template-columns:1fr!important;gap:12px!important}.case,.case.wide{grid-column:auto!important;min-height:390px!important;border-radius:20px!important}
      .concept-case .case-meta{left:16px!important;right:16px!important;top:15px!important}.concept-case .case-meta span:last-child{display:none!important}
      .concept-case .case-bottom{left:16px!important;right:16px!important;bottom:16px!important;gap:7px!important;align-items:flex-start!important;flex-direction:column!important}.concept-case h3{font-size:11.2vw!important;max-width:8ch!important}.concept-case p{display:none!important}.concept-case .case-open{right:13px!important;top:13px!important;padding:8px 10px!important;font-size:9px!important}
      .growthgrid{grid-template-columns:1fr!important}.growthitem{min-height:126px!important}.pricegrid{grid-template-columns:1fr!important;gap:12px!important}.pricecard{padding:18px!important;border-radius:22px!important}.pricecard.featured{transform:none!important}.price{font-size:7.5vw!important}.price-preview{height:145px!important;transform:none!important;opacity:1!important}
      .processrow{grid-template-columns:32px 1fr!important;gap:9px!important;padding:18px 0!important}.processrow h3{font-size:8.1vw!important}.processrow p{grid-column:2!important;font-size:13px!important}.faq summary{grid-template-columns:28px 1fr 20px!important;gap:9px!important;padding:18px 0!important}.faq summary h3{font-size:6.2vw!important}.faq-answer{padding:0 0 20px 37px!important;font-size:13px!important}
      .realcase{padding:66px 0 8px!important}.rc-head{grid-template-columns:1fr!important;gap:14px!important;margin-bottom:30px!important}.rc-grid{grid-template-columns:1fr!important;gap:24px!important}.rc-copy h3{font-size:34px!important}.rc-sub{font-size:13px!important;line-height:1.55!important;margin-bottom:22px!important}.rc-block{padding:17px 0!important}.rc-block li{font-size:13px!important}.rc-frame{position:static!important;border-radius:18px!important}.rc-live{aspect-ratio:4/5!important}.rc-note{font-size:10.5px!important}
      .ctabox{min-height:auto!important;padding:22px 17px!important;border-radius:22px!important}.ctabox h2{font-size:14.5vw!important;margin:26px 0 32px!important}.ctabottom{grid-template-columns:1fr!important;gap:20px!important}.ctabottom p{font-size:15px!important}.contact-links{grid-template-columns:1fr!important}.form{grid-template-columns:1fr!important}.form textarea,.form button,.form-status{grid-column:auto!important}.foot{flex-direction:column!important;gap:7px!important}
      .shiftBootMeta{grid-template-columns:1fr 28px;gap:10px}.shiftBootMeta>span:first-child{display:none}.shiftBootBar{grid-column:1}.shiftBootMeta>span:last-child{grid-column:2;grid-row:1}
    }
  `;
  document.head.appendChild(ui);

  // Restore a concise loading mark once per tab/session for returning visitors.
  try{
    const oldIntroVisible=document.documentElement.classList.contains('show-intro');
    const seen=sessionStorage.getItem('shift_boot_seen_v3');
    if(!oldIntroVisible && !seen){
      const boot=document.createElement('div');boot.id='shiftBoot';boot.innerHTML=`<div class="shiftBootCore"><span class="shiftBootMark"><svg viewBox="0 0 64 64"><path d="M5 18h32L48 7h11L42 24H5z" fill="#d9ff3f"/><path d="M59 46H27L16 57H5l17-17h37z" fill="#fff"/></svg></span><span>SHIFT</span></div><div class="shiftBootMeta"><span>Strategy / Design / Development</span><div class="shiftBootBar"><i></i></div><span>100</span></div>`;document.body.appendChild(boot);document.body.style.overflow='hidden';
      setTimeout(()=>{boot.classList.add('done');document.body.style.overflow='';sessionStorage.setItem('shift_boot_seen_v3','1');setTimeout(()=>boot.remove(),650)},1350);
    }else if(oldIntroVisible){sessionStorage.setItem('shift_boot_seen_v3','1')}
  }catch(e){}

  // Keep agreed starting price grid: 6 / 15 / 22 / 35.
  document.querySelectorAll('.pricecard').forEach(card=>{
    if(card.querySelector('h3')?.textContent.includes('Інтернет-магазин')){
      const price=card.querySelector('.price');
      if(price)price.childNodes[0].nodeValue='від 35 000 грн';
    }
  });

  // Reduce copy in the concept section and use clean visual previews instead of browser screenshots.
  const conceptSection=document.querySelector('#concepts');
  if(conceptSection){
    const copy=conceptSection.querySelector('.section-copy');if(copy)copy.textContent='Два різні бізнеси — дві різні візуальні системи.';
    const note=conceptSection.querySelector('.cases-note');if(note)note.textContent='Відкрийте концепт, щоб переглянути повну сторінку.';
  }

  const concepts=[
    {
      match:'shift_concept_vektor_lev_style.html',
      text:'Сайт девелопера: проєкти, статуси, продажі.',
      open:'Відкрити ↗',
      slides:[
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=88',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=88',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=88'
      ]
    },
    {
      match:'shift_concept_nova_dental_rikota_style.html',
      text:'Стоматологія: послуги, технології, запис.',
      open:'Відкрити ↗',
      slides:['assets/dental-05-clinic.webp','assets/dental-06-consultation.webp','assets/dental-04-patient.webp','assets/dental-02.webp']
    }
  ];

  concepts.forEach((cfg,idx)=>{
    const card=document.querySelector(`a.case-demo-link[href*="${cfg.match}"]`);if(!card)return;
    card.classList.add('concept-case');
    const p=card.querySelector('.case-bottom p');if(p)p.textContent=cfg.text;
    const open=card.querySelector('.case-open');if(open)open.textContent=cfg.open;
    const first=card.querySelector(':scope > img');
    if(first){first.src=cfg.slides[0];first.removeAttribute('srcset');first.classList.add('active');}
    cfg.slides.slice(1).forEach(src=>{const im=document.createElement('img');im.className='concept-slide';im.src=src;im.alt='';im.loading='lazy';card.insertBefore(im,card.firstChild.nextSibling)});
    const slides=[...card.querySelectorAll(':scope > img')];let current=0;
    if(slides.length>1 && !matchMedia('(prefers-reduced-motion: reduce)').matches){setInterval(()=>{slides[current].classList.remove('active');current=(current+1)%slides.length;slides[current].classList.add('active')},4700+idx*500)}
    const copyIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){card.classList.add('is-copy-visible');copyIO.disconnect()}}),{threshold:.28});copyIO.observe(card);
  });

  const old=document.getElementById('heroMesh');if(old)old.remove();
  const existing=document.getElementById('siteMesh');if(existing)existing.remove();
  const canvas=document.createElement('canvas');canvas.id='siteMesh';document.body.prepend(canvas);
  const ctx=canvas.getContext('2d');if(!ctx)return;
  let w=0,h=0,dpr=1,raf=0;
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    dpr=Math.min(devicePixelRatio||1,1.65);w=innerWidth;h=innerHeight;
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function point(u,z,t){
    const cx=w*.5,p=.54+z*.60;let x=cx+(u-.5)*w*p;
    const horizon=h*.18,base=horizon+Math.pow(z,1.35)*h*.92,sp=(u-.5)*Math.PI*2,s=t*.00030,s2=t*.00017;
    const w1=Math.sin(sp*1.55+z*5.1+s),w2=Math.sin(sp*3.15-z*7.3-s2),w3=Math.cos(sp*.78+z*8.9+s*.55),amp=h*(.025+.125*Math.pow(z,.92));
    const y=base+amp*(w1*.62+w2*.25+w3*.20);x+=Math.sin(z*8.5+sp*.7+s2)*(2+8*z);return[x,y];
  }
  function draw(t=0){
    ctx.clearRect(0,0,w,h);ctx.lineCap='round';ctx.lineJoin='round';
    const rows=innerWidth<760?38:48,cols=innerWidth<760?44:72;
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
