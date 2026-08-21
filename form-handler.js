(()=>{
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxqmI7d5yqpwn2xtVlUhWwSViv1lK-KsAfLe-sG2lomRvcsjBLaFGu2dvPcfGbO9P4Q/exec';
  const form = document.getElementById('form');
  if (!form || form.dataset.shiftLeadReady === '1') return;
  form.dataset.shiftLeadReady = '1';

  const status = document.getElementById('formStatus');
  if (status) status.textContent = 'Залиште контакти — відповімо з баченням формату, бюджету й наступного кроку.';

  const phone = form.querySelector('[name="contact"]');
  if (phone) {
    phone.type = 'tel';
    phone.inputMode = 'tel';
    phone.autocomplete = 'tel';
    phone.placeholder = 'Телефон: +380 XX XXX XX XX';
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
      <option>Ще не визначився</option>`;
    const message = form.querySelector('[name="message"]');
    form.insertBefore(select, message || form.querySelector('button'));
  }

  let phoneError = form.querySelector('.phone-error');
  if (!phoneError && phone) {
    phoneError = document.createElement('div');
    phoneError.className = 'phone-error';
    phone.insertAdjacentElement('afterend', phoneError);
  }

  const style = document.createElement('style');
  style.textContent = `
    #form select{width:100%;min-height:58px;border:1px solid rgba(10,10,11,.18);border-radius:14px;background:rgba(255,255,255,.72);color:#101011;padding:0 16px;font:500 14px/1.2 "DM Sans",sans-serif;outline:none;appearance:none}
    #form select:focus{border-color:#101011}
    #form input[name="contact"].phone-invalid{border-color:#c62828!important;box-shadow:0 0 0 1px rgba(198,40,40,.15)!important}
    #form .phone-error{grid-column:2/3;height:0;overflow:visible;position:relative;top:-8px;padding:0 4px;color:#b42318;font:600 11px/1.25 "DM Sans",sans-serif;opacity:0;pointer-events:none}
    #form .phone-error.show{opacity:1}
    #form .form-status.ok{color:#176c3d!important}
    #form .form-status.err{color:#9f2f2f!important}
    #form button[disabled]{opacity:.58;cursor:wait}
    @media(max-width:700px){#form .phone-error{grid-column:1/-1;top:-7px}}
  `;
  document.head.appendChild(style);

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

    const valid = !message;
    phone.setCustomValidity(valid ? '' : message);
    phone.classList.toggle('phone-invalid', !valid && (showMessage || raw.length > 0));
    if (phoneError) {
      phoneError.textContent = (!valid && (showMessage || raw.length > 0)) ? message : '';
      phoneError.classList.toggle('show', !!phoneError.textContent);
    }
    return valid;
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
