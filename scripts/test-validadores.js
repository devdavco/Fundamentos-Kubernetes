#!/usr/bin/env node
/**
 * Smoke test para verificar que:
 * 1. discoverOfficialChallenges() detecta las semanas activas sin errores.
 * 2. Ningún archivo roto original en semana-XX/2.reto-roto/ pasa los validadores por error.
 * 3. evaluateUserProgress() ejecuta limpiamente.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  CHALLENGE_VALIDATORS,
  discoverOfficialChallenges,
  evaluateUserProgress
} = require('./generar-asistentes.js');

const ROOT = path.resolve(__dirname, '..');

function readFilesRecursively(dir, baseDir = dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...readFilesRecursively(full, baseDir));
    } else if (entry.isFile() && !/^readme\.md$/i.test(entry.name)) {
      results.push({
        relPath: path.relative(baseDir, full).replace(/\\/g, '/'),
        content: fs.readFileSync(full, 'utf8')
      });
    }
  }
  return results;
}

const official = discoverOfficialChallenges();
for (const weekKey of ['semana-00', 'semana-01', 'semana-02', 'semana-03', 'semana-04', 'semana-05', 'semana-06']) {
  assert(official[weekKey], `Falta descubrir ${weekKey} en discoverOfficialChallenges()`);
}

// Verificar que los archivos rotos originales NO pasen los validadores
const weekDirs = fs
  .readdirSync(ROOT, { withFileTypes: true })
  .filter(d => d.isDirectory() && /^semana-\d+/.test(d.name));

for (const weekKey of Object.keys(CHALLENGE_VALIDATORS)) {
  const dirEntry = weekDirs.find(d => d.name.startsWith(weekKey));
  assert(dirEntry, `No se encontró directorio para ${weekKey}`);
  const retoDir = path.join(ROOT, dirEntry.name, '2.reto-roto');
  const brokenFiles = readFilesRecursively(retoDir);
  assert(brokenFiles.length > 0, `No hay archivos en ${retoDir}`);

  for (const v of CHALLENGE_VALIDATORS[weekKey]) {
    const targetFiles =
      weekKey === 'semana-00' || weekKey === 'semana-06'
        ? brokenFiles.filter(f => f.relPath.startsWith(`${v.id}-`))
        : brokenFiles;
    const passed = v.validate(targetFiles);
    assert.strictEqual(
      passed,
      false,
      `El validador ${weekKey}/${v.name} aprobó un archivo roto original en ${retoDir}`
    );
  }
}

// Verificar evaluación de progreso sin errores
const sample = evaluateUserProgress('Arlex0296', official);
assert(sample && typeof sample.points === 'number' && sample.points >= 10);

console.log(
  `✅ Smoke test OK: ${Object.keys(CHALLENGE_VALIDATORS).length} semanas validadas, archivos rotos rechazados correctamente.`
);
