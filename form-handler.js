(()=>{
  const ENDPOINT = window.SHIFT_FORM_ENDPOINT || '';
  const form = document.getElementById('form');
  if (!form || form.dataset.shiftLeadReady === '1') return;
  form.dataset.shiftLeadReady = '1';

  const status = document.getElementById('formStatus');
  if (status) status.textContent = 'Залиште контакти — відповімо з баченням формату, бюджету й наступного кроку.';

  if (!form.querySelector('[name="service"]')) {
    const select = document.createElement('select');
    select.name = 'service';
    select.required = true;
    select.innerHTML = `
      <option value="" selected disabled>Що потрібно?</option>
      <option>Сайт-візитка</option>
      <option>Лендінг</option>
      <option>Сайт для компанії</option>
      <option>Інтернет-магазин</option>
      <option>Google / Meta реклама</option>
      <option>Сайт + реклама</option>
      <option>Ще не визначився</option>`;
    const message = form.querySelector('[name="message"]');
    form.insertBefore(select, message || form.querySelector('button'));
  }

  const style = document.createElement('style');
  style.textContent = `
    #form select{width:100%;min-height:58px;border:1px solid rgba(10,10,11,.18);border-radius:14px;background:rgba(255,255,255,.72);color:#101011;padding:0 16px;font:500 14px/1.2 "DM Sans",sans-serif;outline:none;appearance:none}
    #form select:focus{border-color:#101011}
    #form .form-status.ok{color:#176c3d!important}
    #form .form-status.err{color:#9f2f2f!important}
    #form button[disabled]{opacity:.58;cursor:wait}
  `;
  document.head.appendChild(style);

  const params = new URLSearchParams(location.search);
  const attribution = {
    utm_source: params.get('utm_source') || sessionStorage.getItem('shift_utm_source') || '',
    utm_medium: params.get('utm_medium') || sessionStorage.getItem('shift_utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || sessionStorage.getItem('shift_utm_campaign') || '',
    utm_content: params.get('utm_content') || sessionStorage.getItem('shift_utm_content') || '',
    utm_term: params.get('utm_term') || sessionStorage.getItem('shift_utm_term') || '',
    gclid: params.get('gclid') || sessionStorage.getItem('shift_gclid') || '',
    fbclid: params.get('fbclid') || sessionStorage.getItem('shift_fbclid') || ''
  };
  Object.entries(attribution).forEach(([k,v])=>{ if(v) sessionStorage.setItem('shift_'+k,v); });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const button = form.querySelector('button[type="submit"]');
    if (!form.reportValidity()) return;

    if (!ENDPOINT || !/^https:\/\/script\.google\.com\/macros\/s\//.test(ENDPOINT)) {
      if (status) {
        status.className = 'form-status err';
        status.textContent = 'Форма майже готова: потрібно один раз підключити URL Google Apps Script.';
      }
      return;
    }

    const fd = new FormData(form);
    const payload = {
      name: fd.get('name') || '',
      contact: fd.get('contact') || '',
      service: fd.get('service') || '',
      message: fd.get('message') || '',
      page: location.href,
      ...attribution
    };

    if (button) { button.disabled = true; button.dataset.oldText = button.textContent; button.textContent = 'Відправляємо…'; }
    if (status) { status.className = 'form-status'; status.textContent = 'Відправляємо заявку…'; }

    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: {'Content-Type':'text/plain;charset=utf-8'},
        body: JSON.stringify(payload)
      });
      form.reset();
      if (status) {
        status.className = 'form-status ok';
        status.textContent = 'Готово. Заявку отримано — зв’яжемося найближчим часом.';
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({event:'lead_submit', service:payload.service});
    } catch (err) {
      if (status) {
        status.className = 'form-status err';
        status.textContent = 'Не вдалося відправити. Спробуйте ще раз або напишіть напряму.';
      }
    } finally {
      if (button) { button.disabled = false; button.textContent = button.dataset.oldText || 'Обговорити проєкт'; }
    }
  }, true);
})();
