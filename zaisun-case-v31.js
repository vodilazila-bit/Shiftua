(()=>{
  const A='https://raw.githubusercontent.com/vodilazila-bit/ZAISUN-site/main/';
  const target=document.querySelector('.zCase[data-zaisun-v28="1"]') || document.querySelector('#work.zCase') || document.querySelector('#work');
  if(!target)return;

  target.id='work';
  target.className='z34Case';
  target.dataset.zaisunV35='1';

  if(!document.getElementById('zaisunCaseV35Styles')){
    const oldStyles=document.getElementById('zaisunCaseV34Styles');
    if(oldStyles)oldStyles.remove();
    const st=document.createElement('style');
    st.id='zaisunCaseV35Styles';
    st.textContent=`
      .z34Case{position:relative;padding:88px 0 44px;border-top:1px solid rgba(255,255,255,.13);color:#fff;overflow:hidden}
      .z34Wrap{width:min(1520px,calc(100% - 64px));margin:0 auto}
      .z34Head{display:grid;grid-template-columns:1.05fr .65fr;gap:64px;align-items:end;margin-bottom:28px}
      .z34Head h2{margin:10px 0 0;font:600 clamp(50px,6vw,92px)/.88 "Manrope",sans-serif;letter-spacing:-.07em;text-transform:uppercase}
      .z34Head p{margin:0 0 4px;color:#a2a2aa;font-size:14px;line-height:1.55;max-width:430px}

      .z34Screen{border:1px solid rgba(255,255,255,.13);border-radius:28px;overflow:hidden;min-height:570px;display:grid;grid-template-columns:.78fr 1.22fr;background:#efe0cc;color:#181512}
      .z34Copy{padding:clamp(34px,4vw,58px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;z-index:2}
      .z34Logo{width:122px;height:auto;object-fit:contain;margin:0 auto 24px;filter:none!important}
      .z34Tag{display:inline-flex;padding:8px 11px;border:1px solid rgba(24,21,18,.22);border-radius:999px;margin-bottom:22px;font:700 9px/1.2 "DM Sans",sans-serif;letter-spacing:.15em;text-transform:uppercase}
      .z34Copy>p{font-size:16px;line-height:1.55;max-width:430px;color:#564d45;margin:0 0 26px}
      .z34Actions{display:flex;justify-content:flex-start;align-self:stretch;gap:10px;flex-wrap:wrap}
      .z34Btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 20px;border-radius:999px;background:#151515;color:#fff;text-decoration:none;font:600 13px/1 "DM Sans",sans-serif;transition:.25s transform,.25s background,.25s color}
      .z34Btn:hover{transform:translateY(-2px);background:#d9ff3f;color:#0b0b0c}
      .z34BtnLight{background:transparent;color:#181512;border:1px solid rgba(24,21,18,.24)}

      .z34Visual{position:relative;min-height:570px;overflow:hidden;background:#c58c62}
      .z34Visual>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:55% center;display:block;filter:none!important;transform:none!important}
      .z34Visual:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(239,224,204,.12),transparent 24%)}
      .z34Float{position:absolute;z-index:3;background:rgba(251,246,238,.92);backdrop-filter:blur(14px);border:1px solid rgba(24,21,18,.12);border-radius:18px;color:#171513;padding:13px 15px;box-shadow:0 18px 50px rgba(40,20,8,.15)}
      .z34Float b{display:block;font:700 24px/1 "Manrope",sans-serif;letter-spacing:-.04em}.z34Float span{display:block;font-size:9px;margin-top:5px;color:#75685f;text-transform:uppercase;letter-spacing:.12em}
      .z34F1{right:22px;top:22px}.z34F2{left:22px;bottom:22px}

      .z34Quick{display:grid;grid-template-columns:repeat(3,1fr);margin-top:14px;border:1px solid rgba(255,255,255,.13);border-radius:22px;overflow:hidden;background:#111113}
      .z34QuickItem{position:relative;padding:22px 24px 24px;border-right:1px solid rgba(255,255,255,.11);min-height:142px}
      .z34QuickItem:last-child{border-right:0}
      .z34QuickItem small{display:block;color:#d9ff3f;font:700 9px/1.2 "DM Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px}
      .z34QuickItem h4{margin:0 0 8px;font:600 20px/1.05 "Manrope",sans-serif;letter-spacing:-.035em}
      .z34QuickItem p{margin:0;color:#929299;font-size:12px;line-height:1.55}
      .z34QuickItem b{color:#fff;font-weight:600}

      @media(max-width:980px){
        .z34Head{grid-template-columns:1fr;gap:12px}.z34Screen{grid-template-columns:1fr;min-height:0}.z34Visual{min-height:430px}.z34Quick{grid-template-columns:1fr}.z34QuickItem{border-right:0;border-bottom:1px solid rgba(255,255,255,.11);min-height:0}.z34QuickItem:last-child{border-bottom:0}
      }
      @media(max-width:700px){
        .z34Case{padding:58px 0 28px}.z34Wrap{width:min(100% - 24px,1520px)}.z34Head{margin-bottom:18px}.z34Head h2{font-size:12vw}.z34Head p{font-size:12.5px}.z34Screen{border-radius:20px}.z34Copy{padding:28px 22px 30px}.z34Logo{width:94px;margin-bottom:20px}.z34Tag{margin-bottom:18px;font-size:8px}.z34Copy>p{font-size:13.5px;margin-bottom:20px;max-width:330px}.z34Actions{width:100%}.z34Btn{min-height:46px;font-size:12px;padding:0 16px}.z34Visual{min-height:340px}.z34Float{padding:10px 11px}.z34Float b{font-size:20px}.z34F1{right:10px;top:10px}.z34F2{left:10px;bottom:10px}.z34Quick{border-radius:18px;margin-top:10px}.z34QuickItem{padding:17px 19px 18px}.z34QuickItem h4{font-size:18px}.z34QuickItem p{font-size:11.5px}
      }
    `;
    document.head.appendChild(st);
  }

  target.innerHTML=`
    <div class="z34Wrap">
      <div class="z34Head">
        <div><div class="kicker">03 / РЕАЛЬНИЙ ПРОЄКТ</div><h2>ZAISUN</h2></div>
        <p>Дитячий бренд зі спільнотою 50к+: сайт, автоматизація, аналітика й реклама в одній системі.</p>
      </div>

      <article class="z34Screen">
        <div class="z34Copy">
          <img class="z34Logo" src="${A}logo.png" alt="ZaiSun">
          <span class="z34Tag">E-commerce / Design / Development / Ads</span>
          <p>Каталог, оплата, доставка, аналітика та реклама — в одній системі.</p>
          <div class="z34Actions">
            <a class="z34Btn" href="https://zaisun.com.ua" target="_blank" rel="noopener">Відкрити ZaiSun ↗</a>
            <a class="z34Btn z34BtnLight" href="#contact">Обговорити схожий проєкт ↗</a>
          </div>
        </div>
        <div class="z34Visual">
          <img src="${A}hero-autumn.jpg" alt="ZaiSun — дитячий одяг">
          <div class="z34Float z34F1"><b>800+</b><span>товарів у каталозі</span></div>
          <div class="z34Float z34F2"><b>Live</b><span>реальний e-commerce</span></div>
        </div>
      </article>

      <section class="z34Quick" aria-label="Коротко про реалізацію">
        <article class="z34QuickItem"><small>01 / Сайт</small><h4>Повний e-commerce</h4><p>Каталог, фільтри, кошик, checkout та <b>800+ товарних сторінок</b>.</p></article>
        <article class="z34QuickItem"><small>02 / Автоматизація</small><h4>Оплата й доставка</h4><p><b>Нова Пошта + monobank</b>, адмінка та автоматичний товарний фід.</p></article>
        <article class="z34QuickItem"><small>03 / Реклама</small><h4>Аналітика продажів</h4><p><b>Google Ads, GA4, Meta Pixel + CAPI</b> — від кліку до реальної оплати.</p></article>
      </section>
    </div>
  `;
})();

const webworkHeroGhost=document.querySelector('.hero-title .ghost');
if(webworkHeroGhost)webworkHeroGhost.textContent=webworkHeroGhost.textContent.replace(/\.\s*$/,'');