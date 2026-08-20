(()=>{
  // v26: mobile-first layout + site-wide animated mesh. The work section is left untouched.
  const ui=document.createElement('style');
  ui.textContent=`
    #siteMesh{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:1;filter:brightness(1.18) contrast(1.08)}
    body>header,body>main,body>footer{position:relative;z-index:1}
    .hero .grid{display:none!important}.hero:before{background:radial-gradient(circle at 77% 24%,rgba(85,112,255,.18),transparent 29%),radial-gradient(circle at 20% 68%,rgba(255,81,58,.10),transparent 27%),rgba(10,10,11,.58)!important}
    .deliverables{background:rgba(10,10,11,.88)!important}.growth{background:rgba(18,18,21,.82)!important}.faq{background:rgba(17,17,20,.88)!important}.prices{background:rgba(10,10,11,.35)}.what{background:rgba(241,239,232,.96)!important}.ticker{background:rgba(10,10,11,.58)}
    @media(max-width:760px){
      .wrap{width:calc(100% - 28px)!important}.block,.cases,.deliverables{padding:70px 0!important}header{padding:9px 0!important}.nav{padding:8px 8px 8px 12px!important}.logo{font-size:17px!important}.logo .shiftmark{width:24px!important;height:24px!important}.navcta{padding:10px 12px!important;font-size:11px!important}.links{display:none!important}
      .hero{min-height:auto!important;padding:94px 0 20px!important}.hero-inner{min-height:calc(100svh - 114px)}.hero-top{display:block!important}.hero-copy{max-width:100%!important;font-size:14px!important;line-height:1.55!important}.hero-title{font-size:18.2vw!important;line-height:.83!important;margin:28px 0 22px!important;letter-spacing:-.075em!important}.hero-cards{grid-template-columns:1fr!important;gap:10px!important}.visual{height:180px!important}.start{height:168px!important;padding:20px!important}.start h3{font-size:26px!important}.visualcopy{left:16px!important;right:16px!important;bottom:14px!important}
      .section-head{grid-template-columns:1fr!important;gap:18px!important;margin-bottom:34px!important}.section-title{font-size:14vw!important;line-height:.9!important}.section-copy{font-size:14px!important;line-height:1.55!important}.kicker{font-size:10px!important}
      .whatgrid{grid-template-columns:1fr!important;gap:18px!important}.whatcard{position:relative!important;top:auto!important;min-height:330px!important;padding:24px!important}.whatcard h3{font-size:12vw!important}.service{grid-template-columns:30px 1fr 20px!important;gap:12px!important;padding:20px 0!important}.service h3{font-size:9.2vw!important}.service p{grid-column:2/-1!important;font-size:14px!important}.service:hover{padding-left:0!important}
      .deliver-grid{grid-template-columns:1fr!important}.deliver-card{min-height:220px!important}.casegrid{grid-template-columns:1fr!important;gap:14px!important}.case,.case.wide{grid-column:auto!important;min-height:430px!important;border-radius:22px!important}.case-meta{left:20px!important;right:20px!important;top:20px!important}.case-bottom{left:20px!important;right:20px!important;bottom:20px!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:14px!important;padding-right:0!important}.case h3{font-size:13vw!important}.case p{max-width:100%!important;text-align:left!important}.case .case-open{opacity:1!important;transform:none!important;top:56px!important;bottom:auto!important;right:18px!important}
      .growthgrid{grid-template-columns:1fr!important}.growthitem{min-height:132px!important}.pricegrid{grid-template-columns:1fr!important;gap:14px!important}.pricecard{padding:20px!important;border-radius:24px!important}.pricecard.featured{transform:none!important}.price{font-size:8vw!important}.price-preview{height:155px!important;transform:none!important;opacity:1!important}
      .processrow{grid-template-columns:36px 1fr!important;gap:10px!important;padding:20px 0!important}.processrow h3{font-size:8.7vw!important}.processrow p{grid-column:2!important;font-size:14px!important}.faq summary{grid-template-columns:30px 1fr 22px!important;gap:10px!important;padding:20px 0!important}.faq summary h3{font-size:6.8vw!important}.faq-answer{padding:0 0 22px 40px!important;font-size:14px!important}
      .ctabox{min-height:auto!important;padding:24px 18px!important;border-radius:24px!important}.ctabox h2{font-size:15.5vw!important;margin:28px 0 38px!important}.ctabottom{grid-template-columns:1fr!important;gap:22px!important}.ctabottom p{font-size:16px!important}.contact-links{grid-template-columns:1fr!important}.form{grid-template-columns:1fr!important}.form textarea,.form button,.form-status{grid-column:auto!important}.foot{flex-direction:column!important;gap:8px!important}
    }
  `;
  document.head.appendChild(ui);

  // Keep agreed starting price grid: 6 / 15 / 22 / 35.
  document.querySelectorAll('.pricecard').forEach(card=>{
    if(card.querySelector('h3')?.textContent.includes('Інтернет-магазин')){
      const price=card.querySelector('.price');
      if(price)price.childNodes[0].nodeValue='від 35 000 грн';
    }
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
