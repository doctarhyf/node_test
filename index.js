import { jsPDF } from "jspdf";

const data = {
  team: "A",
  y: 2024,
  m: 8,
  d: 30,
  sup: "ALBERT KANKOBWE - 刚果贝",
  shift: "NUIT - 夜班 - 23h00 - 07h00",
  s: "N",
  camions: 0,
  sacs: 15880,
  t: 794,
  dechires: 0,
};

function drawChineseEnglishTextLine(doc, x, y, fontSize, tokens) {
  const orig_font_size = doc.getFontSize();
  doc.setFontSize(fontSize);
  let orig_x = x;

  const lat_font_name = "helvetica";
  const zh_font_name = "DroidSansFallback";
  tokens.forEach((t, i) => {
    const k = Object.keys(t)[0];
    const text = Object.values(t)[0];

    if (k === "lat") {
      doc.setFont(lat_font_name);
      doc.text(orig_x, y, text);
    }

    if (k === "zh") {
      doc.setFont(zh_font_name);
      doc.text(orig_x, y, text);
    }
    const { w } = doc.getTextDimensions(text);
    orig_x += w;
  });
  doc.setFontSize(orig_font_size);
  doc.setFont(lat_font_name);
}

function printBaozhuang(data) {
  /*
{
  team: "A",
  y: 2024,
  m: 8,
  d: 30,
  sup: "ALBERT KANKOBWE - 刚果贝",
  shift: "NUIT - 夜班 - 23h00 - 07h00",
  s: "N",
  camions: 0,
  sacs: 15880,
  t: 794,
  dechires: 0,
};
*/

  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  let r = doc.addFont(
    "fonts/DroidSansFallback.ttf",
    "DroidSansFallback",
    "normal"
  );

  const fontSize = 12;
  doc.setFontSize(fontSize);
  const { team, s, y, m, d, sup, shift } = data;
  const marg = 10;
  const filename = `${team}_${s}_${y}_${m}_${d}.pdf`;
  const tokens_sup = sup
    .replaceAll(" -", "")
    .split(" ")
    .map((it, i) => (i === 2 ? { zh: it } : { lat: ` ${it} ` }));
  const tokens_shift = shift
    .replaceAll(" -", "")
    .split(" ")
    .map((it, i) => (i === 1 ? { zh: it } : { lat: ` ${it} ` }));

  drawChineseEnglishTextLine(doc, marg, marg, fontSize, tokens_shift);

  doc.save(filename);
}

printBaozhuang(data);
