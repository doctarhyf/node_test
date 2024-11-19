import { drawChineseEnglishTextLine } from "./prints_.mjs";
import chart from "./chart.mjs";
import doc, { fontsize, marg } from "./pdf.mjs";

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

function printChart(chart) {
  if (!chart) {
    throw new Error("Cant print undefined or empty Chart");
  }
  let y = marg * 2;

  const flatchart = chart.flat();

  const { equipe, section } = flatchart[0];
  const title = `${section}, ${equipe} / ( ${flatchart.length} )`;

  doc.setTextColor("black");
  doc.text(title, marg, marg);
  doc.setTextColor("white");

  flatchart.map((agent, i) => {
    y = drawAgentStatCard(doc, i, agent, marg, y);
  });
}

printChart(chart);
doc.save("chart.pdf");
