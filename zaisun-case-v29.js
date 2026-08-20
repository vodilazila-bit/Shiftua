(()=>{
  const apply=()=>{
    const section=document.querySelector('.zCase[data-zaisun-v28="1"]');
    if(!section)return false;

    const slide=section.querySelector('.zSlide[data-label="Меню"]');
    if(!slide)return true;

    const ASSET='https://raw.githubusercontent.com/vodilazila-bit/ZAISUN-site/main/';
    const img={
      logo:ASSET+'logo.png',
      a:ASSET+'ig1.jpg',
      b:ASSET+'ig2.jpg',
      c:ASSET+'ig3.jpg',
      d:ASSET+'ig4.jpg',
      e:ASSET+'hero2.jpg',
      f:ASSET+'hero-sale.jpg'
    };

    if(!document.getElementById('zaisunCaseV29Styles')){
      const st=document.createElement('style');
      st.id='zaisunCaseV29Styles';
      st.textContent=`
        .zCatalogMore{height:100%;background:#fbf7f1;color:#302922;display:flex;flex-direction:column;overflow:hidden}
        .zCatalogMoreTop{height:14%;min-height:60px;background:#faecdb;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 4%}
        .zCatalogMoreTop img{width:88px;height:48px;object-fit:contain}.zCatalogMoreTop span{justify-self:end;font-size:18px;letter-spacing:.2em;color:#403a35}
        .zCatalogMoreTitle{display:flex;align-items:end;justify-content:space-between;padding:2% 2.6% 1.35%;gap:18px}
        .zCatalogMoreTitle h4{margin:0;font:500 clamp(20px,2.4vw,34px)/1.05 "Manrope",sans-serif;letter-spacing:-.04em}.zCatalogMoreTitle small{color:#8f857c;font-size:10px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
        .zCatalogGrid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,minmax(0,1fr));gap:12px;padding:0 2.6% 2.5%}
        .zCatalogCard{min-width:0;min-height:0;display:grid;grid-template-columns:.9fr 1.1fr;background:#fff;border-radius:15px;overflow:hidden;box-shadow:0 8px 24px rgba(78,54,36,.06)}
        .zCatalogPic{min-width:0;min-height:0;position:relative;background:#eadfd5;overflow:hidden}.zCatalogPic img{width:100%;height:100%;object-fit:cover}.zCatalogPic:after{content:"NEW";position:absolute;left:8px;top:8px;background:#c98268;color:#fff;border-radius:999px;padding:4px 7px;font:700 7px/1 "DM Sans",sans-serif;letter-spacing:.08em}
        .zCatalogMeta{padding:13px 12px;display:flex;flex-direction:column;justify-content:center;gap:5px;min-width:0}.zCatalogMeta b{font-size:11px;line-height:1.25}.zCatalogMeta p{margin:0;color:#8a7d72;font-size:9px;line-height:1.35}.zCatalogMeta strong{font-size:11px;margin-top:3px}
        @media(max-width:700px){
          .zCatalogMoreTop{height:12%;min-height:42px;padding:0 4%}.zCatalogMoreTop img{width:58px;height:34px}.zCatalogMoreTop span{font-size:14px}
          .zCatalogMoreTitle{padding:4% 4% 2.5%}.zCatalogMoreTitle h4{font-size:4.7vw}.zCatalogMoreTitle small{font-size:7px}
          .zCatalogGrid{grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(3,minmax(0,1fr));gap:7px;padding:0 3.5% 3.5%}
          .zCatalogCard{grid-template-columns:1fr;border-radius:10px}.zCatalogMeta{padding:6px 7px;gap:2px}.zCatalogMeta b{font-size:7.5px}.zCatalogMeta p{display:none}.zCatalogMeta strong{font-size:7px;margin-top:1px}.zCatalogPic:after{left:5px;top:5px;font-size:5px;padding:3px 5px}
        }
      `;
      document.head.appendChild(st);
    }

    slide.dataset.label='Товари';
    slide.innerHTML=`
      <div class="zCatalogMore">
        <div class="zCatalogMoreTop"><span></span><img src="${img.logo}" alt="ZaiSun"><span>⌕ ☰</span></div>
        <div class="zCatalogMoreTitle"><h4>Каталог товарів</h4><small>Одяг для малюків</small></div>
        <div class="zCatalogGrid">
          <div class="zCatalogCard"><div class="zCatalogPic"><img src="${img.a}" alt=""></div><div class="zCatalogMeta"><b>Комплект для малюка</b><p>М'яка бавовна, базові відтінки</p><strong>685 ₴</strong></div></div>
          <div class="zCatalogCard"><div class="zCatalogPic"><img src="${img.b}" alt=""></div><div class="zCatalogMeta"><b>Теплий комплект</b><p>Для прохолодних прогулянок</p><strong>595 ₴</strong></div></div>
          <div class="zCatalogCard"><div class="zCatalogPic"><img src="${img.c}" alt=""></div><div class="zCatalogMeta"><b>Базовий образ</b><p>Щоденний комфорт для дитини</p><strong>570 ₴</strong></div></div>
          <div class="zCatalogCard"><div class="zCatalogPic"><img src="${img.d}" alt=""></div><div class="zCatalogMeta"><b>Святковий образ</b><p>Лаконічний комплект для подій</p><strong>950 ₴</strong></div></div>
          <div class="zCatalogCard"><div class="zCatalogPic"><img src="${img.e}" alt=""></div><div class="zCatalogMeta"><b>Осіння колекція</b><p>Теплі фактури та спокійні кольори</p><strong>від 425 ₴</strong></div></div>
          <div class="zCatalogCard"><div class="zCatalogPic"><img src="${img.f}" alt=""></div><div class="zCatalogMeta"><b>Новинки ZaiSun</b><p>Останні моделі в каталозі</p><strong>від 520 ₴</strong></div></div>
        </div>
      </div>`;

    const thumbs=[...section.querySelectorAll('.zThumb')];
    const third=thumbs[2];
    if(third){
      const ti=third.querySelector('img');
      const ts=third.querySelector('span');
      if(ti)ti.src=img.b;
      if(ts)ts.textContent='Товари';
    }
    return true;
  };

  if(apply())return;
  let tries=0;
  const timer=setInterval(()=>{tries++;if(apply()||tries>30)clearInterval(timer)},100);
})();
