if('scrollRestoration'in history)history.scrollRestoration='manual';
window.addEventListener('load',()=>{window.scrollTo(0,0);setTimeout(()=>window.scrollTo(0,0),0)});
window.addEventListener('beforeunload',()=>window.scrollTo(0,0));
(()=>{
const root=document.documentElement,intro=document.getElementById('intro'),count=document.getElementById('count');
const compactHeaderStyle=document.createElement('style');compactHeaderStyle.textContent=`
body>header{position:fixed!important;z-index:1000!important;top:18px!important;left:0!important;right:0!important;width:100%!important;height:auto!important;padding:0!important;margin:0!important;background:transparent!important;border:0!important;box-shadow:none!important;transform:translateY(0)!important;transition:none!important}
body>header .wrap{width:min(780px,calc(100% - 28px))!important;margin:0 auto!important}
body>header .nav{padding:8px 9px 8px 15px!important}
body>header .links{gap:22px!important;color:#f4f4f4!important}
body>header .links a{color:#f4f4f4!important}
@media(min-width:761px){body>header .links{transform:translateX(55px)!important}}
body .whatcard h3.whatcard-long{font-size:clamp(38px,4.15vw,64px)!important;line-height:.96!important;letter-spacing:-.06em!important;max-width:10.8ch!important}
body .whatcard h3.whatcard-long .whatcard-accent{display:block;margin-top:.12em;color:#d9ff3f;font-size:.82em;line-height:1.02;letter-spacing:-.045em}
body .whatcard p.whatcard-old-copy{display:none!important}

/* clean ZaiSun + SHIFT portfolio cards */
.zaisun-clean,.shiftcase{padding-top:96px!important}
.zaisun-clean .rc-head,.shiftcase .rc-head{grid-template-columns:1fr!important;margin-bottom:34px!important}
.zaisun-clean .rc-grid,.shiftcase .rc-grid{grid-template-columns:.72fr 1.28fr!important;gap:44px!important;align-items:start!important}
.zaisun-clean .rc-copy,.shiftcase .rc-copy{display:flex!important;flex-direction:column!important;gap:18px!important}
.zaisun-clean .rc-sub,.shiftcase .rc-sub{font-size:18px!important;color:#d8d8dc!important;max-width:31ch!important;margin:0!important;line-height:1.55!important}
.zaisun-clean .case-lines{display:grid;gap:0;margin-top:10px;border-top:1px solid rgba(255,255,255,.14)}
.zaisun-clean .case-line{padding:18px 0;border-bottom:1px solid rgba(255,255,255,.14);color:#d8d8dc;font-size:15px;line-height:1.55}
.zaisun-clean .case-line strong{color:#fff;font-weight:700}
.zaisun-clean .rc-link,.shiftcase .rc-link{display:inline-flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;width:max-content!important;min-width:190px!important;margin-top:2px!important;padding:14px 18px!important;border:1px solid rgba(255,255,255,.18)!important;border-radius:999px!important;background:#fff!important;color:#111!important;font-weight:800!important;text-decoration:none!important}
.zaisun-clean .rc-link:hover,.shiftcase .rc-link:hover{background:#d9ff3f!important;color:#111!important;border-color:#d9ff3f!important}
.zaisun-clean-preview,.shiftcase-preview{display:block;position:relative;border:1px solid rgba(255,255,255,.14);border-radius:24px;overflow:hidden;background:#111;color:#fff;text-decoration:none;padding:10px}
.zaisun-clean-preview img,.shiftcase-preview img{display:block;width:100%;height:auto!important;aspect-ratio:auto!important;object-fit:contain!important;background:#111;border-radius:16px}

.shiftcase .rc-block{margin-top:8px!important;padding:22px 24px!important;border:1px solid rgba(255,255,255,.13)!important;border-radius:20px!important;background:#111113!important}
.shiftcase .rc-block:last-of-type{border-bottom:1px solid rgba(255,255,255,.13)!important}
.shiftcase .rc-label{margin-bottom:15px!important;color:#d9ff3f!important}
.shiftcase .rc-block ul{gap:11px!important}
.shiftcase .rc-block li{color:#e0e0e3!important;font-size:14.5px!important}

@media(max-width:760px){
body>header{top:4px!important;padding:0!important}
body>header .wrap{width:calc(100% - 8px)!important}
body>header .nav{display:flex!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:space-between!important;gap:6px!important;padding:6px 6px 6px 8px!important}
body>header .logo{flex:0 0 auto!important;gap:5px!important;font-size:14px!important}
body>header .logo .shiftmark{width:30px!important;height:22px!important}
body>header .links{display:flex!important;flex:0 1 auto!important;width:auto!important;min-width:0!important;justify-content:center!important;align-items:center!important;gap:10px!important;padding:0!important;margin-left:auto!important}
body>header .links a{display:block!important;white-space:nowrap!important;font-size:10.5px!important;line-height:1.2!important;color:#f4f4f4!important}
body>header .links a:nth-child(n+3){display:none!important}
body>header .navcta{flex:0 0 auto!important;white-space:nowrap!important;padding:9px 10px!important;font-size:9.5px!important}
body main .hero{padding-top:132px!important}
body main .hero-inner{min-height:0!important;justify-content:flex-start!important}
body main .hero-title{margin:25px 0 2px!important}
body main .hero-cards{margin-top:0!important;gap:30px!important}
body .whatcard h3.whatcard-long{font-size:9.6vw!important;line-height:.98!important;max-width:11.2ch!important}
body .whatcard h3.whatcard-long .whatcard-accent{font-size:.84em!important}
.zaisun-clean,.shiftcase{padding-top:68px!important}
.zaisun-clean .rc-grid,.shiftcase .rc-grid{grid-template-columns:1fr!important;gap:24px!important}
.zaisun-clean .rc-sub,.shiftcase .rc-sub{font-size:16px!important}
.zaisun-clean .case-line{font-size:14px;padding:15px 0}
.zaisun-clean .rc-link,.shiftcase .rc-link{width:100%!important;justify-content:center!important}
.zaisun-clean-preview,.shiftcase-preview{padding:6px!important;border-radius:18px!important}
.zaisun-clean-preview img,.shiftcase-preview img{border-radius:13px!important}
.shiftcase .rc-block{padding:19px 18px!important}
}`;document.head.appendChild(compactHeaderStyle);
const headerLinks=document.querySelector('.nav .links');if(headerLinks){headerLinks.innerHTML='<a href="#services">Послуги</a><a href="#prices">Ціни</a>';const trim=()=>[...headerLinks.querySelectorAll('a')].slice(2).forEach(a=>a.remove());trim();new MutationObserver(trim).observe(headerLinks,{childList:true})}
const serviceCardTitle=document.querySelector('.whatcard h3');if(serviceCardTitle){serviceCardTitle.classList.add('whatcard-long');serviceCardTitle.innerHTML='Від структури<br>й дизайну<br><span class="whatcard-accent">до запуску та<br>просування.</span>'}
const serviceCardCopy=document.querySelector('.whatcard p');if(serviceCardCopy)serviceCardCopy.classList.add('whatcard-old-copy');
const headerBrandStyle=document.createElement('style');headerBrandStyle.textContent='header .logo .brand-work{color:#d9ff3f!important}';document.head.appendChild(headerBrandStyle);
const navSlideStyle=document.createElement('style');navSlideStyle.textContent=`.nav .links a{opacity:0;transform:translateX(44px);will-change:transform,opacity}.nav-links-ready .nav .links a{animation:webwork-nav-slide .72s cubic-bezier(.16,1,.3,1) forwards}.nav-links-ready .nav .links a:nth-child(1){animation-delay:.00s}.nav-links-ready .nav .links a:nth-child(2){animation-delay:.07s}@keyframes webwork-nav-slide{from{opacity:0;transform:translateX(44px)}to{opacity:1;transform:translateX(0)}}@media(prefers-reduced-motion:reduce){.nav .links a{opacity:1!important;transform:none!important;animation:none!important}}`;document.head.appendChild(navSlideStyle);
let navSlideStarted=false;function startNavSlide(){if(navSlideStarted)return;navSlideStarted=true;requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.add('nav-links-ready')))}
function setMainCtas(){const nav=document.querySelector('.navcta');if(nav)nav.textContent='Порахувати вартість ↗';document.querySelectorAll('#prices .pricecta').forEach(a=>a.textContent='Порахувати вартість ↗');document.querySelectorAll('#prices .price-preview').forEach(el=>el.remove());const submit=document.querySelector('#contact form button[type="submit"]');if(submit)submit.textContent='Порахувати вартість ↗'}setMainCtas();
const soloRules=[['Що робимо','Що роблю'],['Створюємо','Створюю'],['Запускаємо','Запускаю'],['Розвиваємо','Розвиваю'],['Збираємо','Збираю'],['Зробимо digital','Зроблю digital'],['Після запуску ми не просто','Після запуску я не просто'],['Ми дивимось','Я дивлюсь'],['ми дивимось','я дивлюсь'],['Ми відповімо','Я відповім'],['ми відповімо','я відповім'],['відповімо','відповім'],['обговоримо','обговорю'],['фіксуємо','фіксую'],['визначимо','визначу'],['можемо вносити ми','можу вносити'],['підключимо','підключу'],['підключаємо','підключаю'],['працюємо','працюю'],['робимо','роблю'],['налаштовуємо','налаштовую'],['аналізуємо','аналізую'],['тестуємо','тестую'],['оптимізуємо','оптимізую'],['допомагаємо','допомагаю'],['ведемо','веду'],['готуємо','готую'],['незалежна digital-студія','незалежний digital-спеціаліст']];
function soloText(text){let out=text;soloRules.forEach(([from,to])=>out=out.split(from).join(to));return out}
function applySoloCopy(scope=document.body){if(!scope)return;if(scope.nodeType===Node.TEXT_NODE){const next=soloText(scope.nodeValue||'');if(next!==scope.nodeValue)scope.nodeValue=next;return}if(scope.nodeType!==Node.ELEMENT_NODE||['SCRIPT','STYLE','NOSCRIPT'].includes(scope.tagName))return;const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(node=>{const parent=node.parentElement;if(parent&&['SCRIPT','STYLE','NOSCRIPT'].includes(parent.tagName))return;const next=soloText(node.nodeValue||'');if(next!==node.nodeValue)node.nodeValue=next})}
applySoloCopy();new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(node=>applySoloCopy(node)))).observe(document.body,{childList:true,subtree:true});
const legacyIntroText=document.querySelector('.intro-logo .wordclip')?.textContent?.replace(/\s/g,'')||'',legacyBrand=/\bSHIFT\b/i.test(document.title)||legacyIntroText==='SHIFT';
if(legacyBrand){try{localStorage.setItem('shift_intro_seen_v1','1');localStorage.setItem('webwork_intro_seen_v1','1');localStorage.setItem('webwork_intro_seen_v2','1')}catch(e){}root.classList.remove('show-intro');if(intro){intro.style.display='none';intro.remove()}const u=new URL(location.href);if(u.searchParams.get('wwfresh')!=='20260829b'){u.searchParams.set('wwfresh','20260829b');location.replace(u.toString());return}document.title=document.title.replace(/\bSHIFT\b/gi,'WEBWORK');const desc=document.querySelector('meta[name="description"]');if(desc)desc.setAttribute('content',(desc.getAttribute('content')||'').replace(/\bSHIFT\b/gi,'WEBWORK'))}
const firstVisit=!legacyBrand&&root.classList.contains('show-intro');if(firstVisit&&intro){let n=0;const timer=setInterval(()=>{n+=Math.ceil((100-n)*.17);if(n>=99)n=100;if(count)count.textContent=String(n).padStart(2,'0');if(n===100){clearInterval(timer);setTimeout(()=>{intro.classList.add('open');root.classList.remove('show-intro');setTimeout(startNavSlide,260);try{localStorage.setItem('shift_intro_seen_v1','1');localStorage.setItem('webwork_intro_seen_v1','1');localStorage.setItem('webwork_intro_seen_v2','1')}catch(e){}setTimeout(()=>intro.remove(),1150)},220)}},55)}else{if(intro)intro.remove();setTimeout(startNavSlide,90)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(x=>io.observe(x));
const zaisunCase=document.querySelector('#work.realcase');
if(zaisunCase){
  zaisunCase.classList.add('zaisun-clean');
  zaisunCase.innerHTML=`<div class="wrap"><div class="rc-head reveal"><div><div class="kicker">03 / Наш проєкт</div></div></div><div class="rc-grid reveal"><div class="rc-copy"><h3>ZaiSun</h3><p class="rc-sub">E-commerce для бренду дитячого одягу.</p><div class="case-lines"><div class="case-line">Каталог, фільтри, кошик, checkout та <strong>800+ товарних сторінок</strong>.</div><div class="case-line"><strong>Нова Пошта + monobank</strong>, адмінка та автоматичний товарний фід.</div><div class="case-line"><strong>Google Ads, GA4, Meta Pixel + CAPI</strong> — від кліку до реальної оплати.</div></div><a class="rc-link" href="https://zaisun.com.ua/" target="_blank" rel="noopener">Відвідати сайт <span aria-hidden="true">↗</span></a></div><div><a class="zaisun-clean-preview" href="https://zaisun.com.ua/" target="_blank" rel="noopener" aria-label="Відкрити ZaiSun"><img src="https://zaisun.com.ua/hero2.jpg" alt="ZaiSun — дитячий бренд" loading="lazy"></a></div></div></div>`;
  zaisunCase.querySelectorAll('.reveal').forEach(x=>io.observe(x));
}
if(zaisunCase&&!document.getElementById('shift-case')){const shiftCase=document.createElement('section');shiftCase.className='realcase shiftcase';shiftCase.id='shift-case';shiftCase.innerHTML=`<div class="wrap"><div class="rc-head reveal"><div><div class="kicker">03.1 / Наш проєкт</div></div></div><div class="rc-grid reveal"><div class="rc-copy"><h3>SHIFT</h3><p class="rc-sub">Односторінковий сайт транспортної компанії.</p><div class="rc-block"><div class="rc-label">Що зроблено</div><ul><li>Структура сторінки та логіка переходів</li><li>Анімації та мікровзаємодії</li><li>Повна мобільна адаптація</li></ul></div><a class="rc-link" href="https://shiftua.com/" target="_blank" rel="noopener">Відвідати сайт <span aria-hidden="true">↗</span></a></div><div><a class="shiftcase-preview" href="https://shiftua.com/" target="_blank" rel="noopener" aria-label="Відкрити SHIFT"><img src="https://image.thum.io/get/width/1886/noanimate/https://shiftua.com/" alt="SHIFT — односторінковий сайт транспортної компанії" loading="lazy"></a></div></div></div>`;zaisunCase.insertAdjacentElement('afterend',shiftCase);shiftCase.querySelectorAll('.reveal').forEach(x=>io.observe(x))}
const header=document.querySelector('header');if(header)header.style.transform='translateY(0)';
document.querySelectorAll('.case').forEach(card=>{card.addEventListener('mousemove',e=>{if(innerWidth<900)return;const img=card.querySelector('img');if(!img)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;img.style.transform=`scale(1.045) translate(${x*-10}px,${y*-8}px)`});card.addEventListener('mouseleave',()=>{const img=card.querySelector('img');if(img)img.style.transform=''})});
})();
try{sessionStorage.setItem('shift_boot_seen_v3','1')}catch(e){}
(()=>{const s=document.createElement('script');s.src='work-v23.js?v=20260908-compact-layout';s.defer=true;document.head.appendChild(s)})();