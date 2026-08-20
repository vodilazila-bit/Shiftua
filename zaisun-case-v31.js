(()=>{
  const A='https://raw.githubusercontent.com/vodilazila-bit/ZAISUN-site/main/';
  const target=document.querySelector('.zCase[data-zaisun-v28="1"]') || document.querySelector('#work.zCase') || document.querySelector('#work');
  if(!target)return;

  target.id='work';
  target.className='z34Case';
  target.dataset.zaisunV34='1';

  if(!document.getElementById('zaisunCaseV34Styles')){
    const st=document.createElement('style');
    st.id='zaisunCaseV34Styles';
    st.textContent=`
      .z34Case{position:relative;padding:112px 0 52px;border-top:1px solid rgba(255,255,255,.13);color:#fff;overflow:hidden}
      .z34Wrap{width:min(1520px,calc(100% - 64px));margin:0 auto}
      .z34Head{display:grid;grid-template-columns:1.05fr .65fr;gap:64px;align-items:end;margin-bottom:38px}
      .z34Head h2{margin:12px 0 0;font:600 clamp(54px,6.7vw,104px)/.88 "Manrope",sans-serif;letter-spacing:-.07em;text-transform:uppercase}
      .z34Head p{margin:0 0 5px;color:#a2a2aa;font-size:15px;line-height:1.58;max-width:440px}
      .z34Screen{border:1px solid rgba(255,255,255,.13);border-radius:30px;overflow:hidden;min-height:720px;display:grid;grid-template-columns:.83fr 1.17fr;background:#efe0cc;color:#181512}
      .z34Copy{padding:clamp(46px,5.5vw,84px);display:flex;flex-direction:column;align-items:flex-start;justify-content:center;position:relative;z-index:2}
      .z34Logo{width:94px;height:auto;object-fit:contain;margin-bottom:42px;filter:none!important}
      .z34Tag{display:inline-flex;padding:8px 11px;border:1px solid rgba(24,21,18,.22);border-radius:999px;margin-bottom:26px;font:700 10px/1.2 "DM Sans",sans-serif;letter-spacing:.16em;text-transform:uppercase}
      .z34Copy h3{font:700 clamp(66px,8vw,132px)/.76 "Manrope",sans-serif;letter-spacing:-.075em;margin:0 0 34px;text-transform:uppercase}
      .z34Copy>p{font-size:17px;line-height:1.58;max-width:470px;color:#564d45;margin:0 0 32px}
      .z34Actions{display:flex;gap:10px;flex-wrap:wrap}
      .z34Btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 20px;border-radius:999px;background:#151515;color:#fff;text-decoration:none;font:600 13px/1 "DM Sans",sans-serif;transition:.25s transform,.25s background,.25s color}
      .z34Btn:hover{transform:translateY(-2px);background:#d9ff3f;color:#0b0b0c}
      .z34BtnLight{background:transparent;color:#181512;border:1px solid rgba(24,21,18,.24)}
      .z34Visual{position:relative;min-height:720px;overflow:hidden;background:#c58c62}
      .z34Visual>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:55% center;display:block;filter:none!important;transform:none!important}
      .z34Visual:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(239,224,204,.16),transparent 28%)}
      .z34Float{position:absolute;z-index:3;background:rgba(251,246,238,.92);backdrop-filter:blur(14px);border:1px solid rgba(24,21,18,.12);border-radius:18px;color:#171513;padding:14px 16px;box-shadow:0 18px 50px rgba(40,20,8,.15)}
      .z34Float b{display:block;font:700 26px/1 "Manrope",sans-serif;letter-spacing:-.04em}.z34Float span{display:block;font-size:10px;margin-top:5px;color:#75685f;text-transform:uppercase;letter-spacing:.12em}
      .z34F1{right:25px;top:25px}.z34F2{left:25px;bottom:25px}

      .z34Done{margin-top:18px;border:1px solid rgba(255,255,255,.13);border-radius:26px;background:#111113;overflow:hidden}
      .z34DoneHead{display:grid;grid-template-columns:.55fr 1.45fr;gap:42px;padding:36px 40px 30px;border-bottom:1px solid rgba(255,255,255,.12);align-items:end}
      .z34DoneHead span{font:700 10px/1.2 "DM Sans",sans-serif;color:#77777e;letter-spacing:.16em;text-transform:uppercase}
      .z34DoneHead h3{margin:0;font:600 clamp(34px,4vw,62px)/.94 "Manrope",sans-serif;letter-spacing:-.055em}
      .z34DoneGrid{display:grid;grid-template-columns:repeat(3,1fr)}
      .z34DoneItem{padding:34px 40px 38px;min-height:270px;border-right:1px solid rgba(255,255,255,.12)}
      .z34DoneItem:last-child{border-right:0}
      .z34DoneItem small{display:block;color:#d9ff3f;font:700 10px/1.2 "DM Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-bottom:18px}
      .z34DoneItem h4{margin:0 0 15px;font:600 25px/1.04 "Manrope",sans-serif;letter-spacing:-.04em}
      .z34DoneItem p{margin:0;color:#96969d;font-size:13px;line-height:1.7}
      .z34DoneItem b{color:#fff;font-weight:600}
      .z34Bottom{display:flex;justify-content:space-between;gap:24px;align-items:center;padding:22px 40px;border-top:1px solid rgba(255,255,255,.12)}
      .z34Bottom p{margin:0;color:#818188;font-size:12px;line-height:1.5}
      .z34Bottom a{color:#fff;text-decoration:none;font-size:13px;font-weight:700;white-space:nowrap}.z34Bottom a:hover{color:#d9ff3f}

      @media(max-width:980px){
        .z34Head{grid-template-columns:1fr;gap:16px}.z34Screen{grid-template-columns:1fr;min-height:0}.z34Visual{min-height:620px}.z34DoneGrid{grid-template-columns:1fr}.z34DoneItem{border-right:0;border-bottom:1px solid rgba(255,255,255,.12);min-height:0}.z34DoneItem:last-child{border-bottom:0}.z34DoneHead{grid-template-columns:1fr;gap:10px}
      }
      @media(max-width:700px){
        .z34Case{padding:78px 0 34px}.z34Wrap{width:min(100% - 24px,1520px)}.z34Head{margin-bottom:24px}.z34Head h2{font-size:13vw}.z34Head p{font-size:13px}.z34Screen{border-radius:20px}.z34Copy{padding:34px 24px 38px}.z34Logo{width:72px;margin-bottom:28px}.z34Tag{margin-bottom:20px}.z34Copy h3{font-size:18vw;margin-bottom:24px}.z34Copy>p{font-size:14px;margin-bottom:24px}.z34Visual{min-height:470px}.z34Float{padding:11px 12px}.z34Float b{font-size:21px}.z34F1{right:12px;top:12px}.z34F2{left:12px;bottom:12px}.z34Done{border-radius:20px}.z34DoneHead{padding:26px 24px 22px}.z34DoneItem{padding:26px 24px}.z34Bottom{padding:20px 24px;align-items:flex-start;flex-direction:column}
      }
    `;
    document.head.appendChild(st);
  }

  target.innerHTML=`
    <div class="z34Wrap">
      <div class="z34Head">
        <div><div class="kicker">03 / РЕАЛЬНИЙ ПРОЄКТ</div><h2>ZAISUN</h2></div>
        <p>Інтернет-магазин дитячого одягу: сайт, автоматизація, аналітика й реклама в одній системі.</p>
      </div>

      <article class="z34Screen">
        <div class="z34Copy">
          <img class="z34Logo" src="${A}logo.png" alt="ZaiSun">
          <span class="z34Tag">E-commerce / Design / Development / Ads</span>
          <h3>ZaiSun</h3>
          <p>Інтернет-магазин дитячого одягу. Каталог, оплата, доставка, аналітика та реклама — одна система.</p>
          <div class="z34Actions">
            <a class="z34Btn" href="https://zaisun.com.ua" target="_blank" rel="noopener">Відкрити ZaiSun ↗</a>
            <a class="z34Btn z34BtnLight" href="#contact">Обговорити схожий проєкт ↗</a>
          </div>
        </div>
        <div class="z34Visual">
          <img src="${A}hero-autumn.jpg" alt="ZaiSun — дитячий одяг">
          <div class="z34Float z34F1"><b>814</b><span>товарів у каталозі</span></div>
          <div class="z34Float z34F2"><b>Live</b><span>реальний e-commerce</span></div>
        </div>
      </article>

      <section class="z34Done">
        <div class="z34DoneHead"><span>Що зроблено</span><h3>Від каталогу до оплаченої покупки.</h3></div>
        <div class="z34DoneGrid">
          <article class="z34DoneItem">
            <small>01 / Сайт</small>
            <h4>E-commerce з нуля</h4>
            <p>Каталог, фільтри, пошук, картки товарів, кошик і checkout. Адмін-панель для <b>товарів, фото, цін і статусів замовлень</b>. Створено <b>776 товарних сторінок</b> та JSON-LD для пошуку.</p>
          </article>
          <article class="z34DoneItem">
            <small>02 / Автоматизація</small>
            <h4>Оплата й доставка</h4>
            <p><b>Нова Пошта API</b> — міста й відділення підтягуються автоматично. <b>monobank API</b> — створення рахунку та підтвердження оплати. Merchant Center отримує <b>автооновлюваний товарний фід</b>.</p>
          </article>
          <article class="z34DoneItem">
            <small>03 / Реклама й аналітика</small>
            <h4>Видно не кліки, а гроші</h4>
            <p><b>Google Ads / Performance Max</b>, тег і розширені конверсії. <b>GA4</b>: товар → кошик → checkout → реальна оплата, збереження <b>gclid</b> у замовленні. <b>Meta Pixel + Conversions API</b> з дедуплікацією, ремаркетинг і Lookalike.</p>
          </article>
        </div>
        <div class="z34Bottom"><p>Один реальний кейс замість галереї декоративних скрінів — коротко, по суті й з живим результатом.</p><a href="https://zaisun.com.ua" target="_blank" rel="noopener">zaisun.com.ua ↗</a></div>
      </section>
    </div>
  `;
})();