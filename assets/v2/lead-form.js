/*! WEBWORK lead form: same endpoint, payload and conversions as /form-handler.js, without DOM injection. */
(function () {
  'use strict';

  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbxqmI7d5yqpwn2xtVlUhWwSViv1lK-KsAfLe-sG2lomRvcsjBLaFGu2dvPcfGbO9P4Q/exec';
  var form = document.getElementById('form');
  if (!form) return;

  var status = document.getElementById('formStatus');
  var phone = form.querySelector('[name="contact"]');
  var phoneError = document.getElementById('phoneError');

  function validatePhone(show) {
    if (!phone) return true;
    var raw = phone.value.trim();
    var digits = raw.replace(/\D/g, '');
    var message = '';
    if (!digits) message = 'Вкажіть номер телефону.';
    else if (digits.indexOf('380') === 0) {
      if (digits.length > 12) message = 'Забагато цифр — для +380 потрібно рівно 12.';
      else if (digits.length < 12) message = 'Для +380 потрібно рівно 12 цифр.';
    } else if (digits.indexOf('0') === 0) {
      if (digits.length > 10) message = 'Забагато цифр — для номера 0XXXXXXXXX потрібно 10.';
      else if (digits.length < 10) message = 'Для номера 0XXXXXXXXX потрібно рівно 10 цифр.';
    } else {
      message = 'Формат: 0XXXXXXXXX або +380XXXXXXXXX.';
    }
    var visible = !!message && (show || raw.length > 0);
    phone.setCustomValidity(message);
    phone.classList.toggle('phone-invalid', visible);
    if (phoneError) phoneError.textContent = visible ? message : '';
    return !message;
  }
  if (phone) {
    phone.addEventListener('input', function () { validatePhone(false); });
    phone.addEventListener('blur', function () { validatePhone(true); });
  }

  var params = new URLSearchParams(location.search);
  var attribution = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach(function (k) {
    var v = params.get(k) || '';
    try {
      if (v) sessionStorage.setItem('shift_' + k, v);
      else v = sessionStorage.getItem('shift_' + k) || '';
    } catch (e) {}
    attribution[k] = v;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validatePhone(true) || !form.reportValidity()) return;

    var button = form.querySelector('button[type="submit"]');
    var label = button && button.querySelector('.btn-label');
    var fd = new FormData(form);
    var phoneValue = String(fd.get('contact') || '').trim();
    var emailValue = String(fd.get('email') || '').trim();
    var payload = {
      name: fd.get('name') || '',
      contact: emailValue ? phoneValue + ' | Email: ' + emailValue : phoneValue,
      email: emailValue,
      service: fd.get('service') || '',
      message: fd.get('message') || '',
      page: location.href
    };
    Object.keys(attribution).forEach(function (k) { payload[k] = attribution[k]; });

    var oldText = label ? label.textContent : '';
    if (button) button.disabled = true;
    if (label) label.textContent = 'Відправляю…';
    if (status) { status.className = 'form-status'; status.textContent = 'Відправляю заявку…'; }

    fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      keepalive: true
    }).then(function () {
      form.reset();
      validatePhone(false);
      if (status) { status.className = 'form-status ok'; status.textContent = 'Готово. Заявку отримано — відповім найближчим часом.'; }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'lead_submit', service: payload.service });
      if (typeof window.gtag === 'function') window.gtag('event', 'conversion', { send_to: 'AW-18409542106/Ei9nCMuoyeccENqjrcpE' });
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'WEBWORK form', content_category: payload.service || 'Website lead' });
    }).catch(function () {
      if (status) { status.className = 'form-status err'; status.textContent = 'Не вдалося відправити. Спробуйте ще раз або напишіть у Telegram.'; }
    }).then(function () {
      if (button) button.disabled = false;
      if (label) label.textContent = oldText || 'Порахувати вартість';
    });
  });
})();
