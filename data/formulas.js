// formulas.js
// Elke formule heeft:
//   solveFor: array van {key, display} objecten
//     key: de sleutel in answers (genormaliseerde naam zonder speciale tekens)
//     display: LaTeX-string voor weergave aan de leerling
//   answers: object met key → rechterlid van het correcte antwoord (genormaliseerde notatie)

const FORMULAS = [

  // ── A MECHANICA ──────────────────────────────────────────────

  {
    id: 'kin_s_vt',
    display: 's = v \\cdot t',
    variables: { s: 'verplaatsing', v: 'snelheid', t: 'tijd' },
    solveFor: [
      { key: 'v', display: 'v' },
      { key: 't', display: 't' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { v: 's/t', t: 's/v' },
  },
  {
    id: 'vgem',
    display: 'v_{gem} = \\dfrac{\\Delta x}{\\Delta t}',
    variables: { 'v_{gem}': 'gemiddelde snelheid', '\\Delta x': 'verplaatsing', '\\Delta t': 'tijdsduur' },
    solveFor: [
      { key: 'dx', display: '\\Delta x' },
      { key: 'dt', display: '\\Delta t' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { dx: 'vgem*dt', dt: 'dx/vgem' },
  },
  {
    id: 'agem',
    display: 'a_{gem} = \\dfrac{\\Delta v}{\\Delta t}',
    variables: { 'a_{gem}': 'gemiddelde versnelling', '\\Delta v': 'snelheidsverandering', '\\Delta t': 'tijdsduur' },
    solveFor: [
      { key: 'dv', display: '\\Delta v' },
      { key: 'dt', display: '\\Delta t' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { dv: 'agem*dt', dt: 'dv/agem' },
  },
  {
    id: 'newton2',
    display: 'F_{res} = m \\cdot a',
    variables: { 'F_{res}': 'resulterende kracht', m: 'massa', a: 'versnelling' },
    solveFor: [
      { key: 'm', display: 'm' },
      { key: 'a', display: 'a' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { m: 'Fres/a', a: 'Fres/m' },
  },
  {
    id: 'zwaarte',
    display: 'F_z = m \\cdot g',
    variables: { 'F_z': 'zwaartekracht', m: 'massa', g: 'valversnelling' },
    solveFor: [
      { key: 'm', display: 'm' },
      { key: 'g', display: 'g' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { m: 'Fz/g', g: 'Fz/m' },
  },
  {
    id: 'veer',
    display: 'F_v = C \\cdot u',
    variables: { 'F_v': 'veerkracht', C: 'veerconstante', u: 'uitwijking/uitrekking' },
    solveFor: [
      { key: 'C', display: 'C' },
      { key: 'u', display: 'u' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { C: 'Fv/u', u: 'Fv/C' },
  },
  {
    id: 'cirkel_v',
    display: 'v = \\dfrac{2\\pi r}{T}',
    variables: { v: 'baansnelheid', r: 'straal', T: 'omlooptijd' },
    solveFor: [
      { key: 'r', display: 'r' },
      { key: 'T', display: 'T' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { r: '(v*T)/(2*pi)', T: '(2*pi*r)/v' },
  },
  {
    id: 'mpz',
    display: 'F_{mpz} = \\dfrac{mv^2}{r}',
    variables: { 'F_{mpz}': 'middelpuntzoekende kracht', m: 'massa', v: 'snelheid', r: 'straal' },
    solveFor: [
      { key: 'm', display: 'm' },
      { key: 'v', display: 'v' },
      { key: 'r', display: 'r' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { m: '(Fmpz*r)/v^2', v: 'sqrt((Fmpz*r)/m)', r: '(m*v^2)/Fmpz' },
  },
  {
    id: 'arbeid',
    display: 'W = F \\cdot s',
    variables: { W: 'arbeid', F: 'kracht', s: 'verplaatsing' },
    solveFor: [
      { key: 'F', display: 'F' },
      { key: 's', display: 's' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { F: 'W/s', s: 'W/F' },
  },
  {
    id: 'ekin',
    display: 'E_k = \\tfrac{1}{2}mv^2',
    variables: { 'E_k': 'kinetische energie', m: 'massa', v: 'snelheid' },
    solveFor: [
      { key: 'm', display: 'm' },
      { key: 'v', display: 'v' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { m: '(2*Ek)/v^2', v: 'sqrt((2*Ek)/m)' },
  },
  {
    id: 'ez',
    display: 'E_z = m \\cdot g \\cdot h',
    variables: { 'E_z': 'zwaarte-energie', m: 'massa', g: 'valversnelling', h: 'hoogte' },
    solveFor: [
      { key: 'm', display: 'm' },
      { key: 'g', display: 'g' },
      { key: 'h', display: 'h' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { m: 'Ez/(g*h)', g: 'Ez/(m*h)', h: 'Ez/(m*g)' },
  },
  {
    id: 'verm_wt',
    display: 'P = \\dfrac{W}{t}',
    variables: { P: 'vermogen', W: 'arbeid', t: 'tijd' },
    solveFor: [
      { key: 'W', display: 'W' },
      { key: 't', display: 't' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { W: 'P*t', t: 'W/P' },
  },
  {
    id: 'verm_fv',
    display: 'P = F \\cdot v',
    variables: { P: 'vermogen', F: 'kracht', v: 'snelheid' },
    solveFor: [
      { key: 'F', display: 'F' },
      { key: 'v', display: 'v' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { F: 'P/v', v: 'P/F' },
  },
  {
    id: 'rendement',
    display: '\\eta = \\dfrac{P_{uit}}{P_{in}}',
    variables: { '\\eta': 'rendement', 'P_{uit}': 'nuttig vermogen', 'P_{in}': 'opgenomen vermogen' },
    solveFor: [
      { key: 'Puit', display: 'P_{uit}' },
      { key: 'Pin', display: 'P_{in}' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { Puit: 'eta*Pin', Pin: 'Puit/eta' },
  },
  {
    id: 'gravitatie',
    display: 'F_g = G \\cdot \\dfrac{mM}{r^2}',
    variables: { 'F_g': 'gravitatiekracht', G: 'gravitatieconstante', m: 'massa 1', M: 'massa 2', r: 'afstand' },
    solveFor: [
      { key: 'm', display: 'm' },
      { key: 'M', display: 'M' },
      { key: 'r', display: 'r' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { m: '(Fg*r^2)/(G*M)', M: '(Fg*r^2)/(G*m)', r: 'sqrt((G*m*M)/Fg)' },
  },
  {
    id: 'hefboom',
    display: 'F_1 \\cdot r_1 = F_2 \\cdot r_2',
    variables: { 'F_1': 'kracht 1', 'r_1': 'arm 1', 'F_2': 'kracht 2', 'r_2': 'arm 2' },
    solveFor: [
      { key: 'F1', display: 'F_1' },
      { key: 'r1', display: 'r_1' },
      { key: 'F2', display: 'F_2' },
      { key: 'r2', display: 'r_2' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { F1: '(F2*r2)/r1', r1: '(F2*r2)/F1', F2: '(F1*r1)/r2', r2: '(F1*r1)/F2' },
  },
  {
    id: 'massa_veer',
    display: 'T = 2\\pi\\sqrt{\\dfrac{m}{C}}',
    variables: { T: 'trillingstijd', m: 'massa', C: 'veerconstante' },
    solveFor: [
      { key: 'm', display: 'm' },
      { key: 'C', display: 'C' },
    ],
    niveau: 'beide', thema: 'mechanica',
    answers: { m: '(C*T^2)/(4*pi^2)', C: '(4*pi^2*m)/T^2' },
  },

  // ── B TRILLINGEN & GOLVEN ─────────────────────────────────────

  {
    id: 'freq_periode',
    display: 'f = \\dfrac{1}{T}',
    variables: { f: 'frequentie', T: 'periode' },
    solveFor: [
      { key: 'T', display: 'T' },
    ],
    niveau: 'beide', thema: 'trillingen',
    answers: { T: '1/f' },
  },
  {
    id: 'golfsnelheid',
    display: 'v = f \\cdot \\lambda',
    variables: { v: 'golfsnelheid', f: 'frequentie', '\\lambda': 'golflengte' },
    solveFor: [
      { key: 'f', display: 'f' },
      { key: 'lambda', display: '\\lambda' },
    ],
    niveau: 'beide', thema: 'trillingen',
    answers: { f: 'v/lambda', lambda: 'v/f' },
  },
  {
    id: 'vmax',
    display: 'v_{max} = 2\\pi \\cdot f \\cdot A',
    variables: { 'v_{max}': 'maximale snelheid', f: 'frequentie', A: 'amplitude' },
    solveFor: [
      { key: 'f', display: 'f' },
      { key: 'A', display: 'A' },
    ],
    niveau: 'vwo', thema: 'trillingen',
    answers: { f: 'vmax/(2*pi*A)', A: 'vmax/(2*pi*f)' },
  },

  // ── C VLOEISTOFFEN & WARMTE ───────────────────────────────────

  {
    id: 'dichtheid',
    display: '\\rho = \\dfrac{m}{V}',
    variables: { '\\rho': 'dichtheid', m: 'massa', V: 'volume' },
    solveFor: [
      { key: 'm', display: 'm' },
      { key: 'V', display: 'V' },
    ],
    niveau: 'beide', thema: 'warmte',
    answers: { m: 'rho*V', V: 'm/rho' },
  },
  {
    id: 'debiet',
    display: 'Q = \\dfrac{\\Delta V}{\\Delta t}',
    variables: { Q: 'debiet', '\\Delta V': 'volumestroom', '\\Delta t': 'tijdsduur' },
    solveFor: [
      { key: 'dV', display: '\\Delta V' },
      { key: 'dt', display: '\\Delta t' },
    ],
    niveau: 'beide', thema: 'warmte',
    answers: { dV: 'Q*dt', dt: 'dV/Q' },
  },
  {
    id: 'soortelijke_warmte',
    display: 'Q = c \\cdot m \\cdot \\Delta T',
    variables: { Q: 'warmte', c: 'soortelijke warmte', m: 'massa', '\\Delta T': 'temperatuursverschil' },
    solveFor: [
      { key: 'c', display: 'c' },
      { key: 'm', display: 'm' },
      { key: 'dT', display: '\\Delta T' },
    ],
    niveau: 'beide', thema: 'warmte',
    answers: { c: 'Q/(m*dT)', m: 'Q/(c*dT)', dT: 'Q/(c*m)' },
  },
  {
    id: 'warmtestroom',
    display: 'P = \\lambda \\cdot A \\cdot \\dfrac{\\Delta T}{d}',
    variables: { P: 'warmtestroom', '\\lambda': 'warmtegeleidingscoëfficiënt', A: 'oppervlakte', '\\Delta T': 'temperatuursverschil', d: 'dikte' },
    solveFor: [
      { key: 'lambda', display: '\\lambda' },
      { key: 'A', display: 'A' },
      { key: 'dT', display: '\\Delta T' },
      { key: 'd', display: 'd' },
    ],
    niveau: 'beide', thema: 'warmte',
    answers: { lambda: '(P*d)/(A*dT)', A: '(P*d)/(lambda*dT)', dT: '(P*d)/(lambda*A)', d: '(lambda*A*dT)/P' },
  },

  // ── D ELEKTRICITEIT ───────────────────────────────────────────

  {
    id: 'stroom',
    display: 'I = \\dfrac{Q}{t}',
    variables: { I: 'stroomsterkte', Q: 'lading', t: 'tijd' },
    solveFor: [
      { key: 'Q', display: 'Q' },
      { key: 't', display: 't' },
    ],
    niveau: 'beide', thema: 'elektriciteit',
    answers: { Q: 'I*t', t: 'Q/I' },
  },
  {
    id: 'ohm',
    display: 'U = I \\cdot R',
    variables: { U: 'spanning', I: 'stroomsterkte', R: 'weerstand' },
    solveFor: [
      { key: 'I', display: 'I' },
      { key: 'R', display: 'R' },
    ],
    niveau: 'beide', thema: 'elektriciteit',
    answers: { I: 'U/R', R: 'U/I' },
  },
  {
    id: 'verm_ui',
    display: 'P = U \\cdot I',
    variables: { P: 'vermogen', U: 'spanning', I: 'stroomsterkte' },
    solveFor: [
      { key: 'U', display: 'U' },
      { key: 'I', display: 'I' },
    ],
    niveau: 'beide', thema: 'elektriciteit',
    answers: { U: 'P/I', I: 'P/U' },
  },
  {
    id: 'energie_elek',
    display: 'E = P \\cdot t',
    variables: { E: 'energie', P: 'vermogen', t: 'tijd' },
    solveFor: [
      { key: 'P', display: 'P' },
      { key: 't', display: 't' },
    ],
    niveau: 'beide', thema: 'elektriciteit',
    answers: { P: 'E/t', t: 'E/P' },
  },
  {
    id: 'soort_weerstand',
    display: '\\rho = \\dfrac{R \\cdot A}{l}',
    variables: { '\\rho': 'soortelijke weerstand', R: 'weerstand', A: 'doorsnede', l: 'lengte' },
    solveFor: [
      { key: 'R', display: 'R' },
      { key: 'A', display: 'A' },
      { key: 'l', display: 'l' },
    ],
    niveau: 'beide', thema: 'elektriciteit',
    answers: { R: '(rho*l)/A', A: '(rho*l)/R', l: '(R*A)/rho' },
  },
  {
    id: 'parallel_r',
    display: '\\dfrac{1}{R_{tot}} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}',
    variables: { 'R_{tot}': 'totale weerstand', 'R_1': 'weerstand 1', 'R_2': 'weerstand 2' },
    solveFor: [
      { key: 'Rtot', display: 'R_{tot}' },
      { key: 'R1', display: 'R_1' },
      { key: 'R2', display: 'R_2' },
    ],
    niveau: 'beide', thema: 'elektriciteit',
    answers: { Rtot: '(R1*R2)/(R1+R2)', R1: '(Rtot*R2)/(R2-Rtot)', R2: '(Rtot*R1)/(R1-Rtot)' },
  },

  // ── E OVERIGE ─────────────────────────────────────────────────

  {
    id: 'wien',
    display: '\\lambda_{max} \\cdot T = k_W',
    variables: { '\\lambda_{max}': 'piekgolflengte', T: 'temperatuur', 'k_W': 'constante van Wien' },
    solveFor: [
      { key: 'lambdamax', display: '\\lambda_{max}' },
      { key: 'T', display: 'T' },
    ],
    niveau: 'beide', thema: 'overige',
    answers: { lambdamax: 'kW/T', T: 'kW/lambdamax' },
  },
  {
    id: 'foton',
    display: 'E = h \\cdot f',
    variables: { E: 'energie foton', h: 'constante van Planck', f: 'frequentie' },
    solveFor: [
      { key: 'h', display: 'h' },
      { key: 'f', display: 'f' },
    ],
    niveau: 'beide', thema: 'overige',
    answers: { h: 'E/f', f: 'E/h' },
  },
  {
    id: 'lichtsnelheid',
    display: 'c = f \\cdot \\lambda',
    variables: { c: 'lichtsnelheid', f: 'frequentie', '\\lambda': 'golflengte' },
    solveFor: [
      { key: 'f', display: 'f' },
      { key: 'lambda', display: '\\lambda' },
    ],
    niveau: 'beide', thema: 'overige',
    answers: { f: 'c/lambda', lambda: 'c/f' },
  },
  {
    id: 'massagetal',
    display: 'A = N + Z',
    variables: { A: 'massagetal', N: 'aantal neutronen', Z: 'atoomnummer' },
    solveFor: [
      { key: 'N', display: 'N' },
      { key: 'Z', display: 'Z' },
    ],
    niveau: 'beide', thema: 'overige',
    answers: { N: 'A-Z', Z: 'A-N' },
  },
  {
    id: 'dosis',
    display: 'D = \\dfrac{E}{m}',
    variables: { D: 'geabsorbeerde dosis', E: 'energie', m: 'massa' },
    solveFor: [
      { key: 'E', display: 'E' },
      { key: 'm', display: 'm' },
    ],
    niveau: 'beide', thema: 'overige',
    answers: { E: 'D*m', m: 'E/D' },
  },
  {
    id: 'halvering_n',
    display: 'n = \\dfrac{\\log(N/N_0)}{\\log(0{,}5)}',
    variables: { n: 'aantal halveringstijden', N: 'huidig aantal kernen', 'N_0': 'beginhoeveelheid' },
    solveFor: [
      { key: 'N', display: 'N' },
      { key: 'N0', display: 'N_0' },
    ],
    niveau: 'vwo', thema: 'overige',
    answers: { N: 'N0*0.5^n', N0: 'N/0.5^n' },
  },
  {
    id: 'einstein',
    display: 'E = m \\cdot c^2',
    variables: { E: 'energie', m: 'massa', c: 'lichtsnelheid' },
    solveFor: [
      { key: 'm', display: 'm' },
    ],
    niveau: 'vwo', thema: 'overige',
    answers: { m: 'E/c^2' },
  },

  // ── F OPTICA ──────────────────────────────────────────────────

  {
    id: 'snellius',
    display: '\\dfrac{\\sin i}{\\sin r} = n_{1 \\to 2}',
    variables: { i: 'invalshoek', r: 'brekingshoek', 'n_{1\\to2}': 'brekingsindex' },
    solveFor: [
      { key: 'n', display: 'n_{1 \\to 2}' },
    ],
    niveau: 'beide', thema: 'optica',
    answers: { n: 'sin(i)/sin(r)' },
  },
  {
    id: 'lenzen',
    display: '\\dfrac{1}{b} + \\dfrac{1}{v} = \\dfrac{1}{f}',
    variables: { b: 'beeldafstand', v: 'voorwerpsafstand', f: 'brandpuntsafstand' },
    solveFor: [
      { key: 'b', display: 'b' },
      { key: 'v', display: 'v' },
      { key: 'f', display: 'f' },
    ],
    niveau: 'beide', thema: 'optica',
    answers: { b: '(v*f)/(v-f)', v: '(b*f)/(b-f)', f: '(b*v)/(b+v)' },
  },
  {
    id: 'brekingsindex',
    display: 'n_{1 \\to 2} = \\dfrac{n_2}{n_1} = \\dfrac{c_1}{c_2}',
    variables: { 'n_{1\\to2}': 'relatieve brekingsindex', 'n_1': 'brekingsindex medium 1', 'n_2': 'brekingsindex medium 2', 'c_1': 'lichtsnelheid in medium 1', 'c_2': 'lichtsnelheid in medium 2' },
    solveFor: [
      { key: 'n1', display: 'n_1' },
      { key: 'n2', display: 'n_2' },
      { key: 'c1', display: 'c_1' },
      { key: 'c2', display: 'c_2' },
    ],
    niveau: 'beide', thema: 'optica',
    answers: { n1: 'n2/n12', n2: 'n12*n1', c1: 'n12*c2', c2: 'c1/n12' },
  },
];

const THEMAS = {
  mechanica:     { label: 'Mechanica',              letter: 'A', kleur: '#3b82f6' },
  trillingen:    { label: 'Trillingen & golven',    letter: 'B', kleur: '#8b5cf6' },
  warmte:        { label: 'Vloeistoffen & warmte',  letter: 'C', kleur: '#f97316' },
  elektriciteit: { label: 'Elektriciteit',          letter: 'D', kleur: '#eab308' },
  overige:       { label: 'Overige onderwerpen',    letter: 'E', kleur: '#ec4899' },
  optica:        { label: 'Optica (optioneel)',      letter: 'F', kleur: '#14b8a6', optioneel: true },
};