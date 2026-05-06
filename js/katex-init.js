/**
 * katex-init.js — KaTeX render helper voor Formules Omschrijven
 * Vereist: katex geladen (via defer) voor aanroep
 */
function renderKaTeX(latex, el, display) {
  try {
    katex.render(latex, el, { throwOnError: false, displayMode: !!display });
  } catch(e) {
    el.textContent = latex;
  }
}
