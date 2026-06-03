const SUPABASE_URL = window.LINDASTAY_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.LINDASTAY_SUPABASE_ANON_KEY || '';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const state = {
  user: null,
  profile: null,
  lang: localStorage.getItem('lindastay.lang') || 'fr',
  readOnly: false,
};

const I18N = {
  fr: {
    appTagline: 'SaaS premium pour villas, Airbnb et maisons de vacances',
    login: 'Connexion', register: 'Inscription', forgot: 'Mot de passe oublié', email: 'Email', password: 'Mot de passe', fullName: 'Nom complet', phone: 'Téléphone', company: 'Société', language: 'Langue', logout: 'Sortir', save: 'Enregistrer', create: 'Créer', cancel: 'Annuler', profile: 'Profil', settings: 'Réglages', dashboard: 'Dashboard', calendar: 'Calendrier', reservation: 'Réservation', reservations: 'Réservations', properties: 'Propriétés', expenses: 'Dépenses', guide: 'Guide voyageur', support: 'Support', subscriptions: 'Abonnements', total: 'Total', deposit: 'Avance', remaining: 'Reste', nights: 'Nuits', guests: 'Voyageurs', revenue: 'Revenus', netProfit: 'Bénéfice net', occupancy: 'Taux occupation', arrivalsToday: 'Arrivées aujourd’hui', departuresToday: 'Départs aujourd’hui', upcomingArrivals: 'Prochaines arrivées', active: 'Actif', expired: 'Expiré', trial: 'Essai', blocked: 'Suspendu', free: 'Free', starter: 'Starter', pro: 'Pro', premium: 'Premium', sendWhatsapp: 'Envoyer WhatsApp', readOnly: 'Mode lecture seule : abonnement expiré.', newReservation: 'Nouvelle réservation', propertyName: 'Nom du logement', address: 'Adresse', description: 'Description', amenities: 'Équipements', houseRules: 'Règles de la maison', checkInInstructions: 'Instructions d’arrivée', wifi: 'WiFi', status: 'Statut', profitForecast: 'Prévision de rentabilité', expenseTemplates: 'Modèles de dépenses', travelerGuide: 'Guide digital', adminPanel: 'Super Admin', users: 'Utilisateurs', mrr: 'MRR', newCustomers: 'Nouveaux clients', contactRequests: 'Demandes contact', globalSettings: 'Paramètres globaux'
  },
  en: {
    appTagline: 'Premium SaaS for villas, Airbnb and vacation rentals',
    login: 'Login', register: 'Register', forgot: 'Forgot password', email: 'Email', password: 'Password', fullName: 'Full name', phone: 'Phone', company: 'Company', language: 'Language', logout: 'Logout', save: 'Save', create: 'Create', cancel: 'Cancel', profile: 'Profile', settings: 'Settings', dashboard: 'Dashboard', calendar: 'Calendar', reservation: 'Reservation', reservations: 'Reservations', properties: 'Properties', expenses: 'Expenses', guide: 'Traveler guide', support: 'Support', subscriptions: 'Subscriptions', total: 'Total', deposit: 'Deposit', remaining: 'Balance', nights: 'Nights', guests: 'Guests', revenue: 'Revenue', netProfit: 'Net profit', occupancy: 'Occupancy', arrivalsToday: 'Arrivals today', departuresToday: 'Departures today', upcomingArrivals: 'Upcoming arrivals', active: 'Active', expired: 'Expired', trial: 'Trial', blocked: 'Suspended', free: 'Free', starter: 'Starter', pro: 'Pro', premium: 'Premium', sendWhatsapp: 'Send WhatsApp', readOnly: 'Read-only mode: subscription expired.', newReservation: 'New reservation', propertyName: 'Property name', address: 'Address', description: 'Description', amenities: 'Amenities', houseRules: 'House rules', checkInInstructions: 'Check-in instructions', wifi: 'WiFi', status: 'Status', profitForecast: 'Profitability forecast', expenseTemplates: 'Expense templates', travelerGuide: 'Digital guide', adminPanel: 'Super Admin', users: 'Users', mrr: 'MRR', newCustomers: 'New customers', contactRequests: 'Contact requests', globalSettings: 'Global settings'
  },
  de: {
    appTagline: 'Premium-SaaS für Villen, Airbnb und Ferienhäuser',
    login: 'Anmelden', register: 'Registrieren', forgot: 'Passwort vergessen', email: 'E-Mail', password: 'Passwort', fullName: 'Vollständiger Name', phone: 'Telefon', company: 'Firma', language: 'Sprache', logout: 'Abmelden', save: 'Speichern', create: 'Erstellen', cancel: 'Abbrechen', profile: 'Profil', settings: 'Einstellungen', dashboard: 'Dashboard', calendar: 'Kalender', reservation: 'Reservierung', reservations: 'Reservierungen', properties: 'Objekte', expenses: 'Ausgaben', guide: 'Reiseführer', support: 'Support', subscriptions: 'Abos', total: 'Gesamt', deposit: 'Anzahlung', remaining: 'Restbetrag', nights: 'Nächte', guests: 'Gäste', revenue: 'Umsatz', netProfit: 'Nettogewinn', occupancy: 'Auslastung', arrivalsToday: 'Anreisen heute', departuresToday: 'Abreisen heute', upcomingArrivals: 'Nächste Anreisen', active: 'Aktiv', expired: 'Abgelaufen', trial: 'Test', blocked: 'Gesperrt', free: 'Free', starter: 'Starter', pro: 'Pro', premium: 'Premium', sendWhatsapp: 'WhatsApp senden', readOnly: 'Nur-Lesen-Modus: Abo abgelaufen.', newReservation: 'Neue Reservierung', propertyName: 'Objektname', address: 'Adresse', description: 'Beschreibung', amenities: 'Ausstattung', houseRules: 'Hausregeln', checkInInstructions: 'Check-in-Anweisungen', wifi: 'WiFi', status: 'Status', profitForecast: 'Rentabilitätsprognose', expenseTemplates: 'Ausgabenvorlagen', travelerGuide: 'Digitaler Guide', adminPanel: 'Super Admin', users: 'Benutzer', mrr: 'MRR', newCustomers: 'Neue Kunden', contactRequests: 'Kontaktanfragen', globalSettings: 'Globale Einstellungen'
  },
  ar: {
    appTagline: 'منصة فاخرة لإدارة الفيلات وبيوت العطلات',
    login: 'تسجيل الدخول', register: 'إنشاء حساب', forgot: 'نسيت كلمة المرور', email: 'البريد الإلكتروني', password: 'كلمة المرور', fullName: 'الاسم الكامل', phone: 'الهاتف', company: 'الشركة', language: 'اللغة', logout: 'خروج', save: 'حفظ', create: 'إنشاء', cancel: 'إلغاء', profile: 'الملف الشخصي', settings: 'الإعدادات', dashboard: 'لوحة التحكم', calendar: 'التقويم', reservation: 'حجز', reservations: 'الحجوزات', properties: 'العقارات', expenses: 'المصاريف', guide: 'دليل المسافر', support: 'الدعم', subscriptions: 'الاشتراكات', total: 'المجموع', deposit: 'العربون', remaining: 'المتبقي', nights: 'ليالي', guests: 'ضيوف', revenue: 'الإيرادات', netProfit: 'صافي الربح', occupancy: 'نسبة الإشغال', arrivalsToday: 'وصول اليوم', departuresToday: 'مغادرة اليوم', upcomingArrivals: 'الوصول القادم', active: 'نشط', expired: 'منتهي', trial: 'تجربة', blocked: 'موقوف', free: 'مجاني', starter: 'Starter', pro: 'Pro', premium: 'Premium', sendWhatsapp: 'إرسال واتساب', readOnly: 'وضع القراءة فقط: انتهى الاشتراك.', newReservation: 'حجز جديد', propertyName: 'اسم العقار', address: 'العنوان', description: 'الوصف', amenities: 'المرافق', houseRules: 'قواعد المنزل', checkInInstructions: 'تعليمات الوصول', wifi: 'واي فاي', status: 'الحالة', profitForecast: 'توقع الربحية', expenseTemplates: 'قوالب المصاريف', travelerGuide: 'الدليل الرقمي', adminPanel: 'المدير العام', users: 'المستخدمون', mrr: 'الإيراد الشهري', newCustomers: 'عملاء جدد', contactRequests: 'طلبات التواصل', globalSettings: 'الإعدادات العامة'
  }
};

function t(key) { return (I18N[state.lang] && I18N[state.lang][key]) || I18N.fr[key] || key; }
function esc(value) { return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function money(value, currency = '€') { return `${Number(value || 0).toLocaleString(state.lang === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`; }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); }
function monthStart() { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10); }
function nightsBetween(start, end) { if (!start || !end) return 0; return Math.max(0, Math.round((new Date(end) - new Date(start)) / 86400000)); }
function isAdmin() { return state.profile?.role === 'super_admin'; }
function isSubscriptionActive(profile = state.profile) { if (!profile) return false; if (profile.role === 'super_admin') return true; return ['active', 'trial'].includes(profile.subscription_status) && (!profile.subscription_end || profile.subscription_end >= todayISO()); }
function setDocumentLanguage() { document.documentElement.lang = state.lang; document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr'; }

async function loadSession() {
  const { data } = await sb.auth.getSession();
  state.user = data.session?.user || null;
  state.profile = null;
  if (state.user) {
    const { data: profile } = await sb.from('profiles').select('*').eq('id', state.user.id).maybeSingle();
    state.profile = profile || { id: state.user.id, email: state.user.email, role: 'property_owner', subscription_status: 'trial', subscription_plan: 'free' };
    state.lang = state.profile.preferred_language || state.lang;
    localStorage.setItem('lindastay.lang', state.lang);
  }
  state.readOnly = state.user && !isSubscriptionActive();
  setDocumentLanguage();
}

async function guardedWrite(action) {
  if (state.readOnly && !isAdmin()) {
    app.dialog.alert(t('readOnly'));
    return { error: new Error('read-only') };
  }
  return action();
}

async function bootstrapProfile(user, extra = {}) {
  const profile = {
    id: user.id,
    email: user.email,
    full_name: extra.full_name || '',
    phone: extra.phone || '',
    company_name: extra.company_name || '',
    role: 'property_owner',
    preferred_language: state.lang,
    subscription_status: 'trial',
    subscription_plan: 'free',
    subscription_start: todayISO(),
    subscription_end: addDays(todayISO(), 14),
  };
  await sb.from('profiles').upsert(profile, { onConflict: 'id' });
  await sb.from('subscriptions').insert({ owner_id: user.id, plan: 'free', status: 'trial', start_date: todayISO(), end_date: addDays(todayISO(), 14), price_monthly: 0 });
}

function pageShell(title, content, active = 'dashboard', right = '') {
  return `<div class="page premium-page">
    <div class="navbar"><div class="navbar-bg"></div><div class="navbar-inner"><div class="title sliding">${title}</div><div class="right">${right || `<a class="link icon-only" href="/profile/">👤</a>`}</div></div></div>
    <div class="toolbar tabbar-labels toolbar-bottom app-tabbar"><div class="toolbar-inner">
      <a href="/home/" class="tab-link ${active === 'dashboard' ? 'tab-link-active' : ''}"><span class="tabbar-icon">🏠</span><span class="tabbar-label">${t('dashboard')}</span></a>
      <a href="/calendar/" class="tab-link ${active === 'calendar' ? 'tab-link-active' : ''}"><span class="tabbar-icon">📅</span><span class="tabbar-label">${t('calendar')}</span></a>
      <a href="/reservations/new/" class="tab-link fab-tab ${active === 'new' ? 'tab-link-active' : ''}"><span class="tabbar-icon">➕</span><span class="tabbar-label">${t('reservation')}</span></a>
      <a href="/properties/" class="tab-link ${active === 'properties' ? 'tab-link-active' : ''}"><span class="tabbar-icon">🏡</span><span class="tabbar-label">${t('properties')}</span></a>
      <a href="/settings/" class="tab-link ${active === 'settings' ? 'tab-link-active' : ''}"><span class="tabbar-icon">⚙️</span><span class="tabbar-label">${t('settings')}</span></a>
    </div></div>
    <a class="floating-reservation" href="/reservations/new/">+</a>
    <div class="page-content app-content">${state.readOnly && !isAdmin() ? `<div class="readonly-banner">${t('readOnly')}</div>` : ''}${content}</div>
  </div>`;
}

function authShell(mode = 'login') {
  const isRegister = mode === 'register';
  return `<div class="page auth-page"><div class="page-content auth-wrap">
    <div class="auth-card">
      <div class="brand-mark">LS</div><h1>LindaStay</h1><p>${t('appTagline')}</p>
      <div class="segmented segmented-strong auth-segment">
        <a class="button ${mode === 'login' ? 'button-active' : ''}" href="/">${t('login')}</a>
        <a class="button ${isRegister ? 'button-active' : ''}" href="/register/">${t('register')}</a>
      </div>
      <div class="list no-hairlines-md form-list"><ul>
        ${isRegister ? `<li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">${t('fullName')}</div><div class="item-input-wrap"><input id="fullName" autocomplete="name"></div></div></li>
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">${t('phone')}</div><div class="item-input-wrap"><input id="phone" autocomplete="tel"></div></div></li>
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">${t('company')}</div><div class="item-input-wrap"><input id="company"></div></div></li>` : ''}
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">${t('email')}</div><div class="item-input-wrap"><input id="email" type="email" autocomplete="email"></div></div></li>
        ${mode !== 'forgot' ? `<li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">${t('password')}</div><div class="item-input-wrap"><input id="password" type="password" autocomplete="current-password"></div></div></li>` : ''}
        <li><a class="item-link smart-select smart-select-init" data-open-in="popover"><select id="language">${['fr','en','de','ar'].map(l => `<option value="${l}" ${state.lang === l ? 'selected' : ''}>${l.toUpperCase()}</option>`).join('')}</select><div class="item-content"><div class="item-inner"><div class="item-title">${t('language')}</div></div></div></a></li>
      </ul></div>
      <button class="button button-fill button-large primary-btn" id="authAction">${mode === 'forgot' ? t('forgot') : isRegister ? t('register') : t('login')}</button>
      <div class="auth-links"><a href="/forgot/">${t('forgot')}</a><span>•</span><a href="/">${t('login')}</a></div>
      <div class="launch-grid"><span>Tunisia</span><span>France</span><span>Germany</span><span>International</span></div>
    </div>
  </div></div>`;
}

const LoginPage = {
  template: authShell('login'),
  methods: { async submit() {
    state.lang = document.getElementById('language').value; localStorage.setItem('lindastay.lang', state.lang); setDocumentLanguage();
    const email = document.getElementById('email').value.trim(); const password = document.getElementById('password').value;
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return app.dialog.alert(error.message);
    await loadSession(); mainView.router.navigate(isAdmin() ? '/admin/' : '/home/');
  }},
  mounted() { document.getElementById('authAction').onclick = () => this.submit(); }
};

const RegisterPage = {
  template: authShell('register'),
  methods: { async submit() {
    state.lang = document.getElementById('language').value; localStorage.setItem('lindastay.lang', state.lang); setDocumentLanguage();
    const email = document.getElementById('email').value.trim(); const password = document.getElementById('password').value;
    const extra = { full_name: fullName.value, phone: phone.value, company_name: company.value };
    const { data, error } = await sb.auth.signUp({ email, password, options: { data: extra } });
    if (error) return app.dialog.alert(error.message);
    if (data.user) await bootstrapProfile(data.user, extra);
    app.dialog.alert('Compte créé. Vérifie ton email si la confirmation est activée.'); mainView.router.navigate('/');
  }},
  mounted() { document.getElementById('authAction').onclick = () => this.submit(); }
};

const ForgotPage = {
  template: authShell('forgot'),
  methods: { async submit() {
    state.lang = document.getElementById('language').value; localStorage.setItem('lindastay.lang', state.lang);
    const { error } = await sb.auth.resetPasswordForEmail(document.getElementById('email').value.trim(), { redirectTo: location.href.split('#')[0] });
    app.dialog.alert(error ? error.message : 'Email envoyé.');
  }},
  mounted() { document.getElementById('authAction').onclick = () => this.submit(); }
};

const DashboardPage = {
  data() { return { stats: {}, arrivals: [] }; },
  template: pageShell(t('dashboard'), `<section class="hero-card"><div><p class="eyebrow">LindaStay</p><h2>${t('appTagline')}</h2><p>${t('subscriptions')}: <b id="subscriptionText">...</b></p></div><a href="/reservations/new/" class="button button-fill">${t('newReservation')}</a></section><div id="dashboardRoot" class="skeleton-block"></div>`, 'dashboard'),
  methods: {
    render() {
      const s = this.stats;
      dashboardRoot.innerHTML = `<div class="stats-grid">
        ${statCard(t('revenue'), money(s.revenue), '+12%', 'primary')}
        ${statCard(t('expenses'), money(s.expenses), 'forecast', 'secondary')}
        ${statCard(t('netProfit'), money(s.revenue - s.expenses), 'profit', 'success')}
        ${statCard(t('occupancy'), `${s.occupancy}%`, `${s.reservations} ${t('reservations')}`, 'info')}
        ${statCard(t('arrivalsToday'), s.arrivalsToday, '', 'neutral')}
        ${statCard(t('departuresToday'), s.departuresToday, '', 'neutral')}
      </div><div class="content-grid two-col"><div class="lux-card"><div class="card-title-row"><h3>${t('upcomingArrivals')}</h3><a href="/calendar/">${t('calendar')}</a></div>${this.arrivals.length ? this.arrivals.map(reservationItem).join('') : emptyState('Aucune arrivée planifiée')}</div><div class="lux-card"><h3>${t('expenses')}</h3><div class="chart-bars">${bar('Revenue', s.revenue, s.revenue || 1)}${bar('Expenses', s.expenses, s.revenue || 1)}${bar('Profit', Math.max(s.revenue - s.expenses, 0), s.revenue || 1)}</div></div></div>`;
    }
  },
  async mounted() {
    await requireAuth();
    subscriptionText.textContent = `${t(state.profile.subscription_status || 'trial')} · ${(state.profile.subscription_plan || 'free').toUpperCase()} · ${state.profile.subscription_end || '∞'}`;
    const [res, exp] = await Promise.all([
      sb.from('reservations').select('*, properties(name)').eq('owner_id', state.user.id).gte('check_out', monthStart()).order('check_in'),
      sb.from('expenses').select('amount').eq('owner_id', state.user.id).gte('expense_date', monthStart())
    ]);
    const reservations = res.data || []; const expenses = exp.data || [];
    const daysBooked = reservations.reduce((sum, r) => sum + nightsBetween(r.check_in, r.check_out), 0);
    const stats = { reservations: reservations.length, revenue: reservations.reduce((sum, r) => sum + Number(r.total_price || 0), 0), expenses: expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0), occupancy: Math.min(100, Math.round(daysBooked / 30 * 100)), arrivalsToday: reservations.filter(r => r.check_in === todayISO()).length, departuresToday: reservations.filter(r => r.check_out === todayISO()).length };
    this.stats = stats;
    this.arrivals = reservations.filter(r => r.check_in >= todayISO()).slice(0, 5);
    this.$setState({ stats: this.stats, arrivals: this.arrivals });
    this.render();
  }
};

function statCard(label, value, meta, tone) { return `<div class="stat-card ${tone}"><div class="stat-label">${label}</div><div class="stat-number">${value}</div><div class="stat-meta">${meta || '&nbsp;'}</div></div>`; }
function emptyState(text) { return `<div class="empty"><div>✨</div><p>${text}</p></div>`; }
function bar(label, value, max) { const width = Math.max(4, Math.round((Number(value || 0) / Number(max || 1)) * 100)); return `<div class="bar-row"><span>${label}</span><div><i style="width:${Math.min(width,100)}%"></i></div><b>${money(value)}</b></div>`; }
function reservationItem(r) { return `<div class="mini-item"><div><b>${esc(r.guest_name)}</b><span>${esc(r.properties?.name || '')} · ${r.check_in} → ${r.check_out}</span></div><strong>${money(r.total_price)}</strong></div>`; }

async function requireAuth() { await loadSession(); if (!state.user) { mainView.router.navigate('/'); return false; } return true; }

const PropertiesPage = {
  template: pageShell(t('properties'), `<div class="content-grid two-col"><div class="lux-card"><h3>${t('properties')}</h3><div class="list form-list"><ul>
    ${input('propertyName','text',t('propertyName'))}${input('propertyDesc','text',t('description'))}${input('propertyAddress','text',t('address'))}${input('mapsLink','url','Google Maps')}${input('gpsCoordinates','text','GPS coordinates')}${input('photoUrls','text','Photo URLs (comma separated)')}${input('capacity','number','Capacity')}${input('bedrooms','number','Bedrooms')}${input('bathrooms','number','Bathrooms')}${input('amenities','text',t('amenities'))}${input('wifiName','text','WiFi SSID')}${input('wifiPassword','text','WiFi password')}${textarea('checkInInstructions',t('checkInInstructions'))}${textarea('houseRules',t('houseRules'))}</ul></div><button class="button button-fill primary-btn" id="saveProperty">${t('save')}</button></div><div class="lux-card"><div class="card-title-row"><h3>Portfolio</h3><a href="/guide/">${t('travelerGuide')}</a></div><div id="propertiesList"></div></div></div>`, 'properties'),
  methods: {
    async saveProperty() {
      await guardedWrite(async () => {
        const row = { owner_id: state.user.id, name: propertyName.value, description: propertyDesc.value, address: propertyAddress.value, google_maps_link: mapsLink.value, gps_coordinates: gpsCoordinates.value, photos: photoUrls.value.split(',').map(v => v.trim()).filter(Boolean), capacity: Number(capacity.value || 0), bedrooms: Number(bedrooms.value || 0), bathrooms: Number(bathrooms.value || 0), amenities: amenities.value.split(',').map(v => v.trim()).filter(Boolean), wifi_name: wifiName.value, wifi_password: wifiPassword.value, check_in_instructions: checkInInstructions.value, house_rules: houseRules.value };
        const { error } = await sb.from('properties').insert(row); if (error) return app.dialog.alert(error.message); mainView.router.refreshPage();
      });
    }
  },
  async mounted() { await requireAuth(); saveProperty.onclick = () => this.saveProperty(); const { data } = await sb.from('properties').select('*').eq('owner_id', state.user.id).order('created_at', { ascending: false }); propertiesList.innerHTML = (data || []).length ? data.map(propertyCard).join('') : emptyState('Ajoute ta première villa.'); }
};
function propertyCard(p) { const img = (p.photos || [])[0] || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'; return `<article class="property-card"><img src="${esc(img)}" alt=""><div><h4>${esc(p.name)}</h4><p>${esc(p.address || '')}</p><div class="pill-row"><span>${p.capacity || 0} guests</span><span>${p.bedrooms || 0} bedrooms</span><span>${p.bathrooms || 0} baths</span></div></div></article>`; }
function input(id, type, label, value = '') { return `<li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">${label}</div><div class="item-input-wrap"><input id="${id}" type="${type}" value="${esc(value)}"></div></div></li>`; }
function textarea(id, label) { return `<li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">${label}</div><div class="item-input-wrap"><textarea id="${id}"></textarea></div></div></li>`; }

const ReservationNewPage = {
  data() { return { properties: [], templates: [] }; },
  template: pageShell(t('newReservation'), `<div class="wizard-grid"><div class="lux-card"><h3>1 · Guest</h3><div class="list form-list"><ul>${input('guestFullName','text',t('fullName'))}${input('guestPhone','tel',t('phone'))}${input('guestEmail','email',t('email'))}</ul></div><h3>2 · Stay</h3><div class="list form-list"><ul><li><a class="item-link smart-select smart-select-init"><select id="propertyId"></select><div class="item-content"><div class="item-inner"><div class="item-title">${t('properties')}</div></div></div></a></li>${input('checkIn','date','Check-in')}${input('checkOut','date','Check-out')}${input('guestCount','number',t('guests'),'1')}</ul></div><h3>3 · Financial</h3><div class="list form-list"><ul>${input('totalPrice','number',t('total'))}${input('depositPaid','number',t('deposit'),'0')}</ul></div><button class="button button-fill primary-btn" id="createReservation">${t('create')}</button></div><div class="lux-card sticky-card"><h3>${t('profitForecast')}</h3><div id="forecast"></div></div></div>`, 'new'),
  methods: {
    calculate() {
      const nights = nightsBetween(checkIn.value, checkOut.value); const guests = Number(guestCount.value || 0); const total = Number(totalPrice.value || 0); const deposit = Number(depositPaid.value || 0);
      const expenses = this.templates.map(template => ({ name: template.name, category: template.category, amount: expenseAmount(template, nights, guests) })).filter(e => e.amount > 0);
      const expensesTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
      forecast.innerHTML = `<div class="forecast-line"><span>${t('nights')}</span><b>${nights}</b></div><div class="forecast-line"><span>${t('remaining')}</span><b>${money(total - deposit)}</b></div>${expenses.map(e => `<div class="forecast-line"><span>${esc(e.name)}</span><b>${money(e.amount)}</b></div>`).join('')}<div class="forecast-total"><span>${t('netProfit')}</span><b>${money(total - expensesTotal)}</b></div>`;
    },
    async createReservation() {
      await guardedWrite(async () => {
        const property_id = propertyId.value; if (!property_id) return app.dialog.alert('Ajoute une propriété d’abord.');
        let guestId = null;
        const guestRow = { owner_id: state.user.id, full_name: guestFullName.value, phone: guestPhone.value, email: guestEmail.value };
        const guestInsert = await sb.from('guests').insert(guestRow).select().single(); if (guestInsert.error) return app.dialog.alert(guestInsert.error.message); guestId = guestInsert.data.id;
        const nights = nightsBetween(checkIn.value, checkOut.value); const guests = Number(guestCount.value || 0); const total = Number(totalPrice.value || 0); const deposit = Number(depositPaid.value || 0);
        const reservation = { owner_id: state.user.id, property_id, guest_id: guestId, guest_name: guestFullName.value, guest_phone: guestPhone.value, guest_email: guestEmail.value, check_in: checkIn.value, check_out: checkOut.value, guests_count: guests, nights, total_price: total, deposit_paid: deposit, remaining_balance: total - deposit, status: 'confirmed' };
        const created = await sb.from('reservations').insert(reservation).select().single(); if (created.error) return app.dialog.alert(created.error.message);
        const expenses = this.templates.map(template => ({ owner_id: state.user.id, reservation_id: created.data.id, template_id: template.id, name: template.name, category: template.category, amount: expenseAmount(template, nights, guests), expense_date: checkIn.value, forecast: true })).filter(e => e.amount > 0);
        if (expenses.length) await sb.from('expenses').insert(expenses);
        mainView.router.navigate('/reservations/');
      });
    }
  },
  async mounted() { await requireAuth(); const [props, templatesResult] = await Promise.all([sb.from('properties').select('id,name').eq('owner_id', state.user.id).order('name'), sb.from('expense_templates').select('*').eq('owner_id', state.user.id).eq('is_active', true).order('created_at')]); const properties = props.data || []; const templates = templatesResult.data || []; this.properties = properties; this.templates = templates; this.$setState({ properties, templates }); propertyId.innerHTML = properties.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join(''); ['checkIn','checkOut','guestCount','totalPrice','depositPaid'].forEach(id => document.getElementById(id).oninput = () => this.calculate()); createReservation.onclick = () => this.createReservation(); this.calculate(); }
};
function expenseAmount(template, nights, guests) { const amount = Number(template.default_amount || 0); if (template.type === 'per_night') return amount * nights; if (template.type === 'per_guest') return amount * guests; if (template.type === 'manual') return 0; return amount; }

const ReservationsPage = {
  template: pageShell(t('reservations'), `<div class="section-header"><h2>${t('reservations')}</h2><a href="/reservations/new/" class="button button-fill">${t('newReservation')}</a></div><div id="reservationsList" class="lux-card"></div>`, 'new'),
  async mounted() { await requireAuth(); const { data } = await sb.from('reservations').select('*, properties(name)').eq('owner_id', state.user.id).order('check_in', { ascending: false }); reservationsList.innerHTML = (data || []).length ? data.map(r => `<div class="reservation-row"><div><b>${esc(r.guest_name)}</b><span>${esc(r.properties?.name || '')} · ${r.check_in} → ${r.check_out} · ${r.nights} nights</span></div><div><strong>${money(r.total_price)}</strong><small>${t('remaining')}: ${money(r.remaining_balance)}</small><a class="external" target="_blank" href="${whatsappUrl(r)}">${t('sendWhatsapp')}</a></div></div>`).join('') : emptyState('Aucune réservation.'); }
};

function whatsappUrl(r, kind = 'confirmation') { const text = encodeURIComponent(`LindaStay - ${kind}\nBonjour ${r.guest_name}, votre réservation est confirmée du ${r.check_in} au ${r.check_out}. Total: ${r.total_price}. Avance: ${r.deposit_paid}. Reste: ${r.remaining_balance}.`); return `https://wa.me/${String(r.guest_phone || '').replace(/\D/g, '')}?text=${text}`; }

const CalendarPage = {
  template: pageShell(t('calendar'), `<div class="lux-card"><div class="calendar-head"><h2>${t('calendar')}</h2><div class="legend"><span class="available">Available</span><span class="reserved">Reserved</span><span class="arrival">Arrival</span><span class="departure">Departure</span><span class="blocked">Blocked</span></div></div><div id="calendarGrid" class="airbnb-calendar"></div></div>`, 'calendar'),
  async mounted() { await requireAuth(); const start = monthStart(); const end = addDays(start, 45); const { data } = await sb.from('reservations').select('*').eq('owner_id', state.user.id).gte('check_out', start).lte('check_in', end); calendarGrid.innerHTML = renderCalendar(data || []); }
};
function renderCalendar(reservations) { const start = new Date(monthStart()); const days = Array.from({ length: 35 }, (_, i) => addDays(start, i)); return days.map(day => { const r = reservations.find(x => x.check_in <= day && x.check_out >= day); const cls = !r ? 'available' : r.check_in === day ? 'arrival' : r.check_out === day ? 'departure' : r.status === 'cancelled' ? 'blocked' : 'reserved'; return `<div class="cal-day ${cls}"><b>${new Date(day).getDate()}</b><span>${r ? esc(r.guest_name) : 'Available'}</span></div>`; }).join(''); }

const ExpenseSettingsPage = {
  template: pageShell(t('expenseTemplates'), `<div class="content-grid two-col"><div class="lux-card"><h3>${t('expenseTemplates')}</h3><div class="list form-list"><ul>${input('expenseName','text','Name', 'Cleaning')}${input('expenseCategory','text','Category','Service')}${input('expenseAmount','number','Default amount','80')}<li><a class="item-link smart-select smart-select-init"><select id="expenseType"><option value="fixed_per_reservation">Fixed per reservation</option><option value="per_night">Per night</option><option value="per_guest">Per guest</option><option value="manual">Manual</option></select><div class="item-content"><div class="item-inner"><div class="item-title">Type</div></div></div></a></li></ul></div><button id="saveExpenseTemplate" class="button button-fill primary-btn">${t('save')}</button></div><div id="expenseTemplatesList" class="lux-card"></div></div>`, 'settings'),
  methods: { async saveTemplate() { await guardedWrite(async () => { const row = { owner_id: state.user.id, name: expenseName.value, category: expenseCategory.value, default_amount: Number(expenseAmount.value || 0), type: expenseType.value, is_active: true }; const { error } = await sb.from('expense_templates').insert(row); if (error) return app.dialog.alert(error.message); mainView.router.refreshPage(); }); } },
  async mounted() { await requireAuth(); saveExpenseTemplate.onclick = () => this.saveTemplate(); const { data } = await sb.from('expense_templates').select('*').eq('owner_id', state.user.id).order('created_at', { ascending: false }); expenseTemplatesList.innerHTML = `<h3>${t('expenses')}</h3>${(data || []).length ? data.map(e => `<div class="mini-item"><div><b>${esc(e.name)}</b><span>${esc(e.category)} · ${e.type}</span></div><strong>${money(e.default_amount)}</strong></div>`).join('') : emptyState('Cleaning, Electricity, Water, Pool, Garden...')}`; }
};

const GuidePage = {
  template: pageShell(t('travelerGuide'), `<div class="lux-card"><h3>${t('travelerGuide')}</h3><div class="list form-list"><ul><li><a class="item-link smart-select smart-select-init"><select id="guideProperty"></select><div class="item-content"><div class="item-inner"><div class="item-title">${t('properties')}</div></div></div></a></li>${textarea('restaurants','Restaurants')}${textarea('supermarkets','Supermarkets')}${textarea('pharmacies','Pharmacies')}${textarea('beaches','Beaches')}${textarea('emergencyContacts','Emergency contacts')}${textarea('taxiServices','Taxi services')}</ul></div><button id="saveGuide" class="button button-fill primary-btn">${t('save')}</button><button id="shareGuide" class="button button-outline">One-click sharing</button></div>`, 'settings'),
  methods: { async saveGuide() { await guardedWrite(async () => { const row = { owner_id: state.user.id, property_id: guideProperty.value, restaurants: restaurants.value, supermarkets: supermarkets.value, pharmacies: pharmacies.value, beaches: beaches.value, emergency_contacts: emergencyContacts.value, taxi_services: taxiServices.value, share_slug: crypto.randomUUID() }; const { error } = await sb.from('traveler_guides').upsert(row, { onConflict: 'property_id' }); if (error) return app.dialog.alert(error.message); app.dialog.alert('Guide enregistré.'); }); } },
  async mounted() { await requireAuth(); const { data } = await sb.from('properties').select('id,name').eq('owner_id', state.user.id); guideProperty.innerHTML = (data || []).map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join(''); saveGuide.onclick = () => this.saveGuide(); shareGuide.onclick = () => navigator.share ? navigator.share({ title: 'LindaStay Guide', url: location.href }) : app.dialog.alert(location.href); }
};

const MessagesPage = {
  template: pageShell(t('sendWhatsapp'), `<div class="lux-card"><h3>WhatsApp Automation</h3><div class="template-grid">${['Booking confirmation','Arrival reminder','Payment reminder','Check-out message','Thank you message'].map((name, i) => `<div class="message-template"><b>${name}</b><p>${['Bonjour {guest}, votre réservation est confirmée pour {property}.','Rappel arrivée: {check_in}. Voici les instructions.','Paiement: reste {remaining_balance}.','Merci de libérer le logement avant 11h.','Merci pour votre séjour chez LindaStay.'][i]}</p></div>`).join('')}</div></div>`, 'settings'),
  async mounted() { await requireAuth(); }
};

const SettingsPage = {
  template: pageShell(t('settings'), `<div class="content-grid two-col"><div class="lux-card settings-menu"><a href="/profile/">👤 ${t('profile')}</a><a href="/expenses-settings/">💡 ${t('expenseTemplates')}</a><a href="/reservations/">🧾 ${t('reservations')}</a><a href="/guide/">🗺️ ${t('travelerGuide')}</a><a href="/messages/">💬 WhatsApp</a><a href="/support/">🎧 ${t('support')}</a><a href="/admin/">🛡️ ${t('adminPanel')}</a></div><div class="lux-card"><h3>${t('subscriptions')}</h3><div class="plans">${plan('Free','1 property · 10 reservations/month','0€')}${plan('Starter','Unlimited basics','9€')}${plan('Pro','Profitability + guide','19€')}${plan('Premium','Teams + automation','39€')}</div></div></div>`, 'settings'),
  async mounted() { await requireAuth(); }
};
function plan(name, text, price) { return `<div class="plan-card"><b>${name}</b><span>${text}</span><strong>${price}/month</strong></div>`; }

const ProfilePage = {
  template: pageShell(t('profile'), `<div class="lux-card"><h3>${t('profile')}</h3><div class="list form-list"><ul>${input('profileName','text',t('fullName'))}${input('profilePhone','tel',t('phone'))}${input('profileCompany','text',t('company'))}<li><a class="item-link smart-select smart-select-init"><select id="profileLang">${['fr','en','de','ar'].map(l => `<option value="${l}">${l.toUpperCase()}</option>`).join('')}</select><div class="item-content"><div class="item-inner"><div class="item-title">${t('language')}</div></div></div></a></li></ul></div><button id="saveProfile" class="button button-fill primary-btn">${t('save')}</button><button id="logoutButton" class="button button-outline">${t('logout')}</button></div>`, 'settings'),
  methods: { async saveProfile() { const row = { full_name: profileName.value, phone: profilePhone.value, company_name: profileCompany.value, preferred_language: profileLang.value }; const { error } = await sb.from('profiles').update(row).eq('id', state.user.id); if (error) return app.dialog.alert(error.message); state.lang = profileLang.value; localStorage.setItem('lindastay.lang', state.lang); location.reload(); } },
  async mounted() { await requireAuth(); profileName.value = state.profile.full_name || ''; profilePhone.value = state.profile.phone || ''; profileCompany.value = state.profile.company_name || ''; profileLang.value = state.lang; saveProfile.onclick = () => this.saveProfile(); logoutButton.onclick = async () => { await sb.auth.signOut(); mainView.router.navigate('/'); }; }
};

const SupportPage = {
  template: pageShell(t('support'), `<div class="lux-card"><h3>${t('support')}</h3><div class="list form-list"><ul>${input('ticketSubject','text','Subject')}${textarea('ticketMessage','Message')}</ul></div><button id="sendTicket" class="button button-fill primary-btn">${t('create')}</button></div>`, 'settings'),
  methods: { async sendTicket() { const { error } = await sb.from('support_tickets').insert({ owner_id: state.user.id, subject: ticketSubject.value, message: ticketMessage.value, status: 'open' }); app.dialog.alert(error ? error.message : 'Ticket envoyé.'); } },
  async mounted() { await requireAuth(); sendTicket.onclick = () => this.sendTicket(); }
};

const AdminPage = {
  template: `<div class="page premium-page"><div class="navbar"><div class="navbar-bg"></div><div class="navbar-inner"><div class="title">${t('adminPanel')}</div><div class="right"><a class="link" id="adminLogout">${t('logout')}</a></div></div></div><div class="page-content app-content"><div id="adminRoot"></div></div></div>`,
  methods: {
    async changeStatus(id, status, plan = 'pro') { const end = status === 'active' ? addDays(todayISO(), plan === 'yearly' ? 365 : 30) : todayISO(); await sb.from('profiles').update({ subscription_status: status, subscription_plan: plan, subscription_end: end }).eq('id', id); mainView.router.refreshPage(); },
    async deleteUser(id) { await sb.from('profiles').delete().eq('id', id); mainView.router.refreshPage(); }
  },
  async mounted() { await requireAuth(); if (!isAdmin()) return mainView.router.navigate('/home/'); adminLogout.onclick = async () => { await sb.auth.signOut(); mainView.router.navigate('/'); }; const [profiles, subscriptions, properties, tickets] = await Promise.all([sb.from('profiles').select('*').order('created_at', { ascending: false }), sb.from('subscriptions').select('*'), sb.from('properties').select('id'), sb.from('support_tickets').select('*').order('created_at', { ascending: false })]); const users = profiles.data || []; const subs = subscriptions.data || []; const props = properties.data || []; const active = users.filter(u => u.subscription_status === 'active').length; const expired = users.filter(u => ['expired','blocked'].includes(u.subscription_status)).length; const mrr = subs.filter(s => s.status === 'active').reduce((sum, s) => sum + Number(s.price_monthly || 0), 0); adminRoot.innerHTML = `<div class="stats-grid">${statCard(t('users'), users.length, '', 'primary')}${statCard('Active subscriptions', active, '', 'success')}${statCard('Expired subscriptions', expired, '', 'secondary')}${statCard('Total properties', props.length, '', 'info')}${statCard(t('mrr'), money(mrr), '', 'neutral')}${statCard(t('newCustomers'), users.filter(u => u.created_at >= addDays(todayISO(), -30)).length, '', 'neutral')}</div><div class="content-grid two-col"><div class="lux-card"><h3>Users Management</h3>${users.map(u => `<div class="admin-user"><div><b>${esc(u.email)}</b><span>${u.role} · ${u.subscription_status} · ${u.subscription_plan || 'free'} · ${u.subscription_end || '-'}</span></div><div class="button-row"><button class="button button-small button-fill" onclick="window.adminActions.activate('${u.id}')">Activate</button><button class="button button-small button-outline" onclick="window.adminActions.suspend('${u.id}')">Suspend</button><button class="button button-small color-red" onclick="window.adminActions.remove('${u.id}')">Delete</button></div></div>`).join('')}</div><div class="lux-card"><h3>${t('support')}</h3>${(tickets.data || []).map(ticket => `<div class="mini-item"><div><b>${esc(ticket.subject)}</b><span>${esc(ticket.message)}</span></div><strong>${ticket.status}</strong></div>`).join('') || emptyState('No tickets')}<h3>${t('globalSettings')}</h3><div class="pill-row"><span>Pricing</span><span>WhatsApp templates</span><span>Email templates</span><span>Languages</span></div></div></div>`; window.adminActions = { activate: id => this.changeStatus(id, 'active', 'pro'), suspend: id => this.changeStatus(id, 'blocked', 'free'), remove: id => this.deleteUser(id) }; }
};

app = new Framework7({
  el: '#app', name: 'LindaStay', theme: 'ios', init: false,
  routes: [
    { path: '/', component: LoginPage }, { path: '/register/', component: RegisterPage }, { path: '/forgot/', component: ForgotPage },
    { path: '/home/', component: DashboardPage }, { path: '/calendar/', component: CalendarPage }, { path: '/reservations/', component: ReservationsPage }, { path: '/reservations/new/', component: ReservationNewPage },
    { path: '/properties/', component: PropertiesPage }, { path: '/expenses-settings/', component: ExpenseSettingsPage }, { path: '/guide/', component: GuidePage }, { path: '/messages/', component: MessagesPage }, { path: '/settings/', component: SettingsPage }, { path: '/profile/', component: ProfilePage }, { path: '/support/', component: SupportPage }, { path: '/admin/', component: AdminPage },
  ]
});
mainView = app.views.create('.view-main', { url: '/' });
app.init();
loadSession().then(() => { if (state.user) mainView.router.navigate(isAdmin() ? '/admin/' : '/home/', { reloadCurrent: true }); });

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
