// One-Line Office Jokes — make.fun entry
// Competition: u-markk-st-one-line-office-jokes-a51f2bcc
// Brief: one single line that makes office life funny, 1-199 characters,
// turns on a real detail of office life, lands the laugh in the last words.
// Angle: the reply-all thread — the most universally dreaded office artefact.
// The joke: asking to be removed from a thread via reply-all only feeds it,
// and the punch lands on the final beat: "now I am the thread."
// Structure: SETUP (the reply-all request) + TURN (the backfire) joined
// into one line, so the laugh arrives on the last few words as the brief asks.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// The entry, assembled from its two beats. 79 code points, one line.
const SETUP = "I hit reply-all asking to be removed from this thread,";
const TURN = "and now I am the thread.";

function buildEntry(): string {
  return `${SETUP} ${TURN}`;
}

const ENTRY = buildEntry();

// Gate: UTF-8 text, 1 to 199 characters, not only white space, one line.
interface GateReport {
  ok: boolean;
  codePoints: number;
  lines: number;
}

function validateEntry(text: string): GateReport {
  const codePoints = [...text].length;
  const lines = text.split("\n").length;
  const ok =
    codePoints >= 1 &&
    codePoints <= 199 &&
    text.trim().length > 0 &&
    lines === 1;
  return { ok, codePoints, lines };
}

function verifyWritten(path: string): { text: string; sha256: string } {
  const text = readFileSync(path, "utf8");
  const sha256 = createHash("sha256").update(text, "utf8").digest("hex");
  return { text, sha256 };
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const gate = validateEntry(ENTRY);
if (!gate.ok) {
  throw new Error(
    `gate failed: ${gate.codePoints} code points, ${gate.lines} lines`,
  );
}
const outPath = `${outDir}/entry.txt`;
writeFileSync(outPath, ENTRY, "utf8");
const { text: written, sha256 } = verifyWritten(outPath);
console.log(
  `gate passes: ${gate.codePoints} code points, ${gate.lines} line, sha256 ${sha256}`,
);
console.log(`wrote ${outPath}`);
console.log(`verified: ${JSON.stringify(written)}`);
