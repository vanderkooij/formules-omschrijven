/**
 * keyboard.js — Rekenmachinebalk voor Formules Omschrijven
 * Gebruik: const kb = initKeyboard(inputId, groups, opts)
 * opts: { containerId, subIndicatorId }
 * Geeft terug: { setSubMode(bool), isSubMode() }
 */
function initKeyboard(inputId, groups, opts) {
  opts = opts || {};
  const containerId    = opts.containerId    || 'calc-groups';
  const subIndicatorId = opts.subIndicatorId || 'sub-indicator';
  let _subMode = false;

  function insertAt(sym) {
    const inp = document.getElementById(inputId);
    if (!inp || inp.readOnly) return;
    const s = inp.selectionStart, e = inp.selectionEnd;
    inp.value = inp.value.slice(0, s) + sym + inp.value.slice(e);
    inp.selectionStart = inp.selectionEnd = s + sym.length;
    inp.focus();
  }

  function setSubMode(on) {
    _subMode = on;
    const ind = document.getElementById(subIndicatorId);
    if (ind) ind.classList.toggle('visible', on);
    const subBtn = (groups || []).flatMap(g => g.btns).find(b => b.v === '_');
    if (subBtn && subBtn.id) {
      const el = document.getElementById(subBtn.id);
      if (el) el.classList.toggle('sub-active', on);
    }
  }

  function handleBtn(b) {
    const inp = document.getElementById(inputId);
    if (!inp || inp.readOnly) return;
    if (b.v === null) { setSubMode(false); inp.focus(); return; }
    if (b.v === '_') { insertAt('_'); setSubMode(true); }
    else { insertAt(b.v); if (_subMode && '+-*/()^= '.includes(b.v)) setSubMode(false); }
    if (typeof onInputChange === 'function') onInputChange();
  }

  const wrap = document.getElementById(containerId);
  if (wrap) {
    wrap.innerHTML = '';
    (groups || []).forEach((g, gi) => {
      if (gi > 0) {
        const sep = document.createElement('div');
        sep.className = 'calc-group-sep';
        wrap.appendChild(sep);
      }
      const grp = document.createElement('div');
      grp.className = 'calc-group';
      const lbl = document.createElement('span');
      lbl.className = 'calc-group-label';
      lbl.textContent = g.label;
      grp.appendChild(lbl);
      g.btns.forEach(b => {
        const el = document.createElement('button');
        el.className = 'calc-btn';
        el.type = 'button';
        el.textContent = b.l;
        if (b.id) el.id = b.id;
        el.addEventListener('click', () => handleBtn(b));
        grp.appendChild(el);
      });
      wrap.appendChild(grp);
    });
  }

  return { setSubMode, isSubMode: () => _subMode };
}
