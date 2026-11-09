export function invitationCode(url) {
  try {
    const values = new URL(url).searchParams.getAll('code');
    if (values.length !== 1) return null;
    const code = values[0].trim().toUpperCase();
    return /^[A-HJ-NP-Z2-9]{8}$/.test(code) ? code : null;
  } catch { return null; }
}

export function appIntent(code, fallback) {
  if (!/^[A-HJ-NP-Z2-9]{8}$/.test(code)) throw new Error('Ongeldige kamercode');
  return `intent://join/${code}#Intent;scheme=eenendertigen;package=nl.vergersstudio.eenendertigen;S.browser_fallback_url=${encodeURIComponent(fallback)};end`;
}

if (typeof document !== 'undefined') {
  const code = invitationCode(window.location.href);
  const status = document.querySelector('#status');
  if (code) {
    document.querySelector('#code').textContent = code;
    const open = document.querySelector('#open');
    open.href = appIntent(code, window.location.href);
    open.removeAttribute('aria-disabled');
    const copy = document.querySelector('#copy');
    copy.disabled = false;
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(code); status.textContent = 'Gekopieerd. Tot aan tafel!'; }
      catch { status.textContent = `Vul deze code handmatig in: ${code}`; }
    });
  } else status.textContent = 'Deze uitnodiging bevat geen geldige kamercode. Vraag een nieuwe link aan de afzender.';
}
