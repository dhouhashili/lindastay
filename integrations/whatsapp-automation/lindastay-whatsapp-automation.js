const WHATSAPP_COLOR = '#25D366';
const WHATSAPP_VARIABLES = [
  'guest_name', 'property_name', 'check_in_date', 'check_out_date', 'check_in_time', 'check_out_time',
  'total_price', 'deposit_paid', 'remaining_balance', 'property_address', 'google_maps_link',
  'wifi_name', 'wifi_password', 'house_rules', 'owner_phone'
];

const DEFAULT_WHATSAPP_TEMPLATES = [
  { name: 'Booking confirmation', type: 'booking_confirmation', language: 'fr', is_system: true, body: 'Bonjour {guest_name}, votre réservation à {property_name} est confirmée du {check_in_date} au {check_out_date}. Total: {total_price}. Avance: {deposit_paid}. Reste: {remaining_balance}. Adresse: {property_address}. {google_maps_link}' },
  { name: 'Arrival reminder J-1', type: 'arrival_reminder', language: 'fr', is_system: true, body: 'Bonjour {guest_name}, rappel pour votre arrivée demain à {property_name}. Check-in: {check_in_time}. WiFi: {wifi_name} / {wifi_password}. Adresse: {property_address}. Règles: {house_rules}. Contact: {owner_phone}' },
  { name: 'Payment reminder', type: 'payment_reminder', language: 'fr', is_system: true, body: 'Bonjour {guest_name}, petit rappel: le solde restant pour {property_name} est de {remaining_balance}. Merci de le régler avant votre arrivée du {check_in_date}.' },
  { name: 'Check-out message', type: 'checkout_message', language: 'fr', is_system: true, body: 'Bonjour {guest_name}, votre départ de {property_name} est prévu aujourd’hui à {check_out_time}. Merci de respecter les consignes de départ. Contact: {owner_phone}' },
  { name: 'Thank you message', type: 'thank_you', language: 'fr', is_system: true, body: 'Merci {guest_name} pour votre séjour à {property_name}. Nous espérons vous revoir bientôt chez LindaStay.' },
  { name: 'Review request', type: 'review_request', language: 'fr', is_system: true, body: 'Bonjour {guest_name}, merci pour votre séjour à {property_name}. Si tout s’est bien passé, pourriez-vous laisser un avis? Votre retour nous aide beaucoup.' },

  { name: 'Booking confirmation', type: 'booking_confirmation', language: 'en', is_system: true, body: 'Hello {guest_name}, your booking at {property_name} is confirmed from {check_in_date} to {check_out_date}. Total: {total_price}. Deposit: {deposit_paid}. Balance: {remaining_balance}. Address: {property_address}. {google_maps_link}' },
  { name: 'Arrival reminder J-1', type: 'arrival_reminder', language: 'en', is_system: true, body: 'Hello {guest_name}, reminder for your arrival tomorrow at {property_name}. Check-in: {check_in_time}. WiFi: {wifi_name} / {wifi_password}. Address: {property_address}. Rules: {house_rules}. Contact: {owner_phone}' },
  { name: 'Payment reminder', type: 'payment_reminder', language: 'en', is_system: true, body: 'Hello {guest_name}, friendly reminder: the remaining balance for {property_name} is {remaining_balance}. Please settle it before your {check_in_date} arrival.' },
  { name: 'Check-out message', type: 'checkout_message', language: 'en', is_system: true, body: 'Hello {guest_name}, check-out from {property_name} is scheduled today at {check_out_time}. Please follow the check-out instructions. Contact: {owner_phone}' },
  { name: 'Thank you message', type: 'thank_you', language: 'en', is_system: true, body: 'Thank you {guest_name} for staying at {property_name}. We hope to welcome you again soon with LindaStay.' },
  { name: 'Review request', type: 'review_request', language: 'en', is_system: true, body: 'Hello {guest_name}, thank you for staying at {property_name}. If everything went well, could you leave a review? Your feedback helps us a lot.' },

  { name: 'Buchungsbestätigung', type: 'booking_confirmation', language: 'de', is_system: true, body: 'Hallo {guest_name}, Ihre Buchung in {property_name} ist vom {check_in_date} bis {check_out_date} bestätigt. Gesamt: {total_price}. Anzahlung: {deposit_paid}. Restbetrag: {remaining_balance}. Adresse: {property_address}. {google_maps_link}' },
  { name: 'Anreise-Erinnerung J-1', type: 'arrival_reminder', language: 'de', is_system: true, body: 'Hallo {guest_name}, Erinnerung an Ihre morgige Anreise in {property_name}. Check-in: {check_in_time}. WiFi: {wifi_name} / {wifi_password}. Adresse: {property_address}. Regeln: {house_rules}. Kontakt: {owner_phone}' },
  { name: 'Zahlungserinnerung', type: 'payment_reminder', language: 'de', is_system: true, body: 'Hallo {guest_name}, kurze Erinnerung: Der Restbetrag für {property_name} beträgt {remaining_balance}. Bitte vor der Anreise am {check_in_date} begleichen.' },
  { name: 'Check-out-Nachricht', type: 'checkout_message', language: 'de', is_system: true, body: 'Hallo {guest_name}, der Check-out aus {property_name} ist heute um {check_out_time}. Bitte beachten Sie die Check-out-Hinweise. Kontakt: {owner_phone}' },
  { name: 'Dankesnachricht', type: 'thank_you', language: 'de', is_system: true, body: 'Vielen Dank {guest_name} für Ihren Aufenthalt in {property_name}. Wir hoffen, Sie bald wieder bei LindaStay begrüßen zu dürfen.' },
  { name: 'Bewertungsanfrage', type: 'review_request', language: 'de', is_system: true, body: 'Hallo {guest_name}, vielen Dank für Ihren Aufenthalt in {property_name}. Wenn alles gut war, könnten Sie bitte eine Bewertung hinterlassen?' },

  { name: 'تأكيد الحجز', type: 'booking_confirmation', language: 'ar', is_system: true, body: 'مرحباً {guest_name}، تم تأكيد حجزك في {property_name} من {check_in_date} إلى {check_out_date}. المجموع: {total_price}. العربون: {deposit_paid}. المتبقي: {remaining_balance}. العنوان: {property_address}. {google_maps_link}' },
  { name: 'تذكير الوصول قبل يوم', type: 'arrival_reminder', language: 'ar', is_system: true, body: 'مرحباً {guest_name}، تذكير بوصولك غداً إلى {property_name}. وقت الدخول: {check_in_time}. الواي فاي: {wifi_name} / {wifi_password}. العنوان: {property_address}. القواعد: {house_rules}. الهاتف: {owner_phone}' },
  { name: 'تذكير الدفع', type: 'payment_reminder', language: 'ar', is_system: true, body: 'مرحباً {guest_name}، تذكير لطيف: المبلغ المتبقي لحجز {property_name} هو {remaining_balance}. الرجاء الدفع قبل الوصول بتاريخ {check_in_date}.' },
  { name: 'رسالة المغادرة', type: 'checkout_message', language: 'ar', is_system: true, body: 'مرحباً {guest_name}، موعد المغادرة من {property_name} اليوم على الساعة {check_out_time}. الرجاء اتباع تعليمات المغادرة. الهاتف: {owner_phone}' },
  { name: 'رسالة شكر', type: 'thank_you', language: 'ar', is_system: true, body: 'شكراً {guest_name} على إقامتك في {property_name}. نتمنى استقبالك مرة أخرى قريباً مع LindaStay.' },
  { name: 'طلب تقييم', type: 'review_request', language: 'ar', is_system: true, body: 'مرحباً {guest_name}، شكراً لإقامتك في {property_name}. إذا كانت التجربة جيدة، هل يمكنك ترك تقييم؟ رأيك يساعدنا كثيراً.' }
];

function normaliseWhatsAppPhone(phone) {
  return String(phone || '').replace(/\D/g, '');
}

function formatWhatsAppMoney(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function buildMessageVariables(reservation = {}, property = {}, guest = {}, owner = {}) {
  return {
    guest_name: guest.full_name || reservation.guest_name || '',
    property_name: property.name || reservation.properties?.name || '',
    check_in_date: reservation.check_in || '',
    check_out_date: reservation.check_out || '',
    check_in_time: property.check_in_time || '15:00',
    check_out_time: property.check_out_time || '11:00',
    total_price: formatWhatsAppMoney(reservation.total_price),
    deposit_paid: formatWhatsAppMoney(reservation.deposit_paid),
    remaining_balance: formatWhatsAppMoney(reservation.remaining_balance),
    property_address: property.address || '',
    google_maps_link: property.google_maps_link || '',
    wifi_name: property.wifi_name || '',
    wifi_password: property.wifi_password || '',
    house_rules: property.house_rules || '',
    owner_phone: owner.phone || ''
  };
}

function generateMessageFromTemplate(template, reservation, property, guest, owner) {
  const variables = buildMessageVariables(reservation, property, guest, owner);
  const body = String(template?.body || '').replace(/\{([a-z_]+)\}/g, (match, key) => variables[key] ?? match);
  return { body, variables };
}

function openWhatsApp(phone, message) {
  const cleanPhone = normaliseWhatsAppPhone(phone);
  if (!cleanPhone) throw new Error('Numéro WhatsApp manquant.');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message || '')}`;
  if (window.Capacitor?.Plugins?.Browser?.open) {
    window.Capacitor.Plugins.Browser.open({ url });
    return url;
  }
  window.open(url, '_blank', 'noopener');
  return url;
}

function addDaysAt(date, days, hour = 12) {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + days);
  value.setHours(hour, 0, 0, 0);
  return value.toISOString();
}

function templatesForLanguage(language = 'fr') {
  return DEFAULT_WHATSAPP_TEMPLATES.filter(template => template.language === language);
}

function templateByType(type, language = 'fr') {
  return templatesForLanguage(language).find(template => template.type === type) || DEFAULT_WHATSAPP_TEMPLATES.find(template => template.type === type);
}

async function scheduleDefaultMessages(reservation, property = {}, owner = {}) {
  if (!reservation?.id || !window.sb) return { data: [], error: null };
  const language = owner.preferred_language || 'fr';
  const schedule = [
    { type: 'booking_confirmation', scheduled_at: new Date().toISOString() },
    { type: 'arrival_reminder', scheduled_at: addDaysAt(reservation.check_in, -1, 18) },
    { type: 'payment_reminder', scheduled_at: addDaysAt(reservation.check_in, -3, 18), condition: Number(reservation.remaining_balance || 0) > 0 },
    { type: 'thank_you', scheduled_at: addDaysAt(reservation.check_out, 0, 12) },
    { type: 'review_request', scheduled_at: addDaysAt(reservation.check_out, 1, 12) }
  ].filter(item => item.condition !== false);
  const rows = schedule.map(item => {
    const template = templateByType(item.type, language);
    const generated = generateMessageFromTemplate(template, reservation, property, reservation, owner);
    return {
      owner_id: reservation.owner_id,
      reservation_id: reservation.id,
      template_id: template.id || null,
      guest_phone: reservation.guest_phone,
      generated_body: generated.body,
      scheduled_at: item.scheduled_at,
      status: 'scheduled'
    };
  });
  if (!rows.length) return { data: [], error: null };
  return window.sb.from('scheduled_messages').insert(rows).select();
}

async function createMessageHistory({ reservation, template, message, status = 'sent' }) {
  if (!reservation?.id || !window.sb) return { data: null, error: null };
  return window.sb.from('message_history').insert({
    owner_id: reservation.owner_id,
    reservation_id: reservation.id,
    template_id: template?.id || null,
    guest_phone: reservation.guest_phone,
    generated_body: message,
    status,
    sent_at: status === 'sent' ? new Date().toISOString() : null
  }).select().single();
}

window.LindaStayWhatsApp = {
  WHATSAPP_COLOR,
  WHATSAPP_VARIABLES,
  DEFAULT_WHATSAPP_TEMPLATES,
  templatesForLanguage,
  templateByType,
  generateMessageFromTemplate,
  openWhatsApp,
  scheduleDefaultMessages,
  createMessageHistory,
  normaliseWhatsAppPhone
};

(function installLindaStayWhatsAppEnhancer() {
  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  }

  function getLanguage() {
    return localStorage.getItem('lindastay.lang') || document.documentElement.lang || 'fr';
  }

  function getClient() {
    return window.sb || window.lindaStaySupabaseClient || null;
  }

  if (window.supabase?.createClient && !window.supabase.__lindaStayWhatsAppWrapped) {
    const originalCreateClient = window.supabase.createClient.bind(window.supabase);
    window.supabase.createClient = function createLindaStayClient(...args) {
      const client = originalCreateClient(...args);
      window.sb = client;
      window.lindaStaySupabaseClient = client;
      return client;
    };
    window.supabase.__lindaStayWhatsAppWrapped = true;
  }

  function renderTemplateCards() {
    const language = getLanguage();
    return templatesForLanguage(language).map(template => `<div class="message-template whatsapp-template-card"><b>${escapeHtml(template.name)}</b><span>${template.type} · ${template.language.toUpperCase()}</span><p>${escapeHtml(template.body)}</p></div>`).join('');
  }

  async function renderCustomTemplates(root) {
    const client = getClient();
    if (!client) return `<p class="schema-warning">Supabase n’est pas encore prêt. Réessaie après connexion.</p>`;
    const { data: auth } = await client.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) return `<p class="schema-warning">Connecte-toi pour voir tes templates personnalisés.</p>`;
    const { data, error } = await client.from('message_templates').select('*').eq('owner_id', userId).eq('is_system', false).order('created_at', { ascending: false });
    if (error) return `<p class="schema-warning">${escapeHtml(error.message)}<br>Exécute supabase/schema.sql pour activer cette section.</p>`;
    return (data || []).map(template => `<div class="message-template whatsapp-template-card"><b>${escapeHtml(template.name)}</b><span>${template.type} · ${template.language}</span><p>${escapeHtml(template.body)}</p></div>`).join('') || '<div class="empty"><div>✨</div><p>Aucun template personnalisé pour le moment.</p></div>';
  }

  async function renderHistory(root) {
    const client = getClient();
    if (!client) return `<p class="schema-warning">Supabase n’est pas encore prêt. Réessaie après connexion.</p>`;
    const { data: auth } = await client.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) return `<p class="schema-warning">Connecte-toi pour voir l’historique WhatsApp.</p>`;
    const [history, scheduled] = await Promise.all([
      client.from('message_history').select('*, reservations(guest_name, check_in, check_out), message_templates(name)').eq('owner_id', userId).order('created_at', { ascending: false }),
      client.from('scheduled_messages').select('*, reservations(guest_name, check_in, check_out), message_templates(name)').eq('owner_id', userId).order('scheduled_at', { ascending: true })
    ]);
    const error = history.error || scheduled.error;
    if (error) return `<p class="schema-warning">${escapeHtml(error.message)}<br>Les messages apparaîtront après l’exécution de supabase/schema.sql.</p>`;
    const rows = [...(scheduled.data || []), ...(history.data || [])];
    return rows.map(row => {
      const guest = row.reservations?.guest_name || 'Guest';
      const reservation = row.reservations ? `${row.reservations.check_in} → ${row.reservations.check_out}` : 'Reservation';
      const name = row.message_templates?.name || 'WhatsApp template';
      const date = row.sent_at || row.scheduled_at || row.created_at || '';
      return `<div class="message-history-row"><div><b>${escapeHtml(guest)}</b><span>${escapeHtml(name)} · ${escapeHtml(reservation)}</span><small>${escapeHtml(date ? new Date(date).toLocaleString() : '')}</small></div><strong class="status-${escapeHtml(row.status)}">${escapeHtml(row.status)}</strong></div>`;
    }).join('') || '<div class="empty"><div>✨</div><p>Aucun message envoyé ou programmé.</p></div>';
  }

  function renderWhatsAppCenter(container) {
    if (!container || container.dataset.whatsappEnhanced === 'true') return;
    container.dataset.whatsappEnhanced = 'true';
    container.innerHTML = `<div class="whatsapp-header"><div><p class="eyebrow">WhatsApp</p><h2>Automation Center</h2><span>Templates, programmation et historique des messages voyageurs.</span></div><div class="whatsapp-logo">☘</div></div><div class="whatsapp-tabs"><button class="wa-tab active" data-wa-tab="system">Predefined templates</button><button class="wa-tab" data-wa-tab="custom">Custom templates</button><button class="wa-tab" data-wa-tab="history">Message history</button></div><div class="lux-card" data-wa-root><div class="card-title-row"><h3>Templates prédéfinis</h3><span class="wa-status-pill">Actifs dans l’app</span></div><div class="template-grid">${renderTemplateCards()}</div><div class="variable-list">${WHATSAPP_VARIABLES.map(variable => `<span class="variable-chip">{${variable}}</span>`).join('')}</div></div>`;
    const root = container.querySelector('[data-wa-root]');
    container.addEventListener('click', async event => {
      const button = event.target.closest('[data-wa-tab]');
      if (!button) return;
      container.querySelectorAll('[data-wa-tab]').forEach(tab => tab.classList.toggle('active', tab === button));
      if (button.dataset.waTab === 'custom') root.innerHTML = `<div class="card-title-row"><h3>Custom templates</h3><span class="wa-status-pill">Supabase</span></div>${await renderCustomTemplates(root)}`;
      else if (button.dataset.waTab === 'history') root.innerHTML = `<div class="card-title-row"><h3>Message history</h3><span class="wa-status-pill">scheduled / sent</span></div>${await renderHistory(root)}`;
      else root.innerHTML = `<div class="card-title-row"><h3>Templates prédéfinis</h3><span class="wa-status-pill">Actifs dans l’app</span></div><div class="template-grid">${renderTemplateCards()}</div><div class="variable-list">${WHATSAPP_VARIABLES.map(variable => `<span class="variable-chip">{${variable}}</span>`).join('')}</div>`;
    });
  }

  function enhanceCurrentPage() {
    const title = Array.from(document.querySelectorAll('.lux-card h3')).find(node => node.textContent.trim() === 'WhatsApp Automation');
    if (title) renderWhatsAppCenter(title.closest('.lux-card'));
    document.querySelectorAll('a.external[href^="https://wa.me/"]').forEach(link => {
      link.classList.add('whatsapp-outline');
      link.addEventListener('click', event => {
        const text = decodeURIComponent((link.href.split('text=')[1] || '').replace(/\+/g, ' '));
        if (!text || !window.app?.dialog) return;
        event.preventDefault();
        const app = window.app;
        app.dialog.create({ title: 'Aperçu WhatsApp', text: `<div class="message-preview"><div class="preview-body">${escapeHtml(text).replace(/\n/g, '<br>')}</div></div>`, buttons: [{ text: 'Annuler' }, { text: 'Send on WhatsApp', bold: true, color: 'green', onClick: () => window.open(link.href, '_blank', 'noopener') }] }).open();
      }, { once: true });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    enhanceCurrentPage();
    new MutationObserver(enhanceCurrentPage).observe(document.body, { childList: true, subtree: true });
  });
})();
