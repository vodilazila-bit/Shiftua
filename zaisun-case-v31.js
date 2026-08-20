(()=>{
  const A='https://raw.githubusercontent.com/vodilazila-bit/ZAISUN-site/main/';
  const target=document.querySelector('.zCase[data-zaisun-v28="1"]') || document.querySelector('#work.zCase') || document.querySelector('#work');
  if(!target)return;

  target.id='work';
  target.className='z33Case';
  target.dataset.zaisunV33='1';

  if(!document.getElementById('zaisunCaseV33Styles')){
    const st=document.createElement('style');
    st.id='zaisunCaseV33Styles';
    st.textContent=`
      .z33Case{position:relative;padding:112px 0 42px;border-top:1px solid rgba(255,255,255,.13);color:#fff;overflow:hidden}
      .z33Wrap{width:min(1520px,calc(100% - 64px));margin:0 auto}
      .z33Head{display:grid;grid-template-columns:1.05fr .65fr;gap:64px;align-items:end;margin-bottom:42px}
      .z33Head h2{margin:12px 0 0;font:600 clamp(54px,6.7vw,104px)/.88 "Manrope",sans-serif;letter-spacing:-.07em;text-transform:uppercase}
      .z33Head p{margin:0 0 5px;color:#a2a2aa;font-size:15px;line-height:1.58;max-width:440px}
      .z33Project{display:grid;gap:18px}
      .z33Panel{border:1px solid rgba(255,255,255,.13);border-radius:30px;overflow:hidden}
      .z33Hero{min-height:720px;display:grid;grid-template-columns:.83fr 1.17fr;background:#efe0cc;color:#181512}
      .z33HeroCopy{padding:clamp(46px,5.5vw,84px);display:flex;flex-direction:column;align-items:flex-start;justify-content:center;position:relative;z-index:2}
      .z33Logo{width:94px;height:auto;object-fit:contain;margin-bottom:42px;filter:none!important}
      .z33Tag,.z33Eyebrow{font:700 10px/1.2 "DM Sans",sans-serif;letter-spacing:.16em;text-transform:uppercase}
      .z33Tag{display:inline-flex;padding:8px 11px;border:1px solid rgba(24,21,18,.22);border-radius:999px;margin-bottom:26px}
      .z33Hero h3{font:700 clamp(66px,8vw,132px)/.76 "Manrope",sans-serif;letter-spacing:-.075em;margin:0 0 34px;text-transform:uppercase}
      .z33HeroCopy>p{font-size:17px;line-height:1.58;max-width:470px;color:#564d45;margin:0 0 32px}
      .z33Actions{display:flex;gap:10px;flex-wrap:wrap}
      .z33Btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 20px;border-radius:999px;background:#151515;color:#fff;text-decoration:none;font:600 13px/1 "DM Sans",sans-serif;transition:.25s transform,.25s background,.25s color}
      .z33Btn:hover{transform:translateY(-2px);background:#d9ff3f;color:#0b0b0c}
      .z33BtnLight{background:transparent;color:#181512;border:1px solid rgba(24,21,18,.24)}
      .z33HeroVisual{position:relative;min-height:720px;overflow:hidden;background:#c58c62}
      .z33HeroVisual>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:55% center;display:block;filter:none!important;transform:none!important}
      .z33HeroVisual:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(239,224,204,.16),transparent 28%)}
      .z33Float{position:absolute;z-index:3;background:rgba(251,246,238,.9);backdrop-filter:blur(14px);border:1px solid rgba(24,21,18,.12);border-radius:18px;color:#171513;padding:14px 16px;box-shadow:0 18px 50px rgba(40,20,8,.15)}
      .z33Float b{display:block;font:700 26px/1 "Manrope",sans-serif;letter-spacing:-.04em}.z33Float span{display:block;font-size:10px;margin-top:5px;color:#75685f;text-transform:uppercase;letter-spacing:.12em}
      .z33F1{right:25px;top:25px}.z33F2{left:25px;bottom:25px}

      .z33Stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.14)}
      .z33Stat{min-height:190px;background:#101012;padding:34px 38px;display:flex;flex-direction:column;justify-content:space-between}
      .z33Stat b{font:600 clamp(56px,6vw,92px)/.9 "Manrope",sans-serif;letter-spacing:-.065em;color:#d9ff3f}.z33Stat span{color:#aaaab0;font-size:13px;text-transform:uppercase;letter-spacing:.12em}

      .z33Catalog{padding:54px;background:#f5f0e9;color:#171513}
      .z33SectionHead{display:grid;grid-template-columns:.72fr 1.1fr .72fr;gap:34px;align-items:end;margin-bottom:34px}
      .z33SectionHead .z33Eyebrow{color:#80766e;align-self:start;padding-top:8px}
      .z33SectionHead h3{margin:0;font:600 clamp(38px,4.7vw,72px)/.92 "Manrope",sans-serif;letter-spacing:-.055em}
      .z33SectionHead p{margin:0;color:#716a64;font-size:14px;line-height:1.6;max-width:410px}
      .z33Products{display:grid;grid-template-columns:1.08fr .92fr .92fr;gap:12px}
      .z33Product{position:relative;min-height:520px;border-radius:22px;overflow:hidden;background:#ddd3ca}
      .z33Product img{width:100%;height:100%;position:absolute;inset:0;object-fit:cover;display:block;filter:none!important;transform:scale(1.001);transition:transform .7s cubic-bezier(.2,.7,.2,1)}
      .z33Product:hover img{transform:scale(1.035)}
      .z33Product:after{content:"";position:absolute;inset:45% 0 0;background:linear-gradient(transparent,rgba(12,10,9,.78))}
      .z33ProductCopy{position:absolute;z-index:2;left:22px;right:22px;bottom:20px;color:#fff}
      .z33ProductCopy small{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.13em;opacity:.72;margin-bottom:7px}.z33ProductCopy h4{font:600 25px/1.02 "Manrope",sans-serif;letter-spacing:-.035em;margin:0 0 8px}.z33ProductCopy span{font-size:12px;opacity:.78}

      .z33Flow{padding:60px;background:#121214}
      .z33Flow .z33SectionHead h3,.z33Flow .z33SectionHead p{color:#fff}.z33Flow .z33SectionHead p{color:#8e8e95}.z33Flow .z33Eyebrow{color:#74747a}
      .z33FlowGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;counter-reset:flow}
      .z33Step{position:relative;min-height:250px;border:1px solid rgba(255,255,255,.13);border-radius:20px;padding:25px;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.015));overflow:hidden}
      .z33Step:after{content:"";position:absolute;width:130px;height:130px;border-radius:50%;right:-55px;bottom:-55px;background:#d9ff3f;filter:blur(1px);opacity:.08}
      .z33StepTop{display:flex;justify-content:space-between;color:#77777e;font-size:10px;letter-spacing:.14em;text-transform:uppercase}.z33Step strong{font:600 27px/1 "Manrope",sans-serif;letter-spacing:-.04em}.z33Step p{font-size:12px;color:#929299;line-height:1.55;margin:10px 0 0}.z33Arrow{font-size:25px;color:#d9ff3f}

      .z33System{padding:60px;background:#d9ff3f;color:#101011}
      .z33System .z33SectionHead{margin-bottom:30px}.z33System .z33SectionHead p,.z33System .z33Eyebrow{color:#4d581b}
      .z33TechGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
      .z33Tech{min-height:180px;padding:24px;border:1px solid rgba(10,10,11,.18);border-radius:20px;display:flex;flex-direction:column;justify-content:space-between;background:rgba(255,255,255,.18)}
      .z33Tech small{font-size:10px;letter-spacing:.13em;text-transform:uppercase;opacity:.55}.z33Tech h4{font:600 25px/1.03 "Manrope",sans-serif;letter-spacing:-.04em;margin:0}.z33Tech p{font-size:12px;line-height:1.5;margin:8px 0 0;opacity:.67;max-width:31ch}

      .z33Ig{padding:50px;background:#efe0cc;color:#171513;display:grid;grid-template-columns:.56fr 1.44fr;gap:45px;align-items:center}
      .z33IgCopy{padding:20px}.z33IgCopy h3{font:600 clamp(38px,4.8vw,70px)/.9 "Manrope",sans-serif;letter-spacing:-.055em;margin:18px 0 20px}.z33IgCopy p{color:#6b6058;font-size:14px;line-height:1.6;max-width:360px}.z33IgPill{display:inline-flex;margin-top:15px;padding:10px 14px;border-radius:999px;background:#40362f;color:#fff;font-size:12px;font-weight:700}
      .z33IgGrid{display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(2,270px);gap:10px}.z33IgGrid img{width:100%;height:100%;object-fit:cover;border-radius:18px;display:block;filter:none!important;transform:none!important}

      .z33Result{position:relative;min-height:520px;padding:62px;background:#0f0f11;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden}
      .z33Result:before{content:"";position:absolute;width:560px;height:560px;border-radius:50%;right:-120px;top:-210px;background:radial-gradient(circle,#d9ff3f 0,rgba(217,255,63,.24) 24%,transparent 68%);opacity:.65}
      .z33ResultInner{position:relative;z-index:2}.z33Result small{font-size:10px;color:#7f7f85;letter-spacing:.16em;text-transform:uppercase}.z33Result h3{font:600 clamp(44px,6.1vw,90px)/.91 "Manrope",sans-serif;letter-spacing:-.062em;margin:20px 0 24px;max-width:1100px}.z33Result p{font-size:15px;color:#97979e;line-height:1.6;max-width:600px;margin:0 0 28px}

      .z33Reveal{opacity:0;transform:translateY(24px);transition:opacity .72s ease,transform .72s cubic-bezier(.2,.7,.2,1)}.z33Reveal.on{opacity:1;transform:none}
      @media(max-width:1080px){
        .z33Hero{grid-template-columns:1fr;min-height:0}.z33HeroVisual{min-height:640px}.z33Products{grid-template-columns:repeat(2,1fr)}.z33Product:first-child{grid-column:1/-1;min-height:600px}.z33FlowGrid{grid-template-columns:repeat(2,1fr)}.z33TechGrid{grid-template-columns:repeat(2,1fr)}.z33Ig{grid-template-columns:1fr}.z33IgCopy{padding:0}.z33SectionHead{grid-template-columns:.6fr 1fr}.z33SectionHead p{grid-column:2}
      }
      @media(max-width:700px){
        .z33Case{padding:78px 0 28px}.z33Wrap{width:calc(100% - 24px)}.z33Head{grid-template-columns:1fr;gap:14px;margin-bottom:24px}.z33Head h2{font-size:13vw}.z33Head p{font-size:12.5px;max-width:33ch}.z33Panel{border-radius:20px}.z33HeroCopy{padding:34px 24px 38px}.z33Logo{width:74px;margin-bottom:28px}.z33Tag{font-size:8px;margin-bottom:20px}.z33Hero h3{font-size:20vw;margin-bottom:22px}.z33HeroCopy>p{font-size:14px}.z33HeroVisual{min-height:460px}.z33F1{right:12px;top:12px}.z33F2{left:12px;bottom:12px}.z33Float{padding:11px 12px;border-radius:14px}.z33Float b{font-size:21px}.z33Stats{grid-template-columns:1fr}.z33Stat{min-height:135px;padding:24px}.z33Catalog,.z33Flow,.z33System,.z33Ig,.z33Result{padding:30px 20px}.z33SectionHead{grid-template-columns:1fr;gap:10px}.z33SectionHead p{grid-column:auto}.z33SectionHead h3{font-size:12vw}.z33Products{grid-template-columns:1fr}.z33Product,.z33Product:first-child{grid-column:auto;min-height:440px}.z33FlowGrid,.z33TechGrid{grid-template-columns:1fr}.z33Step{min-height:190px}.z33IgGrid{grid-template-rows:repeat(2,190px);gap:7px}.z33IgGrid img{border-radius:12px}.z33Result{min-height:450px}.z33Result h3{font-size:12vw}.z33Actions{flex-direction:column;align-items:stretch}.z33Btn{width:100%}
      }
      @media(prefers-reduced-motion:reduce){.z33Reveal{opacity:1;transform:none;transition:none}.z33Product img{transition:none}}
    `;
    document.head.appendChild(st);
  }

  target.innerHTML=`
    <div class="z33Wrap">
      <div class="z33Head z33Reveal">
        <div><div class="kicker">03 / SELECTED WORK</div><h2>Вибрані роботи</h2></div>
        <p>Реальні проєкти та концепти, що показують наш підхід.</p>
      </div>

      <article class="z33Project">
        <section class="z33Hero z33Panel z33Reveal">
          <div class="z33HeroCopy">
            <img class="z33Logo" src="${A}logo.png" alt="ZaiSun">
            <div class="z33Tag">E-commerce / Design / Development / Ads</div>
            <h3>ZaiSun</h3>
            <p>Інтернет-магазин дитячого одягу. Каталог, оплата, доставка, аналітика та реклама — одна система.</p>
            <div class="z33Actions"><a class="z33Btn z33Remember" href="https://zaisun.com.ua">Відкрити ZaiSun ↗</a><a class="z33Btn z33BtnLight" href="#contact">Обговорити схожий проєкт ↗</a></div>
          </div>
          <div class="z33HeroVisual">
            <img src="${A}hero-autumn.jpg" alt="Осіння колекція ZaiSun">
            <div class="z33Float z33F1"><b>814</b><span>товарів у каталозі</span></div>
            <div class="z33Float z33F2"><b>Live</b><span>реальний e-commerce</span></div>
          </div>
        </section>

        <section class="z33Stats z33Panel z33Reveal">
          <div class="z33Stat"><b>814</b><span>товарів</span></div>
          <div class="z33Stat"><b>131</b><span>боді</span></div>
          <div class="z33Stat"><b>233</b><span>осінніх позицій</span></div>
        </section>

        <section class="z33Catalog z33Panel z33Reveal">
          <div class="z33SectionHead"><div class="z33Eyebrow">01 / Каталог</div><h3>Продукт у центрі.</h3><p>Не показуємо скрін сайту. Збираємо його логіку заново: чисті фото, категорії й контент працюють як частина самого кейса.</p></div>
          <div class="z33Products">
            <article class="z33Product"><img src="${A}ig1.jpg" alt="ZaiSun — новинки"><div class="z33ProductCopy"><small>Колекція 01</small><h4>Новинки</h4><span>Свіжі образи та сезонні позиції</span></div></article>
            <article class="z33Product"><img src="${A}hero2.jpg" alt="ZaiSun — для малюків"><div class="z33ProductCopy"><small>Колекція 02</small><h4>Для малюків</h4><span>Боді, комплекти та базові речі</span></div></article>
            <article class="z33Product"><img src="${A}ig4.jpg" alt="ZaiSun — святкові образи"><div class="z33ProductCopy"><small>Колекція 03</small><h4>Святкове</h4><span>Сукні та готові образи</span></div></article>
          </div>
        </section>

        <section class="z33Flow z33Panel z33Reveal">
          <div class="z33SectionHead"><div class="z33Eyebrow">02 / Покупка</div><h3>Від вибору до оплати.</h3><p>Короткий сценарій без зайвих переходів: клієнт знаходить товар, додає його в кошик, обирає доставку та завершує оплату.</p></div>
          <div class="z33FlowGrid">
            <div class="z33Step"><div class="z33StepTop"><span>01</span><span class="z33Arrow">→</span></div><div><strong>Каталог</strong><p>Категорії, пошук, фільтри та зрозуміла навігація.</p></div></div>
            <div class="z33Step"><div class="z33StepTop"><span>02</span><span class="z33Arrow">→</span></div><div><strong>Товар</strong><p>Фото, розміри, ціна й усе потрібне для рішення.</p></div></div>
            <div class="z33Step"><div class="z33StepTop"><span>03</span><span class="z33Arrow">→</span></div><div><strong>Кошик</strong><p>Короткий checkout без перевантаження інтерфейсу.</p></div></div>
            <div class="z33Step"><div class="z33StepTop"><span>04</span><span class="z33Arrow">↗</span></div><div><strong>Оплата</strong><p>monobank, доставка та передача замовлення в систему.</p></div></div>
          </div>
        </section>

        <section class="z33System z33Panel z33Reveal">
          <div class="z33SectionHead"><div class="z33Eyebrow">03 / Система</div><h3>Що працює під капотом.</h3><p>Кейс показує не лише візуал. У магазині пов'язані каталог, оплати, доставка, аналітика й рекламні канали.</p></div>
          <div class="z33TechGrid">
            <div class="z33Tech"><small>01 / Commerce</small><div><h4>Каталог</h4><p>Сотні товарних сторінок, категорії, розміри та ціни.</p></div></div>
            <div class="z33Tech"><small>02 / Delivery</small><div><h4>Нова Пошта</h4><p>Міста й відділення підтягуються через API.</p></div></div>
            <div class="z33Tech"><small>03 / Payment</small><div><h4>monobank</h4><p>Створення рахунку та контроль статусу оплати.</p></div></div>
            <div class="z33Tech"><small>04 / Feed</small><div><h4>Merchant Center</h4><p>Товарні дані готові для Google Shopping.</p></div></div>
            <div class="z33Tech"><small>05 / Analytics</small><div><h4>GA4</h4><p>E-commerce події від перегляду до фактичної покупки.</p></div></div>
            <div class="z33Tech"><small>06 / Performance</small><div><h4>Meta / Google Ads</h4><p>Сайт підготовлений до реклами, ремаркетингу й оптимізації.</p></div></div>
          </div>
        </section>

        <section class="z33Ig z33Panel z33Reveal">
          <div class="z33IgCopy"><div class="z33Eyebrow">04 / Brand</div><h3>Бренд живе не тільки на сайті.</h3><p>Instagram лишається важливою точкою контакту, а e-commerce забирає на себе каталог, оформлення й дані для реклами.</p><span class="z33IgPill">◎ @zaisun_kids</span></div>
          <div class="z33IgGrid"><img src="${A}ig1.jpg" alt="ZaiSun Instagram"><img src="${A}ig2.jpg" alt="ZaiSun Instagram"><img src="${A}ig3.jpg" alt="ZaiSun Instagram"><img src="${A}ig4.jpg" alt="ZaiSun Instagram"></div>
        </section>

        <section class="z33Result z33Panel z33Reveal">
          <div class="z33ResultInner"><small>Result / Live project</small><h3>Від Instagram-магазину<br>до повноцінного e-commerce.</h3><p>Один продукт для продажів: брендова подача, великий каталог, оплата, доставка, аналітика й готовність до масштабування реклами.</p><div class="z33Actions"><a class="z33Btn z33Remember" href="https://zaisun.com.ua">Відкрити ZaiSun ↗</a><a class="z33Btn" href="#contact">Обговорити схожий проєкт ↗</a></div></div>
        </section>
      </article>
    </div>`;

  const remember=()=>{try{sessionStorage.setItem('shift_return_scroll_v33',String(window.scrollY));sessionStorage.setItem('shift_return_pending_v33','1')}catch(e){}};
  target.querySelectorAll('.z33Remember').forEach(a=>a.addEventListener('click',remember));
  document.querySelectorAll('#concepts a.case-demo-link').forEach(a=>{a.removeAttribute('target');a.removeAttribute('rel');if(a.dataset.shiftV33Bound!=='1'){a.dataset.shiftV33Bound='1';a.addEventListener('click',remember)}});

  const restore=()=>{try{if(sessionStorage.getItem('shift_return_pending_v33')!=='1')return;const y=parseInt(sessionStorage.getItem('shift_return_scroll_v33')||'0',10);sessionStorage.removeItem('shift_return_pending_v33');requestAnimationFrame(()=>requestAnimationFrame(()=>{window.scrollTo(0,y);setTimeout(()=>window.scrollTo(0,y),120)}))}catch(e){}};
  window.addEventListener('pageshow',restore);setTimeout(restore,50);

  const nodes=[...target.querySelectorAll('.z33Reveal')];
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){nodes.forEach(n=>n.classList.add('on'));return;}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.09,rootMargin:'0px 0px -4%'});
  nodes.forEach(n=>io.observe(n));
})();