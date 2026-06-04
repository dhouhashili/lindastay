(function () {
  const SCRIPT_TIMEOUT_MS = 8000;

  function showBootError(message) {
    const appRoot = document.getElementById('app');
    if (!appRoot) return;
    appRoot.innerHTML = '<div class="boot-error" role="alert">' +
      '<div class="brand-mark">LS</div>' +
      '<h1>LindaStay</h1>' +
      '<p>' + message + '</p>' +
      '<button type="button" onclick="window.location.reload()">Reessayer</button>' +
    '</div>';
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      let settled = false;

      function finish(error) {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        script.onload = null;
        script.onerror = null;
        if (error) reject(error);
        else resolve();
      }

      const timer = window.setTimeout(() => {
        finish(new Error('Timeout while loading ' + src));
      }, SCRIPT_TIMEOUT_MS);

      script.src = src;
      script.onload = () => finish();
      script.onerror = () => finish(new Error('Unable to load ' + src));
      document.head.appendChild(script);
    });
  }

  async function bootLindaStay() {
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/framework7@5.7.14/js/framework7.bundle.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');

      if (!window.Framework7 || !window.supabase) {
        throw new Error('Required libraries are missing');
      }

      await loadScript('js/config.js?v=20260604-1');
      await loadScript('js/app.js?v=20260605-1');
      window.setTimeout(() => {
        if (document.getElementById('bootStatus') && !document.querySelector('.view-main .page')) {
          showBootError('L application ne s est pas initialisee. Recharge avec Ctrl+F5, desactive le service worker/cache du navigateur, ou utilise un serveur local sans cache.');
        }
      }, 10000);
    } catch (error) {
      console.error(error);
      showBootError('Framework7 ou Supabase ne se charge pas. Verifie la connexion internet, un bloqueur, ou l acces a cdn.jsdelivr.net.');
    }
  }

  bootLindaStay();
})();
