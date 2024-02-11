import GetRoulemenDaysData from "./GetRoulemenDaysData.mjs";
import {
  DrawLogoWithDate,
  doc,
  PAGE_MARG,
  PrintTableTotalData,
} from "./Print.mjs";

//console.log(GetRoulemenDaysData(2024, 1, 21));

const totalData = {
  DATE: { y: 2024, m: 0 },
  DATA: {
    A: {
      sacs: 117525,
      retours: 0,
      ajouts: 0,
      tonnage: 5876.25,
      camions: 230,
      dechires: 234,
      bonus: 689.75,
    },
    B: {
      sacs: 172441,
      retours: 0,
      ajouts: 0,
      tonnage: 8622.05,
      camions: 331,
      dechires: 386,
      bonus: 716.55,
    },
    C: {
      sacs: 181506,
      retours: 0,
      ajouts: 0,
      tonnage: 9075.3,
      camions: 314,
      dechires: 324,
      bonus: 1880.8,
    },
    D: {
      sacs: 187021,
      retours: 0,
      ajouts: 0,
      tonnage: 9351.050000000001,
      camions: 317,
      dechires: 367,
      bonus: 842,
    },
    TOTAL: {
      sacs: 658493,
      retours: 0,
      ajouts: 0,
      tonnage: 32924.65,
      camions: 1114,
      dechires: 1260,
      bonus: 4129.1,
    },
  },
};

PrintTableTotalData(doc, totalData);
