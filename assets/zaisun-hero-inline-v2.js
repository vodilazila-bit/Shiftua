window.__ZAI_HERO='https://image.thum.io/get/width/1704/crop/848/noanimate/https://zaisun.com.ua/';
(()=>{
  const title=document.querySelector('#services .section-title');
  if(title) title.innerHTML='Створення.<br><em>Запуск.</em><br>Підтримка після запуску: лендінгу — 1 місяць, магазину — від 6 місяців.';

  const ensureCheckboxBullet=()=>{
    const list=document.querySelector('#work .zai-done ul');
    if(!list||list.querySelector('[data-zai-checkbox]'))return;
    const li=document.createElement('li');
    li.setAttribute('data-zai-checkbox','1');
    li.innerHTML='<b>Checkbox</b> — автоматична фіскалізація оплати та надсилання чека покупцю.';
    list.appendChild(li);
  };

  ensureCheckboxBullet();
  const work=document.getElementById('work');
  if(work)new MutationObserver(ensureCheckboxBullet).observe(work,{childList:true,subtree:true});
})();