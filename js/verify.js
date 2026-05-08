/**
 * verify.js — Verificatielogica voor Formules Omschrijven
 * Vereist: math.js geladen voor dit bestand
 */

// Samengestelde namen die als één eenheid behandeld moeten worden
// key = platgeslagen naam in answers/canonical, value = LaTeX met subscript
const COMPOUND_NAMES = {
  'lambdamax': 'lambda_{max}',
  'vmax':      'v_{max}',
  'vgem':      'v_{gem}',
  'agem':      'a_{gem}',
  'Fmpz':      'F_{mpz}',
  'Fres':      'F_{res}',
  'Fg':        'F_g',
  'Fz':        'F_z',
  'Fv':        'F_v',
  'Ek':        'E_k',
  'Ep':        'E_p',
  'Rtot':      'R_{tot}',
  'Puit':      'P_{uit}',
  'Pin':       'P_{in}',
  'kW':        'k_W',
  'N0':        'N_0',
  'n12':       'n_{12}',
  'R1':        'R_1',
  'R2':        'R_2',
  'F1':        'F_1',
  'F2':        'F_2',
  'r1':        'r_1',
  'r2':        'r_2',
  'c1':        'c_1',
  'c2':        'c_2',
  'n1':        'n_1',
  'n2':        'n_2',
  'dx':        'Delta_x',
  'dt':        'Delta_t',
  'dv':        'Delta_v',
  'dV':        'Delta_V',
  'dT':        'Delta_T',
};
const GREEK_NAMES = ['lambda','Delta','alpha','beta','gamma','delta',
                     'omega','sigma','theta','phi','eta','rho','pi'];

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
      let sub = '';
      if (i < expr.length && expr[i] === '_') {
        i++;
        while (i < expr.length && /[a-zA-Z0-9]/.test(expr[i])) sub += expr[i++];
      }
      if (FUNCS.includes(name) && i < expr.length && expr[i] === '(') {
        tokens.push({ type: 'FUNC', value: name });
      } else if (GREEK_NAMES.includes(name)) {
        tokens.push({ type: 'NAME', value: sub ? name + sub : name });
      } else {
        let matched = false;
        for (const g of [...GREEK_NAMES].sort((a,b) => b.length - a.length)) {
          if (name.startsWith(g)) {
            tokens.push({ type: 'NAME', value: g });
            const rest = name.slice(g.length);
            for (const letter of rest) {
              tokens.push({ type: 'NAME', value: letter });
            }
            matched = true;
            break;
          }
        }
        if (!matched) {
          if (sub) {
            tokens.push({ type: 'NAME', value: name + sub });
          } else {
            for (const letter of name) {
              tokens.push({ type: 'NAME', value: letter });
            }
          }
        }
      }
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

// Groepeer noemer: a/b*c → a/(b*c) en teller: a*b/c → (a*b)/c
function groupDenominator(s) {
  s = s.replace(
    /([a-zA-Z0-9_^()]+(?:\*[a-zA-Z0-9_^()]+)+)\/([a-zA-Z0-9_^()]+)(?!\*)/g,
    (match, num, den) => `(${num})/${den}`
  );
  s = s.replace(
    /([a-zA-Z0-9_^()]+)\/([a-zA-Z0-9_^()]+(?:\*[a-zA-Z0-9_^()]+)+)/g,
    (match, num, den) => `${num}/(${den})`
  );
  return s;
}

function checkAnswer(userInput, correctExpr) {
  const userNorm = normalize(userInput);
  const corrNorm = normalize(correctExpr);
  if (!userNorm || !corrNorm) { console.log('[verify] Lege invoer'); return false; }
  const userTokens = insertImplicitMul(tokenize(userNorm));
  const corrTokens = insertImplicitMul(tokenize(corrNorm));
  const userStr = groupDenominator(tokensToString(userTokens));
  const corrStr = groupDenominator(tokensToString(corrTokens));
  const allVars = [...new Set([...collectVarNames(tokenize(userStr)), ...collectVarNames(tokenize(corrStr))])];
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

// ── toDisplayLatex ───────────────────────────────────────────────────────────

function convertDivToFrac(s) {
  let prev = '', n = 0;
  while (s !== prev && n++ < 10) {
    prev = s;
    s = s.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, '\\dfrac{$1}{$2}');
    s = s.replace(/([a-zA-Z0-9_{}\\^]+)\/\(([^()]+)\)/g, '\\dfrac{$1}{$2}');
    s = s.replace(/\(([^()]+)\)\/([a-zA-Z0-9_{}\\^]+)/g, '\\dfrac{$1}{$2}');
    s = s.replace(/([a-zA-Z0-9_{}\\^]+)\/([a-zA-Z0-9_{}\\^]+)/g, '\\dfrac{$1}{$2}');
  }
  return s;
}

function toDisplayLatex(expr, target) {
  if (!expr) return '';

  // Stap 0: vervang samengestelde namen door versie met underscore VOOR tokenizing
  // zodat Ek, vmax etc. als één token worden behandeld (name+sub patroon)
  let expr2 = expr;
  for (const [flat, sub] of Object.entries(COMPOUND_NAMES).sort((a,b) => b[0].length - a[0].length)) {
    // Vervang alleen als het een losstaand woord is (niet deel van langere naam)
    expr2 = expr2.replace(new RegExp(`(?<![a-zA-Z])${flat}(?![a-zA-Z0-9])`, 'g'), sub.replace('_', '_'));
  }

  // Stap 1: normaliseer en tokenize
  let s = tokensToString(insertImplicitMul(tokenize(normalize(expr2))));

  // Stap 2: groepeer noemer/teller
  s = groupDenominator(s);

  // Stap 2b: verwijder overbodige haakjes
  s = s.replace(/\(\(([^()]+)\)\)/g, '($1)');
  s = s.replace(/\/\(([a-zA-Z0-9_^]+)\)/g, '/$1');

  // Stap 3: subscriptnamen terug naar LaTeX (langste eerst)
  const subMap = {
    'lambdamax': '\\lambda_{max}',
    'vmax':  'v_{max}', 'vgem':  'v_{gem}', 'agem':  'a_{gem}',
    'Fmpz':  'F_{mpz}', 'Fres':  'F_{res}', 'Fg': 'F_g', 'Fz': 'F_z', 'Fv': 'F_v',
    'Ek': 'E_k', 'Ep': 'E_p',
    'Rtot':  'R_{tot}', 'Puit':  'P_{uit}', 'Pin': 'P_{in}',
    'kW': 'k_W', 'N0': 'N_0', 'n12': 'n_{12}',
    'R1': 'R_1', 'R2': 'R_2', 'F1': 'F_1', 'F2': 'F_2',
    'r1': 'r_1', 'r2': 'r_2', 'c1': 'c_1', 'c2': 'c_2',
    'n1': 'n_1', 'n2': 'n_2',
    'dx': '\\Delta x', 'dt': '\\Delta t', 'dv': '\\Delta v',
    'dV': '\\Delta V', 'dT': '\\Delta T',
  };
  for (const [flat, latex] of Object.entries(subMap).sort((a,b) => b[0].length - a[0].length))
    s = s.split(flat).join(latex);

  // Stap 4: Griekse namen → LaTeX (langste eerst)
  const greekLatex = {
    'lambda':'\\lambda','rho':'\\rho','eta':'\\eta','omega':'\\omega',
    'alpha':'\\alpha','beta':'\\beta','gamma':'\\gamma','delta':'\\delta',
    'phi':'\\phi','Delta':'\\Delta','pi':'\\pi',
  };
  for (const [name, latex] of Object.entries(greekLatex).sort((a,b) => b[0].length - a[0].length))
    s = s.split(name).join(latex);

  // Stap 5: machten
  s = s.replace(/\^([a-zA-Z0-9]{2,})/g, '^{$1}');

  // Stap 6: sqrt — verwerk breuk binnen de wortel eerst
  s = s.replace(/sqrt\(([^)]+)\)/g, (match, inner) => {
    let inn = groupDenominator(inner);
    inn = inn.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, '\\dfrac{$1}{$2}');
    inn = inn.replace(/([a-zA-Z0-9_{}\\^]+)\/\(([^()]+)\)/g, '\\dfrac{$1}{$2}');
    inn = inn.replace(/\(([^()]+)\)\/([a-zA-Z0-9_{}\\^]+)/g, '\\dfrac{$1}{$2}');
    inn = inn.replace(/([a-zA-Z0-9_{}\\^]+)\/([a-zA-Z0-9_{}\\^]+)/g, '\\dfrac{$1}{$2}');
    inn = inn.replace(/\*/g, ' \\cdot ');
    return `\\sqrt{${inn}}`;
  });

  // Stap 7: breuken buiten sqrt
  s = convertDivToFrac(s);

  // Stap 8: vermenigvuldiging
  s = s.replace(/\*/g, ' \\cdot ');

  // Stap 9: doelgrootheid weergeven
  // target is de key (bijv. 'lambdamax'), haal de LaTeX-display op
  let displayTarget = target;
  if (subMap[target]) displayTarget = subMap[target];
  else if (greekLatex[target]) displayTarget = greekLatex[target];

  return `${displayTarget} = ${s}`;
}