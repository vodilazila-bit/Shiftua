(()=>{
  const ZAI_HTML=`<div class="wrap"><div class="rc-head reveal on"><div><div class="kicker">03 / Наш проєкт</div></div></div><div class="rc-grid reveal on"><div class="rc-copy"><h3>ZaiSun</h3><p class="rc-sub">E-commerce для бренду дитячого одягу.</p><div class="rc-block zai-done"><div class="rc-label">Що зроблено</div><ul><li>Каталог, фільтри, кошик, checkout та <b>800+ товарних сторінок</b>.</li><li><b>Нова Пошта + monobank</b>, адмінка та автоматичний товарний фід.</li><li><b>Google Ads, GA4, Meta Pixel + CAPI</b> — від кліку до реальної оплати.</li></ul></div><a class="rc-link" href="https://zaisun.com.ua/" target="_blank" rel="noopener">Відвідати сайт <span aria-hidden="true">↗</span></a></div><div class="zai-visual"><a class="zaisun-clean-preview" href="https://zaisun.com.ua/" target="_blank" rel="noopener" aria-label="Відкрити ZaiSun"><img class="zai-user-shot" alt="ZaiSun — осіння колекція"></a></div></div></div>`;

  const style=document.createElement('style');
  style.id='zaisun-force-clean-style';
  style.textContent=`
    #work.zaisun-force-clean{padding:96px 0 34px!important;border-top:1px solid rgba(255,255,255,.14)!important}
    #work.zaisun-force-clean .rc-head{display:grid!important;grid-template-columns:1fr!important;margin:0 0 34px!important}
    #work.zaisun-force-clean .rc-grid{display:grid!important;grid-template-columns:.72fr 1.28fr!important;gap:44px!important;align-items:start!important}
    #work.zaisun-force-clean .rc-copy{display:flex!important;flex-direction:column!important;gap:18px!important}
    #work.zaisun-force-clean .rc-copy h3{margin:0!important;color:#fff!important;font:600 clamp(30px,3.4vw,44px)/1.03 Manrope,sans-serif!important;letter-spacing:-.04em!important}
    #work.zaisun-force-clean .rc-sub{margin:0!important;max-width:34ch!important;color:#d8d8dc!important;font-size:18px!important;line-height:1.55!important}
    #work.zaisun-force-clean .rc-block{margin-top:8px!important;padding:22px 24px!important;border:1px solid rgba(255,255,255,.13)!important;border-radius:20px!important;background:#111113!important}
    #work.zaisun-force-clean .rc-label{margin-bottom:15px!important;color:#d9ff3f!important;font:700 11px/1 "DM Sans",sans-serif!important;letter-spacing:.17em!important;text-transform:uppercase!important}
    #work.zaisun-force-clean .rc-block ul{margin:0!important;padding:0!important;list-style:none!important;display:grid!important;gap:11px!important}
    #work.zaisun-force-clean .rc-block li{position:relative!important;padding-left:25px!important;color:#e0e0e3!important;font-size:14.5px!important;line-height:1.55!important}
    #work.zaisun-force-clean .rc-block li:before{content:""!important;position:absolute!important;left:0!important;top:.72em!important;width:10px!important;height:2px!important;background:#d9ff3f!important}
    #work.zaisun-force-clean .rc-block li b{color:#fff!important;font-weight:700!important}
    #work.zaisun-force-clean .rc-link{display:inline-flex!important;align-items:center!important;justify-content:space-between!important;gap:20px!important;width:max-content!important;min-width:210px!important;margin-top:6px!important;padding:14px 18px!important;border:1px solid rgba(255,255,255,.18)!important;border-radius:999px!important;background:#fff!important;color:#111!important;font-weight:800!important;text-decoration:none!important}
    #work.zaisun-force-clean .rc-link:hover{background:#d9ff3f!important;border-color:#d9ff3f!important;color:#111!important}
    #work.zaisun-force-clean .rc-link span{display:grid!important;place-items:center!important;width:34px!important;height:34px!important;border:1px solid #111!important;border-radius:11px!important;font-size:15px!important}
    #work.zaisun-force-clean .zaisun-clean-preview{display:block!important;padding:10px!important;border:1px solid rgba(255,255,255,.14)!important;border-radius:24px!important;overflow:hidden!important;background:#111!important;text-decoration:none!important}
    #work.zaisun-force-clean .zaisun-clean-preview img{display:block!important;width:100%!important;height:auto!important;aspect-ratio:480/218!important;object-fit:contain!important;border-radius:16px!important;background:#111!important}
    @media(min-width:761px){body>header .navcta{margin-left:18px!important}}
    @media(max-width:760px){
      #work.zaisun-force-clean{padding:68px 0 18px!important}
      #work.zaisun-force-clean .rc-head{margin-bottom:28px!important}
      #work.zaisun-force-clean .rc-grid{display:flex!important;flex-direction:column!important;gap:24px!important}
      #work.zaisun-force-clean .zai-visual{order:1!important}
      #work.zaisun-force-clean .rc-copy{order:2!important;gap:18px!important}
      #work.zaisun-force-clean .rc-sub{font-size:16px!important;max-width:none!important}
      #work.zaisun-force-clean .rc-block{padding:19px 18px!important;border-radius:18px!important}
      #work.zaisun-force-clean .rc-block li{font-size:14px!important;padding-left:23px!important}
      #work.zaisun-force-clean .rc-link{width:max-content!important;min-width:0!important;justify-content:space-between!important;padding:13px 16px!important}
      #work.zaisun-force-clean .zaisun-clean-preview{padding:6px!important;border-radius:18px!important}
      #work.zaisun-force-clean .zaisun-clean-preview img{border-radius:13px!important}
      #shift-case .rc-grid{display:flex!important;flex-direction:column!important;gap:24px!important}
      #shift-case .rc-grid>div:last-child{order:1!important}
      #shift-case .rc-copy{order:2!important}
    }
  `;
  document.head.appendChild(style);

  const approachStyle=document.createElement('style');
  approachStyle.id='approach-disclosure-style';
  approachStyle.textContent=`
    #approach.approach-disclosure{display:block!important;margin:34px 0 0!important;padding:0!important;background:transparent!important;border:0!important}
    #approach.approach-disclosure .approach-toggle{position:relative!important;isolation:isolate!important;width:100%!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:20px!important;padding:20px 22px 20px 24px!important;border:1px solid rgba(255,255,255,.13)!important;border-radius:22px!important;background:linear-gradient(135deg,rgba(255,255,255,.055),rgba(255,255,255,.018) 48%,rgba(217,255,63,.045))!important;color:#fff!important;text-align:left!important;cursor:pointer!important;overflow:hidden!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 16px 44px rgba(0,0,0,.20)!important;transition:border-color .28s ease,transform .28s ease,background .28s ease,box-shadow .28s ease!important}
    #approach.approach-disclosure .approach-toggle:before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background:linear-gradient(110deg,transparent 0 62%,rgba(217,255,63,.07) 78%,transparent 100%);transform:translateX(-24%);transition:transform .55s cubic-bezier(.16,1,.3,1)}
    #approach.approach-disclosure .approach-toggle:hover{border-color:rgba(217,255,63,.38)!important;transform:translateY(-2px)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 20px 54px rgba(0,0,0,.28),0 0 24px rgba(217,255,63,.04)!important}
    #approach.approach-disclosure .approach-toggle:hover:before{transform:translateX(18%)}
    #approach .approach-toggle-copy{display:flex;min-width:0;flex-direction:column;gap:7px}
    #approach .approach-toggle-kicker{font:700 10px/1 "DM Sans",sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#d9ff3f}
    #approach .approach-toggle-title{font:600 clamp(20px,2.1vw,30px)/1.05 Manrope,sans-serif;letter-spacing:-.035em;color:#f7f7f7}
    #approach .approach-toggle-icon{position:relative;display:block;flex:0 0 52px;width:52px;height:52px;border:1px solid rgba(255,255,255,.16);border-radius:16px;background:#0c0c0e;box-shadow:inset 0 1px 0 rgba(255,255,255,.05);transition:transform .4s cubic-bezier(.16,1,.3,1),background .28s ease,border-color .28s ease}
    #approach .approach-toggle-icon:before,#approach .approach-toggle-icon:after{content:"";position:absolute;left:50%;top:50%;width:18px;height:1.5px;border-radius:99px;background:#d9ff3f;transform:translate(-50%,-50%);transition:transform .38s cubic-bezier(.16,1,.3,1)}
    #approach .approach-toggle-icon:after{transform:translate(-50%,-50%) rotate(90deg)}
    #approach.is-open .approach-toggle{border-color:rgba(217,255,63,.30)!important;background:linear-gradient(135deg,rgba(217,255,63,.08),rgba(255,255,255,.025) 50%,rgba(255,255,255,.045))!important}
    #approach.is-open .approach-toggle-icon{transform:rotate(90deg);background:#d9ff3f;border-color:#d9ff3f}
    #approach.is-open .approach-toggle-icon:before,#approach.is-open .approach-toggle-icon:after{background:#0a0a0b}
    #approach.is-open .approach-toggle-icon:after{transform:translate(-50%,-50%) rotate(0deg)}
    #approach .approach-panel{display:grid!important;grid-template-rows:0fr!important;opacity:0!important;transform:translateY(-8px)!important;transition:grid-template-rows .55s cubic-bezier(.16,1,.3,1),opacity .34s ease,transform .55s cubic-bezier(.16,1,.3,1)!important}
    #approach .approach-panel-inner{min-height:0!important;overflow:hidden!important}
    #approach.is-open .approach-panel{grid-template-rows:1fr!important;opacity:1!important;transform:translateY(0)!important}
    #approach .approach-window{position:relative;margin-top:14px!important;padding:18px!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:26px!important;background:linear-gradient(180deg,#0f0f11 0%,#0b0b0d 100%)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 24px 70px rgba(0,0,0,.27)!important;overflow:hidden!important}
    #approach .approach-window:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(700px 220px at 86% 0%,rgba(217,255,63,.07),transparent 58%)}
    #approach .approach-window>#approach-title{display:none!important}
    #approach .approach-grid{position:relative!important;z-index:1!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:0!important;margin:0!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:18px!important;overflow:hidden!important;background:rgba(255,255,255,.07)!important}
    #approach .approach-item{margin:0!important;padding:25px 24px!important;background:#0d0d0f!important;border:0!important;border-bottom:1px solid rgba(255,255,255,.08)!important}
    #approach .approach-item:nth-child(odd){border-right:1px solid rgba(255,255,255,.08)!important}
    #approach .approach-item:nth-last-child(-n+2){border-bottom:0!important}
    #approach .approach-label{margin-bottom:14px!important;color:#d9ff3f!important;font:700 10px/1 "DM Sans",sans-serif!important;letter-spacing:.17em!important;text-transform:uppercase!important}
    #approach .approach-item h3{margin:0 0 11px!important;color:#fff!important;font:600 18px/1.18 Manrope,sans-serif!important;letter-spacing:-.025em!important}
    #approach .approach-item p{margin:0!important;color:#aaaab0!important;font-size:14px!important;line-height:1.65!important}
    #approach .approach-item p strong{color:#ededf0!important;font-weight:600!important}
    @media(max-width:760px){
      #approach.approach-disclosure{margin-top:24px!important}
      #approach.approach-disclosure .approach-toggle{padding:16px 15px 16px 17px!important;border-radius:18px!important;gap:14px!important}
      #approach .approach-toggle-copy{gap:6px}
      #approach .approach-toggle-kicker{font-size:8px!important;letter-spacing:.16em!important}
      #approach .approach-toggle-title{font-size:17px!important;line-height:1.12!important}
      #approach .approach-toggle-icon{flex-basis:44px;width:44px;height:44px;border-radius:13px}
      #approach .approach-toggle-icon:before,#approach .approach-toggle-icon:after{width:15px}
      #approach .approach-window{margin-top:10px!important;padding:8px!important;border-radius:20px!important}
      #approach .approach-grid{grid-template-columns:1fr!important;border-radius:14px!important}
      #approach .approach-item{padding:20px 18px!important;border-right:0!important;border-bottom:1px solid rgba(255,255,255,.08)!important}
      #approach .approach-item:last-child{border-bottom:0!important}
      #approach .approach-item h3{font-size:16px!important}
      #approach .approach-item p{font-size:13.5px!important;line-height:1.58!important}
    }
  `;
  document.head.appendChild(approachStyle);

  let applying=false;
  let heroReady=null;
  function loadZaiHero(){
    const img=document.querySelector('#work .zai-user-shot');
    if(!img)return;
    if(window.__ZAI_HERO){img.src=window.__ZAI_HERO;return}
    if(!heroReady){
      heroReady=new Promise(resolve=>{
        const h=document.createElement('script');
        h.src='assets/zaisun-hero-inline-v2.js?v=20260912-2032';
        h.async=true;
        h.onload=()=>resolve(window.__ZAI_HERO||null);
        h.onerror=()=>resolve(null);
        document.head.appendChild(h);
      });
    }
    heroReady.then(src=>{const current=document.querySelector('#work .zai-user-shot');if(src&&current)current.src=src});
  }

  function isClean(z){
    return z && z.classList.contains('zaisun-force-clean') && z.querySelector('.zai-done') && !z.querySelector('.rc-badge,.rc-frame');
  }
  function applyZai(){
    if(applying)return;
    const z=document.querySelector('#work.realcase, #work');
    if(!z)return;
    if(isClean(z)){loadZaiHero();return}
    applying=true;
    z.className='realcase zaisun-force-clean';
    z.innerHTML=ZAI_HTML;
    applying=false;
    loadZaiHero();
  }

  function watchZai(){
    applyZai();
    const z=document.getElementById('work');
    if(!z)return;
    new MutationObserver(()=>{if(!isClean(z))applyZai();else loadZaiHero()}).observe(z,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }

  function setupApproachDisclosure(){
    const approach=document.getElementById('approach');
    if(!approach||approach.classList.contains('approach-disclosure'))return;
    const original=[...approach.children];
    if(!original.length)return;
    approach.classList.add('approach-disclosure');

    const button=document.createElement('button');
    button.type='button';
    button.className='approach-toggle';
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-controls','approach-panel');
    button.innerHTML='<span class="approach-toggle-copy"><span class="approach-toggle-kicker">WEBWORK / ПІДХІД</span><span class="approach-toggle-title">Як я підходжу до сайту</span></span><span class="approach-toggle-icon" aria-hidden="true"></span>';

    const panel=document.createElement('div');
    panel.className='approach-panel';
    panel.id='approach-panel';
    panel.setAttribute('aria-hidden','true');
    const inner=document.createElement('div');
    inner.className='approach-panel-inner';
    const win=document.createElement('div');
    win.className='approach-window';
    original.forEach(el=>win.appendChild(el));
    inner.appendChild(win);
    panel.appendChild(inner);
    approach.appendChild(button);
    approach.appendChild(panel);

    button.addEventListener('click',()=>{
      const open=!approach.classList.contains('is-open');
      approach.classList.toggle('is-open',open);
      button.setAttribute('aria-expanded',open?'true':'false');
      panel.setAttribute('aria-hidden',open?'false':'true');
    });
  }

  function enforceCostCtas(){
    let fix=document.getElementById('mobile-cost-cta-fix');
    if(!fix){
      fix=document.createElement('style');
      fix.id='mobile-cost-cta-fix';
      fix.textContent=`@media(max-width:760px){html body>header .nav{overflow:hidden!important;gap:6px!important}html body>header .nav .links{margin-left:auto!important;margin-right:0!important}html body>header .nav .links a:last-child{margin-right:12px!important}html body>header .nav .navcta{position:relative!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;flex:0 0 auto!important;width:auto!important;min-width:0!important;max-width:none!important;height:38px!important;min-height:38px!important;margin:0!important;padding:0 13px!important;border:1px solid rgba(217,255,63,.62)!important;border-radius:13px!important;background:linear-gradient(135deg,rgba(217,255,63,.16),rgba(255,255,255,.035) 55%,rgba(217,255,63,.07))!important;color:#f7f7f2!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 8px 20px rgba(0,0,0,.26),0 0 18px rgba(217,255,63,.06)!important;backdrop-filter:blur(12px)!important;-webkit-backdrop-filter:blur(12px)!important;font-size:10.5px!important;font-weight:800!important;line-height:1!important;letter-spacing:-.015em!important;white-space:nowrap!important}html body>header .nav .navcta:before{content:""!important;display:block!important;width:6px!important;height:6px!important;flex:0 0 6px!important;border:1px solid #d9ff3f!important;border-radius:2px!important;background:rgba(217,255,63,.14)!important;box-shadow:0 0 8px rgba(217,255,63,.35)!important}}`;
      document.head.appendChild(fix);
    }
    const nav=document.querySelector('body>header .navcta');
    if(nav){const wanted=window.innerWidth<=760?'Порахувати':'Порахувати вартість';if(nav.textContent!==wanted)nav.textContent=wanted}
    document.querySelectorAll('#prices .pricecta').forEach(a=>{if(a.textContent.trim()!=='Порахувати вартість')a.textContent='Порахувати вартість'});
    const submit=document.querySelector('#contact form button[type="submit"]');
    if(submit&&submit.textContent.trim()!=='Порахувати вартість')submit.textContent='Порахувати вартість';
  }

  function watchCostCtas(){
    enforceCostCtas();
    new MutationObserver(enforceCostCtas).observe(document.body,{childList:true,subtree:true,characterData:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{watchZai();watchCostCtas();setupApproachDisclosure()},{once:true});
  else{watchZai();watchCostCtas();setupApproachDisclosure()}
  setTimeout(applyZai,250);setTimeout(applyZai,900);setTimeout(applyZai,2200);
  setTimeout(enforceCostCtas,250);setTimeout(enforceCostCtas,900);
  setTimeout(setupApproachDisclosure,300);setTimeout(setupApproachDisclosure,1200);

  const s=document.createElement('script');
  s.src='app-main-20260912.js?v=20260913-approach';
  s.defer=true;
  s.onload=()=>{applyZai();loadZaiHero();enforceCostCtas();setupApproachDisclosure();setTimeout(applyZai,400);setTimeout(applyZai,1500);setTimeout(enforceCostCtas,50);setTimeout(enforceCostCtas,600);setTimeout(enforceCostCtas,1800);setTimeout(setupApproachDisclosure,500)};
  document.head.appendChild(s);
  window.addEventListener('resize',enforceCostCtas,{passive:true});
})();