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

  function enforceHeaderCta(){
    let fix=document.getElementById('mobile-cost-cta-fix');
    if(!fix){
      fix=document.createElement('style');
      fix.id='mobile-cost-cta-fix';
      fix.textContent=`@media(max-width:760px){body>header .nav{overflow:hidden!important}body>header .navcta{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;width:auto!important;min-width:0!important;max-width:none!important;height:36px!important;min-height:36px!important;margin:0!important;padding:0 12px!important;border:1px solid rgba(255,255,255,.22)!important;border-radius:999px!important;background:#fff!important;color:#111!important;box-shadow:0 4px 16px rgba(0,0,0,.18)!important;font-size:10px!important;font-weight:700!important;line-height:1!important;letter-spacing:-.01em!important;white-space:nowrap!important}}`;
      document.head.appendChild(fix);
    }
    const cta=document.querySelector('body>header .navcta');
    if(!cta)return;
    const wanted=window.innerWidth<=760?'Порахувати':'Порахувати вартість';
    if(cta.textContent!==wanted)cta.textContent=wanted;
  }

  function watchHeaderCta(){
    enforceHeaderCta();
    const cta=document.querySelector('body>header .navcta');
    if(!cta)return;
    new MutationObserver(enforceHeaderCta).observe(cta,{childList:true,subtree:true,characterData:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{watchZai();watchHeaderCta()},{once:true});
  else{watchZai();watchHeaderCta()}
  setTimeout(applyZai,250);setTimeout(applyZai,900);setTimeout(applyZai,2200);
  setTimeout(enforceHeaderCta,250);setTimeout(enforceHeaderCta,900);

  const s=document.createElement('script');
  s.src='app-main-20260912.js?v=20260912-2032';
  s.defer=true;
  s.onload=()=>{applyZai();loadZaiHero();enforceHeaderCta();setTimeout(applyZai,400);setTimeout(applyZai,1500);setTimeout(enforceHeaderCta,50);setTimeout(enforceHeaderCta,600)};
  document.head.appendChild(s);
  window.addEventListener('resize',enforceHeaderCta,{passive:true});
})();
