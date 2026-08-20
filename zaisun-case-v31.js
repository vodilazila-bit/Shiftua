(()=>{
  const shots=[
    {src:window.ZS31_SHOT_1||window.ZS_SHOT_1,label:'Головна'},
    {src:window.ZS31_SHOT_2,label:'Категорії'},
    {src:window.ZS31_SHOT_3,label:'Сукні'},
    {src:window.ZS31_SHOT_4,label:'Каталог'},
    {src:window.ZS31_SHOT_5,label:'Instagram'}
  ];

  const addHeading=(section)=>{
    if(!section || section.querySelector('.zSelectedHead'))return;
    const gallery=section.querySelector('.zGallery');
    if(!gallery)return;
    const head=document.createElement('div');
    head.className='zSelectedHead reveal on';
    head.innerHTML=`<div><div class="kicker">03 / SELECTED WORK</div><h2>Вибрані роботи</h2></div><p>Реальні проєкти та концепти, що показують наш підхід.</p>`;
    gallery.before(head);
  };

  const apply=()=>{
    const section=document.querySelector('.zCase[data-zaisun-v28="1"]') || document.querySelector('#work .zCase') || document.querySelector('.zCase');
    if(!section)return false;
    addHeading(section);

    if(!document.getElementById('zaisunCaseV31Styles')){
      const st=document.createElement('style');
      st.id='zaisunCaseV31Styles';
      st.textContent=`
        .zSelectedHead{display:grid;grid-template-columns:1fr .72fr;gap:56px;align-items:end;margin:0 0 36px;padding-top:4px}
        .zSelectedHead h2{margin:12px 0 0;color:#fff;font:600 clamp(52px,6.7vw,98px)/.9 "Manrope",sans-serif;letter-spacing:-.065em;text-transform:uppercase}
        .zSelectedHead p{margin:0 0 5px;color:#a2a2aa;font-size:15px;line-height:1.55;max-width:470px}
        .zCase .zSlide{background:#f6eee3!important}
        .zCase .zShotExact{position:absolute;inset:0;display:grid;place-items:center;background:#f6eee3;overflow:hidden}
        .zCase .zShotExact img{width:100%;height:100%;display:block;object-fit:contain!important;object-position:center!important;filter:none!important;transform:none!important}
        .zCase .zThumb img{object-fit:cover!important;object-position:center!important;filter:none!important;transform:none!important}
        .zCase .zThumb span{background:rgba(10,10,11,.62);padding:5px 7px;border-radius:999px;backdrop-filter:blur(8px)}
        @media(max-width:700px){
          .zSelectedHead{grid-template-columns:1fr;gap:12px;margin-bottom:22px}
          .zSelectedHead h2{font-size:12.5vw;margin-top:8px}
          .zSelectedHead p{font-size:12.5px;line-height:1.5;max-width:32ch}
          .zCase .zStage{aspect-ratio:4/5.15!important;min-height:0!important;background:#f6eee3!important}
          .zCase .zThumbs{grid-template-columns:repeat(5,minmax(82px,1fr))!important;overflow-x:auto!important;padding-bottom:6px!important;scrollbar-width:none!important}
          .zCase .zThumbs::-webkit-scrollbar{display:none}
          .zCase .zThumb{height:82px!important}
        }
      `;
      document.head.appendChild(st);
    }

    const slides=[...section.querySelectorAll('.zSlide')];
    const thumbs=[...section.querySelectorAll('.zThumb')];
    if(slides.length<5 || shots.some(s=>!s.src))return false;

    slides.slice(0,5).forEach((slide,i)=>{
      slide.dataset.label=shots[i].label;
      slide.dataset.index=String(i);
      slide.innerHTML=`<div class="zShotExact"><img src="${shots[i].src}" alt="ZaiSun — ${shots[i].label}"></div>`;
    });
    slides.slice(5).forEach(s=>s.remove());

    thumbs.slice(0,5).forEach((thumb,i)=>{
      const img=thumb.querySelector('img');
      const text=thumb.querySelector('span');
      if(img){img.src=shots[i].src;img.alt='';img.removeAttribute('srcset');}
      if(text)text.textContent=shots[i].label;
    });
    thumbs.slice(5).forEach(t=>t.remove());

    const count=section.querySelector('.zSlideCount');
    if(count){
      const current=Math.max(0,slides.slice(0,5).findIndex(s=>s.classList.contains('active')));
      count.textContent=`${String(current+1).padStart(2,'0')} / 05`;
    }
    return true;
  };

  if(apply())return;
  let tries=0;
  const timer=setInterval(()=>{tries++;if(apply()||tries>60)clearInterval(timer)},100);
})();
