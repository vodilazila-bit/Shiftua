(()=>{
  const apply=()=>{
    const section=document.querySelector('.zCase[data-zaisun-v28="1"]');
    if(!section)return false;

    const slide=section.querySelector('.zSlide[data-label="Меню"]') || section.querySelector('.zSlide[data-label="Товари"]');
    if(!slide)return true;

    if(!document.getElementById('zaisunCaseV30Styles')){
      const st=document.createElement('style');
      st.id='zaisunCaseV30Styles';
      st.textContent=`
        .zExactCatalog{height:100%;background:#fbf7f1;overflow:hidden;position:relative}
        .zExactCatalog img{width:100%;height:100%;display:block;object-fit:cover;object-position:center 10%;filter:none!important}
        .zExactCatalog:after{content:"НОВИНКИ / БОДІ / СУКНІ";position:absolute;left:18px;bottom:17px;padding:8px 11px;border-radius:999px;background:rgba(15,15,17,.68);backdrop-filter:blur(10px);color:#fff;font:700 8px/1 "DM Sans",sans-serif;letter-spacing:.12em}
        @media(max-width:700px){
          .zExactCatalog img{object-position:35% 8%}
          .zExactCatalog:after{left:10px;bottom:10px;font-size:6px;padding:6px 8px}
        }
      `;
      document.head.appendChild(st);
    }

    slide.dataset.label='Товари';
    slide.innerHTML=`<div class="zExactCatalog"><img src="assets/zaisun-catalog-products.webp?v=30" alt="ZaiSun — каталог: боді, сукні та новинки"></div>`;

    const thumbs=[...section.querySelectorAll('.zThumb')];
    const third=thumbs[2];
    if(third){
      const ti=third.querySelector('img');
      const ts=third.querySelector('span');
      if(ti){ti.src='assets/zaisun-catalog-products.webp?v=30';ti.style.objectPosition='center 15%';}
      if(ts)ts.textContent='Боді / сукні';
    }
    return true;
  };

  if(apply())return;
  let tries=0;
  const timer=setInterval(()=>{tries++;if(apply()||tries>30)clearInterval(timer)},100);
})();
