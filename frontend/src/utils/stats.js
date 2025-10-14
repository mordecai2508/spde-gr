// src/utils/stats.js
// Agregados y normalización robusta para el dashboard

export const avg = (arr) =>
  arr.length ? arr.reduce((s, n) => s + Number(n || 0), 0) / arr.length : 0;

export const percent = (num, den) =>
  den ? Math.round((Number(num) * 100) / Number(den)) : 0;

// --- helpers ---------------------------------------------------------------

function pickFirst(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
}
const isNum = (v) => Number.isFinite(v);

function normText(v) {
  if (v == null) return "";
  return String(v)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function normRiesgoValue(v) {
  const t = normText(v);
  if (!t) return undefined;
  // Soporta "alto", "Riesgo Alto", "ALTO", etc.
  if (t.includes("alto")) return "Alto";
  if (t.includes("medio")) return "Medio";
  if (t.includes("bajo")) return "Bajo";
  // Algunas APIs usan códigos
  if (t === "high") return "Alto";
  if (t === "medium") return "Medio";
  if (t === "low") return "Bajo";
  return undefined;
}

// Reglas (sin forzar “Alto” si faltan datos)
function computeRiesgoFromRules(est) {
  const asistencia = Number(pickFirst(est, ["asistencia"]));
  const promedio   = Number(pickFirst(est, ["promedio_nota"]));
  const nivel      = Number(pickFirst(est, ["estrato", "nivel_socioeconomico"]));

  const hasA = isNum(asistencia);
  const hasP = isNum(promedio);
  const hasN = isNum(nivel);
  const c = (cond, ok) => (ok ? (cond ? 1 : 0) : 0);

  // 🔴 ALTO: al menos 2 verdaderas
  const altoCount =
    c(asistencia < 50, hasA) +
    c(promedio   < 3.0, hasP) +
    c(nivel >= 1 && nivel <= 2, hasN);
  if (altoCount >= 2) return "Alto";

  // 🟢 BAJO: al menos 2 verdaderas
  const bajoCount =
    c(asistencia > 80, hasA) +
    c(promedio   >= 4.0, hasP) +
    c(nivel >= 5 && nivel <= 6, hasN);
  if (bajoCount >= 2) return "Bajo";

  // 🟠 MEDIO (si no fue Alto/Bajo o faltan datos)
  const medioCount =
    c(asistencia >= 50 && asistencia <= 80, hasA) +
    c(promedio   >= 3.0 && promedio < 4.0, hasP) +
    c(nivel >= 3 && nivel <= 4, hasN);
  if (medioCount >= 2) return "Medio";

  // Si las combinaciones no alcanzan 2 condiciones (por datos faltantes), caer en Medio:
  return "Medio";
}

// Lee riesgo desde backend si viene; si no, calcula
function getRiesgo(est) {
  const raw =
    pickFirst(est, ["riesgo_de_desercion", "riesgoDeDesercion", "riesgo_desercion", "riesgo"]) ??
    pickFirst(est, ["categoria", "categoria_riesgo"]);
  const norm = normRiesgoValue(raw);
  if (norm) return norm;
  return computeRiesgoFromRules(est);
}

export function dashboardAggregates(estudiantes = []) {
  const total = estudiantes.length;

  const asistencias = estudiantes.map((e) => {
    const v = Number(e?.asistencia ?? NaN);
    return isNum(v) ? v : 0;
  });

  const promedios = estudiantes.map((e) => {
    const v = Number(e?.promedio_nota ?? NaN);
    return isNum(v) ? v : 0;
  });

  let alto = 0, medio = 0, bajo = 0;
  for (const e of estudiantes) {
    const r = getRiesgo(e);
    if (r === "Alto") alto++;
    else if (r === "Bajo") bajo++;
    else medio++;
  }

  const riesgo = {
    Alto: alto,
    Medio: medio,
    Bajo: bajo,
    pct: {
      alto:  percent(alto, total),
      medio: percent(medio, total),
      bajo:  percent(bajo, total),
    },
  };

  return {
    total,
    avgAsist: Math.round(avg(asistencias)),
    avgProm:  Number(avg(promedios).toFixed(2)),
    riesgo,
  };
}

// --- Panel de depuración opcional ------------------------------------------
// Útil para detectar por qué todo cae en un bucket
export function buildDebugProfile(estudiantes = []) {
  const prof = {
    total: estudiantes.length,
    asistencia: { lt50: 0, btw50_80: 0, gt80: 0, missing: 0 },
    promedio:   { lt3: 0, btw3_4: 0, ge4: 0, missing: 0 },
    estrato:    { e12: 0, e34: 0, e56: 0, missing: 0 }
  };

  for (const e of estudiantes) {
    const a = Number(e?.asistencia ?? NaN);
    const p = Number(e?.promedio_nota ?? NaN);
    const n = Number(pickFirst(e, ["estrato", "nivel_socioeconomico"]));

    // asistencia
    if (isNum(a)) {
      if (a < 50) prof.asistencia.lt50++;
      else if (a <= 80) prof.asistencia.btw50_80++;
      else prof.asistencia.gt80++;
    } else prof.asistencia.missing++;

    // promedio
    if (isNum(p)) {
      if (p < 3.0) prof.promedio.lt3++;
      else if (p < 4.0) prof.promedio.btw3_4++;
      else prof.promedio.ge4++;
    } else prof.promedio.missing++;

    // estrato
    if (isNum(n)) {
      if (n <= 2) prof.estrato.e12++;
      else if (n <= 4) prof.estrato.e34++;
      else prof.estrato.e56++;
    } else prof.estrato.missing++;
  }

  return prof;
}
