(()=>{
  // Keep the real ZaiSun work section from the previous version.
  const original=document.createElement('script');
  original.src='work-v23-original.js?v=23';
  original.defer=true;
  document.head.appendChild(original);

  // Brighter animated wireframe hero background (v22 look).
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

  const ctx=canvas.getContext('2d');
  if(!ctx) return;
  let w=0,h=0,dpr=1,raf=0;
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeMesh(){
    const r=canvas.getBoundingClientRect();
    dpr=Math.min(window.devicePixelRatio||1,1.7);
    w=Math.max(1,Math.round(r.width));
    h=Math.max(1,Math.round(r.height));
    canvas.width=Math.round(w*dpr);
    canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function point(u,z,time){
    const cx=w*.5;
    const perspective=.54 + z*.60;
    let x=cx + (u-.5)*w*perspective;
    const horizon=h*.28;
    const base=horizon + Math.pow(z,1.38)*h*.72;
    const spatial=(u-.5)*Math.PI*2;
    const slow=time*.00034;
    const slow2=time*.00019;
    const wave1=Math.sin(spatial*1.55 + z*5.1 + slow);
    const wave2=Math.sin(spatial*3.15 - z*7.3 - slow2);
    const wave3=Math.cos(spatial*.78 + z*8.9 + slow*.55);
    const amp=h*(.020 + .105*Math.pow(z,.92));
    const y=base + amp*(wave1*.62 + wave2*.25 + wave3*.20);
    x += Math.sin(z*8.5 + spatial*.7 + slow2)*(2+8*z);
    return [x,y];
  }

  function draw(time=0){
    if(!w||!h)resizeMesh();
    ctx.clearRect(0,0,w,h);
    ctx.lineCap='round';
    ctx.lineJoin='round';
    const rows=46, cols=72;

    for(let r=0;r<rows;r++){
      const z=r/(rows-1);
      ctx.beginPath();
      for(let c=0;c<=cols;c++){
        const u=c/cols;
        const [x,y]=point(u,z,time);
        if(c===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      const a=.055 + .235*Math.pow(z,1.08);
      ctx.strokeStyle=`rgba(224,228,233,${a.toFixed(3)})`;
      ctx.lineWidth=.55 + .55*z;
      ctx.stroke();
    }

    for(let c=0;c<=cols;c++){
      const u=c/cols;
      ctx.beginPath();
      for(let r=0;r<rows;r++){
        const z=r/(rows-1);
        const [x,y]=point(u,z,time);
        if(r===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      const edge=Math.abs(u-.5)*2;
      const a=.070 + .110*(1-edge*.55);
      ctx.strokeStyle=`rgba(220,224,230,${a.toFixed(3)})`;
      ctx.lineWidth=.55;
      ctx.stroke();
    }

    [.36,.50,.64,.78].forEach((z,i)=>{
      ctx.beginPath();
      for(let c=0;c<=cols;c++){
        const u=c/cols;
        const [x,y]=point(u,z,time+i*520);
        if(c===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      const g=ctx.createLinearGradient(0,0,w,0);
      g.addColorStop(0,'rgba(255,255,255,.05)');
      g.addColorStop(.42,'rgba(255,255,255,.18)');
      g.addColorStop(.68,'rgba(255,255,255,.30)');
      g.addColorStop(1,'rgba(255,255,255,.08)');
      ctx.strokeStyle=g;
      ctx.lineWidth=1;
      ctx.stroke();
    });

    if(!reduceMotion) raf=requestAnimationFrame(draw);
  }

  resizeMesh();
  addEventListener('resize',()=>{cancelAnimationFrame(raf);resizeMesh();draw(performance.now())},{passive:true});
  draw(performance.now());
})();