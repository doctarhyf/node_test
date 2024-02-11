import GetRoulemenDaysData from "./GetRoulemenDaysData.mjs";
import { MONTHS, POSTE, SHIFT_HOURS_ZH } from "./flow";
import { jsPDF } from "jspdf";

const LOGO_GCK_BASE_64 =
  "data:image/png;base64,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";

const LOGO_RATIO = 4;
const LOGOW = 286;
const LOGOH = 66;
// Default export is a4 paper, portrait, using millimeters for units
const orientation = "landscape";

export const CustomSortByListPriority = (a, b) => {
  const ata = a.list_priority;
  const atb = b.list_priority;

  return ata - atb;
};

export function formatFrenchDate(inputDate) {
  // Assuming inputDate is either a JavaScript Date object or a date string
  const date = new Date(inputDate);

  // Format the date using the French locale
  const formattedDate = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return formattedDate;
}

export const FFD = formatFrenchDate;

export function getDaysInMonth(y, m, doNotAddOne) {
  if (doNotAddOne) m -= 1;
  const lastDayOfMonth = new Date(y, m + 1, 0).getDate();
  //console.log(new Date(y, m + 1, 0).toLocaleDateString());
  return lastDayOfMonth;
}

export function CountAgentsByPostType(agentsList, k_poste) {
  const propName = "poste";
  const propVal = POSTE[k_poste];

  return agentsList.filter((it, i) => it[propName] === propVal).length;
}

export function CountAgentsByPropEqVal(agentsList, propName, propVal) {
  return agentsList.filter((it, i) => it[propName] === propVal).length;
}

export function GeneratePDF(agents_names, list_title) {
  const doc = new jsPDF({ orientation: orientation });
  const PG_W = orientation === "landscape" ? 297 : 210;
  const PG_H = orientation === "landscape" ? 210 : 297;

  const logo =
    "data:image/png;base64,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";
  const MARG = 15;
  const LOGO_X = MARG;
  const LOGO_Y = 10;
  const LOGO_W = (293 / 10) * 2;
  const LOGO_H = (66 / 10) * 2;

  doc.setFontSize(12);
  const date = formatFrenchDate(new Date());
  let { w, h } = doc.getTextDimensions(date);
  doc.text(date, PG_W - w - MARG, MARG);

  doc.setFontSize(16);

  doc.addImage(logo, "PNG", LOGO_X, LOGO_Y, LOGO_W, LOGO_H);
  doc.line(MARG, LOGO_H + MARG, PG_W - MARG, LOGO_H + MARG);

  let title = `NOM DES AGENTS DE L'ATELIER CIMENT`;
  doc.text(title, LOGO_W + MARG * 2, LOGO_H + MARG / 1.5);
  doc.setFontSize(12);

  let dims = doc.getTextDimensions(agents_names);

  const PG_CONT_Y = MARG * 2.5;
  agents_names.map((it, i) => {
    let x = MARG;
    let y = PG_CONT_Y + i * 10;

    if (i > 15) {
      x = dims.w + 30;
      y = PG_CONT_Y + (i - 16) * 10;
    }

    if (i > 31) {
      x = dims.w * 2 + 35;
      y = PG_CONT_Y + (i - 32) * 10;
    }

    const txt = `${i + 1}. ${it}`;
    const d = doc.getTextDimensions(txt);
    doc.text(txt, x, y);
  });

  const equipe =
    list_title && list_title !== ""
      ? "Equipe   :" + list_title
      : "Equipe   : _______________";

  const sig_block = [
    "Signature: _______________",
    "",
    equipe,
    "",
    "Heure    : _______________",
    "",
    `Total    : ${agents_names.length} Agent(s)`,
  ];

  dims = doc.getTextDimensions(sig_block);
  const sig_x = dims.w * 3 + 30 * 2;
  const sig_y = PG_CONT_Y + MARG / 4;
  doc.text(sig_block, sig_x, sig_y);
  const sp = MARG / 4;
  doc.rect(sig_x - sp, sig_y - sp * 2, dims.w + sp * 2, dims.h + sp * 2);
  doc.save("agents.pdf");
}

function addLogo(doc) {
  doc.addImage(
    LOGO_GCK_BASE_64,
    "PNG",
    10,
    10,
    LOGOW / LOGO_RATIO,
    LOGOH / LOGO_RATIO
  );
}

function addTitle(doc, agents) {
  if (agents.length === 0) {
    throw new Error("Agents length must not be zero!");
    return;
  }
  let { equipe, section } = agents[0];
  let date = new Date().toLocaleDateString();

  let title = `NOM DES AGENTS DE L'ATELIER CIMENT, ${section} EQUIPE ${equipe}, le ${date}`;
  doc.setFontSize(12);
  const x = 10;
  const y = LOGOH / LOGO_RATIO + 20;
  doc.text(title, x, y);
  doc.line(x, y + 2.5, 180, y + 2.5);
}

function fcap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function addAgentsNames(doc, agents) {
  if (agents.length === 0) {
    throw new Error("Agents length must not be zero!");
    return;
  }

  doc.setFontSize(10);
  const x = 10;
  let y;
  agents.forEach((agent, i) => {
    let nom = `${i + 1}. ${agent.nom} ${agent.postnom} ${fcap(agent.prenom)}`;

    y = LOGOH / 2 + 10 + (i + 1) * 8;
    doc.text(nom, x, y);
    if (i === agents.length - 1) doc.line(x, y + 2.5, 180, y + 2.5);
  });

  doc.setFontSize(12);
  doc.text(`TOTAL :  ${agents.length} Agent(s)`, x, y + 10);
}

export function printPDF1(agents) {
  if (agents.length === 0) {
    const msg = `Agents list is empty!`;

    alert(msg);
    throw new Error(msg);
    return;
  }

  const { equipe, section } = agents[0];

  const doc = new jsPDF();
  addLogo(doc);
  addTitle(doc, agents);
  addAgentsNames(doc, agents);
  doc.save(`${section}_${equipe}.pdf`);
}

export function GroupBySectionAndEquipe(data) {
  return data.reduce((result, item) => {
    const sectionKey = item.section;
    const equipeKey = item.equipe;

    // Check if the section exists in the result object
    if (!result[sectionKey]) {
      result[sectionKey] = {};
    }

    // Check if the equipe exists in the section
    if (!result[sectionKey][equipeKey]) {
      result[sectionKey][equipeKey] = [];
    }

    // Push the current item to the appropriate equipe in the section
    result[sectionKey][equipeKey].push(item);

    return result;
  }, {});
}

export function _(ref) {
  if (ref === undefined) return;
  return ref.current.value;
}

export function ParseYearRepport(year_data) {
  let repport = { type: "Annuel" };
  let sacs = 0;
  let t = 0;
  let ret = 0;
  let ajt = 0;
  let camions = 0;
  repport.date = year_data[0];
  Object.values(year_data[1]).map((m, i) => {
    Object.values(m).map((d, i) => {
      Object.values(d).map((shift, i) => {
        sacs += Number(shift.sacs);
        ret += Number(shift.retours);
        ajt += Number(shift.ajouts);
        t = sacs / 20;
        camions += Number(shift.camions);
      });
    });
  });
  repport.sacs = sacs + " Sacs";
  repport.tonnage = t + " T";
  repport.camions = camions;
  repport.retours = ret;
  repport.ajouts = ajt;

  return repport;
}

export function ParseMonthRepport(month_data) {
  const [y, m] = month_data[0].split("-");

  let repport = {
    type: "Mensuel",
    date: `Mois ${MONTHS[m]} ${y}`,
  };
  let sacs = 0;
  let t = 0;
  let ret = 0;
  let ajt = 0;
  let camions = 0;

  Object.values(month_data[1]).map((d, i) => {
    Object.values(d).map((shift, i) => {
      sacs += Number(shift.sacs);
      ret += Number(shift.retours);
      ajt += Number(shift.ajouts);
      t = sacs / 20;
      camions += Number(shift.camions);
    });
  });

  repport.sacs = sacs + " Sacs";
  repport.tonnage = t + " T";
  repport.camions = camions;
  repport.retours = ret;
  repport.ajouts = ajt;

  return repport;
}

export function ParseDayRepport(day_data) {
  const date_str = day_data[0];
  let [y, m, d] = date_str.split("-");

  if (m === undefined && d === undefined && date_str.indexOf("_") !== -1) {
    [y, m, d] = date_str.split("_");
  }

  console.log("ParseDayRepport", day_data);

  let repport = {
    type: "Journalier",

    date: `Du ${d} ${MONTHS[m]} ${y}`,
  };
  let sacs = 0;
  let t = 0;
  let ret = 0;
  let ajt = 0;
  let camions = 0;
  let bonus = 0;

  Object.values(day_data[1]).map((shift, i) => {
    sacs += Number(shift.sacs);
    ret += Number(shift.retours);
    ajt += Number(shift.ajouts);
    t = sacs / 20;
    camions += Number(shift.camions);
  });

  repport.sacs = sacs;
  repport.tonnage = t;
  repport.camions = camions;
  repport.retours = ret;
  repport.ajouts = ajt;
  repport.data = day_data[1];
  return repport;
}

export const customSortByDate = (a, b) => {
  const lastTwoCharsA = a.code.slice(-2);
  const lastTwoCharsB = b.code.slice(-2);

  return lastTwoCharsA.localeCompare(lastTwoCharsB);
};

export function CorrectZeroMonthIndexDisplay(dateStr, splitter = "-") {
  let [y, m, d] = dateStr.split(splitter);
  m = Number(m) + 1;
  if (d === undefined) return `${y}/${m}`;
  return `${y}/${m}/${d}`;
}

export const customSortDaysArray = (a, b) => {
  const dateA = Number(a[0].split("-")[2]); //.code.slice(-2);
  const dateB = Number(b[0].split("-")[2]); //.code.slice(-2);

  return dateA - dateB; //lastTwoCharsA.localeCompare(lastTwoCharsB);
};

export function getRouelemtDaysLetters2(year, month) {
  // Calculate the 21st of the current month
  let monthIndex = Number(month);
  const startDate = new Date(year, monthIndex, 21);

  // Calculate the 20th of the next month
  const endDate = new Date(year, monthIndex + 1, 20);

  const dayNames = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayName = currentDate
      .toLocaleDateString("fr-FR", { weekday: "long" })
      .charAt(0)
      .toUpperCase();
    dayNames.push(dayName);
    // console.log(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dayNames;
}

export function getRouelemtDaysLetters(year, monthIndex) {
  // Ensure the monthIndex is between 0 (January) and 11 (December)
  monthIndex = monthIndex - 1;
  monthIndex = (monthIndex + 12) % 12;

  // Calculate the 21st of the current month
  const startDate = new Date(year, monthIndex, 21);

  // Calculate the 20th of the next month
  const endDate = new Date(year, monthIndex + 1, 20);

  const dayNames = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayName = currentDate
      .toLocaleDateString("fr-FR", { weekday: "long" })
      .charAt(0)
      .toUpperCase();
    dayNames.push(dayName);
    // console.log(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  //console.log(startDate, endDate);

  return dayNames;
}

export function ParseShiftRepport(shift_data) {
  //console.log("ssddtt => ", shift_data);

  const shift = shift_data[1];
  const [t, s, y, m, d] = shift.code.split("_");

  let repport = {
    type: " de Chargement",
    date: `Equipe ${t}, de ${SHIFT_HOURS_ZH[s][2]}, ${SHIFT_HOURS_ZH[s][0]}, le ${d} ${MONTHS[m]} ${y}, `,
  };

  repport.id = shift.id;
  repport.equipe = t;
  repport.heure = `${SHIFT_HOURS_ZH[s][0]}, ${SHIFT_HOURS_ZH[s][2]}`;
  repport.sacs = shift.sacs;
  repport.camions = shift.camions;
  repport.tonnage = Number(shift.sacs / 20);
  repport.code = shift.code;
  repport.retours = shift.retours;
  repport.ajouts = shift.ajouts;
  repport.dechires = shift.dechires;
  const bonus_marg_t = repport.tonnage - 600 < 0 ? 0 : repport.tonnage - 600;
  const bonus_marg_cdf = bonus_marg_t * 1000;
  repport.bonus = bonus_marg_cdf;

  const upd = {
    id: shift.id,
    shift: s,
    team: t, //SHIF_HOURS_ZH[shift.code[0]][1],
    date: `${d}/${m}/${y}`,
    sacs: shift.sacs,
    camions: shift.camions,
    retours: shift.retours,
    ajouts: shift.ajouts,
    dechires: shift.dechires,
  };

  repport.upd = JSON.stringify(upd);
  return repport;
}

function isDateBetween20thAnd21st(year, month, day) {
  // Create a Date object for the input date
  const inputDate = new Date(year, month - 1, day); // Month is 0-based in JavaScript

  // Get the current date
  const currentDate = new Date();

  // Get the 20th of the current month
  const startRange = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    20
  );

  // Get the 21st of the next month
  let endRange = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    21
  );

  // Adjust the endRange if it goes to the next year
  if (endRange.getMonth() === 0) {
    endRange = new Date(currentDate.getFullYear() + 1, 0, 21);
  }

  // Check if the input date is between startRange and endRange
  return inputDate >= startRange && inputDate <= endRange;
}

export function GetDatesPartsFromShiftCode(shift_code) {
  if (shift_code === undefined) return;

  const [t, s, y, m, d] = shift_code.split("_");

  return { y: Number(y), m: Number(m), d: Number(d) };
}

export function GetTodaysDateYMDObject() {
  const y = new Date().getFullYear();
  const m = new Date().getMonth();
  const d = new Date().getDate();

  return { y: y, m: m, d: d };
}
