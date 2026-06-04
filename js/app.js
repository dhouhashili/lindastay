const SUPABASE_URL = window.LINDASTAY_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.LINDASTAY_SUPABASE_ANON_KEY || '';
const APP_ROOT = getAppRoot();
let app;
let mainView;

function getAppRoot() {
  const path = window.location.pathname;
  if (path.startsWith('/lindastay/')) return '/lindastay/';
  return '/';
}

function getInitialRoute() {
  const path = window.location.pathname;
  if (APP_ROOT !== '/' && path.startsWith(APP_ROOT)) {
    return `/${path.slice(APP_ROOT.length)}` || '/';
  }
  return path === APP_ROOT ? '/' : path;
}

function renderBootError(message) {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;
  appRoot.innerHTML = `<div class="boot-error" role="alert">
    <div class="brand-mark">LS</div>
    <h1>LindaStay</h1>
    <p>${message}</p>
    <button type="button" onclick="window.location.reload()">Réessayer</button>
  </div>`;
}

if (!window.Framework7) {
  renderBootError('Framework7 ne s’est pas chargé. Vérifie la connexion internet puis recharge la page.');
  throw new Error('Framework7 is not loaded');
}

if (!window.supabase) {
  renderBootError('Supabase ne s’est pas chargé. Vérifie la connexion internet puis recharge la page.');
  throw new Error('Supabase client is not loaded');
}

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

function authField(id) { return document.getElementById(id); }
function authValue(id) { return authField(id)?.value?.trim() || ''; }
function setAuthFeedback(message = '', type = 'info') {
  const feedback = authField('authFeedback');
  if (!feedback) return;
  feedback.textContent = message;
  feedback.className = `auth-feedback ${type}`;
  feedback.hidden = !message;
}
function setAuthBusy(isBusy, label) {
  const button = authField('authAction');
  if (!button) return;
  if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.textContent;
  button.disabled = isBusy;
  button.textContent = isBusy ? label : button.dataset.defaultLabel;
}
function validateAuthForm({ requireName = false } = {}) {
  const email = authValue('email');
  const password = authField('password')?.value || '';
  const fullName = authValue('fullName');
  if (requireName && !fullName) return { error: 'Merci de saisir ton nom complet.' };
  if (!email) return { error: 'Merci de saisir ton email.' };
  if (!email.includes('@')) return { error: 'Merci de saisir un email valide.' };
  if (!password) return { error: 'Merci de saisir un mot de passe.' };
  if (password.length < 6) return { error: 'Le mot de passe doit contenir au moins 6 caractères.' };
  return { email, password, fullName };
}

async function loadSession() {
  const { data } = await sb.auth.getSession();
  state.user = data.session?.user || null;
  state.profile = null;
  if (state.user) {
    const { data: profile } = await sb.from('profiles').select('*').eq('id', state.user.id).maybeSingle();
    if (profile) {
      state.profile = profile;
    } else {
      const metadata = state.user.user_metadata || {};
      const extra = {
        full_name: metadata.full_name || '',
        phone: metadata.phone || '',
        company_name: metadata.company_name || '',
      };
      await bootstrapProfile(state.user, extra);
      const { data: createdProfile } = await sb.from('profiles').select('*').eq('id', state.user.id).maybeSingle();
      state.profile = createdProfile || { id: state.user.id, email: state.user.email, role: 'property_owner', subscription_status: 'trial', subscription_plan: 'free' };
    }
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
  const trialEnd = addDays(todayISO(), 14);
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
    subscription_end: trialEnd,
  };
  const { error: profileError } = await sb.from('profiles').upsert(profile, { onConflict: 'id' });
  if (profileError) return { error: profileError };
  const { data: existingSubscription, error: lookupError } = await sb
    .from('subscriptions')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();
  if (lookupError) return { error: lookupError };
  if (existingSubscription) return { error: null };
  const { error: subscriptionError } = await sb
    .from('subscriptions')
    .insert({ owner_id: user.id, plan: 'free', status: 'trial', start_date: todayISO(), end_date: trialEnd, price_monthly: 0 });
  return { error: subscriptionError };
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
      <button type="button" class="button button-fill button-large primary-btn" id="authAction">${mode === 'forgot' ? t('forgot') : isRegister ? t('register') : t('login')}</button>
      <div id="authFeedback" class="auth-feedback" hidden></div>
      <div class="auth-links"><a href="/forgot/">${t('forgot')}</a><span>•</span><a href="/">${t('login')}</a></div>
      <div class="launch-grid"><span>Tunisia</span><span>France</span><span>Germany</span><span>International</span></div>
    </div>
  </div></div>`;
}

const LoginPage = {
  template: authShell('login'),
  methods: { async submit() {
    setAuthFeedback();
    state.lang = authField('language').value; localStorage.setItem('lindastay.lang', state.lang); setDocumentLanguage();
    const form = validateAuthForm();
    if (form.error) return setAuthFeedback(form.error, 'error');
    setAuthBusy(true, 'Connexion...');
    try {
      const { error } = await sb.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) return setAuthFeedback(error.message, 'error');
      setAuthFeedback('Connexion réussie. Ouverture du tableau de bord...', 'success');
      await loadSession(); mainView.router.navigate(isAdmin() ? '/admin/' : '/home/');
    } catch (error) {
      setAuthFeedback(error.message || 'Connexion impossible. Vérifie internet puis réessaie.', 'error');
    } finally {
      setAuthBusy(false);
    }
  }},
  mounted() { authField('authAction').onclick = () => this.submit(); }
};

const RegisterPage = {
  template: authShell('register'),
  methods: { async submit() {
    setAuthFeedback();
    state.lang = authField('language').value; localStorage.setItem('lindastay.lang', state.lang); setDocumentLanguage();
    const form = validateAuthForm({ requireName: true });
    if (form.error) return setAuthFeedback(form.error, 'error');
    const extra = { full_name: form.fullName, phone: authValue('phone'), company_name: authValue('company') };
    setAuthBusy(true, 'Création du compte...');
    try {
      const { data, error } = await sb.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: extra, emailRedirectTo: `${location.origin}${APP_ROOT}` }
      });
      if (error) return setAuthFeedback(error.message, 'error');
      if (data.session && data.user) {
        const { error: profileError } = await bootstrapProfile(data.user, extra);
        if (profileError) return setAuthFeedback(profileError.message, 'error');
        await loadSession();
        setAuthFeedback('Compte créé. Ouverture du tableau de bord...', 'success');
        mainView.router.navigate('/home/');
        return;
      }
      setAuthFeedback('Compte créé. Vérifie ton email pour activer la connexion.', 'success');
      app.dialog.alert('Compte créé. Vérifie ton email pour activer la connexion.');
      mainView.router.navigate('/');
    } catch (error) {
      setAuthFeedback(error.message || 'Inscription impossible. Vérifie internet puis réessaie.', 'error');
    } finally {
      setAuthBusy(false);
    }
  }},
  mounted() { authField('authAction').onclick = () => this.submit(); }
};

const ForgotPage = {
  template: authShell('forgot'),
  methods: { async submit() {
    setAuthFeedback();
    state.lang = authField('language').value; localStorage.setItem('lindastay.lang', state.lang);
    const email = authValue('email');
    if (!email) return setAuthFeedback('Merci de saisir ton email.', 'error');
    setAuthBusy(true, 'Envoi...');
    try {
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}${APP_ROOT}` });
      setAuthFeedback(error ? error.message : 'Email envoyé.', error ? 'error' : 'success');
    } catch (error) {
      setAuthFeedback(error.message || 'Envoi impossible. Vérifie internet puis réessaie.', 'error');
    } finally {
      setAuthBusy(false);
    }
  }},
  mounted() { authField('authAction').onclick = () => this.submit(); }
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
        await scheduleDefaultMessages(created.data);
        mainView.router.navigate('/reservations/');
      });
    }
  },
  async mounted() { await requireAuth(); const [props, templatesResult] = await Promise.all([sb.from('properties').select('id,name').eq('owner_id', state.user.id).order('name'), sb.from('expense_templates').select('*').eq('owner_id', state.user.id).eq('is_active', true).order('created_at')]); const properties = props.data || []; const templates = templatesResult.data || []; this.properties = properties; this.templates = templates; this.$setState({ properties, templates }); propertyId.innerHTML = properties.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join(''); ['checkIn','checkOut','guestCount','totalPrice','depositPaid'].forEach(id => document.getElementById(id).oninput = () => this.calculate()); createReservation.onclick = () => this.createReservation(); this.calculate(); }
};
function expenseAmount(template, nights, guests) { const amount = Number(template.default_amount || 0); if (template.type === 'per_night') return amount * nights; if (template.type === 'per_guest') return amount * guests; if (template.type === 'manual') return 0; return amount; }

const WHATSAPP_TEMPLATE_META = {
  booking_confirmation: { name: 'Booking confirmation', icon: '✅' },
  arrival_reminder: { name: 'Arrival reminder J-1', icon: '🧳' },
  payment_reminder: { name: 'Payment reminder', icon: '💳' },
  checkout_message: { name: 'Check-out message', icon: '🚪' },
  thank_you: { name: 'Thank you message', icon: '🙏' },
  review_request: { name: 'Review request', icon: '⭐' },
};
const WHATSAPP_VARIABLES = ['guest_name','property_name','check_in_date','check_out_date','check_in_time','check_out_time','total_price','deposit_paid','remaining_balance','property_address','google_maps_link','wifi_name','wifi_password','house_rules','owner_phone'];
const DEFAULT_WHATSAPP_TEMPLATES = [
  { type: 'booking_confirmation', language: 'fr', body: 'Bonjour {guest_name}, votre réservation à {property_name} est confirmée du {check_in_date} au {check_out_date}. Total: {total_price}. Avance: {deposit_paid}. Reste: {remaining_balance}. Adresse: {property_address} {google_maps_link}' },
  { type: 'arrival_reminder', language: 'fr', body: 'Bonjour {guest_name}, rappel arrivée demain à {property_name}. Check-in à partir de {check_in_time}. Adresse: {property_address}. GPS: {google_maps_link}. WiFi: {wifi_name} / {wifi_password}. Règles: {house_rules}' },
  { type: 'payment_reminder', language: 'fr', body: 'Bonjour {guest_name}, petit rappel paiement pour {property_name}. Reste à payer: {remaining_balance} sur un total de {total_price}. Merci.' },
  { type: 'checkout_message', language: 'fr', body: 'Bonjour {guest_name}, le check-out de {property_name} est prévu à {check_out_time}. Merci de respecter les règles: {house_rules}. À bientôt.' },
  { type: 'thank_you', language: 'fr', body: 'Merci {guest_name} pour votre séjour à {property_name}. Nous espérons vous revoir bientôt. Contact propriétaire: {owner_phone}' },
  { type: 'review_request', language: 'fr', body: 'Bonjour {guest_name}, merci pour votre séjour à {property_name}. Pouvez-vous laisser un avis sur votre expérience ? Votre retour nous aide beaucoup.' },
  { type: 'booking_confirmation', language: 'en', body: 'Hello {guest_name}, your booking at {property_name} is confirmed from {check_in_date} to {check_out_date}. Total: {total_price}. Deposit: {deposit_paid}. Balance: {remaining_balance}. Address: {property_address} {google_maps_link}' },
  { type: 'arrival_reminder', language: 'en', body: 'Hello {guest_name}, arrival reminder for tomorrow at {property_name}. Check-in from {check_in_time}. Address: {property_address}. Map: {google_maps_link}. WiFi: {wifi_name} / {wifi_password}. Rules: {house_rules}' },
  { type: 'payment_reminder', language: 'en', body: 'Hello {guest_name}, payment reminder for {property_name}. Remaining balance: {remaining_balance} out of {total_price}. Thank you.' },
  { type: 'checkout_message', language: 'en', body: 'Hello {guest_name}, check-out from {property_name} is scheduled at {check_out_time}. Please follow the house rules: {house_rules}. See you soon.' },
  { type: 'thank_you', language: 'en', body: 'Thank you {guest_name} for staying at {property_name}. We hope to welcome you again soon. Owner contact: {owner_phone}' },
  { type: 'review_request', language: 'en', body: 'Hello {guest_name}, thank you for staying at {property_name}. Could you leave a review about your experience? Your feedback helps us a lot.' },
  { type: 'booking_confirmation', language: 'de', body: 'Hallo {guest_name}, Ihre Reservierung in {property_name} ist vom {check_in_date} bis {check_out_date} bestätigt. Gesamt: {total_price}. Anzahlung: {deposit_paid}. Restbetrag: {remaining_balance}. Adresse: {property_address} {google_maps_link}' },
  { type: 'arrival_reminder', language: 'de', body: 'Hallo {guest_name}, Erinnerung: Anreise morgen in {property_name}. Check-in ab {check_in_time}. Adresse: {property_address}. Karte: {google_maps_link}. WiFi: {wifi_name} / {wifi_password}. Regeln: {house_rules}' },
  { type: 'payment_reminder', language: 'de', body: 'Hallo {guest_name}, Zahlungserinnerung für {property_name}. Restbetrag: {remaining_balance} von {total_price}. Vielen Dank.' },
  { type: 'checkout_message', language: 'de', body: 'Hallo {guest_name}, Check-out aus {property_name} ist um {check_out_time}. Bitte beachten Sie die Hausregeln: {house_rules}. Bis bald.' },
  { type: 'thank_you', language: 'de', body: 'Danke {guest_name} für Ihren Aufenthalt in {property_name}. Wir hoffen, Sie bald wieder begrüßen zu dürfen. Kontakt: {owner_phone}' },
  { type: 'review_request', language: 'de', body: 'Hallo {guest_name}, danke für Ihren Aufenthalt in {property_name}. Können Sie eine Bewertung hinterlassen? Ihr Feedback hilft uns sehr.' },
  { type: 'booking_confirmation', language: 'ar', body: 'مرحباً {guest_name}، تم تأكيد حجزك في {property_name} من {check_in_date} إلى {check_out_date}. المجموع: {total_price}. العربون: {deposit_paid}. المتبقي: {remaining_balance}. العنوان: {property_address} {google_maps_link}' },
  { type: 'arrival_reminder', language: 'ar', body: 'مرحباً {guest_name}، تذكير بالوصول غداً إلى {property_name}. تسجيل الدخول من {check_in_time}. العنوان: {property_address}. الخريطة: {google_maps_link}. الواي فاي: {wifi_name} / {wifi_password}. القواعد: {house_rules}' },
  { type: 'payment_reminder', language: 'ar', body: 'مرحباً {guest_name}، تذكير بالدفع لحجز {property_name}. المبلغ المتبقي: {remaining_balance} من {total_price}. شكراً.' },
  { type: 'checkout_message', language: 'ar', body: 'مرحباً {guest_name}، موعد المغادرة من {property_name} هو {check_out_time}. يرجى احترام قواعد المنزل: {house_rules}. إلى اللقاء.' },
  { type: 'thank_you', language: 'ar', body: 'شكراً {guest_name} على إقامتك في {property_name}. نتمنى استقبالك مرة أخرى قريباً. هاتف المالك: {owner_phone}' },
  { type: 'review_request', language: 'ar', body: 'مرحباً {guest_name}، شكراً لإقامتك في {property_name}. هل يمكنك ترك تقييم عن تجربتك؟ رأيك يساعدنا كثيراً.' },
].map(template => ({ ...template, name: WHATSAPP_TEMPLATE_META[template.type].name, is_system: true, is_active: true }));

function localizedWhatsAppTemplates(language = state.lang) {
  return DEFAULT_WHATSAPP_TEMPLATES.filter(template => template.language === language);
}
function getDefaultWhatsAppTemplate(type, language = state.lang) {
  return DEFAULT_WHATSAPP_TEMPLATES.find(template => template.type === type && template.language === language) || DEFAULT_WHATSAPP_TEMPLATES.find(template => template.type === type && template.language === 'fr');
}
function messageVariableMap(reservation = {}, property = {}, guest = {}) {
  return {
    guest_name: guest.full_name || reservation.guest_name || '',
    property_name: property.name || reservation.properties?.name || '',
    check_in_date: reservation.check_in || '',
    check_out_date: reservation.check_out || '',
    check_in_time: property.check_in_time || '15:00',
    check_out_time: property.check_out_time || '11:00',
    total_price: money(reservation.total_price || 0),
    deposit_paid: money(reservation.deposit_paid || 0),
    remaining_balance: money(reservation.remaining_balance || 0),
    property_address: property.address || '',
    google_maps_link: property.google_maps_link || '',
    wifi_name: property.wifi_name || '',
    wifi_password: property.wifi_password || '',
    house_rules: property.house_rules || '',
    owner_phone: state.profile?.phone || '',
  };
}
function generateMessageFromTemplate(template, reservation, property = {}, guest = {}) {
  const variables = messageVariableMap(reservation, property, guest);
  const body = (template?.body || '').replace(/\{([a-z_]+)\}/g, (_, key) => variables[key] ?? '');
  return { body, variables };
}
function normalizePhone(phone = '') { return String(phone).replace(/\D/g, ''); }
async function openWhatsApp(phone, message) {
  const cleanPhone = normalizePhone(phone);
  if (!cleanPhone) return app.dialog.alert('Numéro WhatsApp manquant pour ce locataire.');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  if (window.Capacitor?.Plugins?.Browser?.open) return window.Capacitor.Plugins.Browser.open({ url });
  window.open(url, '_blank', 'noopener');
}
function scheduleAt(date, time = '18:00', offsetDays = 0) {
  const base = new Date(`${date}T${time}:00`);
  base.setDate(base.getDate() + offsetDays);
  return base.toISOString();
}
function scheduledDefinitions(reservation) {
  const definitions = [
    { type: 'booking_confirmation', scheduled_at: new Date().toISOString() },
    { type: 'arrival_reminder', scheduled_at: scheduleAt(reservation.check_in, '18:00', -1) },
    { type: 'thank_you', scheduled_at: scheduleAt(reservation.check_out, '12:00', 0) },
    { type: 'review_request', scheduled_at: scheduleAt(reservation.check_out, '12:00', 1) },
  ];
  if (Number(reservation.remaining_balance || 0) > 0) definitions.splice(2, 0, { type: 'payment_reminder', scheduled_at: scheduleAt(reservation.check_in, '18:00', -3) });
  return definitions;
}
async function scheduleDefaultMessages(reservation) {
  try {
    const { data: property } = await sb.from('properties').select('*').eq('id', reservation.property_id).maybeSingle();
    const { data: customTemplates } = await sb.from('message_templates').select('*').eq('owner_id', state.user.id).eq('language', state.lang).eq('is_active', true);
    const rows = scheduledDefinitions(reservation).map(definition => {
      const template = (customTemplates || []).find(item => item.type === definition.type) || getDefaultWhatsAppTemplate(definition.type, state.lang);
      const generated = generateMessageFromTemplate(template, reservation, property || {});
      return { owner_id: state.user.id, reservation_id: reservation.id, template_id: template?.id || null, guest_phone: reservation.guest_phone, generated_body: generated.body, scheduled_at: definition.scheduled_at, status: 'scheduled' };
    });
    if (rows.length) await sb.from('scheduled_messages').insert(rows);
  } catch (error) {
    console.warn('LindaStay WhatsApp scheduling skipped:', error.message || error);
  }
}
async function createMessageHistory({ reservation, template, generatedBody, status = 'sent' }) {
  const row = { owner_id: state.user.id, reservation_id: reservation?.id, template_id: template?.id || null, guest_phone: reservation?.guest_phone, generated_body: generatedBody, status, sent_at: status === 'sent' ? new Date().toISOString() : null };
  return sb.from('message_history').insert(row);
}
function whatsappPreviewUrl(reservationId, type) { return `/messages/preview/${reservationId}/${type}/`; }
function statusBadge(status) { return `<span class="status-badge ${status}">${esc(status)}</span>`; }
function renderTemplateCard(template, actions = '') {
  const meta = WHATSAPP_TEMPLATE_META[template.type] || { icon: '💬', name: template.name };
  return `<div class="message-template pro-template"><div class="template-top"><b>${meta.icon} ${esc(template.name || meta.name)}</b><span>${esc(template.language || state.lang).toUpperCase()}</span></div><p>${esc(template.body)}</p><div class="variable-strip">${WHATSAPP_VARIABLES.slice(0, 6).map(v => `<code>{${v}}</code>`).join('')}</div>${actions}</div>`;
}

const MessagePreviewPage = {
  template: pageShell('WhatsApp Preview', `<div class="whatsapp-preview-grid"><div id="previewMain" class="lux-card"></div><div id="previewVars" class="lux-card sticky-card"></div></div>`, 'settings'),
  async mounted() {
    await requireAuth();
    const params = this.$route.params || {};
    const type = params.type || 'booking_confirmation';
    const { data: reservation, error } = await sb.from('reservations').select('*, properties(*)').eq('owner_id', state.user.id).eq('id', params.reservationId).maybeSingle();
    if (error || !reservation) { previewMain.innerHTML = emptyState(error?.message || 'Réservation introuvable.'); return; }
    const property = reservation.properties || {};
    const { data: customTemplate } = await sb.from('message_templates').select('*').eq('owner_id', state.user.id).eq('type', type).eq('language', state.lang).eq('is_active', true).order('created_at', { ascending: false }).limit(1).maybeSingle();
    const template = customTemplate || getDefaultWhatsAppTemplate(type, state.lang);
    const generated = generateMessageFromTemplate(template, reservation, property);
    previewMain.innerHTML = `<div class="preview-head"><div><p class="eyebrow">WhatsApp</p><h2>${esc(template.name || WHATSAPP_TEMPLATE_META[type]?.name || type)}</h2><p>${esc(reservation.guest_name)} · ${esc(reservation.guest_phone || 'Téléphone manquant')}</p></div><div class="wa-logo">☘</div></div><div class="wa-message-preview">${esc(generated.body).replace(/\n/g, '<br>')}</div><button id="sendPreviewWhatsApp" class="button button-fill whatsapp-btn">Send on WhatsApp</button>`;
    previewVars.innerHTML = `<h3>Variables used</h3>${Object.entries(generated.variables).map(([key, value]) => `<div class="forecast-line"><span>{${key}}</span><b>${esc(value || '—')}</b></div>`).join('')}`;
    sendPreviewWhatsApp.onclick = async () => {
      const history = await createMessageHistory({ reservation, template, generatedBody: generated.body, status: 'sent' });
      if (history.error) app.dialog.alert(history.error.message);
      await openWhatsApp(reservation.guest_phone, generated.body);
    };
  }
};

const ReservationsPage = {
  template: pageShell(t('reservations'), `<div class="section-header"><h2>${t('reservations')}</h2><a href="/reservations/new/" class="button button-fill">${t('newReservation')}</a></div><div id="reservationsList" class="lux-card"></div>`, 'new'),
  async mounted() {
    await requireAuth();
    const { data } = await sb.from('reservations').select('*, properties(name)').eq('owner_id', state.user.id).order('check_in', { ascending: false });
    reservationsList.innerHTML = (data || []).length ? data.map(r => `<div class="reservation-row reservation-row-actions"><div><b>${esc(r.guest_name)}</b><span>${esc(r.properties?.name || '')} · ${r.check_in} → ${r.check_out} · ${r.nights} nights</span><small>${esc(r.guest_phone || '')}</small></div><div><strong>${money(r.total_price)}</strong><small>${t('remaining')}: ${money(r.remaining_balance)}</small><div class="quick-actions"><a href="${whatsappPreviewUrl(r.id, 'booking_confirmation')}" class="button button-small whatsapp-outline">Confirmation</a><a href="${whatsappPreviewUrl(r.id, 'arrival_reminder')}" class="button button-small whatsapp-outline">Arrival info</a><a href="${whatsappPreviewUrl(r.id, 'payment_reminder')}" class="button button-small whatsapp-outline">Payment</a><a href="${whatsappPreviewUrl(r.id, 'thank_you')}" class="button button-small whatsapp-outline">Thank you</a></div></div></div>`).join('') : emptyState('Aucune réservation.');
  }
};

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
  template: pageShell('WhatsApp Automation', `<div class="section-header"><h2>WhatsApp Automation</h2><a href="/reservations/" class="button button-fill whatsapp-btn">Quick actions</a></div><div class="whatsapp-tabs"><button class="wa-tab active" data-tab="predefined">Predefined templates</button><button class="wa-tab" data-tab="custom">Custom templates</button><button class="wa-tab" data-tab="history">Message history</button></div><div id="messagesRoot"></div>`, 'settings'),
  data() { return { customTemplates: [], scheduled: [], history: [] }; },
  methods: {
    switchTab(tab) {
      document.querySelectorAll('.wa-tab').forEach(button => button.classList.toggle('active', button.dataset.tab === tab));
      if (tab === 'predefined') this.renderPredefined();
      if (tab === 'custom') this.renderCustom();
      if (tab === 'history') this.renderHistory();
    },
    renderPredefined() {
      const templates = localizedWhatsAppTemplates(state.lang);
      messagesRoot.innerHTML = `<div class="lux-card"><div class="card-title-row"><h3>Predefined templates · ${state.lang.toUpperCase()}</h3><span class="status-badge scheduled">${WHATSAPP_VARIABLES.length} variables</span></div><div class="template-grid">${templates.map(template => renderTemplateCard(template)).join('')}</div></div><div class="lux-card"><h3>Automation schedule</h3><div class="schedule-grid"><div><b>Confirmation</b><span>Immediately after reservation confirmation</span></div><div><b>Arrival reminder</b><span>1 day before check-in at 18:00</span></div><div><b>Payment reminder</b><span>3 days before check-in if balance &gt; 0</span></div><div><b>Thank you</b><span>After check-out at 12:00</span></div><div><b>Review request</b><span>1 day after check-out</span></div></div></div>`;
    },
    renderCustom() {
      const options = Object.entries(WHATSAPP_TEMPLATE_META).map(([type, meta]) => `<option value="${type}">${esc(meta.name)}</option>`).join('');
      messagesRoot.innerHTML = `<div class="content-grid two-col"><div class="lux-card"><h3>Create custom template</h3><div class="list form-list"><ul>${input('customTemplateName','text','Template name')}<li><a class="item-link smart-select smart-select-init"><select id="customTemplateType">${options}</select><div class="item-content"><div class="item-inner"><div class="item-title">Type</div></div></div></a></li><li><a class="item-link smart-select smart-select-init"><select id="customTemplateLang">${['fr','en','de','ar'].map(lang => `<option value="${lang}" ${lang === state.lang ? 'selected' : ''}>${lang.toUpperCase()}</option>`).join('')}</select><div class="item-content"><div class="item-inner"><div class="item-title">Language</div></div></div></a></li>${textarea('customTemplateBody','Message body')}</ul></div><div class="variable-strip full">${WHATSAPP_VARIABLES.map(v => `<code>{${v}}</code>`).join('')}</div><button id="saveCustomTemplate" class="button button-fill primary-btn">${t('save')}</button></div><div class="lux-card"><h3>Custom templates</h3><div id="customTemplatesList">${this.customTemplates.length ? this.customTemplates.map(template => renderTemplateCard(template, `<button class="button button-small button-outline" onclick="window.lindaStayMessageActions.disableTemplate('${template.id}')">Disable</button>`)).join('') : emptyState('Aucun modèle personnalisé.')}</div></div></div>`;
      saveCustomTemplate.onclick = () => this.saveCustomTemplate();
    },
    renderHistory() {
      const scheduledRows = this.scheduled.map(row => messageHistoryRow(row, 'scheduled'));
      const historyRows = this.history.map(row => messageHistoryRow(row, 'history'));
      messagesRoot.innerHTML = `<div class="content-grid two-col"><div class="lux-card"><h3>Scheduled messages</h3>${scheduledRows.length ? scheduledRows.join('') : emptyState('Aucun message programmé.')}</div><div class="lux-card"><h3>Message history</h3>${historyRows.length ? historyRows.join('') : emptyState('Aucun message envoyé.')}</div></div>`;
    },
    async saveCustomTemplate() {
      await guardedWrite(async () => {
        const row = { owner_id: state.user.id, name: customTemplateName.value, type: customTemplateType.value, language: customTemplateLang.value, body: customTemplateBody.value, is_system: false, is_active: true };
        const { error } = await sb.from('message_templates').insert(row);
        if (error) return app.dialog.alert(error.message);
        await this.loadData();
        this.renderCustom();
      });
    },
    async disableTemplate(id) {
      const { error } = await sb.from('message_templates').update({ is_active: false }).eq('owner_id', state.user.id).eq('id', id);
      if (error) return app.dialog.alert(error.message);
      await this.loadData();
      this.renderCustom();
    },
    async loadData() {
      const [custom, scheduled, history] = await Promise.all([
        sb.from('message_templates').select('*').eq('owner_id', state.user.id).eq('is_active', true).order('created_at', { ascending: false }),
        sb.from('scheduled_messages').select('*, reservations(guest_name,check_in,check_out,properties(name)), message_templates(name,type)').eq('owner_id', state.user.id).order('scheduled_at', { ascending: true }),
        sb.from('message_history').select('*, reservations(guest_name,check_in,check_out,properties(name)), message_templates(name,type)').eq('owner_id', state.user.id).order('created_at', { ascending: false }).limit(50),
      ]);
      if (custom.error || scheduled.error || history.error) {
        messagesRoot.innerHTML = `<div class="lux-card">${emptyState((custom.error || scheduled.error || history.error).message + ' · Lance la mise à jour supabase/schema.sql pour activer le module WhatsApp.')}</div>`;
        return false;
      }
      this.customTemplates = custom.data || [];
      this.scheduled = scheduled.data || [];
      this.history = history.data || [];
      return true;
    }
  },
  async mounted() {
    await requireAuth();
    window.lindaStayMessageActions = { disableTemplate: id => this.disableTemplate(id) };
    const loaded = await this.loadData();
    if (!loaded) return;
    document.querySelectorAll('.wa-tab').forEach(button => button.onclick = () => this.switchTab(button.dataset.tab));
    this.renderPredefined();
  }
};
function messageHistoryRow(row, source) {
  const reservation = row.reservations || {};
  const template = row.message_templates || {};
  const date = source === 'scheduled' ? row.scheduled_at : row.sent_at || row.created_at;
  const title = template.name || WHATSAPP_TEMPLATE_META[template.type]?.name || 'WhatsApp message';
  return `<div class="message-history-row"><div><b>${esc(reservation.guest_name || 'Guest')}</b><span>${esc(title)} · ${esc(reservation.properties?.name || '')}</span><small>${esc(reservation.check_in || '')} → ${esc(reservation.check_out || '')}</small></div><div>${statusBadge(row.status)}<small>${date ? new Date(date).toLocaleString() : '—'}</small></div></div>`;
}

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

try {
  app = new Framework7({
    root: '#app', name: 'LindaStay', theme: 'ios', init: false,
    routes: [
    { path: '/', component: LoginPage }, { path: '/register/', component: RegisterPage }, { path: '/forgot/', component: ForgotPage },
    { path: '/home/', component: DashboardPage }, { path: '/calendar/', component: CalendarPage }, { path: '/reservations/', component: ReservationsPage }, { path: '/reservations/new/', component: ReservationNewPage },
    { path: '/properties/', component: PropertiesPage }, { path: '/expenses-settings/', component: ExpenseSettingsPage }, { path: '/guide/', component: GuidePage }, { path: '/messages/', component: MessagesPage }, { path: '/messages/preview/:reservationId/:type/', component: MessagePreviewPage }, { path: '/settings/', component: SettingsPage }, { path: '/profile/', component: ProfilePage }, { path: '/support/', component: SupportPage }, { path: '/admin/', component: AdminPage },
    ]
  });
  mainView = app.views.create('.view-main', { url: getInitialRoute() });
  app.init();
  loadSession()
    .then(() => { if (state.user) mainView.router.navigate(isAdmin() ? '/admin/' : '/home/', { reloadCurrent: true }); })
    .catch(error => console.warn('LindaStay session bootstrap failed:', error.message || error));
} catch (error) {
  console.error('LindaStay boot failed:', error);
  renderBootError(`LindaStay n’a pas pu démarrer. ${error.message || 'Recharge la page.'}`);
}

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
