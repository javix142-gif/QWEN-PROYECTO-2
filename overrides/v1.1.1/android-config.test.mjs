import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const activityPath = new URL('../src/main/java/cl/javiersanmartin/albionmarketamerica/MainActivity.java', import.meta.url);
const insetsPath = new URL('../src/main/java/cl/javiersanmartin/albionmarketamerica/InsetsPolicy.java', import.meta.url);
const manifestPath = new URL('../src/main/AndroidManifest.xml', import.meta.url);
const buildPath = new URL('../build.gradle.kts', import.meta.url);

const [activity, insetsPolicy, manifest, build] = await Promise.all([
  readFile(activityPath, 'utf8'),
  readFile(insetsPath, 'utf8'),
  readFile(manifestPath, 'utf8'),
  readFile(buildPath, 'utf8'),
]);

test('Android 15 aplica edge-to-edge e insets de barras, recorte e IME', () => {
  assert.match(activity, /WindowCompat\.setDecorFitsSystemWindows\(getWindow\(\), false\)/);
  assert.match(activity, /WindowInsetsCompat\.Type\.systemBars\(\)/);
  assert.match(activity, /WindowInsetsCompat\.Type\.displayCutout\(\)/);
  assert.match(activity, /WindowInsetsCompat\.Type\.ime\(\)/);
  assert.match(activity, /target\.setPadding\(/);
  assert.match(insetsPolicy, /Math\.max\(Math\.max\(0, systemBottom\), Math\.max\(0, imeBottom\)\)/);
  assert.match(manifest, /android:windowSoftInputMode="adjustResize"/);
});

test('nombre, agente de usuario y versión son uniformes', () => {
  assert.match(activity, /AlbionMarketrelli\/1\.1\.1/);
  assert.match(build, /versionCode = 3/);
  assert.match(build, /versionName = "1\.1\.1"/);
  assert.match(build, /applicationId = "cl\.javiersanmartin\.albionmarketrelli"/);
});
