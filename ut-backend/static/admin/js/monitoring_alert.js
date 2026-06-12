/* UrbanTrends admin — monitoring alert banner */
(function () {
  'use strict';

  var POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes
  var BANNER_ID     = 'ut-monitoring-banner';

  function checkAlerts() {
    fetch('/api/cms/monitoring-alert', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;
        var existing = document.getElementById(BANNER_ID);
        if (!data.alerts || data.alerts.length === 0) {
          if (existing) existing.remove();
          return;
        }
        if (!existing) renderBanner(data.alerts, data.checked_at);
      })
      .catch(function () {});
  }

  function renderBanner(alerts, checkedAt) {
    var names = alerts.map(function (a) {
      return '<strong>' + escHtml(a.name) + '</strong> <span style="opacity:.8">(' + escHtml(a.status) + ')</span>';
    }).join(' &nbsp;·&nbsp; ');

    var time = checkedAt ? ' &nbsp;<span style="opacity:.6;font-size:11px;">last checked ' + new Date(checkedAt).toLocaleTimeString() + '</span>' : '';

    var banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.innerHTML =
      '<div style="background:#7f1d1d;color:#fef2f2;padding:11px 20px;' +
      'display:flex;align-items:center;justify-content:space-between;gap:16px;' +
      'font-size:13px;font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif;' +
      'position:sticky;top:0;z-index:99999;border-bottom:1px solid rgba(255,255,255,.12);">' +
        '<span style="display:flex;align-items:center;gap:8px;">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" stroke-width="2.2" stroke-linecap="round" style="flex-shrink:0">' +
            '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>' +
            '<line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' +
          '</svg>' +
          '<span>Service alert: ' + names + time + '</span>' +
          '&nbsp;<a href="/admin/cms/servicestatus/" style="color:#fca5a5;text-decoration:underline;font-weight:600;">View details</a>' +
        '</span>' +
        '<button onclick="document.getElementById(\'' + BANNER_ID + '\').remove()" ' +
          'style="background:transparent;border:1px solid rgba(255,200,200,.35);color:#fca5a5;' +
          'padding:4px 12px;border-radius:5px;cursor:pointer;font-size:12px;white-space:nowrap;">' +
          'Dismiss' +
        '</button>' +
      '</div>';

    document.body.prepend(banner);
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Run on load + poll every 5 min
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAlerts);
  } else {
    checkAlerts();
  }
  setInterval(checkAlerts, POLL_INTERVAL);
})();
