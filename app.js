
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('load',()=>{window.scrollTo(0,0);setTimeout(()=>window.scrollTo(0,0),0)});
window.addEventListener('beforeunload',()=>window.scrollTo(0,0));

(()=>{
  const root=document.documentElement;
  const intro=document.getElementById('intro');
  const count=document.getElementById('count');
  const firstVisit=root.classList.contains('show-intro');
  if(firstVisit && intro){
    let n=0;
    const timer=setInterval(()=>{
      n+=Math.ceil((100-n)*.17); if(n>=99)n=100;
      if(count)count.textContent=String(n).padStart(2,'0');
      if(n===100){clearInterval(timer);setTimeout(()=>{intro.classList.add('open');root.classList.remove('show-intro');try{localStorage.setItem('shift_intro_seen_v1','1')}catch(e){}setTimeout(()=>intro.remove(),1150)},220)}
    },55);
  } else if(intro){ intro.remove(); }

  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(x=>io.observe(x));

  let last=0;const header=document.querySelector('header');
  addEventListener('scroll',()=>{const y=scrollY;if(header)header.style.transform=(y>last&&y>180)?'translateY(-120%)':'translateY(0)';last=y},{passive:true});

  document.querySelectorAll('.case').forEach(card=>{
    card.addEventListener('mousemove',e=>{if(innerWidth<900)return;const img=card.querySelector('img');if(!img)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;img.style.transform=`scale(1.045) translate(${x*-10}px,${y*-8}px)`});
    card.addEventListener('mouseleave',()=>{const img=card.querySelector('img');if(img)img.style.transform=''});
  });

  const cases={
    shop:{title:'Інтернет-магазин',lead:'Демонстрація e-commerce підходу: від першого екрану до каталогу й оформлення замовлення.',task:'Зробити магазин, де товар легко знайти, зрозуміти й купити без зайвих кроків.',done:'Структура каталогу, картка товару, кошик, CTA, мобільна логіка та підготовка до реклами.',focus:'Швидкий шлях від реклами до товару й замовлення.',tech:'HTML / CSS / JS · CMS або e-commerce платформа · GA4 · Merchant Center',url:'shop.shift.preview',theme:'shop',benefits:['Продумана структура каталогу','Адаптивна мобільна версія','Кошик і сценарій покупки','Базова аналітика','Підготовка до Google Shopping','Зрозуміле керування контентом']},
    company:{title:'Сайт для компанії',lead:'Сайт, який швидко пояснює, хто ви, що робите й чому клієнту варто звернутися саме до вас.',task:'Упакувати послуги компанії у зрозумілу структуру та вести від першого екрану до заявки.',done:'Головна, послуги, кейси, процес роботи, блоки довіри, форми та адаптив.',focus:'Довіра, зрозуміла подача послуг і заявка.',tech:'HTML / CSS / JS · CMS · GA4 · форми та інтеграції',url:'company.shift.preview',theme:'company',benefits:['Індивідуальна структура','Сторінки послуг','Кейси та блоки довіри','Форми звернення','Адаптив під мобільні','Підготовка до реклами']},
    commerce:{title:'Магазин, де легко замовити',lead:'Більш виразний e-commerce концепт із фокусом на візуал бренду, мобільну покупку та повторні продажі.',task:'Поєднати сильну бренд-подачу з простим сценарієм покупки.',done:'Візуальна система, категорії, товарні блоки, checkout-сценарій, аналітика та рекламна логіка.',focus:'Бренд + конверсія без перевантаження інтерфейсу.',tech:'UI / UX · HTML / CSS / JS · e-commerce · GA4 · Ads integrations',url:'commerce.shift.preview',theme:'commerce',benefits:['Сильний перший екран','Каталог і картка товару','Зручний мобільний checkout','Платіжні інтеграції','Аналітика продажів','Основа для ремаркетингу']}
  };

  const modal=document.getElementById('caseModal'),viewport=document.getElementById('mockViewport');
  const screens=(theme)=>{
    const cls=theme==='company'?'mock-company':theme==='commerce'?'mock-commerce':'';
    return [
      `<section class="mock-page active ${cls}"><div class="mock-inner"><div class="mock-nav"><span>SHIFT / ${theme.toUpperCase()}</span><small>Меню&nbsp;&nbsp; Контакти</small></div><div class="mock-hero-grid"><div><div class="mock-kicker">Нова digital-подача</div><h3 class="mock-title">Сайт, який веде до дії.</h3><p class="mock-copy">Чітка структура, сильний перший екран і зрозумілий наступний крок для клієнта.</p><span class="mock-btn">Обрати / Замовити ↗</span></div><div class="mock-art"></div></div><div class="mock-products"><div class="mock-product"><div class="ph"></div><b>Пропозиція 01</b><small>Короткий опис</small></div><div class="mock-product"><div class="ph"></div><b>Пропозиція 02</b><small>Короткий опис</small></div><div class="mock-product"><div class="ph"></div><b>Пропозиція 03</b><small>Короткий опис</small></div></div></div></section>`,
      `<section class="mock-page ${cls}"><div class="mock-inner"><div class="mock-nav"><span>SHIFT / DETAIL</span><small>Назад&nbsp;&nbsp; CTA</small></div><div class="mock-kicker">Внутрішня сторінка</div><h3 class="mock-title">Менше шуму.<br>Більше ясності.</h3><p class="mock-copy">Детальна сторінка розкладає пропозицію на переваги, процес, докази й конкретну дію.</p><div class="mock-products"><div class="mock-product"><div class="ph"></div><b>Перевага</b><small>Аргумент для клієнта</small></div><div class="mock-product"><div class="ph"></div><b>Кейс</b><small>Доказ і результат</small></div><div class="mock-product"><div class="ph"></div><b>CTA</b><small>Наступний крок</small></div></div></div></section>`,
      `<section class="mock-page ${cls}"><div class="mock-inner" style="max-width:430px;margin:auto"><div class="mock-nav"><span>SHIFT / MOBILE</span><small>☰</small></div><div class="mock-art" style="min-height:190px;margin-bottom:20px"></div><div class="mock-kicker">Mobile first</div><h3 class="mock-title">Зручно з телефону.</h3><p class="mock-copy">Великі кнопки, короткі блоки, швидкий контакт і мінімум зайвих кроків.</p><span class="mock-btn">Залишити заявку ↗</span><div class="mock-products" style="grid-template-columns:1fr 1fr"><div class="mock-product"><div class="ph" style="height:100px"></div><b>Блок 01</b></div><div class="mock-product"><div class="ph" style="height:100px"></div><b>Блок 02</b></div></div></div></section>`
    ].join('');
  };

  function setScreen(i){document.querySelectorAll('.mock-page').forEach((p,n)=>p.classList.toggle('active',n===i));document.querySelectorAll('.mock-tab').forEach((b,n)=>b.classList.toggle('active',n===i));}
  function openCase(key){const d=cases[key];if(!d||!modal)return;document.getElementById('caseTitle').textContent=d.title;document.getElementById('caseLead').textContent=d.lead;document.getElementById('caseTask').textContent=d.task;document.getElementById('caseDone').textContent=d.done;document.getElementById('caseFocus').textContent=d.focus;document.getElementById('caseTech').textContent=d.tech;document.getElementById('mockUrl').textContent=d.url;document.getElementById('caseBenefits').innerHTML=d.benefits.map(x=>`<li>${x}</li>`).join('');viewport.innerHTML=screens(d.theme);setScreen(0);modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
  function closeCase(){if(!modal)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  document.querySelectorAll('[data-case]').forEach(el=>{el.addEventListener('click',()=>openCase(el.dataset.case));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCase(el.dataset.case)}})});
  document.querySelector('.case-close')?.addEventListener('click',closeCase);modal?.addEventListener('click',e=>{if(e.target===modal)closeCase()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCase()});document.querySelectorAll('.mock-tab').forEach((b,i)=>b.addEventListener('click',()=>setScreen(i)));

  const form=document.getElementById('form');
  form?.addEventListener('submit',e=>{e.preventDefault();const status=document.getElementById('formStatus');if(status)status.textContent='Форму підключимо після налаштування окремої пошти SHIFT.';});
})();

// Work section v27: mobile-first + clean concept previews + full-site mesh.
(()=>{const s=document.createElement('script');s.src='work-v23.js?v=27';s.defer=true;document.head.appendChild(s)})();