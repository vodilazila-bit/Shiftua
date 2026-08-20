(()=>{
  const shots=[
    {src:'assets/zaisun-shot-1.webp?v=31',label:'Головна'},
    {src:'assets/zaisun-shot-2.webp?v=31',label:'Категорії'},
    {src:'assets/zaisun-shot-3.webp?v=31',label:'Сукні'},
    {src:'assets/zaisun-shot-4.webp?v=31',label:'Каталог'},
    {src:'assets/zaisun-shot-5.webp?v=31',label:'Instagram'}
  ];

  const setHeading=()=>{
    const section=document.querySelector('#work');
    if(!section)return;
    const head=section.querySelector('.rc-head');
    if(!head)return;
    head.innerHTML=`<div><div class="kicker">03 / SELECTED WORK</div><h2 class="section-title" style="margin-top:12px">Вибрані роботи</h2></div><p class="section-copy">Реальні проєкти та концепти, що показують наш підхід.</p>`;
  };

  const apply=()=>{
    const section=document.querySelector('.zCase[data-zaisun-v28="1"]') || document.querySelector('#work .zCase');
    if(!section)return false;

    if(!document.getElementById('zaisunCaseV31Styles')){
      const st=document.createElement('style');
      st.id='zaisunCaseV31Styles';
      st.textContent=`
        .zCase .zSlide{background:#f7efe4!important}
        .zCase .zShotExact{position:absolute;inset:0;display:grid;place-items:center;background:#f7efe4;overflow:hidden}
        .zCase .zShotExact img{width:100%;height:100%;display:block;object-fit:contain!important;object-position:center!important;filter:none!important;transform:none!important;background:#f7efe4}
        .zCase .zSlide[data-index="0"] .zShotExact img,.zCase .zSlide[data-index="1"] .zShotExact img{object-fit:cover!important;object-position:center top!important}
        .zCase .zShotLabel{position:absolute;left:18px;bottom:18px;z-index:4;padding:8px 11px;border-radius:999px;background:rgba(10,10,11,.67);backdrop-filter:blur(10px);color:#fff;font:700 8px/1 "DM Sans",sans-serif;letter-spacing:.1em;text-transform:uppercase}
        .zCase .zThumb img{object-fit:cover!important;object-position:center!important;filter:none!important}
        .zCase .zThumb:nth-child(1) img,.zCase .zThumb:nth-child(2) img{object-position:center top!important}
        @media(max-width:700px){
          .zCase .zStage{aspect-ratio:4/5.2!important;min-height:0!important;background:#f7efe4!important}
          .zCase .zSlide[data-index="0"] .zShotExact img,.zCase .zSlide[data-index="1"] .zShotExact img{object-fit:contain!important;object-position:center!important}
          .zCase .zShotLabel{left:10px;bottom:10px;font-size:6px;padding:6px 8px}
          .zCase .zThumbs{grid-template-columns:repeat(5,minmax(82px,1fr))!important;overflow-x:auto!important;padding-bottom:6px!important;scrollbar-width:none!important}
          .zCase .zThumbs::-webkit-scrollbar{display:none}
          .zCase .zThumb{height:82px!important}
        }
      `;
      document.head.appendChild(st);
    }

    const slides=[...section.querySelectorAll('.zSlide')];
    const thumbs=[...section.querySelectorAll('.zThumb')];
    if(slides.length<5)return false;

    slides.slice(0,5).forEach((slide,i)=>{
      slide.dataset.label=shots[i].label;
      slide.dataset.index=String(i);
      slide.innerHTML=`<div class="zShotExact"><img src="${shots[i].src}" alt="ZaiSun — ${shots[i].label}"><span class="zShotLabel">${shots[i].label}</span></div>`;
    });
    slides.slice(5).forEach(s=>s.remove());

    thumbs.slice(0,5).forEach((thumb,i)=>{
      const img=thumb.querySelector('img');
      const text=thumb.querySelector('span');
      if(img){img.src=shots[i].src;img.alt='';}
      if(text)text.textContent=shots[i].label;
    });
    thumbs.slice(5).forEach(t=>t.remove());

    const count=section.querySelector('.zSlideCount');
    if(count){
      const active=Math.max(0,slides.slice(0,5).findIndex(s=>s.classList.contains('active')));
      count.textContent=`${String(active+1).padStart(2,'0')} / 05`;
    }
    return true;
  };

  setHeading();
  if(apply())return;
  let tries=0;
  const timer=setInterval(()=>{tries++;setHeading();if(apply()||tries>50)clearInterval(timer)},100);
})();
