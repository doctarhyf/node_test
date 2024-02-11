import { jsPDF } from "jspdf";

import { getDaysInMonth, formatFrenchDate } from "./func.mjs";
import { MONTHS, SUPERVISORS } from "./flow";
const orientation = "landscape";
const doc = new jsPDF({ orientation: orientation });
let r = doc.addFont(
  "fonts/DroidSansFallback.ttf",
  "DroidSansFallback",
  "normal"
);
const PG_W = orientation === "landscape" ? 297 : 210;
const PG_H = orientation === "landscape" ? 210 : 297;
const LOGO_H = (66 / 10) * 2;
const PAGE_MARG = 15;
const FONT_SIZE = 8;
const BOX_WIDTH_SPACE_PCT = 1.1;

function hline(doc, x, y, len) {
  doc.line(x, y, x + len, y);
}

function vline(doc, x, y, len) {
  doc.line(x, y, x, y + len);
}

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

function ls_food(agents_names) {
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
  const date = new Date().toDateString();
  let { w, h } = doc.getTextDimensions(date);
  doc.text(date, PG_W - w - MARG, MARG);

  doc.setFontSize(16);

  doc.addImage(logo, "PNG", LOGO_X, LOGO_Y, LOGO_W, LOGO_H);
  doc.line(MARG, LOGO_H + MARG, PG_W - MARG, LOGO_H + MARG);

  let title = `NOMS DES AGENTS CIMETERIE`;
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

    const txt = `${i + 1}. ${it}`;
    const d = doc.getTextDimensions(txt);
    doc.text(txt, x, y);
  });

  const sig_block = [
    "Signature: _______________",
    "",
    "Equipe   : _______________",
    "",
    "Heure    : _______H_______",
    "",
    `Total    : ${agents_names.length} Agent(s)`,
  ];

  dims = doc.getTextDimensions(sig_block);
  const sig_x = dims.w * 2 + 30 * 2;
  const sig_y = PG_CONT_Y + MARG / 4;
  doc.text(sig_block, sig_x, sig_y);
  const sp = MARG / 4;
  doc.rect(sig_x - sp, sig_y - sp * 2, dims.w + sp * 2, dims.h + sp * 2);
  doc.save("a4.pdf");
}

function drawLogo(doc) {
  const logo =
    "data:image/png;base64,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";
  const MARG = 15;
  const LOGO_X = MARG;
  const LOGO_Y = 10;
  const LOGO_W = (293 / 10) * 2;
  const LOGO_H = (66 / 10) * 2;

  doc.setFontSize(12);
  const date = new Date().toDateString();
  let { w, h } = doc.getTextDimensions(date);
  doc.text(date, PG_W - w - MARG, MARG);

  doc.setFontSize(16);

  doc.addImage(logo, "PNG", LOGO_X, LOGO_Y, LOGO_W, LOGO_H);

  return { x: LOGO_X, y: LOGO_Y, w: LOGO_W, h: LOGO_H };
}

function draw_en_tete(
  doc,
  agent_data,
  page_margin,
  page_width,
  logo_height,
  onGetHeaderHeight
) {
  const logo =
    "data:image/png;base64,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";

  const LOGO_X = page_margin;
  const LOGO_Y = 10;
  const LOGO_W = (293 / 10) * 2;

  doc.setFontSize(12);
  const date = new Date().toDateString();
  let { w, h } = doc.getTextDimensions(date);
  doc.text(date, page_width - w - page_margin, page_margin);

  // doc.setFontSize(16);

  doc.addImage(logo, "PNG", LOGO_X, LOGO_Y, LOGO_W, logo_height);

  const fontSize = 12;
  const lineHeight = fontSize / 2;

  const title_y = 30;

  let poste_zh = "岗位"; // postes_zh_array[poste] !!!!!

  const text_gck = [
    { lat: "GCK" },
    { zh: "公司水泥线水泥" },
    { lat: " ' " },
    { zh: poste_zh },
    { lat: " ' " },
    { zh: "名单" },
  ];
  const text_poste = [
    { lat: `${agent_data.poste}/` },
    { zh: "" },
    { lat: ": ATELIER DE CIMENT" },
  ];

  let cury = agent_data.year;
  let curm = agent_data.month - 1;
  let nextm = curm + 2 > 12 ? 1 : curm + 1;

  let curmn = getFrenchMonthName(curm + 1).toUpperCase();
  let nextmn = getFrenchMonthName(nextm + 1).toUpperCase();

  const text_roulement_month = [
    { lat: `${curmn} - ${nextmn} (${curm + 2 > 12 ? cury + 1 : cury}` },
    { zh: "年" },
    { lat: curm + 2 + "" },
    { zh: "月" },
    { lat: ")" },
  ];

  drawChineseEnglishTextLine(doc, page_margin, title_y, fontSize, text_gck);
  drawChineseEnglishTextLine(
    doc,
    page_margin,
    title_y + lineHeight,
    fontSize,
    text_poste
  );
  drawChineseEnglishTextLine(
    doc,

    page_margin,
    title_y + lineHeight * 2,
    fontSize,
    text_roulement_month
  );

  onGetHeaderHeight && onGetHeaderHeight(title_y + lineHeight * 3);
}

const agents_food = [...Array(20).fill("MUTUNDA KOJI Franvale")];
const agents_rl = [
  ...Array(20).fill({
    nom: "MUTUNDA KOJI Franvale",
    rld: "JJPPNNRRJJPPNNRRJJPPNNRRJJPPNNR",
  }),
];

function getFrenchMonthName(index) {
  const month = new Date(2000, index, 1); // Using any year, day 1 to get a consistent result
  const monthName = month.toLocaleString("fr-FR", { month: "long" });
  return monthName;
}

function centeTextInRect(
  doc,
  x,
  y,
  box_marg_pct,
  fontSize,
  textTokens,
  subTextTokenz
) {
  let tokens = textTokens;

  let { h: text_h, w: text_w } = getTextTokensDimensions(doc, fontSize, tokens);

  const box_w = text_w + (text_w * box_marg_pct - text_w);
  const box_h = fontSize;

  let text_x = x + (box_w - text_w) / 2;
  let text_y = y + fontSize / 2 + text_h / 2;

  if (subTextTokenz) {
    tokens = subTextTokenz;
    text_w = getTextTokensDimensions(doc, fontSize, subTextTokenz).w;
    text_x = x + (box_w - text_w) / 2;
  }

  drawChineseEnglishTextLine(doc, text_x, text_y, fontSize, tokens);
  doc.rect(x, y, box_w, box_h);
  const rect = { x: x, y: y, w: box_w, h: box_h };
  return rect;
}

function drawTextInRect(doc, text, font_size, x, y, w, h) {
  const origi_fsize = doc.getFontSize();
  doc.setFontSize(font_size);
  const { w: text_w, h: text_h } = doc.getTextDimensions(text);
  let text_x = x + (w - text_w) / 2;
  let text_y = y + h * 0.7;
  doc.text(text, text_x, text_y);
  doc.setFontSize(origi_fsize);
}

function getTextTokensDimensions(doc, font_size, tokens) {
  const orig_font_size = doc.getFontSize();
  doc.setFontSize(font_size);
  const lat_font_name = "helvetica";
  const zh_font_name = "DroidSansFallback";
  let tw = 0;
  let th = 0;
  tokens.forEach((t, i) => {
    const k = Object.keys(t)[0];
    const text = Object.values(t)[0];

    if (k === "lat") {
      doc.setFont(lat_font_name);
    }

    if (k === "zh") {
      doc.setFont(zh_font_name);
    }
    const { w, h } = doc.getTextDimensions(text);
    tw += w;
    th = h;

    ////console.log(w, text);
  });

  doc.setFont(lat_font_name);
  doc.setFontSize(orig_font_size);
  return { w: tw, h: th };
}

function getDayName(dateString, oneLetter) {
  const daysOfWeekEn = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const daysOfWeekFr = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  const date = new Date(dateString);

  ////console.log(` date => ${date}, dateString => ${dateString}`);
  const dayOfWeekIndex = date.getDay();

  // Get the day name from the array
  const dayName = daysOfWeekFr[dayOfWeekIndex];

  return oneLetter ? dayName[0] : dayName;
}

function print_agent_roulement(doc, agent_data, print_empty) {
  // Delete all existing pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = pageCount; i >= 1; i--) {
    doc.deletePage(i);
  }

  // Add a new, single page
  doc.addPage();
  const { matricule, month, year, nom, postnom } = agent_data;

  const fname = `${matricule}_${nom.fr.replaceAll(" ", "_")}_${
    MONTHS[month]
  }_${year}.pdf`;
  //console.log(fname);
  let days_letters = [];
  const array_rld = agent_data.rld.split("");

  const END_DATE = array_rld.length;
  const num_days = array_rld.length;
  let date_idx = 21;
  let month_idx = month + 1;
  let inNextMonth = false;
  let lastDate = getDaysInMonth(year, month);

  array_rld.map((d, i) => {
    if (date_idx > lastDate) {
      date_idx = 1;
      if (inNextMonth === false) {
        month_idx += 1;
        inNextMonth = true;
      }
    }

    let ds = `${month_idx}/${date_idx}/${year}`;
    let dt = new Date(ds).toString();
    let dname = getDayName(ds, true);
    //console.log(`ds => ${ds}, dt => ${dt.split(" ")[0]}, dname => ${dname}`);
    days_letters[i] = dname;
    date_idx++;
  });

  //console.log(days_letters);

  doc.setFontSize(FONT_SIZE);
  draw_en_tete(doc, agent_data, PAGE_MARG, PG_W, LOGO_H, (h) => {
    let text_tokens = [{ lat: "Num / " }, { zh: "序号" }];

    hline(doc, PAGE_MARG, h, PG_W - PAGE_MARG * 2);

    let rect_row_num = { y: h };

    rect_row_num = centeTextInRect(
      doc,
      PAGE_MARG,
      rect_row_num.y + FONT_SIZE,
      BOX_WIDTH_SPACE_PCT,
      FONT_SIZE,
      text_tokens
    );

    rect_row_num = centeTextInRect(
      doc,
      rect_row_num.x,
      rect_row_num.y + FONT_SIZE,
      BOX_WIDTH_SPACE_PCT,
      FONT_SIZE,
      text_tokens,
      [{ lat: "13" }]
    );

    text_tokens = [{ lat: agent_data.nom.fr }, { zh: agent_data.nom.zh }];
    let rect_row_agent = centeTextInRect(
      doc,
      PAGE_MARG + rect_row_num.w,
      h + FONT_SIZE,
      BOX_WIDTH_SPACE_PCT,
      FONT_SIZE,
      text_tokens,
      [{ lat: "AGENT/" }, { zh: "工人" }]
    );

    rect_row_agent = centeTextInRect(
      doc,
      PAGE_MARG + rect_row_num.w,
      rect_row_agent.y + FONT_SIZE,
      BOX_WIDTH_SPACE_PCT,
      FONT_SIZE,
      text_tokens
    );

    text_tokens = [{ lat: "MAT./" }, { zh: "工号" }];
    let rect_row_mat = centeTextInRect(
      doc,
      PAGE_MARG + rect_row_num.w + rect_row_agent.w,
      h + FONT_SIZE,
      BOX_WIDTH_SPACE_PCT,
      FONT_SIZE,
      text_tokens
    );

    rect_row_mat = centeTextInRect(
      doc,
      rect_row_mat.x,
      rect_row_mat.y + FONT_SIZE,
      BOX_WIDTH_SPACE_PCT,
      FONT_SIZE,
      text_tokens,
      [{ lat: matricule }]
    );
    doc.rect(
      PAGE_MARG,
      h,
      rect_row_num.w + rect_row_agent.w + rect_row_mat.w,
      FONT_SIZE
    );

    let day_box_w =
      (PG_W - PAGE_MARG - (rect_row_mat.x + rect_row_mat.w)) / num_days;

    const days_x_start = rect_row_mat.x + rect_row_mat.w;
    let day_boxes_w;
    const day_box_h = rect_row_mat.h;
    let date = 21;
    array_rld.forEach((el, i) => {
      day_boxes_w = i * day_box_w;

      const day_box_y = rect_row_mat.y - FONT_SIZE * 2;
      const date_box_y = day_box_y + FONT_SIZE;
      const date_x = days_x_start + i * day_box_w;
      const rld_data_y = rect_row_mat.y;

      doc.rect(date_x, day_box_y, day_box_w, day_box_h);
      drawTextInRect(
        doc,
        days_letters[i],
        FONT_SIZE,
        date_x,
        day_box_y,
        day_box_w,
        day_box_h
      );
      doc.rect(date_x, date_box_y, day_box_w, day_box_h);

      if (date > END_DATE) date = 1;
      drawTextInRect(
        doc,
        date + "",
        FONT_SIZE,
        date_x,
        date_box_y,
        day_box_w,
        day_box_h
      );
      date += 1;

      doc.rect(date_x, rld_data_y, day_box_w, day_box_h);
      //doc.text(el, date_x, rld_data_y + FONT_SIZE / 2);

      drawTextInRect(
        doc,
        print_empty ? " " : el,
        FONT_SIZE,
        date_x,
        rld_data_y,
        day_box_w,
        day_box_h
      );
    });
  });

  doc.save(fname);
}

function print_agents_list_roulement(agents_rl) {
  drawLogo();

  const rld_data = agents_rl[0].rld;
  const num_days = rld_data.split("").length;

  const marg = 20;
  const y_start = LOGO_H * 3;

  let names_w = 0;
  agents_rl.map((it, i) => {
    const { nom, rld } = it;
    let line_y = y_start + i * 10;
    //doc.line(marg, line_y, PG_W - marg, line_y);
    hline(doc, marg, line_y, PG_W - marg * 2);
    const name_text_dims = doc.getTextDimensions(it.nom);

    //doc.text(it.nom, marg, y);
    //doc.line(dim.w, y, dim.w, y + 10);
    //doc.line(marg, y, marg, y + 10);

    const h_line_len = 10;
    const text_sp_pct = 0.1;
    const x_sp_pct = marg * text_sp_pct;
    const y_sp_pct = -marg * text_sp_pct;
    vline(doc, marg, line_y, marg, h_line_len);
    vline(doc, marg + name_text_dims.w, line_y, marg, h_line_len);

    let rest_w = PG_W - marg * 2 - name_text_dims.w;
    let space = rest_w / num_days;

    [...Array(num_days)].map((it, i) => {
      let rld_text = rld[i];
      let box_x = marg + name_text_dims.w + i * space;
      vline(doc, box_x, line_y, h_line_len);

      let original_font_size = doc.getFontSize();
      doc.setFontSize(12);
      doc.text(rld_text, box_x + x_sp_pct, line_y + y_sp_pct);
      doc.setFontSize(original_font_size);
    });

    let original_font_size = doc.getFontSize();
    doc.setFontSize(12);
    doc.text(nom, marg + x_sp_pct, line_y + y_sp_pct);
    doc.setFontSize(original_font_size);

    if (name_text_dims.w > names_w) names_w = name_text_dims.w;
  });

  doc.save("rl.pdf");
}

function print_agents_rl(agents_list, print_empty, team_name) {
  const first_el = { ...agents_list[0] };
  const days_names_el = { ...agents_list[agents_list.length - 1] };

  const doc = new jsPDF({ orientation: orientation });
  let r = doc.addFont(
    "fonts/DroidSansFallback.ttf",
    "DroidSansFallback",
    "normal"
  );

  const ofsize = doc.getFontSize();

  const largest_row_widths = getLargestRowWidths(agents_list);

  const limit = 14;
  const pw = 297;
  const ph = 210;
  const pm = 15;
  const fsize = 10;

  const LOGO_X = pm;
  const LOGO_Y = pm;
  const LOGO_W = (293 / 10) * 2;
  const LOGO_H = (66 / 10) * 2;

  draw_date(doc, pw, pm, fsize);
  let rect_logo = draw_logo(doc, LOGO_X, LOGO_Y, LOGO_W, LOGO_H);

  //gck 公司水泥厂
  const chinese_team_name = "";
  const chinese_team_name_tokens = [
    { lat: "GCK" },
    { zh: `公司水泥线水泥${chinese_team_name}名单` },
  ];

  drawChineseEnglishTextLine(
    doc,
    rect_logo.x,
    rect_logo.y + rect_logo.h + fsize / 2,
    fsize,
    chinese_team_name_tokens
  );

  console.log("team_name:", team_name);
  console.log("chinese team name :", chinese_team_name);
  console.log("chinese team name tokens", chinese_team_name_tokens);

  doc.setFontSize(fsize);

  let title_tokens = [
    { lat: "ATELIER CIMENT / " },
    { zh: " 水泥车间 " },
    { lat: ", EQUIPE: " },
    { lat: team_name || "_______________________" },
  ];

  //=================================
  let text_dims = getTextTokensDimensions(doc, fsize, title_tokens);

  let rect_title = {
    x: rect_logo.x,
    y: rect_logo.y + rect_logo.h + fsize,
    w: text_dims.w,
    h: text_dims.h,
  };

  //doc.text(title, rect_title.x, rect_title.y);
  drawChineseEnglishTextLine(
    doc,
    rect_title.x,
    rect_title.y,
    fsize,
    title_tokens
  );

  const rules_tokens = [
    { zh: "填表说明" },
    { lat: ": " },
    { zh: "出勤 " },
    { lat: "(_/), " },
    { zh: "旷空 " },
    { lat: "(A), " },
    { zh: "夜班 " },
    { lat: "(N), " },
    { zh: "休息 " },
    { lat: "(R), " },
    { zh: "病假 " },
    { lat: "(M)" },
  ];
  //填表说明：出勤（✓）， 旷空（A）， 夜班（N）， 休息（R）， 休息（R），病假（M）
  const zhdims = getTextTokensDimensions(doc, fsize, rules_tokens);
  const zhx = pw - pm - zhdims.w;
  drawChineseEnglishTextLine(
    doc,
    zhx,
    rect_logo.y + rect_logo.h + fsize,
    fsize,
    rules_tokens
  );

  let { year: y, month: m } = first_el;
  m -= 1;
  const next_m = Number(m) + 1 > 11 ? 0 : Number(m) + 1;

  //console.log("m", m, "next_m", next_m);

  const month_names_tokens = [
    {
      lat: `${getFrenchMonthName(m).toUpperCase()} - ${getFrenchMonthName(
        next_m
      ).toUpperCase()} ${y} , `,
    },
    { lat: "" + y },
    { zh: "年" },
    { lat: "" + (Number(m) + 1) },
    { zh: "月" },
  ];
  text_dims = getTextTokensDimensions(doc, fsize, month_names_tokens);

  drawChineseEnglishTextLine(
    doc,
    rect_title.x,
    rect_title.y + fsize / 2,
    fsize,
    month_names_tokens
  );

  //===============================================
  let orig_rly = LOGO_H + pm + 10;
  let rly = orig_rly;
  let rlx = pm;
  let newPage = false;

  let idx = 0;
  let line_rects;

  //draw header
  const { idx_max_w_nom, idx_max_w_mat, agent_data } = largest_row_widths;
  let header_el_w_data = { ...agents_list[idx_max_w_nom] };

  const dates = getRoulementDates(
    header_el_w_data.year,
    header_el_w_data.month
  );

  const final_data = [days_names_el, first_el, ...agents_list];
  final_data.pop();

  final_data.forEach((cur_ag_data, i) => {
    let y = newPage ? idx * fsize + pm : rly + idx * fsize + fsize;
    const is_header_row = i === 1;
    const is_day_nams_row = i === 0;
    if (is_header_row) {
      line_rects = draw_agent_single_line(
        doc,
        false,
        {
          ...cur_ag_data,
          id: "No",
          nom: { fr: "AGENT/", zh: "员工" },
          matricule: "MAT.",
          contrat: "",
          i: i,
        },
        rlx,
        y,
        pw,
        pm,
        header_el_w_data,
        dates
      );
    } else {
      line_rects = draw_agent_single_line(
        doc,
        !is_day_nams_row && print_empty,
        { ...cur_ag_data, i: i },
        rlx,
        y,
        pw,
        pm,
        header_el_w_data
      );
    }
    if (idx <= limit) {
      idx++;
    } else {
      idx = 0;
      doc.addPage();
      newPage = true;
    }
  });

  const last_rect = line_rects[line_rects.length - 1];

  drawChineseEnglishTextLine(doc, pm, last_rect.y + fsize + fsize, fsize, [
    { lat: "RESPONSABLE DU SERVICE / " },
    { zh: " 车间负责人" },
  ]);

  const sup_tokens = [{ lat: "SUPERVISEUR / " }, { zh: "班长" }];
  const dims = getTextTokensDimensions(doc, fsize, sup_tokens);

  let sup_x = pw - pm - dims.w;
  let sup_y = last_rect.y + fsize + fsize;

  drawChineseEnglishTextLine(doc, sup_x, sup_y, fsize, sup_tokens);

  doc.setFontSize(ofsize);
  doc.save("rl.pdf");
}

function draw_agent_single_line(
  doc,
  print_empty,
  agd,
  x,
  y,
  pw,
  pm,
  largest_w_data,
  dates
) {
  const ph = 210;

  const pct = 1.2;
  const fsize = 10;

  const rects = [];

  let rect = centeTextInRect(
    doc,
    x,
    y,
    pct,
    fsize,
    [{ lat: "Num/" }, { zh: "序号" }],
    [{ lat: `${agd.id + ""}` }]
  );

  rects.push({ ...rect });

  rect = centeTextInRect(
    doc,
    rect.x + rect.w,
    y,
    pct,
    fsize,
    [{ lat: largest_w_data.nom.fr }, { zh: largest_w_data.nom.zh }],
    [{ lat: agd.nom.fr }, { zh: agd.nom.zh }]
  );

  rects.push({ ...rect });

  rect = centeTextInRect(
    doc,
    rect.x + rect.w,
    y,
    pct,
    fsize,
    [{ lat: "_________" }],
    [{ lat: `${agd.contrat} ${agd.matricule}` }]
  );

  rects.push({ ...rect });

  let boxes_w = pw - pm - (rect.x + rect.w);
  rects.push({ x: rect.x + rect.w, y: rect.y, w: boxes_w, h: rect.h });
  let rld_data = agd.rld.split("");
  let days_count = agd.rld.length;
  let box_w = boxes_w / agd.rld.length;
  let box_h = rect.h;

  let box_orig_x = rect.x + rect.w;
  let box_orig_y = rect.y;
  let bx = box_orig_x;
  let by = box_orig_y;

  let box_data = dates ? dates : rld_data;

  box_data.forEach((el, i) => {
    drawTextInRect2(
      doc,
      print_empty ? " " : el,
      fsize,
      bx + i * box_w,
      by,
      box_w,
      box_h,
      true
    );
  });

  return rects;
}

function draw_logo(doc, x, y, w, h) {
  const logo =
    "data:image/png;base64,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";

  doc.addImage(logo, "PNG", x, y, w, h);
  return { x: x, y: y, w: w, h: h };
}

function draw_date(doc, page_width, page_margin, font_size, other_date) {
  const old_font_size = doc.getFontSize();
  doc.setFontSize(font_size);
  const date = formatFrenchDate(other_date || new Date()).toUpperCase();
  let { w, h } = doc.getTextDimensions(date);

  doc.text(date, page_width - w - page_margin, page_margin);
  doc.setFontSize(old_font_size);
}

function getLargestRowWidths(agents_array) {
  let widths = {};
  let keys_to_check = ["nom", "matricule"];

  agents_array.forEach((ag, i) => {
    Object.entries(ag).map((d, i) => {
      const k = d[0];
      const v = d[1];
      const len = JSON.stringify(d[1]).length;
      if (keys_to_check.includes(k)) {
        const dt = JSON.stringify(v).length;

        if (widths[k] === undefined) {
          widths[k] = [dt];
        } else {
          widths[k].push(dt);
        }
      }
    });
  });

  let max_ws = {};
  Object.entries(widths).forEach((el, i) => {
    max_ws[el[0]] = Math.max(...el[1]);
  });

  ////console.log(widths.nom);

  const { nom: max_w_nom, matricule: max_w_mat } = max_ws;
  ////console.log(max_w_nom, max_w_mat);

  const idx_max_w_nom = widths.nom.findIndex((it) => it === max_w_nom);
  ////console.log(idx_max_w_nom);

  const idx_max_w_mat = widths.matricule.findIndex((it) => it === max_w_mat);
  ////console.log(idx_max_w_mat);
  const widths_indexes = {
    idx_max_w_nom: idx_max_w_nom,
    idx_max_w_mat: idx_max_w_mat,
    agent_data: {
      nom: agents_array[idx_max_w_nom].nom,
      matricule: agents_array[idx_max_w_mat].matricule,
    },
  };
  ////console.log(widths_indexes);
  return widths_indexes;
}

function getRoulementDates(year, month) {
  let y = year;
  let m = month - 1;
  //console.log("y:", y, "m:", m);
  let dts = [];
  const last_date = getLastDateOfMonth(y, m);
  //console.log("getLastDateOfMonth:", last_date);
  const tot_days = last_date - 21 + 20;
  ////console.log(tot_days);
  let dt = 21;
  for (let index = 0; index <= tot_days; index++) {
    if (dt > last_date) dt = 1;
    dts.push(dt + "");
    dt++;
  }

  return dts;
}

function drawTextInRect2(doc, text, font_size, x, y, w, h, draw_border) {
  drawTextInRect(doc, text, font_size, x, y, w, h);
  if (draw_border) {
    doc.rect(x, y, w, h);
  }
}

function getLastDateOfMonth(year, month) {
  // Create a new Date object with the next month's first day
  let nextMonthFirstDay = new Date(year, month + 1, 1);

  // Subtract one day to get the last day of the current month
  let lastDayOfMonth = new Date(nextMonthFirstDay - 1);

  // Return the date part of the last day
  return lastDayOfMonth.getDate();
}

function GetRandomArray(len) {
  const agents_data = [];
  let fr = "MUTUNDA KOJI Franvale";
  for (let index = 0; index < len; index++) {
    let d = {
      nom: {
        fr: fr.slice(0, Math.random() * fr.length),
        zh: "库齐",
      },
      rld: "JJJNNNRRRJJJNNNRRRJJJNNNRRRJJJN",
      month: 1,
      year: 2024,
      poste: "INT",
      id: index,
      contrat: "GCK",
      matricule: "L0501",
    };
    agents_data.push(d);
  }

  return agents_data;
}

function draw_load_table(data) {
  const fname = `PRIME_${data.date.toUpperCase().replaceAll(" ", "_")}.pdf`;

  const pw = 210;
  const ph = 297;
  const pm = 15;
  const fsize = 8;

  const doc = new jsPDF();
  let fontr = doc.addFont(
    "./fonts/DroidSansFallback.ttf",
    "DroidSansFallback",
    "normal"
  );

  const rect_logo = drawLogo(doc);

  draw_date(doc, pw, pm, fsize, new Date(data.date), true);
  const rect_title = draw_title(doc, rect_logo.y + rect_logo.h, pw, pm, 12);

  draw_charg_table(doc, pw, ph, pm, rect_title, fsize, data);

  doc.save(fname);
}

function draw_title(doc, y, pw, pm, fsize) {
  const text_tokens = [
    { lat: "RAPPORT DU CHARGEMENT JOURNALIER" },
    // { zh: "每日装载报告" },
  ];
  const old_fsize = doc.getFontSize();

  doc.setFontSize(fsize);
  const { w, h } = getTextTokensDimensions(doc, fsize, text_tokens);

  const tx = pm + (pw - pm) / 2 - w / 2;
  const ty = y + fsize;

  drawChineseEnglishTextLine(doc, tx, ty, fsize, text_tokens);

  doc.setFontSize(old_fsize);

  return { x: tx, y: ty, w: w, h: h };
}

function draw_charg_table(doc, pw, ph, pm, rect_title, fsize, load_data) {
  const loads = {};

  load_data.data.forEach((ld, i) => {
    const [team, shift, year, month, day] = ld.code.split("_");
    loads[shift] = { ...ld, sup: SUPERVISORS[team] };
  });

  const deq_m = loads.M?.sup?.nom || "";
  const deq_p = loads.P?.sup?.nom || "";
  const deq_n = loads.N?.sup?.nom || "";

  const cam_m = Number(loads.M?.camions) || 0;
  const cam_p = Number(loads.P?.camions) || 0;
  const cam_n = Number(loads.N?.camions) || 0;

  const cam_m_text = cam_m === 0 ? "" : `${cam_m} CAMIONS`;
  const cam_p_text = cam_p === 0 ? "" : `${cam_p} CAMIONS`;
  const cam_n_text = cam_n === 0 ? "" : `${cam_n} CAMIONS`;

  const sacs_m = loads.M?.sacs || "0";
  const sacs_p = loads.P?.sacs || "0";
  const sacs_n = loads.N?.sacs || "0";

  const ton_m = sacs_m / 20;
  const ton_p = sacs_p / 20;
  const ton_n = sacs_n / 20;

  let ton_bonus_m =
    Number(sacs_m) / 20 - 600 < 0 ? 0 : Number(sacs_m) / 20 - 600;
  let ton_bonus_p =
    Number(sacs_p) / 20 - 600 < 0 ? 0 : Number(sacs_p) / 20 - 600;
  let ton_bonus_n =
    Number(sacs_n) / 20 - 600 < 0 ? 0 : Number(sacs_n) / 20 - 600;

  ton_bonus_m = Number(ton_bonus_m.toFixed(2));
  ton_bonus_p = Number(ton_bonus_p.toFixed(2));
  ton_bonus_n = Number(ton_bonus_n.toFixed(2));

  const prime_m = ton_bonus_m * 1000;
  const prime_p = ton_bonus_p * 1000;
  const prime_n = ton_bonus_n * 1000;

  const tot_prime_cdf = prime_m + prime_p + prime_n;
  const tot_ton = ton_bonus_m + ton_bonus_p + ton_bonus_n;

  const old_fsize = doc.getFontSize();
  doc.setFontSize(fsize);
  const table_x = pm;
  const table_y = rect_title.y + fsize;
  const table_w = pw - pm * 2;
  const table_h = ph - pm - fsize - (rect_title.y + rect_title.h);

  const boxes_rect = [];
  const cols = [19, 21, 22, 45, 23, 29, 22];
  const rows = [15, 56, 11, 56, 13, 60, 13, 13];

  const texts = [
    [
      "TEMPS",
      ["CHEF DE", "POSTE"], //"CHEF DE POSTE",
      "MACHINE",
      "NOMS DES AGENTS",
      ["NOMBRE", "DE CAMIONS", "CHARGES"],
      ["DIFFERENCE", "DE CHARGEMENT"],
      ["MONTANT", "FC"],
    ],
    [
      ["07h00", "15h00", -90],
      [deq_m, -90],
      "",
      "",
      [`${cam_m_text}`, -90],
      [
        `${sacs_m} sacs`,
        ` `,
        `(${ton_m} - 600) T`,
        " ",
        `${ton_bonus_m} T`,
        -90,
      ],
      [`${prime_m} FC`, -90],
    ],
    ["MATIN", "", "", "", "", "", ""],
    [
      ["15h00", "23h00"],
      [deq_p, -90],
      "",
      "",
      [`${cam_p_text}`, -90],
      [
        `${sacs_p} sacs`,
        ` `,
        `(${ton_p} - 600) T`,
        " ",
        `${ton_bonus_p} T`,
        -90,
      ],
      [`${prime_p} FC`, -90],
    ],
    ["APREM.", "", "", "", "", "", ""],
    [
      ["23h00", "07h00"],
      [deq_n, -90],
      "",
      "",
      [`${cam_n_text}`, -90],
      [
        `${sacs_n} sacs`,
        ` `,
        `(${ton_n} - 600) T`,
        " ",
        `${ton_bonus_n} T`,
        -90,
      ],
      [`${prime_n} FC`, -90],
    ],
    ["NUIT", "", "", "", "", "", ""],
    [
      ["TOTAL", "DU JOUR"],
      "",
      "",
      "",
      "",
      `${tot_ton} T`,
      `${tot_prime_cdf} FC`,
    ],
  ];

  let totx = 0;
  let toty = 0;
  const boxes = [];
  rows.forEach((boxh, iy) => {
    toty = rows.slice(0, iy).reduce((acc, cv) => acc + cv, 0);
    cols.forEach((boxw, ix) => {
      totx = cols.slice(0, ix).reduce((acc, cv) => acc + cv, 0);
      const box = {
        x: table_x + totx,
        y: table_y + toty,
        w: boxw,
        h: boxh,
        ix: ix,
        iy: iy,
      };

      let box_text = texts[iy][ix];
      const text_is_array = Array.isArray(box_text); // || ""; // `ix:${ix}, iy:${iy}`;
      let box_text_angle = 0;
      let align = "center";

      if (text_is_array) {
        const text_array_len = box_text.length;
        const last_el = box_text[text_array_len - 1];

        if (typeof last_el === "number") {
          box_text_angle = last_el;

          box_text = box_text.splice(0, text_array_len - 1);
          align = "left";
        }
      }

      let tvx = box.x + box.w / 2;
      let tvy = box.y + box.h / 2;

      if (box_text_angle !== 0) {
        const { w } = doc.getTextDimensions(box_text.join(""));
        tvy -= w / 2;
        //tvy = tvy -
      }

      doc.rect(box.x, box.y, box.w, box.h);
      doc.text(box_text, tvx, tvy, {
        align: align,
        angle: box_text_angle,
      });

      boxes.push(box);
    });
  });

  doc.setFontSize(old_fsize);
}

export {
  draw_load_table,
  GetRandomArray,
  hline,
  vline,
  drawChineseEnglishTextLine,
  ls_food,
  drawLogo,
  draw_en_tete,
  agents_food,
  agents_rl,
  getTextTokensDimensions,
  centeTextInRect,
  drawTextInRect,
  getDayName,
  print_agent_roulement,
  print_agents_list_roulement,
  doc,
  print_agents_rl,
};
