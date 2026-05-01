(function () {
  const CYRILLIC_RE = /[\u0400-\u04FF]/;
  const LATIN_RE = /[A-Za-z]/;
  const WORD_ONLY_RE = /^[A-Za-z\u0400-\u04FFӨөҮүЁёҢңҺһ]+$/;

  const characterDeck = [
    { glyph: "ᠠ", name: "A", cyr: "а", latin: "a", hint: "Base back-vowel form used very often." },
    { glyph: "ᠡ", name: "E", cyr: "э", latin: "e", hint: "Core front-vowel form." },
    { glyph: "ᠢ", name: "I", cyr: "и", latin: "i", hint: "Narrow body, common medial shape." },
    { glyph: "ᠣ", name: "O", cyr: "о", latin: "o", hint: "Back rounded vowel." },
    { glyph: "ᠤ", name: "U", cyr: "у", latin: "u", hint: "Back rounded vowel; compare with ᠣ." },
    { glyph: "ᠥ", name: "OE", cyr: "ө", latin: "oe", hint: "Front rounded vowel." },
    { glyph: "ᠦ", name: "UE", cyr: "ү", latin: "ue", hint: "Front rounded vowel; compare with ᠥ." },
    { glyph: "ᠧ", name: "EE", cyr: "е", latin: "ee", hint: "Special e-like value in some contexts." },
    { glyph: "ᠨ", name: "N", cyr: "н", latin: "n", hint: "Core consonant in many endings." },
    { glyph: "ᠩ", name: "NG", cyr: "ң", latin: "ng", hint: "Velar nasal; easy to confuse with ᠨ." },
    { glyph: "ᠮ", name: "M", cyr: "м", latin: "m", hint: "Wide body; distinguish from ᠨ." },
    { glyph: "ᠯ", name: "L", cyr: "л", latin: "l", hint: "Tall and clean vertical form." },
    { glyph: "ᠷ", name: "R", cyr: "р", latin: "r", hint: "Compact center; common root consonant." },
    { glyph: "ᠪ", name: "B/P", cyr: "б/п", latin: "b", hint: "Sound can shift by context." },
    { glyph: "ᠫ", name: "P", cyr: "п", latin: "p", hint: "Borrowed/clear p in many cases." },
    { glyph: "ᠲ", name: "T", cyr: "т", latin: "t", hint: "Often paired against ᠳ." },
    { glyph: "ᠳ", name: "D", cyr: "д", latin: "d", hint: "Often paired against ᠲ." },
    { glyph: "ᠭ", name: "G/GH", cyr: "г", latin: "g", hint: "Context-driven g/gh value." },
    { glyph: "ᠬ", name: "Q/KH", cyr: "х", latin: "q", hint: "Core q/kh-like consonant tied to vowel context." },
    { glyph: "ᠰ", name: "S", cyr: "с", latin: "s", hint: "High-frequency consonant." },
    { glyph: "ᠱ", name: "SH", cyr: "ш", latin: "sh", hint: "Postalveolar fricative." },
    { glyph: "ᠴ", name: "CH", cyr: "ч", latin: "ch", hint: "Affricate consonant." },
    { glyph: "ᠵ", name: "J", cyr: "ж", latin: "j", hint: "Can align with j/zh transliteration styles." },
    { glyph: "ᠶ", name: "Y", cyr: "й/я", latin: "y", hint: "Semivowel; used in yu/ya sequences." },
    { glyph: "ᠸ", name: "W", cyr: "в", latin: "w", hint: "W/v-like borrowed behavior." },
    { glyph: "ᠹ", name: "F", cyr: "ф", latin: "f", hint: "Mainly in loanwords." },
    { glyph: "ᠺ", name: "K", cyr: "к", latin: "k", hint: "Borrowed/foreign words." },
    { glyph: "ᠻ", name: "KH", cyr: "х", latin: "kh", hint: "Extended/loan kha form in full charts." },
    { glyph: "ᠼ", name: "TS", cyr: "ц", latin: "ts", hint: "Affricate in borrowed items." },
    { glyph: "ᠽ", name: "Z", cyr: "з", latin: "z", hint: "Borrowed z value." },
    { glyph: "ᠾ", name: "H", cyr: "һ", latin: "h", hint: "Breathy h/kh area." },
    { glyph: "ᠿ", name: "ZR", cyr: "—", latin: "zr", hint: "Ali Gali extension." },
    { glyph: "ᡀ", name: "LH", cyr: "—", latin: "lh", hint: "Ali Gali extension." },
    { glyph: "ᡁ", name: "ZH", cyr: "ж", latin: "zh", hint: "Ali Gali extension." },
    { glyph: "ᡂ", name: "CHI", cyr: "ч", latin: "chi", hint: "Ali Gali extension." }
  ];

  const cyrToLatin = {
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "g",
    "д": "d",
    "е": "ee",
    "ё": "yo",
    "ж": "j",
    "з": "z",
    "и": "i",
    "й": "y",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "ө": "oe",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ү": "ue",
    "ф": "f",
    "х": "kh",
    "ц": "ts",
    "ч": "ch",
    "ш": "sh",
    "щ": "shch",
    "ъ": "",
    "ы": "y",
    "ь": "",
    "э": "e",
    "ю": "yu",
    "я": "ya",
    "ң": "ng",
    "һ": "h"
  };

  const cyrToTraditional = {
    "а": "ᠠ",
    "э": "ᠡ",
    "е": "ᠧ",
    "и": "ᠢ",
    "й": "ᠶ",
    "о": "ᠣ",
    "ө": "ᠥ",
    "у": "ᠤ",
    "ү": "ᠦ",
    "н": "ᠨ",
    "ң": "ᠩ",
    "м": "ᠮ",
    "л": "ᠯ",
    "с": "ᠰ",
    "ш": "ᠱ",
    "т": "ᠲ",
    "д": "ᠳ",
    "б": "ᠪ",
    "п": "ᠫ",
    "г": "ᠭ",
    "х": "ᠬ",
    "к": "ᠺ",
    "р": "ᠷ",
    "з": "ᠽ",
    "ж": "ᠵ",
    "ч": "ᠴ",
    "в": "ᠸ",
    "ф": "ᠹ",
    "ц": "ᠼ",
    "һ": "ᠾ",
    "ю": "ᠶᠦ",
    "я": "ᠶᠠ",
    "ё": "ᠶᠣ"
  };

  const latinTokenToTraditional = {
    shch: "ᠱᠴ",
    chi: "ᡂ",
    ng: "ᠩ",
    qh: "ᠻ",
    sh: "ᠱ",
    ch: "ᠴ",
    ts: "ᠼ",
    kh: "ᠬ",
    gh: "ᠭ",
    zh: "ᡁ",
    lh: "ᡀ",
    zr: "ᠿ",
    oe: "ᠥ",
    ue: "ᠦ",
    ee: "ᠧ",
    yo: "ᠶᠣ",
    yu: "ᠶᠦ",
    ya: "ᠶᠠ"
  };

  const latinSingleToTraditional = {
    a: "ᠠ",
    e: "ᠡ",
    i: "ᠢ",
    o: "ᠣ",
    u: "ᠤ",
    n: "ᠨ",
    m: "ᠮ",
    l: "ᠯ",
    r: "ᠷ",
    b: "ᠪ",
    p: "ᠫ",
    t: "ᠲ",
    d: "ᠳ",
    g: "ᠭ",
    q: "ᠬ",
    h: "ᠾ",
    s: "ᠰ",
    j: "ᠵ",
    y: "ᠶ",
    w: "ᠸ",
    v: "ᠸ",
    f: "ᠹ",
    k: "ᠺ",
    z: "ᠽ",
    x: "ᠱ"
  };

  const latinTokenOptions = {
    shch: [{ text: "ᠱᠴ", weight: 1 }],
    chi: [{ text: "ᡂ", weight: 1 }, { text: "ᠴᠢ", weight: 0.66 }],
    ng: [{ text: "ᠩ", weight: 1 }, { text: "ᠨᠭ", weight: 0.6 }],
    qh: [{ text: "ᠻ", weight: 1 }, { text: "ᠬ", weight: 0.65 }],
    sh: [{ text: "ᠱ", weight: 1 }, { text: "ᠰ", weight: 0.55 }],
    ch: [{ text: "ᠴ", weight: 1 }, { text: "ᡂ", weight: 0.58 }],
    ts: [{ text: "ᠼ", weight: 1 }, { text: "ᠴ", weight: 0.52 }],
    kh: [{ text: "ᠬ", weight: 1 }, { text: "ᠻ", weight: 0.82 }],
    gh: [{ text: "ᠭ", weight: 1 }],
    zh: [{ text: "ᡁ", weight: 1 }, { text: "ᠵ", weight: 0.75 }],
    lh: [{ text: "ᡀ", weight: 1 }, { text: "ᠯᠬ", weight: 0.44 }],
    zr: [{ text: "ᠿ", weight: 1 }, { text: "ᠽᠷ", weight: 0.5 }],
    oe: [{ text: "ᠥ", weight: 1 }],
    ue: [{ text: "ᠦ", weight: 1 }],
    ee: [{ text: "ᠧ", weight: 1 }, { text: "ᠡ", weight: 0.72 }],
    yo: [{ text: "ᠶᠣ", weight: 1 }],
    yu: [{ text: "ᠶᠦ", weight: 1 }],
    ya: [{ text: "ᠶᠠ", weight: 1 }]
  };

  const latinSingleOptions = {
    a: [{ text: "ᠠ", weight: 1 }],
    e: [{ text: "ᠡ", weight: 1 }, { text: "ᠧ", weight: 0.72 }],
    i: [{ text: "ᠢ", weight: 1 }],
    o: [{ text: "ᠣ", weight: 1 }],
    u: [{ text: "ᠤ", weight: 1 }],
    n: [{ text: "ᠨ", weight: 1 }],
    m: [{ text: "ᠮ", weight: 1 }],
    l: [{ text: "ᠯ", weight: 1 }],
    r: [{ text: "ᠷ", weight: 1 }],
    b: [{ text: "ᠪ", weight: 1 }, { text: "ᠫ", weight: 0.68 }],
    p: [{ text: "ᠫ", weight: 1 }, { text: "ᠪ", weight: 0.66 }],
    t: [{ text: "ᠲ", weight: 1 }, { text: "ᠳ", weight: 0.63 }],
    d: [{ text: "ᠳ", weight: 1 }, { text: "ᠲ", weight: 0.63 }],
    g: [{ text: "ᠭ", weight: 1 }],
    q: [{ text: "ᠬ", weight: 1 }, { text: "ᠻ", weight: 0.71 }],
    h: [{ text: "ᠾ", weight: 1 }, { text: "ᠬ", weight: 0.55 }],
    s: [{ text: "ᠰ", weight: 1 }, { text: "ᠱ", weight: 0.63 }],
    j: [{ text: "ᠵ", weight: 1 }, { text: "ᡁ", weight: 0.62 }],
    y: [{ text: "ᠶ", weight: 1 }],
    w: [{ text: "ᠸ", weight: 1 }],
    v: [{ text: "ᠸ", weight: 1 }],
    f: [{ text: "ᠹ", weight: 1 }],
    k: [{ text: "ᠺ", weight: 1 }, { text: "ᠻ", weight: 0.68 }],
    z: [{ text: "ᠽ", weight: 1 }, { text: "ᠿ", weight: 0.54 }],
    x: [{ text: "ᠱ", weight: 1 }]
  };

  const phraseOverrides = {
    "сайн байна уу": "ᠰᠠᠢᠨ ᠪᠠᠢᠨᠠ ᠤᠤ",
    "sain baina uu": "ᠰᠠᠢᠨ ᠪᠠᠢᠨᠠ ᠤᠤ",
    "сайн уу": "ᠰᠠᠢᠨ ᠤᠤ",
    "sain uu": "ᠰᠠᠢᠨ ᠤᠤ",
    "би монгол хүн": "ᠪᠢ ᠮᠣᠩᠭᠣᠯ ᠬᠦᠮ",
    "bi mongol hun": "ᠪᠢ ᠮᠣᠩᠭᠣᠯ ᠬᠦᠮ"
  };

  const wordOverridesCyr = {
    "сайн": "ᠰᠠᠢᠨ",
    "байна": "ᠪᠠᠢᠨᠠ",
    "уу": "ᠤᠤ",
    "би": "ᠪᠢ",
    "чи": "ᠴᠢ",
    "бид": "ᠪᠢᠳ",
    "та": "ᠲᠠ",
    "баяр": "ᠪᠠᠶᠠᠷ",
    "баярлалаа": "ᠪᠠᠶᠠᠷᠯᠠᠯᠠ᠎ᠠ",
    "ном": "ᠨᠣᠮ",
    "номоо": "ᠨᠣᠮᠣᠣ",
    "монгол": "ᠮᠣᠩᠭᠣᠯ",
    "хүн": "ᠬᠦᠮ",
    "хэл": "ᠬᠡᠯ",
    "сургууль": "ᠰᠤᠷᠭᠤᠤᠯ",
    "гэр": "ᠭᠡᠷ",
    "ус": "ᠤᠰ",
    "өдөр": "ᠥᠳᠦᠷ",
    "орой": "ᠣᠷᠣᠢ",
    "ээлж": "ᠧᠯᠵ",
    "эх": "ᠡᠬ",
    "эцэг": "ᠡᠴᠡᠭ",
    "эхнэр": "ᠡᠬᠨᠡᠷ",
    "хүүхэд": "ᠬᠦᠬᠡᠳ"
  };

  const wordOverridesLatin = {
    sain: "ᠰᠠᠢᠨ",
    baina: "ᠪᠠᠢᠨᠠ",
    uu: "ᠤᠤ",
    bi: "ᠪᠢ",
    chi: "ᠴᠢ",
    bid: "ᠪᠢᠳ",
    ta: "ᠲᠠ",
    bayar: "ᠪᠠᠶᠠᠷ",
    bayarlalaa: "ᠪᠠᠶᠠᠷᠯᠠᠯᠠ᠎ᠠ",
    nom: "ᠨᠣᠮ",
    mongol: "ᠮᠣᠩᠭᠣᠯ",
    hun: "ᠬᠦᠮ",
    hel: "ᠬᠡᠯ",
    surguul: "ᠰᠤᠷᠭᠤᠤᠯ",
    ger: "ᠭᠡᠷ",
    us: "ᠤᠰ",
    odor: "ᠥᠳᠦᠷ",
    oroi: "ᠣᠷᠣᠢ",
    eej: "ᠧᠯᠵ",
    eejii: "ᠧᠯᠵᠢ",
    etseg: "ᠡᠴᠡᠭ",
    ehner: "ᠡᠬᠨᠡᠷ",
    huuhed: "ᠬᠦᠬᠡᠳ"
  };

  const quizWordBank = [
    { cyr: "Сайн", latin: "sain" },
    { cyr: "Байна", latin: "baina" },
    { cyr: "Ном", latin: "nom" },
    { cyr: "Монгол", latin: "mongol" },
    { cyr: "Хүн", latin: "hun" },
    { cyr: "Хэл", latin: "hel" },
    { cyr: "Гэр", latin: "ger" },
    { cyr: "Ус", latin: "us" },
    { cyr: "Өдөр", latin: "odor" },
    { cyr: "Орой", latin: "oroi" },
    { cyr: "Эх", latin: "eh" },
    { cyr: "Эцэг", latin: "etseg" },
    { cyr: "Эхнэр", latin: "ehner" },
    { cyr: "Хүүхэд", latin: "huuhed" },
    { cyr: "Би", latin: "bi" },
    { cyr: "Чи", latin: "chi" },
    { cyr: "Бид", latin: "bid" },
    { cyr: "Та", latin: "ta" },
    { cyr: "Баяр", latin: "bayar" },
    { cyr: "Баярлалаа", latin: "bayarlalaa" },
    { cyr: "Сургууль", latin: "surguul" },
    { cyr: "Номоо", latin: "nomoo" }
  ];

  const tokenKeys = Object.keys(latinTokenToTraditional).sort((a, b) => b.length - a.length);

  function normalizeSpaces(text) {
    return String(text || "").replace(/\u00A0/g, " ");
  }

  function normalizeLatinInput(text) {
    return normalizeSpaces(text)
      .replace(/[Өө]/g, "oe")
      .replace(/[Үү]/g, "ue")
      .replace(/[Ёё]/g, "yo")
      .replace(/[Яя]/g, "ya")
      .replace(/[Юю]/g, "yu")
      .replace(/[Ōō]/g, "oo")
      .replace(/[Üü]/g, "ue")
      .replace(/[Öö]/g, "oe")
      .toLowerCase();
  }

  function normalizeCyrillicInput(text) {
    return normalizeSpaces(text).toLowerCase();
  }

  function normalizeLookupText(text, system) {
    const value = normalizeSpaces(text).trim();
    if (!value) {
      return "";
    }
    return (system === "latin" ? normalizeLatinInput(value) : normalizeCyrillicInput(value))
      .replace(/[.,!?;:'"()\-_/\\]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function detectInputSystem(text) {
    const value = normalizeSpaces(text);
    if (CYRILLIC_RE.test(value)) {
      return "cyrillic";
    }
    if (LATIN_RE.test(value)) {
      return "latin";
    }
    return "unknown";
  }

  function transliterateByMap(input, map) {
    let out = "";
    const text = normalizeSpaces(input);

    for (const ch of text) {
      const lower = ch.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(map, lower)) {
        out += map[lower];
      } else {
        out += ch;
      }
    }

    return out;
  }

  function transliterateLatinToTraditional(input) {
    const text = normalizeLatinInput(input);
    let i = 0;
    let out = "";

    while (i < text.length) {
      const ch = text[i];

      if (/\s/.test(ch)) {
        out += ch;
        i += 1;
        continue;
      }

      if (/[^a-z]/.test(ch)) {
        out += ch;
        i += 1;
        continue;
      }

      let matched = false;

      for (const token of tokenKeys) {
        if (text.startsWith(token, i)) {
          out += latinTokenToTraditional[token];
          i += token.length;
          matched = true;
          break;
        }
      }

      if (matched) {
        continue;
      }

      out += latinSingleToTraditional[ch] || ch;
      i += 1;
    }

    return out;
  }

  function splitForWordConversion(text) {
    return normalizeSpaces(text).match(/([A-Za-z\u0400-\u04FFӨөҮүЁёҢңҺһ]+|\s+|[^A-Za-z\u0400-\u04FFӨөҮүЁёҢңҺһ\s]+)/g) || [];
  }

  function isWordToken(token) {
    return WORD_ONLY_RE.test(token || "");
  }

  function normalizeTraditionalForCompare(input) {
    return normalizeSpaces(input)
      .toLowerCase()
      .replace(/[\u180E\u200B-\u200D\uFEFF]/g, "")
      .replace(/[\s\t\n\r]/g, "")
      .replace(/[.,!?;:'"()\-_/\\]/g, "");
  }

  function compareTraditional(userInput, expected) {
    return normalizeTraditionalForCompare(userInput) === normalizeTraditionalForCompare(expected);
  }

  function dedupeAndRankCandidates(rawCandidates, maxCount) {
    const merged = new Map();

    rawCandidates.forEach((candidate) => {
      const text = candidate && candidate.text ? candidate.text : "";
      const key = normalizeTraditionalForCompare(text);
      if (!key) {
        return;
      }
      const score = Number(candidate.score) || 0;
      const prev = merged.get(key);
      if (!prev || score > prev.score) {
        merged.set(key, {
          text,
          score,
          source: candidate.source || "rules",
          note: candidate.note || ""
        });
      }
    });

    const ranked = Array.from(merged.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(1, maxCount || 5));

    const top = ranked[0] ? Math.max(0.001, ranked[0].score) : 1;

    ranked.forEach((candidate) => {
      candidate.confidence = Math.max(0.01, Math.min(0.999, candidate.score / top));
    });

    return ranked;
  }

  function getLatinVowelProfile(latinInput) {
    const text = normalizeLatinInput(latinInput);
    const hasFront = /(oe|ue|ee|e)/.test(text);
    const hasBack = /[aou]/.test(text);

    if (hasFront && hasBack) {
      return "mixed";
    }
    if (hasFront) {
      return "front";
    }
    if (hasBack) {
      return "back";
    }
    return "unknown";
  }

  function getTraditionalVowelProfile(traditionalWord) {
    const chars = String(traditionalWord || "");
    const hasBack = /[ᠠᠣᠤ]/.test(chars);
    const hasFront = /[ᠡᠥᠦᠧ]/.test(chars);

    if (hasBack && hasFront) {
      return "mixed";
    }
    if (hasFront) {
      return "front";
    }
    if (hasBack) {
      return "back";
    }
    return "unknown";
  }

  function applyHarmonyHeuristic(score, candidateText, latinInput) {
    const sourceProfile = getLatinVowelProfile(latinInput);
    const targetProfile = getTraditionalVowelProfile(candidateText);

    if (sourceProfile === "unknown" || targetProfile === "unknown") {
      return score;
    }

    if (sourceProfile === "mixed") {
      return targetProfile === "mixed" ? score : score * 0.92;
    }

    if (sourceProfile === targetProfile) {
      return score;
    }

    if (targetProfile === "mixed") {
      return score * 0.9;
    }

    return score * 0.82;
  }

  function generateTraditionalCandidatesFromLatin(latinInput, maxCandidates) {
    const text = normalizeLatinInput(latinInput);
    const segments = [];
    let i = 0;

    while (i < text.length) {
      const ch = text[i];

      if (/\s/.test(ch)) {
        segments.push({ type: "fixed", text: ch });
        i += 1;
        continue;
      }

      if (/[^a-z]/.test(ch)) {
        segments.push({ type: "fixed", text: ch });
        i += 1;
        continue;
      }

      let matched = false;

      for (const token of tokenKeys) {
        if (text.startsWith(token, i)) {
          const opts = latinTokenOptions[token] || [{ text: latinTokenToTraditional[token], weight: 1 }];
          segments.push({ type: "options", options: opts });
          i += token.length;
          matched = true;
          break;
        }
      }

      if (matched) {
        continue;
      }

      const singleOpts = latinSingleOptions[ch] || [{ text: latinSingleToTraditional[ch] || ch, weight: 0.4 }];
      segments.push({ type: "options", options: singleOpts });
      i += 1;
    }

    const raw = [];
    const maxPaths = 500;

    function dfs(index, out, score, altCount) {
      if (raw.length > maxPaths) {
        return;
      }

      if (index >= segments.length) {
        raw.push({
          text: out,
          score: applyHarmonyHeuristic(score * Math.pow(0.96, altCount), out, latinInput),
          source: "rules"
        });
        return;
      }

      const part = segments[index];
      if (part.type === "fixed") {
        dfs(index + 1, out + part.text, score, altCount);
        return;
      }

      part.options.forEach((opt, optIndex) => {
        dfs(index + 1, out + opt.text, score * (opt.weight || 0.5), altCount + (optIndex > 0 ? 1 : 0));
      });
    }

    dfs(0, "", 1, 0);

    if (!raw.length) {
      return [{ text: normalizeSpaces(latinInput), score: 0.2, source: "rules", confidence: 1 }];
    }

    return dedupeAndRankCandidates(raw, maxCandidates || 5);
  }

  function lookupWordOverride(word, system) {
    if (system === "cyrillic") {
      const key = normalizeLookupText(word, "cyrillic");
      return wordOverridesCyr[key] || "";
    }

    if (system === "latin") {
      const key = normalizeLookupText(word, "latin");
      return wordOverridesLatin[key] || "";
    }

    return "";
  }

  function convertWordDetailed(word, system) {
    const override = lookupWordOverride(word, system);
    const direct =
      system === "cyrillic"
        ? transliterateByMap(word, cyrToTraditional)
        : transliterateLatinToTraditional(word);

    if (override) {
      return {
        primary: override,
        candidates: dedupeAndRankCandidates(
          [
            { text: override, score: 0.99, source: "lexicon", note: "Dictionary-backed spelling." },
            { text: direct, score: 0.71, source: "rules", note: "Literal fallback." }
          ],
          4
        ),
        source: "lexicon"
      };
    }

    const latinInput = system === "cyrillic" ? transliterateByMap(word, cyrToLatin) : word;
    const generated = generateTraditionalCandidatesFromLatin(latinInput, 4);
    const ranked = dedupeAndRankCandidates(
      [{ text: direct, score: 0.78, source: "rules-direct" }, ...generated],
      4
    );

    return {
      primary: ranked[0] ? ranked[0].text : direct,
      candidates: ranked,
      source: ranked[0] ? ranked[0].source : "rules"
    };
  }

  function buildSentenceCandidates(parts, baseScore) {
    const sentenceCandidates = [
      {
        text: parts.map((part) => part.primary).join(""),
        score: baseScore,
        source: "hybrid"
      }
    ];

    parts.forEach((part, partIndex) => {
      if (!part.isWord || !part.candidates || part.candidates.length < 2) {
        return;
      }

      const topScore = part.candidates[0].score || 1;

      part.candidates.slice(1, 3).forEach((alt) => {
        const altParts = parts.map((entry, idx) => {
          if (idx !== partIndex) {
            return entry.primary;
          }
          return alt.text;
        });

        const ratio = Math.max(0.1, Math.min(1, (alt.score || 0.2) / topScore));
        sentenceCandidates.push({
          text: altParts.join(""),
          score: baseScore * ratio,
          source: "hybrid-alt",
          note: "Alternative ranked spelling."
        });
      });
    });

    return dedupeAndRankCandidates(sentenceCandidates, 6);
  }

  function transliterateDetailed(input) {
    const source = normalizeSpaces(input);
    const system = detectInputSystem(source);

    if (!source.trim()) {
      return {
        input: source,
        sourceSystem: system,
        latinOutput: "",
        primary: "",
        candidates: [],
        confidence: 0,
        method: "empty"
      };
    }

    if (system === "unknown") {
      return {
        input: source,
        sourceSystem: system,
        latinOutput: source,
        primary: source,
        candidates: [{ text: source, source: "passthrough", confidence: 1, score: 1 }],
        confidence: 1,
        method: "passthrough"
      };
    }

    const phraseKey = normalizeLookupText(source, system);
    const phraseHit = phraseOverrides[phraseKey];

    if (phraseHit) {
      return {
        input: source,
        sourceSystem: system,
        latinOutput: system === "cyrillic" ? transliterateByMap(source, cyrToLatin) : source,
        primary: phraseHit,
        candidates: [{ text: phraseHit, source: "phrase-lexicon", note: "Phrase dictionary hit.", score: 0.995, confidence: 1 }],
        confidence: 0.995,
        method: "phrase-lexicon"
      };
    }

    const chunks = splitForWordConversion(source);
    const parts = [];
    let wordCount = 0;
    let lexiconCount = 0;
    let scoreSum = 0;

    chunks.forEach((chunk) => {
      if (!isWordToken(chunk)) {
        parts.push({
          isWord: false,
          raw: chunk,
          primary: chunk,
          candidates: [{ text: chunk, score: 1, source: "fixed" }],
          source: "fixed"
        });
        return;
      }

      wordCount += 1;
      const wordDetail = convertWordDetailed(chunk, system);
      const top = wordDetail.candidates[0] || { score: 0.5, source: "rules" };
      scoreSum += top.score || 0;

      if (String(wordDetail.source || "").includes("lexicon")) {
        lexiconCount += 1;
      }

      parts.push({
        isWord: true,
        raw: chunk,
        primary: wordDetail.primary,
        candidates: wordDetail.candidates,
        source: wordDetail.source
      });
    });

    const baseScore = wordCount ? Math.max(0.2, scoreSum / wordCount) : 0.85;
    const sentenceCandidates = buildSentenceCandidates(parts, baseScore);
    const primary = sentenceCandidates[0] ? sentenceCandidates[0].text : parts.map((part) => part.primary).join("");

    const method =
      lexiconCount === wordCount && wordCount > 0
        ? "lexicon"
        : lexiconCount > 0
          ? "hybrid"
          : "rules";

    return {
      input: source,
      sourceSystem: system,
      latinOutput: system === "cyrillic" ? transliterateByMap(source, cyrToLatin) : source,
      primary,
      candidates: sentenceCandidates,
      confidence: sentenceCandidates[0] ? sentenceCandidates[0].confidence : 0.5,
      method,
      stats: {
        words: wordCount,
        lexiconWords: lexiconCount
      }
    };
  }

  function transliterateToTraditional(input) {
    return transliterateDetailed(input).primary;
  }

  function transliterateToLatin(input) {
    const system = detectInputSystem(input);
    if (system === "cyrillic") {
      return transliterateByMap(input, cyrToLatin);
    }
    return normalizeSpaces(input);
  }

  function getCharacterDeck() {
    return characterDeck.slice();
  }

  function getQuizWordBank() {
    return quizWordBank.slice();
  }

  const lessons = [
    { id: "lesson-1", title: "Vowels", glyphs: ["ᠠ", "ᠡ", "ᠢ", "ᠣ", "ᠤ", "ᠥ", "ᠦ", "ᠧ"] },
    { id: "lesson-2", title: "Core Sonorants", glyphs: ["ᠨ", "ᠩ", "ᠮ", "ᠯ", "ᠷ", "ᠶ"] },
    { id: "lesson-3", title: "Stops and Fricatives", glyphs: ["ᠪ", "ᠫ", "ᠲ", "ᠳ", "ᠭ", "ᠬ", "ᠰ", "ᠱ"] },
    { id: "lesson-4", title: "Extended and Loan", glyphs: ["ᠴ", "ᠵ", "ᠸ", "ᠹ", "ᠺ", "ᠻ", "ᠼ", "ᠽ", "ᠾ"] }
  ];

  const confusables = [
    {
      prompt: "Which glyph matches 'u' best?",
      options: [
        { glyph: "ᠣ", label: "o" },
        { glyph: "ᠤ", label: "u" }
      ],
      answer: 1,
      explanation: "ᠤ maps to u; ᠣ maps to o."
    },
    {
      prompt: "Which glyph is 'ng'?",
      options: [
        { glyph: "ᠨ", label: "n" },
        { glyph: "ᠩ", label: "ng" }
      ],
      answer: 1,
      explanation: "ᠩ is ng, while ᠨ is n."
    },
    {
      prompt: "Which glyph is more likely 'd'?",
      options: [
        { glyph: "ᠲ", label: "t" },
        { glyph: "ᠳ", label: "d" }
      ],
      answer: 1,
      explanation: "ᠳ is d-like and ᠲ is t-like."
    },
    {
      prompt: "Which glyph is 'oe'?",
      options: [
        { glyph: "ᠥ", label: "oe" },
        { glyph: "ᠦ", label: "ue" }
      ],
      answer: 0,
      explanation: "ᠥ maps to oe and ᠦ maps to ue."
    },
    {
      prompt: "Which glyph is the extended loan 'kh' letter?",
      options: [
        { glyph: "ᠺ", label: "k" },
        { glyph: "ᠻ", label: "kh (loan)" }
      ],
      answer: 1,
      explanation: "ᠻ is commonly listed as the extended/loan kh form."
    }
  ];

  window.SCRIPT_BRIDGE = {
    getCharacterDeck,
    getQuizWordBank,
    lessons,
    confusables,
    detectInputSystem,
    transliterateToLatin,
    transliterateToTraditional,
    transliterateDetailed,
    normalizeTraditionalForCompare,
    compareTraditional
  };
})();
