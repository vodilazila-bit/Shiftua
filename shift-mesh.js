(()=>{
  const ui=document.createElement('style');
  ui.textContent=`
    #siteMesh{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:1;filter:brightness(1.18) contrast(1.08)}
    body>header,body>main,body>footer{position:relative;z-index:1}
    .hero .grid{display:none!important}
    .hero:before{background:radial-gradient(circle at 77% 24%,rgba(85,112,255,.18),transparent 29%),radial-gradient(circle at 20% 68%,rgba(255,81,58,.10),transparent 27%),rgba(10,10,11,.58)!important}
    .deliverables{background:rgba(10,10,11,.88)!important}
    .growth{background:rgba(18,18,21,.82)!important}
    .faq{background:rgba(17,17,20,.88)!important}
    .prices{background:rgba(10,10,11,.35)}
    .what{background:rgba(241,239,232,.96)!important}
    .ticker{background:rgba(10,10,11,.58)}
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
    const cx=w*.5,p=.54+z*.60;
    let x=cx+(u-.5)*w*p;
    const horizon=h*.18;
    const base=horizon+Math.pow(z,1.35)*h*.92;
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

// v31 — selected work heading + only the five supplied ZaiSun screenshots.
(()=>{
  if(document.querySelector('script[data-zaisun-case-v28]'))return;
  const load=(src,key)=>new Promise((resolve,reject)=>{
    if(key&&document.querySelector(`script[data-${key}]`)){resolve();return;}
    const el=document.createElement('script');el.src=src;el.defer=true;
    if(key)el.dataset[key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]='1';
    el.onload=resolve;el.onerror=reject;document.head.appendChild(el);
  });

  load('zaisun-case-v28.js?v=31','zaisun-case-v28').then(()=>{
    const items=[...document.querySelectorAll('.zCase .reveal')];
    if(items.length){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.08});items.forEach(x=>io.observe(x));}
    return Promise.all([
      load('assets/zaisun-shot-1-data2.js?v=31'),
      load('assets/zaisun-shot-2-data.js?v=31'),
      load('assets/zaisun-shot-3-data.js?v=31'),
      load('assets/zaisun-shot-4-data.js?v=31'),
      load('assets/zaisun-shot-5-data.js?v=31')
    ]);
  }).then(()=>load('zaisun-case-v31.js?v=31','zaisun-case-v31')).catch(()=>{});
})();
