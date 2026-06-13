// Detector de secrets accidentales en el código fuente (multiplataforma).
// Uso: npm run check-secrets — falla (exit 1) si encuentra algo sospechoso.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const SCAN_DIRS = ["app", "components", "lib", "types", "prisma", "scripts"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);

const PATTERNS = [
  {
    name: "Secret/URL hardcodeado",
    // Asignación de un valor literal a variables sensibles (no process.env)
    regex: /(NEXTAUTH_SECRET|AUTH_SECRET|DATABASE_URL)\s*[:=]\s*["'][^"']{8,}["']/,
  },
  { name: "API key estilo OpenAI/Stripe (sk-)", regex: /\bsk-[A-Za-z0-9]{16,}/ },
  { name: "API key estilo Stripe (pk_)", regex: /\bpk_[A-Za-z0-9]{16,}/ },
  { name: "Contraseña de ejemplo insegura", regex: /password123/i },
  { name: "Token de GitHub", regex: /\bghp_[A-Za-z0-9]{20,}/ },
];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (EXTENSIONS.has(extname(path))) yield path;
  }
}

let findings = 0;
for (const dir of SCAN_DIRS) {
  let files;
  try {
    files = [...walk(dir)];
  } catch {
    continue; // el directorio no existe
  }
  for (const file of files) {
    if (file.endsWith("check-secrets.mjs")) continue; // este archivo define los patrones
    const content = readFileSync(file, "utf8");
    const lines = content.split("\n");
    lines.forEach((line, index) => {
      for (const pattern of PATTERNS) {
        if (pattern.regex.test(line)) {
          findings++;
          console.error(`✗ ${file}:${index + 1} — ${pattern.name}`);
          console.error(`  ${line.trim().slice(0, 120)}`);
        }
      }
    });
  }
}

if (findings > 0) {
  console.error(`\n❌ ${findings} posible(s) secret(s) en el código. Muévelos a .env.local`);
  process.exit(1);
}
console.log("OK — no secrets found in code");
