export function detectCharacterType(char) {
  if (/[\u4e00-\u9fff]/.test(char)) {
    return "zh";
  } else if (/[A-Za-z]/.test(char)) {
    return "lat";
  } else {
    return "Other";
  }
}

export function genZHLATTokens(text) {
  let keys = [];
  let new_str = "";
  let tokensArr = [];

  text.split("").forEach((char, i) => {
    const detectedKey = detectCharacterType(char);
    keys.push(detectedKey);

    if (i > 0 && detectedKey !== keys[i - 1]) {
      new_str = new_str.concat(`$$`);
      new_str = new_str.concat(char);
    } else {
      new_str = new_str.concat(char);
    }
  });

  new_str.split("$$").forEach((it, i) => {
    const k = detectCharacterType(it[0]);
    const tokensObj = { [k]: it };
    tokensArr.push(tokensObj);
  });

  console.log(tokensArr);
  return tokensArr;
}
