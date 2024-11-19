import { jsPDF } from "jspdf";

const pw = 210;
const ph = 297;
const marg = 10;
const fontsize = 10;
const doc = new jsPDF();
let r = doc.addFont(
  "fonts/DroidSansFallback.ttf",
  "DroidSansFallback",
  "normal"
);
doc.setFontSize(fontsize);

export { pw, ph, marg, fontsize };

export default doc;
