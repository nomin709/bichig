(function () {
  const sections = {
    vowelRows: [
      { name: "A", latin: "a", glyph: "ᠠ", sound: "back vowel", note: "Core back-vowel anchor." },
      { name: "E", latin: "e", glyph: "ᠡ", sound: "front vowel", note: "Core front-vowel anchor." },
      { name: "I", latin: "i", glyph: "ᠢ", sound: "neutral vowel", note: "Can appear with both harmony classes." },
      { name: "O", latin: "o", glyph: "ᠣ", sound: "back vowel", note: "Often confused with ᠤ." },
      { name: "U", latin: "u", glyph: "ᠤ", sound: "back vowel", note: "Often confused with ᠣ." },
      { name: "OE", latin: "oe", glyph: "ᠥ", sound: "front vowel", note: "Often confused with ᠦ." },
      { name: "UE", latin: "ue", glyph: "ᠦ", sound: "front vowel", note: "Often confused with ᠥ." },
      { name: "EE", latin: "ee", glyph: "ᠧ", sound: "extended vowel", note: "Useful in fuller chart coverage." }
    ],
    coreRows: [
      { name: "NA", latin: "n", glyph: "ᠨ", sound: "n", note: "High-frequency core consonant." },
      { name: "ANG", latin: "ng", glyph: "ᠩ", sound: "ng", note: "Train directly against ᠨ." },
      { name: "BA", latin: "b/p", glyph: "ᠪ", sound: "b~p", note: "Context can shift reading." },
      { name: "PA", latin: "p", glyph: "ᠫ", sound: "p", note: "Core p consonant." },
      { name: "QA", latin: "q/kh", glyph: "ᠬ", sound: "velar/uvular", note: "Context and harmony matter." },
      { name: "GA", latin: "g/gh", glyph: "ᠭ", sound: "g~gh", note: "One of the most context-sensitive letters." },
      { name: "MA", latin: "m", glyph: "ᠮ", sound: "m", note: "Wider profile than ᠨ." },
      { name: "LA", latin: "l", glyph: "ᠯ", sound: "l", note: "Core liquid consonant." },
      { name: "SA", latin: "s", glyph: "ᠰ", sound: "s", note: "Very common consonant." },
      { name: "SHA", latin: "sh", glyph: "ᠱ", sound: "sh", note: "Common in many charts and loans." },
      { name: "TA", latin: "t", glyph: "ᠲ", sound: "t", note: "Often confused with ᠳ." },
      { name: "DA", latin: "d", glyph: "ᠳ", sound: "d", note: "Often confused with ᠲ." },
      { name: "CHA", latin: "ch", glyph: "ᠴ", sound: "ch", note: "Core affricate." },
      { name: "JA", latin: "j", glyph: "ᠵ", sound: "j", note: "Can map to j/zh in systems." },
      { name: "YA", latin: "y", glyph: "ᠶ", sound: "y", note: "Glide-like core letter." },
      { name: "RA", latin: "r", glyph: "ᠷ", sound: "r", note: "Frequent in roots and endings." },
      { name: "WA", latin: "w", glyph: "ᠸ", sound: "w/v", note: "Frequently listed in practical modern sets." }
    ],
    extendedRows: [
      { name: "FA", latin: "f", glyph: "ᠹ", sound: "f", note: "Loanword letter." },
      { name: "KA", latin: "k", glyph: "ᠺ", sound: "k", note: "Loanword letter." },
      { name: "KHA", latin: "kh", glyph: "ᠻ", sound: "kh", note: "Extended kh form in full charts." },
      { name: "TSA", latin: "ts", glyph: "ᠼ", sound: "ts", note: "Loan affricate." },
      { name: "ZA", latin: "z", glyph: "ᠽ", sound: "z", note: "Loan consonant." },
      { name: "HAA", latin: "h", glyph: "ᠾ", sound: "h", note: "Extended h-family letter." },
      { name: "ZRA", latin: "zr", glyph: "ᠿ", sound: "zr", note: "Rare chart letter." },
      { name: "LHA", latin: "lh", glyph: "ᡀ", sound: "lh", note: "Rare chart letter." },
      { name: "ZHI", latin: "zh", glyph: "ᡁ", sound: "zh", note: "Rare chart letter." },
      { name: "CHI", latin: "chi", glyph: "ᡂ", sound: "chi", note: "Rare chart letter." }
    ]
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function forms(glyph) {
    return {
      isolate: glyph,
      initial: `${glyph}\u200D`,
      medial: `\u200D${glyph}\u200D`,
      final: `\u200D${glyph}`
    };
  }

  function glyphCell(value) {
    return `<span class="sheet-glyph">${value}</span>`;
  }

  function rowHtml(item) {
    const f = forms(item.glyph);
    return `
      <tr>
        <td>
          <span class="sheet-name">${item.name}</span>
          <span class="sheet-sub">${item.latin}</span>
        </td>
        <td class="sheet-glyph-cell">${glyphCell(f.isolate)}</td>
        <td class="sheet-glyph-cell">${glyphCell(f.initial)}</td>
        <td class="sheet-glyph-cell">${glyphCell(f.medial)}</td>
        <td class="sheet-glyph-cell">${glyphCell(f.final)}</td>
        <td>${item.sound}</td>
        <td>${item.note}</td>
      </tr>
    `;
  }

  function renderSection(targetId, rows) {
    const tbody = byId(targetId);
    tbody.innerHTML = rows.map(rowHtml).join("");
  }

  function init() {
    renderSection("vowelRows", sections.vowelRows);
    renderSection("coreRows", sections.coreRows);
    renderSection("extendedRows", sections.extendedRows);

    const total = sections.vowelRows.length + sections.coreRows.length + sections.extendedRows.length;
    byId("sheetTotal").textContent = String(total);
  }

  init();
})();
