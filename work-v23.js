(()=>{
  // v24 live patch: latest work block + brighter animated hero mesh.
  const work=document.getElementById('work');
  if(work){
    const style=document.createElement('style');
    style.textContent=`
      .case-zaisun-v24{background:#111;position:relative;overflow:hidden}
      .case-zaisun-v24 .z24-art{position:absolute;inset:0;background:radial-gradient(circle at 76% 28%,rgba(217,255,63,.22),transparent 20%),linear-gradient(135deg,#101012 0%,#292522 46%,#c7a78c 100%)}
      .case-zaisun-v24 .z24-art:after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.78),transparent 58%)}
      .z24-browser{position:absolute;left:7%;top:12%;width:54%;height:52%;border:1px solid rgba(255,255,255,.18);border-radius:22px;background:#f4eadf;box-shadow:0 28px 80px rgba(0,0,0,.3);padding:18px;color:#302821}
      .z24-browser i{display:inline-block;width:8px;height:8px;border-radius:50%;background:#c9b9aa;margin-right:5px}
      .z24-browser small{float:right;font-size:9px;letter-spacing:.11em;text-transform:uppercase}
      .z24-logo{position:absolute;right:7%;top:16%;font:700 clamp(54px,7vw,112px)/.82 "Manrope";letter-spacing:-.08em;color:#fff}
      .z24-products{position:absolute;left:10%;right:10%;bottom:13%;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;z-index:1}
      .z24-products b{height:128px;border-radius:20px;background:linear-gradient(145deg,#ead8c6,#f8eee4);border:1px solid rgba(255,255,255,.32)}
      .case-zaisun-v24 .case-bottom>div{max-width:390px}.case-zaisun-v24 .case-bottom p{text-align:left;max-width:390px}
      .z24-live{display:inline-flex;margin-top:14px;padding:10px 14px;border-radius:999px;background:var(--acid);color:#111;font-size:11px;font-weight:700}
      @media(max-width:700px){.z24-browser{width:72%;height:40%}.z24-logo{top:52%;font-size:17vw}.z24-products{display:none}}
    `;
    document.head.appendChild(style);
    const wrap=work.querySelector('.wrap');
    if(wrap){
      wrap.innerHTML=`
        <div class="section-head reveal on"><div><div class="kicker">03 / Роботи</div><h2 class="section-title">Сайти, які<br><em>працюють на бізнес.</em></h2></div><p class="section-copy">ZaiSun — реальний e-commerce проєкт, який уже працює. Нижче — ще два приклади під різні задачі бізнесу.</p></div>
        <div class="casegrid">
          <article class="case wide case-zaisun-v24 reveal on"><div class="z24-art"><div class="z24-browser"><i></i><i></i><i></i><small>zaisun.com.ua</small></div><div class="z24-logo">ZAISUN</div><div class="z24-products"><b></b><b></b><b></b></div></div><div class="case-meta"><span>REAL PROJECT / E-COMMERCE</span><span>LIVE · ZAISUN.COM.UA</span></div><div class="case-bottom"><h3>ZAISUN</h3><div><p>Реальний інтернет-магазин дитячого одягу: каталог, кошик, оформлення замовлення та e-commerce логіка.</p><a class="z24-live" href="https://zaisun.com.ua" target="_blank" rel="noopener">Відкрити сайт ↗</a></div></div></article>
          <article class="case reveal on"><img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=86" alt="Сайт для компанії"><div class="case-meta"><span>Послуги / Концепт</span><span>2026</span></div><div class="case-bottom"><h3>Сайт для<br>компанії</h3><p>Пояснює послуги простими словами, показує переваги й веде клієнта до заявки.</p></div></article>
          <article class="case reveal on"><img src="case-digital-commerce.webp" alt="Інтернет-магазин"><div class="case-meta"><span>E-commerce / Концепт</span><span>2026</span></div><div class="case-bottom"><h3>Інтернет-<br>магазин</h3><p>Каталог, зручне оформлення замовлення та структура, готова до реклами.</p></div></article>
        </div>`;
    }
  }

  // Keep agreed starting price grid: 6 / 15 / 22 / 35.
  document.querySelectorAll('.pricecard').forEach(card=>{
    if(card.querySelector('h3')?.textContent.includes('Інтернет-магазин')){
      const price=card.querySelector('.price');
      if(price) price.childNodes[0].nodeValue='від 35 000 грн';
    }
  });

  const grid=document.querySelector('.hero .grid');
  if(!grid || document.getElementById('heroMesh')) return;
  grid.style.opacity='1';
  grid.style.background='#050506';
  grid.style.backgroundImage='none';
  grid.style.maskImage='none';
  grid.style.webkitMaskImage='none';
  grid.style.overflow='hidden';
  grid.style.pointerEvents='none';
  const canvas=document.createElement('canvas');
  canvas.id='heroMesh';
  Object.assign(canvas.style,{display:'block',width:'100%',height:'100%',opacity:'1',filter:'brightness(1.18) contrast(1.08)'});
  grid.appendChild(canvas);
  const ctx=canvas.getContext('2d');if(!ctx)return;
  let w=0,h=0,dpr=1,raf=0;const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){const r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,1.7);w=Math.max(1,Math.round(r.width));h=Math.max(1,Math.round(r.height));canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  function point(u,z,t){const cx=w*.5,p=.54+z*.60;let x=cx+(u-.5)*w*p;const horizon=h*.28,base=horizon+Math.pow(z,1.38)*h*.72,sp=(u-.5)*Math.PI*2,s=t*.00034,s2=t*.00019;const w1=Math.sin(sp*1.55+z*5.1+s),w2=Math.sin(sp*3.15-z*7.3-s2),w3=Math.cos(sp*.78+z*8.9+s*.55),amp=h*(.020+.105*Math.pow(z,.92));const y=base+amp*(w1*.62+w2*.25+w3*.20);x+=Math.sin(z*8.5+sp*.7+s2)*(2+8*z);return[x,y]}
  function draw(t=0){if(!w||!h)resize();ctx.clearRect(0,0,w,h);ctx.lineCap='round';ctx.lineJoin='round';const rows=46,cols=72;for(let r=0;r<rows;r++){const z=r/(rows-1);ctx.beginPath();for(let c=0;c<=cols;c++){const [x,y]=point(c/cols,z,t);c?ctx.lineTo(x,y):ctx.moveTo(x,y)}const a=.055+.235*Math.pow(z,1.08);ctx.strokeStyle=`rgba(224,228,233,${a.toFixed(3)})`;ctx.lineWidth=.55+.55*z;ctx.stroke()}for(let c=0;c<=cols;c++){const u=c/cols;ctx.beginPath();for(let r=0;r<rows;r++){const [x,y]=point(u,r/(rows-1),t);r?ctx.lineTo(x,y):ctx.moveTo(x,y)}const edge=Math.abs(u-.5)*2,a=.070+.110*(1-edge*.55);ctx.strokeStyle=`rgba(220,224,230,${a.toFixed(3)})`;ctx.lineWidth=.55;ctx.stroke()}[.36,.50,.64,.78].forEach((z,i)=>{ctx.beginPath();for(let c=0;c<=cols;c++){const [x,y]=point(c/cols,z,t+i*520);c?ctx.lineTo(x,y):ctx.moveTo(x,y)}const g=ctx.createLinearGradient(0,0,w,0);g.addColorStop(0,'rgba(255,255,255,.05)');g.addColorStop(.42,'rgba(255,255,255,.18)');g.addColorStop(.68,'rgba(255,255,255,.30)');g.addColorStop(1,'rgba(255,255,255,.08)');ctx.strokeStyle=g;ctx.lineWidth=1;ctx.stroke()});if(!reduceMotion)raf=requestAnimationFrame(draw)}
  resize();addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw(performance.now())},{passive:true});draw(performance.now());
})();