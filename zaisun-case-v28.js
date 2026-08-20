(()=>{
  const old=document.getElementById('work');
  if(!old || old.dataset.zaisunV28==='1') return;

  const ASSET='https://raw.githubusercontent.com/vodilazila-bit/ZAISUN-site/main/';
  const imgs={
    hero:ASSET+'hero-autumn.jpg',
    hero2:ASSET+'hero2.jpg',
    sale:ASSET+'hero-sale.jpg',
    logo:ASSET+'logo.png',
    ig1:ASSET+'ig1.jpg',
    ig2:ASSET+'ig2.jpg',
    ig3:ASSET+'ig3.jpg',
    ig4:ASSET+'ig4.jpg'
  };

  const style=document.createElement('style');
  style.id='zaisunCaseV28Styles';
  style.textContent=`
    .zCase{position:relative;padding:112px 0 72px;border-top:1px solid rgba(255,255,255,.12);overflow:hidden}
    .zCase:before{content:"";position:absolute;left:-10%;top:14%;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(217,255,63,.08),transparent 67%);pointer-events:none}
    .zCase .zWrap{width:min(1460px,calc(100% - 44px));margin:auto;position:relative;z-index:2}

    .zGallery{position:relative}
    .zFrame{position:relative;border:1px solid rgba(255,255,255,.14);border-radius:30px;background:#111114;padding:13px;box-shadow:0 42px 110px rgba(0,0,0,.28);overflow:hidden}
    .zFrame:before{content:"";position:absolute;inset:-1px;border-radius:30px;background:linear-gradient(120deg,rgba(217,255,63,.12),transparent 22%,transparent 76%,rgba(85,112,255,.12));pointer-events:none;z-index:5}
    .zChrome{height:36px;display:flex;align-items:center;gap:7px;padding:0 6px 10px;position:relative;z-index:7}
    .zChrome i{width:8px;height:8px;border-radius:50%;background:#34343a;display:block}.zChrome span{margin-left:9px;color:#73737c;font:500 11px/1 ui-monospace,SFMono-Regular,monospace;letter-spacing:.03em}
    .zStage{position:relative;aspect-ratio:16/8.7;min-height:470px;border-radius:20px;overflow:hidden;background:#eee6db;isolation:isolate}
    .zSlide{position:absolute;inset:0;opacity:0;transform:scale(1.018);transition:opacity .72s ease,transform 5.8s cubic-bezier(.2,.7,.2,1);pointer-events:none}
    .zSlide.active{opacity:1;transform:scale(1);pointer-events:auto;z-index:2}
    .zSlide img{display:block;width:100%;height:100%;object-fit:cover}
    .zSiteHeader{height:15%;min-height:58px;background:#f8ecdc;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 4%;position:relative;z-index:4;color:#302a26}
    .zSiteHeader .zLogoImg{width:92px;height:46px;object-fit:contain;filter:contrast(1.08)}
    .zSiteHeader .zTools{justify-self:end;display:flex;gap:17px;font-size:18px}.zSiteHeader .zSearchIcon{width:17px;height:17px;border:1.8px solid currentColor;border-radius:50%;position:relative}.zSiteHeader .zSearchIcon:after{content:"";position:absolute;width:7px;height:1.5px;background:currentColor;right:-5px;bottom:-2px;transform:rotate(45deg)}.zSiteHeader .zMenuIcon{font-size:23px;line-height:1}
    .zHeroShot{position:absolute;left:0;right:0;top:15%;bottom:0;background:center/cover no-repeat;overflow:hidden}.zHeroShot:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(40,23,11,.52),transparent 52%),linear-gradient(to top,rgba(24,15,8,.18),transparent 38%)}
    .zHeroText{position:absolute;left:6%;top:50%;transform:translateY(-42%);z-index:4;color:#fff;max-width:400px}.zHeroText small{font-size:10px;letter-spacing:.18em;text-transform:uppercase;font-weight:700}.zHeroText h3{margin:13px 0 12px;font:700 clamp(34px,4.6vw,65px)/.98 "Manrope",sans-serif;letter-spacing:-.055em}.zHeroText p{margin:0;max-width:330px;font-size:13px;line-height:1.55;color:rgba(255,255,255,.86)}.zHeroBtn{display:inline-flex;margin-top:19px;background:#ddb49b;color:#fff;border-radius:10px;padding:12px 19px;font-size:11px;font-weight:700}
    .zHeroDots{position:absolute;z-index:5;left:50%;bottom:18px;transform:translateX(-50%);display:flex;gap:6px}.zHeroDots i{width:6px;height:6px;background:rgba(255,255,255,.65);border-radius:50%}.zHeroDots i:first-child{width:23px;border-radius:99px;background:#fff}

    .zShopShot{height:100%;background:#fbf7f1;color:#302922;display:flex;flex-direction:column}.zShopTop{height:14%;min-height:60px;background:#faecdb;display:flex;align-items:center;justify-content:center;position:relative}.zShopTop img{width:88px;height:48px;object-fit:contain}.zShopTop:after{content:"⌕   ☰";position:absolute;right:4%;font-size:19px;letter-spacing:.26em;color:#403a35}.zShopTitle{text-align:center;padding:2.2% 0 1.5%;font-size:clamp(18px,2.2vw,31px);letter-spacing:.26em;text-transform:uppercase;color:#aaa39b;font-weight:400}.zProducts{flex:1;display:grid;grid-template-columns:repeat(5,1fr);gap:12px;padding:0 1.8% 2%}.zProduct{min-width:0;display:flex;flex-direction:column;gap:7px}.zProduct .pic{flex:1;min-height:0;border-radius:15px;overflow:hidden;background:#e7ddd2;position:relative}.zProduct .pic img{width:100%;height:100%;object-fit:cover}.zProduct .pic:before{content:"NEW";position:absolute;z-index:2;left:9px;top:9px;background:#cc8267;color:#fff;border-radius:99px;padding:4px 7px;font:700 8px/1 "DM Sans",sans-serif}.zProduct b{display:block;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600}.zProduct small{font-size:10px;color:#7a6e62;font-weight:700}

    .zMenuShot{height:100%;position:relative;background:#f4eee6}.zMenuShot .zMenuBg{position:absolute;inset:0;background:center/cover no-repeat;filter:saturate(.78);opacity:.66}.zMenuShot:after{content:"";position:absolute;inset:0;background:rgba(28,25,22,.34)}.zMenuPanel{position:absolute;z-index:3;right:0;top:0;bottom:0;width:34%;min-width:300px;background:#fff0df;padding:4.5% 4%;display:flex;flex-direction:column;align-items:center}.zMenuPanel img{width:92px;height:50px;object-fit:contain;margin-bottom:18px}.zMenuPanel h4{font-size:21px;margin:0 0 17px;font-weight:500}.zMenuList{display:grid;gap:9px;text-align:center;color:#8a6e5d;font-size:13px;line-height:1.2}.zMenuX{position:absolute;right:18px;top:16px;font-size:25px;color:#6c5a4d}

    .zIgShot{height:100%;background:#f8eddd;color:#57483c;display:grid;grid-template-columns:.68fr 1.32fr;gap:3.5%;padding:4.2% 5.5%;align-items:center}.zIgInfo{text-align:center}.zIgInfo img{width:110px;height:64px;object-fit:contain;margin:0 auto 12px}.zIgInfo h4{font-size:clamp(22px,2.5vw,38px);margin:0 0 13px;letter-spacing:-.03em}.zIgPill{display:inline-flex;background:#4b3e34;color:#fff;border-radius:999px;padding:11px 17px;font-size:11px;font-weight:700}.zIgGrid{height:100%;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:10px}.zIgGrid img{border-radius:17px;object-fit:cover}

    .zFocusShot{height:100%;background:#fbf8f3;padding:4%;display:grid;grid-template-columns:1.05fr .95fr;gap:22px;color:#332c27}.zFocusBig{border-radius:20px;overflow:hidden;position:relative}.zFocusBig img{width:100%;height:100%;object-fit:cover}.zFocusBig:after{content:"ВЛАСНЕ ВИРОБНИЦТВО";position:absolute;left:18px;bottom:16px;background:rgba(255,255,255,.88);color:#3c332c;border-radius:999px;padding:9px 12px;font-size:9px;letter-spacing:.12em;font-weight:700}.zFocusGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.zFocusTile{position:relative;border-radius:16px;overflow:hidden;background:#eadfd5}.zFocusTile img{width:100%;height:100%;object-fit:cover}.zFocusTile span{position:absolute;left:10px;bottom:10px;background:rgba(255,255,255,.87);border-radius:999px;padding:7px 9px;font-size:9px;font-weight:700}

    .zNavBtn{position:absolute;z-index:8;top:calc(50% + 12px);transform:translateY(-50%);width:44px;height:44px;border:1px solid rgba(255,255,255,.2);border-radius:50%;background:rgba(9,9,11,.64);backdrop-filter:blur(12px);color:#fff;font-size:19px;cursor:pointer;transition:.22s}.zNavBtn:hover{background:#d9ff3f;color:#0a0a0b;border-color:#d9ff3f}.zPrev{left:26px}.zNext{right:26px}
    .zSlideCount{position:absolute;z-index:8;right:26px;top:59px;background:rgba(10,10,11,.64);color:#fff;border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(10px);border-radius:999px;padding:8px 11px;font:700 9px/1 "DM Sans",sans-serif;letter-spacing:.12em}

    .zThumbs{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:12px}.zThumb{position:relative;height:112px;border-radius:15px;border:1px solid rgba(255,255,255,.11);background:#161619;overflow:hidden;padding:0;cursor:pointer;transition:.28s}.zThumb:after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.48),transparent 58%)}.zThumb:hover{transform:translateY(-3px)}.zThumb.active{border-color:#d9ff3f;box-shadow:0 0 0 1px rgba(217,255,63,.28),0 12px 35px rgba(0,0,0,.22)}.zThumb img{width:100%;height:100%;object-fit:cover;filter:saturate(.84)}.zThumb span{position:absolute;z-index:2;left:10px;bottom:9px;color:#fff;font-size:9px;letter-spacing:.08em;text-transform:uppercase;font-weight:700}.zThumb:nth-child(2) img,.zThumb:nth-child(3) img{object-position:center 35%}

    .zInfo{display:grid;grid-template-columns:.8fr 1.2fr;gap:78px;align-items:start;margin-top:62px}.zIntro{position:sticky;top:110px}.zKicker{display:flex;gap:10px;align-items:center;color:#c2c2c8;font-size:11px;letter-spacing:.12em;text-transform:uppercase}.zKicker b{color:#d9ff3f}.zIntro h2{font:600 clamp(58px,7.4vw,108px)/.88 "Manrope",sans-serif;letter-spacing:-.075em;margin:17px 0 18px;color:#fff}.zLead{display:flex;gap:10px;align-items:flex-start;color:#f1f1f3;font-size:15px;font-weight:600;line-height:1.45;max-width:460px}.zLead:before{content:"";width:9px;height:9px;border-radius:50%;background:#d9ff3f;box-shadow:0 0 18px rgba(217,255,63,.8);flex:none;margin-top:.42em}.zIntroText{margin:20px 0 0;color:#8f8f97;font-size:13px;line-height:1.62;max-width:440px}.zCtaRow{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-top:28px}.zOpen{display:inline-flex;align-items:center;justify-content:center;gap:10px;background:#d9ff3f;color:#0a0a0b;border-radius:999px;padding:16px 25px;font-weight:800;font-size:13px;box-shadow:0 14px 42px rgba(217,255,63,.14);transition:.25s}.zOpen:hover{transform:translateY(-2px);box-shadow:0 18px 48px rgba(217,255,63,.22)}.zDomain{display:flex;gap:8px;align-items:center;color:#b3b3ba;font-size:11px}.zDomain:before{content:"";width:6px;height:6px;border-radius:50%;background:#d9ff3f}

    .zDetails{display:grid;gap:12px}.zDetail{border:1px solid rgba(255,255,255,.12);border-radius:22px;background:linear-gradient(145deg,rgba(31,31,35,.9),rgba(18,18,21,.9));overflow:hidden;transition:.3s}.zDetail[open]{border-color:rgba(217,255,63,.24);box-shadow:0 18px 55px rgba(0,0,0,.18)}.zDetail summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:48px 1fr 30px;gap:17px;align-items:center;padding:22px 23px;color:#fff}.zDetail summary::-webkit-details-marker{display:none}.zDIcon{width:45px;height:45px;border:1px solid rgba(217,255,63,.45);border-radius:14px;display:grid;place-items:center;color:#d9ff3f;font-size:19px}.zDetail summary h3{margin:0;font:600 18px/1.15 "Manrope",sans-serif;letter-spacing:-.025em}.zDetail summary p{margin:5px 0 0;color:#8e8e96;font-size:11.5px;line-height:1.45}.zPlus{justify-self:end;color:#d9ff3f;font-size:25px;font-weight:300;transition:transform .3s}.zDetail[open] .zPlus{transform:rotate(45deg)}.zDbody{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 23px 22px 88px}.zDbody span{display:block;border-top:1px solid rgba(255,255,255,.1);padding:11px 0 2px;color:#c8c8ce;font-size:11.5px;line-height:1.4}.zDbody b{color:#fff;font-weight:600}
    .zFacts{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}.zFact{padding:8px 10px;border:1px solid rgba(255,255,255,.11);border-radius:999px;color:#9898a0;font-size:9px;letter-spacing:.04em}.zFact b{color:#d9ff3f;margin-right:4px}

    @media(max-width:1000px){
      .zCase{padding:82px 0 58px}.zInfo{grid-template-columns:1fr;gap:34px;margin-top:45px}.zIntro{position:static}.zDetails{max-width:none}.zStage{min-height:420px}.zThumb{height:96px}
    }
    @media(max-width:700px){
      .zCase{padding:66px 0 48px}.zCase .zWrap{width:calc(100% - 26px)}
      .zFrame{padding:7px;border-radius:23px}.zFrame:before{border-radius:23px}.zChrome{height:29px;padding:0 5px 7px}.zChrome i{width:6px;height:6px}.zChrome span{font-size:9px}
      .zStage{aspect-ratio:4/5;min-height:0;border-radius:17px}.zSiteHeader{height:13%;min-height:44px;padding:0 4%}.zSiteHeader .zLogoImg{width:62px;height:34px}.zSiteHeader .zTools{gap:12px}.zHeroShot{top:13%;background-position:56% center}.zHeroShot:after{background:linear-gradient(90deg,rgba(40,23,11,.62),rgba(40,23,11,.12) 68%,transparent)}.zHeroText{left:7%;right:31%;top:52%;transform:translateY(-44%)}.zHeroText small{font-size:7px}.zHeroText h3{font-size:7.8vw;margin:8px 0 8px}.zHeroText p{display:none}.zHeroBtn{margin-top:7px;padding:9px 12px;font-size:8px;border-radius:8px}.zHeroDots{bottom:10px}.zHeroDots i{width:4px;height:4px}.zHeroDots i:first-child{width:17px}
      .zShopTop{height:12%;min-height:42px}.zShopTop img{width:58px;height:34px}.zShopTop:after{font-size:14px}.zShopTitle{padding:4% 0 2.5%;font-size:4.2vw}.zProducts{grid-template-columns:repeat(2,1fr);gap:7px;padding:0 3.5% 3.5%}.zProduct:nth-child(n+5){display:none}.zProduct .pic{border-radius:10px}.zProduct b{font-size:8px}.zProduct small{font-size:8px}.zProduct .pic:before{left:5px;top:5px;font-size:6px;padding:3px 5px}
      .zMenuPanel{width:70%;min-width:0;padding:8% 6%}.zMenuPanel img{width:68px;height:40px;margin-bottom:8px}.zMenuPanel h4{font-size:16px;margin-bottom:12px}.zMenuList{gap:8px;font-size:10px}.zMenuX{font-size:20px;right:12px;top:10px}
      .zIgShot{grid-template-columns:1fr;padding:6%;gap:4%}.zIgInfo{display:none}.zIgGrid{gap:7px}.zIgGrid img{border-radius:12px}.zFocusShot{grid-template-columns:1fr;padding:4%;gap:8px}.zFocusBig{height:45%;border-radius:13px}.zFocusGrid{height:55%;gap:7px}.zFocusTile{border-radius:10px}.zFocusBig:after,.zFocusTile span{font-size:6px;padding:5px 7px}
      .zNavBtn{display:none}.zSlideCount{right:12px;top:40px;padding:6px 8px;font-size:7px}
      .zThumbs{display:flex;overflow-x:auto;gap:7px;margin-top:8px;padding-bottom:3px;scrollbar-width:none;scroll-snap-type:x mandatory}.zThumbs::-webkit-scrollbar{display:none}.zThumb{flex:0 0 22%;height:72px;border-radius:11px;scroll-snap-align:start}.zThumb span{left:7px;bottom:6px;font-size:6px}
      .zInfo{margin-top:38px;gap:27px}.zKicker{font-size:9px}.zIntro h2{font-size:16vw;margin:12px 0 13px}.zLead{font-size:13px}.zIntroText{display:none}.zCtaRow{margin-top:21px;gap:13px}.zOpen{padding:14px 21px;font-size:12px}.zDomain{font-size:10px}.zFacts{margin-top:14px}
      .zDetail{border-radius:18px}.zDetail summary{grid-template-columns:41px 1fr 24px;gap:12px;padding:17px 16px}.zDIcon{width:39px;height:39px;border-radius:12px;font-size:16px}.zDetail summary h3{font-size:15px}.zDetail summary p{font-size:10px}.zPlus{font-size:22px}.zDbody{grid-template-columns:1fr;padding:0 16px 17px 69px}.zDbody span{font-size:10.5px;padding-top:9px}
    }
    @media(prefers-reduced-motion:reduce){.zSlide,.zThumb,.zOpen,.zPlus{transition:none!important}}
  `;
  document.head.appendChild(style);

  const section=document.createElement('section');
  section.className='zCase';
  section.id='work';
  section.dataset.zaisunV28='1';
  section.innerHTML=`
    <div class="zWrap">
      <div class="zGallery reveal">
        <div class="zFrame">
          <div class="zChrome"><i></i><i></i><i></i><span>zaisun.com.ua / real project</span></div>
          <div class="zStage" id="zCaseStage">
            <article class="zSlide active" data-label="Головна">
              <div class="zSiteHeader"><span></span><img class="zLogoImg" src="${imgs.logo}" alt="ZaiSun"><div class="zTools"><span class="zSearchIcon"></span><span class="zMenuIcon">☰</span></div></div>
              <div class="zHeroShot" style="background-image:url('${imgs.hero}')"><div class="zHeroText"><small>Нова колекція</small><h3>Осіння колекція вже на сайті</h3><p>Тепліші тканини, спокійні кольори — усе для перших прохолодних днів.</p><span class="zHeroBtn">Дивитись осінь</span></div><div class="zHeroDots"><i></i><i></i><i></i></div></div>
            </article>
            <article class="zSlide" data-label="Каталог">
              <div class="zShopShot"><div class="zShopTop"><img src="${imgs.logo}" alt=""><span></span></div><div class="zShopTitle">Новинки</div><div class="zProducts">
                <div class="zProduct"><div class="pic"><img src="${imgs.ig3}" alt=""></div><b>Комплект для малюка</b><small>від 570 ₴</small></div>
                <div class="zProduct"><div class="pic"><img src="${imgs.ig1}" alt=""></div><b>Нова колекція</b><small>від 685 ₴</small></div>
                <div class="zProduct"><div class="pic"><img src="${imgs.hero2}" alt=""></div><b>Базовий комплект</b><small>від 425 ₴</small></div>
                <div class="zProduct"><div class="pic"><img src="${imgs.ig2}" alt=""></div><b>Теплий образ</b><small>від 595 ₴</small></div>
                <div class="zProduct"><div class="pic"><img src="${imgs.ig4}" alt=""></div><b>Святковий образ</b><small>від 950 ₴</small></div>
              </div></div>
            </article>
            <article class="zSlide" data-label="Меню">
              <div class="zMenuShot"><div class="zMenuBg" style="background-image:url('${imgs.hero}')"></div><aside class="zMenuPanel"><span class="zMenuX">×</span><img src="${imgs.logo}" alt=""><h4>Каталог товарів</h4><div class="zMenuList"><span>Всі товари</span><span>Осінь</span><span>Боді</span><span>Костюми</span><span>Сукні</span><span>Джинси, штани, кофтини</span><span>Шапки</span><span>Ромпери</span><span>Одяг на хрещення</span><span>Аксесуари</span></div></aside></div>
            </article>
            <article class="zSlide" data-label="Instagram">
              <div class="zIgShot"><div class="zIgInfo"><img src="${imgs.logo}" alt=""><h4>Відвідайте наш Instagram</h4><span class="zIgPill">◎ @zaisun_kids</span></div><div class="zIgGrid"><img src="${imgs.ig1}" alt=""><img src="${imgs.ig2}" alt=""><img src="${imgs.ig3}" alt=""><img src="${imgs.ig4}" alt=""></div></div>
            </article>
            <article class="zSlide" data-label="Бренд">
              <div class="zFocusShot"><div class="zFocusBig"><img src="${imgs.sale}" alt=""></div><div class="zFocusGrid"><div class="zFocusTile"><img src="${imgs.ig1}" alt=""><span>Новинки</span></div><div class="zFocusTile"><img src="${imgs.ig2}" alt=""><span>Осінь</span></div><div class="zFocusTile"><img src="${imgs.ig3}" alt=""><span>Для малюків</span></div><div class="zFocusTile"><img src="${imgs.ig4}" alt=""><span>Святкове</span></div></div></div>
            </article>
            <button class="zNavBtn zPrev" type="button" aria-label="Попередній екран">←</button><button class="zNavBtn zNext" type="button" aria-label="Наступний екран">→</button><div class="zSlideCount"><span id="zCaseCurrent">01</span> / 05</div>
          </div>
        </div>
        <div class="zThumbs" id="zCaseThumbs">
          <button class="zThumb active" type="button"><img src="${imgs.hero}" alt=""><span>Головна</span></button>
          <button class="zThumb" type="button"><img src="${imgs.ig3}" alt=""><span>Каталог</span></button>
          <button class="zThumb" type="button"><img src="${imgs.hero}" alt=""><span>Меню</span></button>
          <button class="zThumb" type="button"><img src="${imgs.ig1}" alt=""><span>Instagram</span></button>
          <button class="zThumb" type="button"><img src="${imgs.sale}" alt=""><span>Бренд</span></button>
        </div>
      </div>

      <div class="zInfo">
        <div class="zIntro reveal">
          <div class="zKicker"><b>03 /</b><span>Реальний проєкт</span></div>
          <h2>ZaiSun</h2>
          <div class="zLead">Інтернет-магазин дитячого одягу — від каталогу до оплати й реклами.</div>
          <p class="zIntroText">Замість довгого технічного опису — спочатку сам продукт. Деталі реалізації відкриваються нижче тільки за потреби.</p>
          <div class="zCtaRow"><a class="zOpen zRemember" href="https://zaisun.com.ua">Відкрити сайт ↗</a><span class="zDomain">zaisun.com.ua</span></div>
          <div class="zFacts"><span class="zFact"><b>776</b> товарних сторінок</span><span class="zFact"><b>GA4</b> ecommerce</span><span class="zFact"><b>API</b> оплата + доставка</span></div>
        </div>

        <div class="zDetails reveal">
          <details class="zDetail"><summary><span class="zDIcon">✦</span><div><h3>Що зробили</h3><p>Сайт, каталог, адмінка, оплата та доставка.</p></div><span class="zPlus">+</span></summary><div class="zDbody"><span><b>Каталог</b> — фільтри, пошук, картки й кошик</span><span><b>Адмінка</b> — товари, фото, ціни, замовлення</span><span><b>Нова Пошта API</b> — міста та відділення</span><span><b>monobank API</b> — рахунок і статус оплати</span></div></details>
          <details class="zDetail"><summary><span class="zDIcon">↗</span><div><h3>Реклама та аналітика</h3><p>Від кліку до фактичної оплати.</p></div><span class="zPlus">+</span></summary><div class="zDbody"><span><b>Merchant Center</b> — автоматичний товарний фід</span><span><b>Google Ads</b> — Performance Max і конверсії</span><span><b>GA4</b> — повна ecommerce-воронка</span><span><b>Meta</b> — Pixel + Conversions API</span></div></details>
          <details class="zDetail"><summary><span class="zDIcon">◎</span><div><h3>Результат</h3><p>Одна система для продажів і подальшого росту.</p></div><span class="zPlus">+</span></summary><div class="zDbody"><span><b>Покупка</b> — коротший і зрозуміліший сценарій</span><span><b>Дані</b> — видно реальні оплати, а не тільки заявки</span><span><b>Реклама</b> — сайт готовий до Shopping і ремаркетингу</span><span><b>Керування</b> — каталог оновлюється без розробника</span></div></details>
        </div>
      </div>
    </div>`;
  old.replaceWith(section);

  const stage=section.querySelector('#zCaseStage');
  const slides=[...section.querySelectorAll('.zSlide')];
  const thumbs=[...section.querySelectorAll('.zThumb')];
  const current=section.querySelector('#zCaseCurrent');
  const prev=section.querySelector('.zPrev');
  const next=section.querySelector('.zNext');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index=0,timer=0,touchX=0,visible=false;

  function show(n,user=false){
    index=(n+slides.length)%slides.length;
    slides.forEach((s,i)=>s.classList.toggle('active',i===index));
    thumbs.forEach((t,i)=>t.classList.toggle('active',i===index));
    if(current)current.textContent=String(index+1).padStart(2,'0');
    if(user)restart();
  }
  function play(){if(reduced||!visible)return;clearInterval(timer);timer=setInterval(()=>show(index+1),5200)}
  function restart(){clearInterval(timer);play()}
  thumbs.forEach((b,i)=>b.addEventListener('click',()=>show(i,true)));
  prev?.addEventListener('click',()=>show(index-1,true));
  next?.addEventListener('click',()=>show(index+1,true));
  stage?.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX},{passive:true});
  stage?.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)show(index+(dx<0?1:-1),true)},{passive:true});
  stage?.addEventListener('mouseenter',()=>clearInterval(timer));
  stage?.addEventListener('mouseleave',play);
  new IntersectionObserver(es=>es.forEach(e=>{visible=e.isIntersecting;if(visible)play();else clearInterval(timer)}),{threshold:.18}).observe(section.querySelector('.zGallery'));

  section.querySelectorAll('.zDetail').forEach(d=>d.addEventListener('toggle',()=>{if(!d.open)return;section.querySelectorAll('.zDetail').forEach(x=>{if(x!==d)x.open=false})}));

  // Same-tab portfolio navigation + exact return position on mobile/desktop.
  const remember=()=>{try{sessionStorage.setItem('shift_return_scroll_v28',String(window.scrollY));sessionStorage.setItem('shift_return_pending_v28','1')}catch(e){}};
  section.querySelectorAll('.zRemember').forEach(a=>a.addEventListener('click',remember));
  document.querySelectorAll('#concepts a.case-demo-link').forEach(a=>{a.removeAttribute('target');a.removeAttribute('rel');a.addEventListener('click',remember)});

  function restorePosition(){
    try{
      if(sessionStorage.getItem('shift_return_pending_v28')!=='1')return;
      const y=parseInt(sessionStorage.getItem('shift_return_scroll_v28')||'0',10);
      sessionStorage.removeItem('shift_return_pending_v28');
      requestAnimationFrame(()=>requestAnimationFrame(()=>{window.scrollTo({top:y,left:0,behavior:'auto'});setTimeout(()=>window.scrollTo(0,y),120)}));
    }catch(e){}
  }
  window.addEventListener('pageshow',restorePosition);
  if(document.readyState==='complete')setTimeout(restorePosition,40);
})();
