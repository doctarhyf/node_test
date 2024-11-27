import { drawChineseEnglishTextLine } from "./prints_.mjs";
import chart from "./chart.mjs";
import doc, { fontsize, marg } from "./pdf.mjs";
import { detectCharacterType, genZHLATTokens } from "./tokensgen.mjs";

function drawAgentStatCard(doc, i, agent, x, y) {
  if (agent.chef_deq === "OUI") agent.poste = "DEQ";
  if (agent.is_exp === "OUI") agent.poste = "EXPD";

  let { nom, postnom, prenom, poste, mingzi, matricule, phone, chef_deq } =
    agent;

  const agentdata = [
    { lat: `${i + 1}. -> ` },
    { lat: `${poste}: ` },
    { zh: mingzi },
    {
      lat: ` - ${matricule}  ${nom} ${postnom} ${prenom} `,
    },
  ];

  // finalchart.push(agentdata);
  let {
    x: xr,
    y: yr,
    w: wr,
    h: hr,
  } = drawChineseEnglishTextLine(doc, x, y, fontsize, agentdata);

  if (poste === "SUP") {
    doc.setFillColor(180, 0, 0);
  } else if (poste === "DEQ") {
    doc.setFillColor(0, 0, 180);
  } else if (poste === "OPE") {
    doc.setFillColor(0, 180, 0);
  } else if (poste === "CHARG") {
    doc.setFillColor(0, 180, 180);
  } else if (poste === "NET") {
    doc.setFillColor(180, 0, 180);
  } else if (poste === "EXP") {
    doc.setFillColor(90, 90, 170);
  } else if (poste === "DEQ") {
    doc.setFillColor(0, 0, 255);
  } else {
    doc.setFillColor(0, 0, 0);
  }

  doc.rect(
    xr - fontsize / 2,
    yr - fontsize / 2,
    wr + fontsize,
    hr + fontsize / 2,
    "F"
  );
  drawChineseEnglishTextLine(doc, x, y, fontsize, agentdata);
  y = yr + fontsize;

  return y;
}

function printChart(chart, filename) {
  if (!chart) {
    throw new Error("Cant print undefined or empty Chart");
  }
  let y = marg * 2;

  const flatchart = chart.flat();

  const { equipe, section } = flatchart[0];
  const title = `${section}, ${equipe} / ( ${flatchart.length} )`;
  if (!filename) filename = `${title.replaceAll(" ", "_")}.pdf`;

  doc.setTextColor("black");
  doc.text(title, marg, marg);
  doc.setTextColor("white");

  flatchart.map((agent, i) => {
    y = drawAgentStatCard(doc, i, agent, marg, y);
  });

  doc.save(filename);
}

const text =
  "Hello 你好 this is my text 这是我写的字.\ni want to detech for 我需要在字母里面\n check for latin and english\n 看一下那些字母是中文那些事英文\n";

const tk = genZHLATTokens(text);

drawChineseEnglishTextLine(doc, 10, 10, 10, tk);
doc.save("zhlat.pdf");
//console.log(tk);
