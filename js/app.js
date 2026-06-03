const sb = window.supabase.createClient(
  window.LINDASTAY_SUPABASE_URL,
  window.LINDASTAY_SUPABASE_ANON_KEY
);

let currentUser = null;
let currentProfile = null;

let app = null;
let mainView = null;

function money(value) { return `${Number(value || 0).toFixed(2)} DT`; }
function todayISO() { return new Date().toISOString().slice(0,10); }
function nightsBetween(start, end) {
  if (!start || !end) return 0;
  const a = new Date(start); const b = new Date(end);
  return Math.max(0, Math.round((b - a) / 86400000));
}
function isSubscriptionActive(profile) {
  if (!profile) return false;
  if (profile.role === 'admin') return true;
  return profile.subscription_status === 'active' && (!profile.subscription_end || profile.subscription_end >= todayISO());
}
async function loadSession() {
  const { data } = await sb.auth.getSession();
  currentUser = data.session?.user || null;
  if (currentUser) {
    const { data: profile } = await sb.from('profiles').select('*').eq('id', currentUser.id).single();
    currentProfile = profile;
  }
}
async function refreshRoute() { await loadSession(); mainView.router.refreshPage(); }

const LoginPage = {
  template: `
  <div class="page">
    <div class="page-content login-screen-content block">
      <div class="logo">LindaStay</div>
      <div class="subtitle">Gestion simple des maisons de vacances</div>
      <div class="list no-hairlines-md">
        <ul>
          <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Email</div><div class="item-input-wrap"><input id="email" type="email" placeholder="email"></div></div></li>
          <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Mot de passe</div><div class="item-input-wrap"><input id="password" type="password" placeholder="mot de passe"></div></div></li>
        </ul>
      </div>
      <button class="button button-fill button-large" @click="login">Connexion</button>
      <br>
      <button class="button button-outline" @click="register">Créer un compte propriétaire</button>
      <p class="small-muted">Le premier admin doit être défini manuellement dans Supabase: profiles.role = 'admin'.</p>
    </div>
  </div>`,
  methods: {
    async login() {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) return app.dialog.alert(error.message);
      await loadSession();
      mainView.router.navigate(currentProfile?.role === 'admin' ? '/admin/' : '/home/');
    },
    async register() {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const { data, error } = await sb.auth.signUp({ email, password });
      if (error) return app.dialog.alert(error.message);
      if (data.user) {
        await sb.from('profiles').insert({ id: data.user.id, email, role:'owner', subscription_status:'trial', subscription_end: todayISO() });
      }
      app.dialog.alert('Compte créé. Connecte-toi maintenant.');
    }
  }
};

const HomePage = {
  template: `
  <div class="page">
    <div class="navbar"><div class="navbar-bg"></div><div class="navbar-inner"><div class="title">LindaStay</div><div class="right"><a class="link" @click="logout">Sortir</a></div></div></div>
    <div class="toolbar tabbar toolbar-bottom">
      <div class="toolbar-inner">
        <a href="/home/" class="tab-link tab-link-active">Accueil</a>
        <a href="/houses/" class="tab-link">Maisons</a>
        <a href="/bookings/" class="tab-link">Réservations</a>
        <a href="/expenses-settings/" class="tab-link">Dépenses</a>
      </div>
    </div>
    <div class="page-content block">
      <div class="stat-card"><div class="stat-label">Abonnement</div><div class="stat-number">{{subText}}</div></div>
      <div class="stat-card"><div class="stat-label">Réservations</div><div class="stat-number">{{stats.bookings}}</div></div>
      <div class="stat-card"><div class="stat-label">Revenus</div><div class="stat-number">{{money(stats.revenue)}}</div></div>
      <div class="stat-card"><div class="stat-label">Dépenses</div><div class="stat-number">{{money(stats.expenses)}}</div></div>
      <div class="stat-card"><div class="stat-label">Bénéfice net</div><div class="stat-number">{{money(stats.revenue - stats.expenses)}}</div></div>
      <button class="button button-fill" @click="goBookings">Ajouter une réservation</button>
    </div>
  </div>`,
  data() { return { stats:{ bookings:0, revenue:0, expenses:0 }, subText:'...' }; },
  methods: {
    money, goBookings(){ mainView.router.navigate('/bookings/'); },
    async logout(){ await sb.auth.signOut(); mainView.router.navigate('/'); }
  },
  async mounted() {
    await loadSession();
    if (!currentUser) return mainView.router.navigate('/');
    this.$setState({ subText: isSubscriptionActive(currentProfile) ? 'Actif' : 'Expiré / essai terminé' });
    const { data: bookings } = await sb.from('bookings').select('id,total_amount').eq('owner_id', currentUser.id);
    const ids = (bookings || []).map(b=>b.id);
    let expensesTotal = 0;
    if (ids.length) {
      const { data: exp } = await sb.from('reservation_expenses').select('amount').in('booking_id', ids);
      expensesTotal = (exp || []).reduce((s,e)=>s+Number(e.amount||0),0);
    }
    this.$setState({ stats:{ bookings:(bookings||[]).length, revenue:(bookings||[]).reduce((s,b)=>s+Number(b.total_amount||0),0), expenses:expensesTotal } });
  }
};

const HousesPage = {
  template: `
  <div class="page">
    <div class="navbar"><div class="navbar-bg"></div><div class="navbar-inner"><div class="left"><a href="/home/" class="link back">Retour</a></div><div class="title">Mes maisons</div></div></div>
    <div class="page-content block">
      <div class="list"><ul>
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Nom maison</div><div class="item-input-wrap"><input id="houseName"></div></div></li>
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Adresse</div><div class="item-input-wrap"><input id="houseAddress"></div></div></li>
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Google Maps</div><div class="item-input-wrap"><input id="houseGps"></div></div></li>
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Prix par nuit</div><div class="item-input-wrap"><input id="housePrice" type="number"></div></div></li>
      </ul></div>
      <button class="button button-fill" @click="addHouse">Ajouter maison</button>
      <div class="list media-list"><ul>{{#each houses}}<li><div class="item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">{{name}}</div><div class="item-after">{{default_price}} DT</div></div><div class="item-subtitle">{{address}}</div><div class="item-text">{{gps_link}}</div></div></div></li>{{else}}<div class="empty">Aucune maison</div>{{/each}}</ul></div>
    </div>
  </div>`,
  data(){ return { houses:[] }; },
  methods:{
    async addHouse(){
      await loadSession();
      const row = { owner_id:currentUser.id, name:houseName.value, address:houseAddress.value, gps_link:houseGps.value, default_price:Number(housePrice.value||0) };
      const { error } = await sb.from('houses').insert(row);
      if (error) return app.dialog.alert(error.message);
      mainView.router.refreshPage();
    }
  },
  async mounted(){ await loadSession(); const { data } = await sb.from('houses').select('*').eq('owner_id', currentUser.id).order('created_at',{ascending:false}); this.$setState({houses:data||[]}); }
};

const BookingsPage = {
  template: `
  <div class="page">
    <div class="navbar"><div class="navbar-bg"></div><div class="navbar-inner"><div class="left"><a href="/home/" class="link back">Retour</a></div><div class="title">Réservations</div></div></div>
    <div class="page-content block">
      {{#unless active}}<div class="stat-card"><b>Accès limité</b><br>Ton abonnement n'est pas actif. Contacte l'admin.</div>{{/unless}}
      <div class="list"><ul>
        <li><a class="item-link smart-select smart-select-init" data-open-in="popover"><select id="houseId">{{#each houses}}<option value="{{id}}">{{name}}</option>{{/each}}</select><div class="item-content"><div class="item-inner"><div class="item-title">Maison</div></div></div></a></li>
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Client</div><div class="item-input-wrap"><input id="guestName"></div></div></li>
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Téléphone</div><div class="item-input-wrap"><input id="guestPhone"></div></div></li>
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Arrivée</div><div class="item-input-wrap"><input id="checkIn" type="date"></div></div></li>
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Départ</div><div class="item-input-wrap"><input id="checkOut" type="date"></div></div></li>
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Personnes</div><div class="item-input-wrap"><input id="guests" type="number" value="1"></div></div></li>
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Total</div><div class="item-input-wrap"><input id="total" type="number"></div></div></li>
        <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Avance</div><div class="item-input-wrap"><input id="deposit" type="number"></div></div></li>
      </ul></div>
      <button class="button button-fill" @click="addBooking" {{#unless active}}disabled{{/unless}}>Ajouter + générer dépenses</button>
      <div class="list media-list"><ul>{{#each bookings}}<li><div class="item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">{{guest_name}}</div><div class="item-after money">{{total_amount}} DT</div></div><div class="item-subtitle">{{check_in}} → {{check_out}}</div><div class="item-text">Avance: {{deposit_amount}} DT | Reste: {{remaining_amount}} DT | Dépenses: {{expenses_total}} DT | Net: {{net_total}} DT</div><p><a class="button button-small button-outline" href="https://wa.me/{{guest_phone}}?text={{whatsapp_text}}" external>WhatsApp arrivée</a></p></div></div></li>{{else}}<div class="empty">Aucune réservation</div>{{/each}}</ul></div>
    </div>
  </div>`,
  data(){ return { houses:[], bookings:[], active:false }; },
  methods:{
    async addBooking(){
      await loadSession();
      const booking = { owner_id:currentUser.id, house_id:houseId.value, guest_name:guestName.value, guest_phone:guestPhone.value, check_in:checkIn.value, check_out:checkOut.value, guests_count:Number(guests.value||1), total_amount:Number(total.value||0), deposit_amount:Number(deposit.value||0), remaining_amount:Number(total.value||0)-Number(deposit.value||0), status:'confirmed' };
      const { data, error } = await sb.from('bookings').insert(booking).select().single();
      if (error) return app.dialog.alert(error.message);
      await generateAutoExpenses(data);
      mainView.router.refreshPage();
    }
  },
  async mounted(){
    await loadSession();
    const active = isSubscriptionActive(currentProfile);
    const { data: houses } = await sb.from('houses').select('*').eq('owner_id', currentUser.id);
    const { data: bookings } = await sb.from('bookings').select('*, houses(name,address,gps_link)').eq('owner_id', currentUser.id).order('created_at',{ascending:false});
    const ids = (bookings||[]).map(b=>b.id);
    let expenses = [];
    if (ids.length) { const r = await sb.from('reservation_expenses').select('*').in('booking_id', ids); expenses = r.data || []; }
    const enriched = (bookings||[]).map(b=>{
      const expTotal = expenses.filter(e=>e.booking_id===b.id).reduce((s,e)=>s+Number(e.amount||0),0);
      const text = encodeURIComponent(`Bonjour ${b.guest_name}, votre arrivée est prévue le ${b.check_in}. Adresse: ${b.houses?.address || ''}. GPS: ${b.houses?.gps_link || ''}. Merci.`);
      return { ...b, expenses_total: expTotal.toFixed(2), net_total:(Number(b.total_amount||0)-expTotal).toFixed(2), whatsapp_text:text };
    });
    this.$setState({houses:houses||[], bookings:enriched, active});
  }
};

async function generateAutoExpenses(booking){
  const { data: settings } = await sb.from('expense_settings').select('*').eq('owner_id', booking.owner_id).eq('is_active', true);
  const nights = nightsBetween(booking.check_in, booking.check_out);
  const rows = (settings||[]).map(s=>{
    let amount = Number(s.default_amount||0);
    if (s.calculation_type === 'per_night') amount *= nights;
    if (s.calculation_type === 'per_person') amount *= Number(booking.guests_count||1);
    return { owner_id: booking.owner_id, booking_id: booking.id, name:s.name, category:s.category, amount, note:'Générée automatiquement' };
  }).filter(r=>r.amount>0);
  if (rows.length) await sb.from('reservation_expenses').insert(rows);
}

const ExpenseSettingsPage = {
  template: `
  <div class="page"><div class="navbar"><div class="navbar-bg"></div><div class="navbar-inner"><div class="left"><a href="/home/" class="link back">Retour</a></div><div class="title">Dépenses intelligentes</div></div></div>
  <div class="page-content block">
    <div class="list"><ul>
      <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Nom</div><div class="item-input-wrap"><input id="expName" placeholder="Ménage"></div></div></li>
      <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Catégorie</div><div class="item-input-wrap"><input id="expCat" placeholder="Service"></div></div></li>
      <li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Montant par défaut</div><div class="item-input-wrap"><input id="expAmount" type="number"></div></div></li>
      <li><a class="item-link smart-select smart-select-init"><select id="expType"><option value="fixed">Fixe par réservation</option><option value="per_night">Par nuit</option><option value="per_person">Par personne</option><option value="manual">Manuel</option></select><div class="item-content"><div class="item-inner"><div class="item-title">Type</div></div></div></a></li>
    </ul></div>
    <button class="button button-fill" @click="addSetting">Ajouter paramètre</button>
    <div class="list media-list"><ul>{{#each settings}}<li><div class="item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">{{name}}</div><div class="item-after">{{default_amount}} DT</div></div><div class="item-subtitle">{{category}} - {{calculation_type}}</div></div></div></li>{{else}}<div class="empty">Aucune dépense paramétrée</div>{{/each}}</ul></div>
  </div></div>`,
  data(){ return { settings:[] }; },
  methods:{ async addSetting(){ await loadSession(); const row={owner_id:currentUser.id,name:expName.value,category:expCat.value,default_amount:Number(expAmount.value||0),calculation_type:expType.value,is_active:true}; const {error}=await sb.from('expense_settings').insert(row); if(error) return app.dialog.alert(error.message); mainView.router.refreshPage(); } },
  async mounted(){ await loadSession(); const {data}=await sb.from('expense_settings').select('*').eq('owner_id',currentUser.id).order('created_at',{ascending:false}); this.$setState({settings:data||[]}); }
};

const AdminPage = {
  template: `
  <div class="page"><div class="navbar"><div class="navbar-bg"></div><div class="navbar-inner"><div class="title">Admin LindaStay</div><div class="right"><a class="link" @click="logout">Sortir</a></div></div></div>
  <div class="page-content block">
    <div class="stat-card"><div class="stat-label">Utilisateurs</div><div class="stat-number">{{profiles.length}}</div></div>
    <div class="list media-list"><ul>{{#each profiles}}<li><div class="item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">{{email}}</div><div class="item-after">{{subscription_status}}</div></div><div class="item-subtitle">{{role}} | Fin: {{subscription_end}}</div><p><button class="button button-small button-fill" @click="../activate('{{id}}')">Activer 1 mois</button></p><p><button class="button button-small button-outline" @click="../expire('{{id}}')">Expirer</button></p></div></div></li>{{/each}}</ul></div>
  </div></div>`,
  data(){ return {profiles:[]}; },
  methods:{
    async logout(){ await sb.auth.signOut(); mainView.router.navigate('/'); },
    async activate(id){ const d=new Date(); d.setMonth(d.getMonth()+1); await sb.from('profiles').update({subscription_status:'active', subscription_end:d.toISOString().slice(0,10)}).eq('id',id); mainView.router.refreshPage(); },
    async expire(id){ await sb.from('profiles').update({subscription_status:'expired', subscription_end:todayISO()}).eq('id',id); mainView.router.refreshPage(); }
  },
  async mounted(){ await loadSession(); if(currentProfile?.role!=='admin') return mainView.router.navigate('/home/'); const {data}=await sb.from('profiles').select('*').order('created_at',{ascending:false}); this.$setState({profiles:data||[]}); }
};

app = new Framework7({
  el: '#app',
  name: 'LindaStay',
  theme: 'auto',
  routes: [
    { path: '/', component: LoginPage },
    { path: '/home/', component: HomePage },
    { path: '/houses/', component: HousesPage },
    { path: '/bookings/', component: BookingsPage },
    { path: '/expenses-settings/', component: ExpenseSettingsPage },
    { path: '/admin/', component: AdminPage },
  ],
});

mainView = app.views.create('.view-main');

loadSession().then(()=>{ if(currentUser) mainView.router.navigate(currentProfile?.role === 'admin' ? '/admin/' : '/home/'); });
