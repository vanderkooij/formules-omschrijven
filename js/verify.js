/**
 * verify.js — Verificatielogica voor Formules Omschrijven
 * Vereist: math.js geladen voor dit bestand
 */

function normalize(expr) {
  if (!expr || typeof expr !== 'string') return '';
  let s = expr.trim().replace(/\s+/g, '');
  const greekMap = {'α':'alpha','β':'beta','γ':'gamma','δ':'delta','η':'eta','λ':'lambda','ρ':'rho','ω':'omega','φ':'phi','Δ':'Delta','π':'pi','σ':'sigma'};
  for (const [sym, name] of Object.entries(greekMap)) s = s.split(sym).join(name);
  const latexMap = {'\\alpha':'alpha','\\beta':'beta','\\gamma':'gamma','\\delta':'delta','\\eta':'eta','\\lambda':'lambda','\\rho':'rho','\\omega':'omega','\\phi':'phi','\\Delta':'Delta','\\pi':'pi','\\cdot':'*','\\times':'*'};
  for (const [cmd, repl] of Object.entries(latexMap)) s = s.split(cmd).join(repl);
  s = s.replace(/\\/g, '').replace(/\{([^}]*)\}/g, '$1');
  if (s.includes('=')) s = s.split('=').slice(1).join('=');
  return s;
}

function tokenize(expr) {
  const tokens = [];
  let i = 0;
  const FUNCS = ['sqrt','sin','cos','tan','log','ln','abs'];
  while (i < expr.length) {
    const ch = expr[i];
    if (/[0-9.]/.test(ch)) {
      let num = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) num += expr[i++];
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let name = '';
      while (i < expr.length && /[a-zA-Z]/.test(expr[i])) name += expr[i++];
      if (i < expr.length && expr[i] === '_') {
        i++;
        let sub = '';
        while (i < expr.length && /[a-zA-Z0-9]/.test(expr[i])) sub += expr[i++];
        name = name + sub;
      }
      tokens.push({ type: FUNCS.includes(name) && i < expr.length && expr[i] === '(' ? 'FUNC' : 'NAME', value: name });
      continue;
    }
    if ('+-*/^'.includes(ch)) { tokens.push({ type: 'OP', value: ch }); i++; continue; }
    if (ch === '(') { tokens.push({ type: 'LPAREN', value: '(' }); i++; continue; }
    if (ch === ')') { tokens.push({ type: 'RPAREN', value: ')' }); i++; continue; }
    i++;
  }
  return tokens;
}

function insertImplicitMul(tokens) {
  const result = [];
  for (let i = 0; i < tokens.length; i++) {
    result.push(tokens[i]);
    if (i + 1 < tokens.length) {
      const cur = tokens[i], nxt = tokens[i + 1];
      if (
        (cur.type === 'NUMBER'  && (nxt.type === 'NAME' || nxt.type === 'LPAREN' || nxt.type === 'FUNC')) ||
        (cur.type === 'NAME'    && (nxt.type === 'NAME' || nxt.type === 'NUMBER' || nxt.type === 'LPAREN' || nxt.type === 'FUNC')) ||
        (cur.type === 'RPAREN'  && (nxt.type === 'NAME' || nxt.type === 'NUMBER' || nxt.type === 'LPAREN' || nxt.type === 'FUNC'))
      ) result.push({ type: 'OP', value: '*' });
    }
  }
  return result;
}

function tokensToString(tokens) { return tokens.map(t => t.value).join(''); }
function collectVarNames(tokens) { return [...new Set(tokens.filter(t => t.type === 'NAME').map(t => t.value))]; }

const PRIMES = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47];

function buildScope(varNames, multiplier) {
  const scope = {}, used = new Set();
  let idx = 0;
  for (const name of [...varNames].sort()) {
    while (idx < PRIMES.length && used.has(PRIMES[idx])) idx++;
    scope[name] = (PRIMES[idx] || (idx + 2)) * multiplier;
    used.add(PRIMES[idx++]);
  }
  return scope;
}

function checkAnswer(userInput, correctExpr) {
  const userNorm = normalize(userInput);
  const corrNorm = normalize(correctExpr);
  if (!userNorm || !corrNorm) { console.log('[verify] Lege invoer'); return false; }
  const userTokens = insertImplicitMul(tokenize(userNorm));
  const corrTokens = insertImplicitMul(tokenize(corrNorm));
  const userStr = tokensToString(userTokens);
  const corrStr = tokensToString(corrTokens);
  const allVars = [...new Set([...collectVarNames(userTokens), ...collectVarNames(corrTokens)])];
  console.log('[verify] Gebruiker:', userStr, '| Correct:', corrStr, '| Vars:', allVars);
  for (const mult of [1, 1.3, 1.7]) {
    const scope = buildScope(allVars, mult);
    let userVal, corrVal;
    try { userVal = math.evaluate(userStr, { ...scope }); } catch(e) { console.log('[verify] Eval fout gebruiker:', e.message); return false; }
    try { corrVal = math.evaluate(corrStr, { ...scope }); } catch(e) { console.log('[verify] Eval fout correct:', e.message); return false; }
    console.log('[verify] mult:', mult, '| user:', userVal, '| corr:', corrVal);
    if (userVal == null || corrVal == null || isNaN(userVal) || isNaN(corrVal)) return false;
    if (Math.abs(userVal - corrVal) / (Math.abs(corrVal) || 1) > 0.0001) return false;
  }
  console.log('[verify] GOED');
  return true;
}

function convertDivToFrac(s) {
  let prev = '', n = 0;
  while (s !== prev && n++ < 10) {
    prev = s;
    s = s.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, '\\dfrac{$1}{$2}');
    s = s.replace(/([a-zA-Z0-9_{}\\]+)\/\(([^()]+)\)/g, '\\dfrac{$1}{$2}');
    s = s.replace(/\(([^()]+)\)\/([a-zA-Z0-9_{}\\]+)/g, '\\dfrac{$1}{$2}');
    s = s.replace(/([a-zA-Z0-9_{}\\]+)\/([a-zA-Z0-9_{}\\]+)/g, '\\dfrac{$1}{$2}');
  }
  return s;
}

function toDisplayLatex(expr, target) {
  if (!expr) return '';
  let s = tokensToString(insertImplicitMul(tokenize(normalize(expr))));
  const subMap = {'vgem':'v_{gem}','agem':'a_{gem}','vmax':'v_{max}','Fmpz':'F_{mpz}','Fres':'F_{res}','Fg':'F_g','Fz':'F_z','Fv':'F_v','Ek':'E_k','Ep':'E_p','Rtot':'R_{tot}','Puit':'P_{uit}','Pin':'P_{in}','lambdamax':'\\lambda_{max}'};
  for (const [flat, latex] of Object.entries(subMap).sort((a,b) => b[0].length - a[0].length)) s = s.split(flat).join(latex);
  const greekLatex = {'lambda':'\\lambda','rho':'\\rho','eta':'\\eta','omega':'\\omega','alpha':'\\alpha','beta':'\\beta','gamma':'\\gamma','delta':'\\delta','phi':'\\phi','Delta':'\\Delta','pi':'\\pi'};
  for (const [name, latex] of Object.entries(greekLatex).sort((a,b) => b[0].length - a[0].length)) s = s.split(name).join(latex);
  s = s.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
  s = convertDivToFrac(s);
  s = s.replace(/\*/g, ' \\cdot ');
  s = s.replace(/\^([a-zA-Z0-9]{2,})/g, '^{$1}');
  return `${target} = ${s}`;
}
