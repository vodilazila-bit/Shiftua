(()=>{
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxqmI7d5yqpwn2xtVlUhWwSViv1lK-KsAfLe-sG2lomRvcsjBLaFGu2dvPcfGbO9P4Q/exec';
  const form = document.getElementById('form');
  if (!form || form.dataset.shiftLeadReady === '1') return;
  form.dataset.shiftLeadReady = '1';

  const status = document.getElementById('formStatus');
  if (status) status.textContent = 'Залиште контакти — відповімо з баченням формату, бюджету й наступного кроку.';

  if (!form.querySelector('.form-brief-guide')) {
    const guide = document.createElement('div');
    guide.className = 'form-brief-guide';
    guide.innerHTML = `
      <div class="form-brief-head">
        <b>Що написати в заявці</b>
        <span>Не треба готувати ТЗ — достатньо 2–4 речень.</span>
      </div>
      <div class="form-brief-grid">
        <div><small>01</small><strong>Бізнес</strong><p>Чим займаєтесь, що продаєте або які послуги надаєте.</p></div>
        <div><small>02</small><strong>Мета</strong><p>Що має дати сайт: заявки, продажі, презентацію чи запуск реклами.</p></div>
        <div><small>03</small><strong>Задача</strong><p>Який сайт потрібен або що саме треба переробити чи запустити.</p></div>
        <div><small>04</small><strong>Рамки</strong><p>Бажаний термін, бюджетний орієнтир і приклади сайтів, якщо вони є.</p></div>
      </div>`;
    form.insertBefore(guide, form.firstChild);
  }

  const phone = form.querySelector('[name="contact"]');
  let phoneField = form.querySelector('.phone-field');
  let phoneError = form.querySelector('.phone-error');

  if (phone) {
    phone.type = 'tel';
    phone.inputMode = 'tel';
    phone.autocomplete = 'tel';
    phone.placeholder = 'Телефон: +380 XX XXX XX XX';

    if (!phoneField) {
      phoneField = document.createElement('div');
      phoneField.className = 'phone-field';
      phone.parentNode.insertBefore(phoneField, phone);
      phoneField.appendChild(phone);
    }
    if (!phoneError) {
      phoneError = document.createElement('div');
      phoneError.className = 'phone-error';
      phoneField.appendChild(phoneError);
    }
  }

  if (!form.querySelector('[name="email"]')) {
    const email = document.createElement('input');
    email.type = 'email';
    email.name = 'email';
    email.autocomplete = 'email';
    email.placeholder = 'Email (резервний контакт)';
    const message = form.querySelector('[name="message"]');
    form.insertBefore(email, message || form.querySelector('button'));
  }

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
      <option>Інше</option>`;
    const message = form.querySelector('[name="message"]');
    form.insertBefore(select, message || form.querySelector('button'));
  }

  const style = document.createElement('style');
  style.textContent = `
    #form .form-brief-guide{grid-column:1/-1;border:1px solid rgba(10,10,11,.16);border-radius:16px;background:rgba(255,255,255,.20);overflow:hidden;margin:0 0 2px}
    #form .form-brief-head{display:flex;align-items:baseline;justify-content:space-between;gap:18px;padding:13px 15px;border-bottom:1px solid rgba(10,10,11,.12)}
    #form .form-brief-head b{font:700 13px/1.2 "DM Sans",sans-serif;color:#101011}
    #form .form-brief-head span{font:500 11px/1.35 "DM Sans",sans-serif;color:rgba(10,10,11,.58);text-align:right}
    #form .form-brief-grid{display:grid;grid-template-columns:repeat(4,1fr)}
    #form .form-brief-grid>div{padding:12px 13px 13px;border-right:1px solid rgba(10,10,11,.10)}
    #form .form-brief-grid>div:last-child{border-right:0}
    #form .form-brief-grid small{display:block;margin-bottom:5px;font:700 9px/1 "DM Sans",sans-serif;letter-spacing:.12em;color:rgba(10,10,11,.48)}
    #form .form-brief-grid strong{display:block;margin-bottom:4px;font:700 12px/1.15 "DM Sans",sans-serif;color:#101011}
    #form .form-brief-grid p{margin:0;font:500 10.5px/1.38 "DM Sans",sans-serif;color:rgba(10,10,11,.62)}
    #form .phone-field{width:100%;display:flex;flex-direction:column;gap:4px;align-self:start}
    #form .phone-field input{width:100%;box-sizing:border-box}
    #form select{width:100%;min-height:58px;border:1px solid rgba(10,10,11,.18);border-radius:14px;background:rgba(255,255,255,.72);color:#101011;padding:0 16px;font:500 14px/1.2 "DM Sans",sans-serif;outline:none;appearance:none}
    #form select:focus{border-color:#101011}
    #form input[name="contact"].phone-invalid{border-color:#c62828!important;box-shadow:0 0 0 1px rgba(198,40,40,.15)!important}
    #form .phone-error{min-height:14px;padding:0 4px;color:#b42318;font:600 11px/1.25 "DM Sans",sans-serif;opacity:0;pointer-events:none}
    #form .phone-error.show{opacity:1}
    #form .form-status.ok{color:#176c3d!important}
    #form .form-status.err{color:#9f2f2f!important}
    #form button[disabled]{opacity:.58;cursor:wait}

    /* v39: one clean arrow language across the live site */
    .shiftUiArrow{width:100%;height:100%;display:block;overflow:visible}
    #services .service .arr{font-size:0!important;width:44px!important;height:44px!important;border-radius:14px!important;border:1px solid rgba(10,10,11,.20)!important;background:rgba(255,255,255,.54)!important;color:#101011!important;display:grid!important;place-items:center!important;align-self:center!important;box-shadow:0 1px 0 rgba(255,255,255,.65) inset!important;transition:transform .28s cubic-bezier(.2,.8,.2,1),background .28s,color .28s,border-color .28s!important}
    #services .service .arr svg{width:18px;height:18px;display:block}
    #services .service:hover .arr{background:#101011!important;color:#fff!important;border-color:#101011!important;transform:translate(2px,-2px)}
    .modernCta .modernArrow{border-radius:12px!important;background:transparent!important;border:1px solid currentColor!important;box-shadow:none!important}
    .modernCta .modernArrow svg{width:14px!important;height:14px!important}
    .navcta.modernCta .modernArrow{background:#101012!important;color:#fff!important;border-color:#101012!important}
    .navcta.modernCta:hover .modernArrow{background:#101012!important;color:#d9ff3f!important}
    .ticker-item:after{content:""!important;width:5px;height:5px;border-radius:50%;background:#d9ff3f;display:block;flex:0 0 5px}
    .dicon.shiftArrowIcon,.proofarrow.shiftArrowIcon{font-size:0!important;display:grid!important;place-items:center!important}
    .dicon.shiftArrowIcon svg{width:24px;height:24px}
    .proofarrow.shiftArrowIcon svg{width:110px;height:110px}

    @media(max-width:820px){
      #form .form-brief-head{display:block}
      #form .form-brief-head span{display:block;margin-top:4px;text-align:left}
      #form .form-brief-grid{grid-template-columns:1fr 1fr}
      #form .form-brief-grid>div:nth-child(2){border-right:0}
      #form .form-brief-grid>div:nth-child(-n+2){border-bottom:1px solid rgba(10,10,11,.10)}
    }
    @media(max-width:760px){
      #services .service{grid-template-columns:54px minmax(0,1fr) 44px!important;column-gap:18px!important}
      #services .service .arr{width:42px!important;height:42px!important;border-radius:13px!important;align-self:start!important;margin-top:1px!important;background:#111214!important;color:#fff!important;border-color:#111214!important}
      #services .service .arr svg{width:17px;height:17px}
      .modernCta .modernArrow{width:32px!important;height:32px!important;flex-basis:32px!important;border-radius:10px!important}
      .navcta.modernCta .modernArrow{width:34px!important;height:34px!important;flex-basis:34px!important}
    }
  `;
  document.head.appendChild(style);

  const arrowSvg = '<svg class="shiftUiArrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 16.5L16.5 7.5M10 7.5h6.5V14" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function polishSiteUi(){
    const heroCopy = document.querySelector('.hero-copy');
    const heroStrong = heroCopy?.querySelector('strong');
    if (heroCopy && heroStrong) {
      heroCopy.innerHTML = heroStrong.outerHTML + ' Дизайн, який працює як частина сценарію продажу.';
    }

    const visualText = document.querySelector('.hero .visualcopy>div');
    if (visualText) {
      visualText.innerHTML = '<b>Дизайн, який працює.</b><br><small>Як частина сценарію продажу.</small>';
    }

    document.querySelectorAll('#services .service .arr').forEach(el=>{
      el.innerHTML = arrowSvg;
      el.setAttribute('aria-hidden','true');
    });

    document.querySelectorAll('.dicon,.proofarrow').forEach(el=>{
      const txt=(el.textContent||'').trim();
      if(txt==='↗' || txt==='→' || txt==='➡️' || txt==='➡'){
        el.classList.add('shiftArrowIcon');
        el.innerHTML=arrowSvg;
      }
    });
  }
  polishSiteUi();
  setTimeout(polishSiteUi,180);
  setTimeout(polishSiteUi,700);

  function validatePhone(showMessage = false) {
    if (!phone) return true;
    const raw = phone.value.trim();
    const digits = raw.replace(/\D/g, '');
    let message = '';

    if (!digits) {
      message = 'Вкажіть номер телефону.';
    } else if (digits.startsWith('380')) {
      if (digits.length > 12) message = 'Забагато цифр — для +380 потрібно рівно 12.';
      else if (digits.length < 12) message = 'Для +380 потрібно рівно 12 цифр.';
    } else if (digits.startsWith('0')) {
      if (digits.length > 10) message = 'Забагато цифр — для номера 0XXXXXXXXX потрібно 10.';
      else if (digits.length < 10) message = 'Для номера 0XXXXXXXXX потрібно рівно 10 цифр.';
    } else {
      message = 'Формат: 0XXXXXXXXX або +380XXXXXXXXX.';
    }

    const visible = !!message && (showMessage || raw.length > 0);
    phone.setCustomValidity(message);
    phone.classList.toggle('phone-invalid', visible);
    if (phoneError) {
      phoneError.textContent = visible ? message : '';
      phoneError.classList.toggle('show', visible);
    }
    return !message;
  }

  phone?.addEventListener('input', () => validatePhone(false));
  phone?.addEventListener('blur', () => validatePhone(true));

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
    const phoneOk = validatePhone(true);
    if (!phoneOk || !form.reportValidity()) return;

    const fd = new FormData(form);
    const phoneValue = String(fd.get('contact') || '').trim();
    const emailValue = String(fd.get('email') || '').trim();
    const combinedContact = emailValue ? `${phoneValue} | Email: ${emailValue}` : phoneValue;

    const payload = {
      name: fd.get('name') || '',
      contact: combinedContact,
      email: emailValue,
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
        body: JSON.stringify(payload),
        keepalive: true
      });
      form.reset();
      validatePhone(false);
      if (status) {
        status.className = 'form-status ok';
        status.textContent = 'Готово. Заявку отримано — зв’яжемося найближчим часом.';
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({event:'lead_submit', service:payload.service});

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-18409542106/Ei9nCMuoyeccENqjrcpE'
        });
      }

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: 'WEBWORK form',
          content_category: payload.service || 'Website lead'
        });
      }
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