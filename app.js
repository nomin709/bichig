const STORAGE_KEY = "vertical-studio-phase2";
const LEGACY_STATS_KEY = "vertical-studio-stats";
const LESSON_UNLOCK_THRESHOLD = 0.8;
const MASTERY_REPETITIONS = 3;
const MASTERY_INTERVAL_DAYS = 7;

const characters = [
  {
    "glyph": "ᠠ",
    "name": "A",
    "cyr": "а",
    "latin": "a",
    "answers": [
      "a"
    ],
    "hint": "Core back vowel. Often the first back-vowel clue in a word.",
    "isolate": "ᠠ",
    "initial": "ᠠ‍",
    "medial": "‍ᠠ‍",
    "final": "‍ᠠ"
  },
  {
    "glyph": "ᠡ",
    "name": "E",
    "cyr": "э/е",
    "latin": "e",
    "answers": [
      "e"
    ],
    "hint": "Core front vowel.",
    "isolate": "ᠡ",
    "initial": "ᠡ‍",
    "medial": "‍ᠡ‍",
    "final": "‍ᠡ"
  },
  {
    "glyph": "ᠢ",
    "name": "I",
    "cyr": "и",
    "latin": "i",
    "answers": [
      "i"
    ],
    "hint": "Neutral vowel. It can appear with back- or front-vowel words.",
    "isolate": "ᠢ",
    "initial": "ᠢ‍",
    "medial": "‍ᠢ‍",
    "final": "‍ᠢ"
  },
  {
    "glyph": "ᠣ",
    "name": "O",
    "cyr": "о",
    "latin": "o",
    "answers": [
      "o"
    ],
    "hint": "Back vowel. Compare carefully against ᠤ.",
    "isolate": "ᠣ",
    "initial": "ᠣ‍",
    "medial": "‍ᠣ‍",
    "final": "‍ᠣ"
  },
  {
    "glyph": "ᠤ",
    "name": "U",
    "cyr": "у",
    "latin": "u",
    "answers": [
      "u"
    ],
    "hint": "Back vowel. Compare carefully against ᠣ.",
    "isolate": "ᠤ",
    "initial": "ᠤ‍",
    "medial": "‍ᠤ‍",
    "final": "‍ᠤ"
  },
  {
    "glyph": "ᠥ",
    "name": "OE",
    "cyr": "ө",
    "latin": "oe",
    "answers": [
      "oe",
      "ö"
    ],
    "hint": "Front vowel. Often confused with ᠦ.",
    "isolate": "ᠥ",
    "initial": "ᠥ‍",
    "medial": "‍ᠥ‍",
    "final": "‍ᠥ"
  },
  {
    "glyph": "ᠦ",
    "name": "UE",
    "cyr": "ү",
    "latin": "ue",
    "answers": [
      "ue",
      "ü"
    ],
    "hint": "Front vowel. Often confused with ᠥ.",
    "isolate": "ᠦ",
    "initial": "ᠦ‍",
    "medial": "‍ᠦ‍",
    "final": "‍ᠦ"
  },
  {
    "glyph": "ᠧ",
    "name": "EE",
    "cyr": "э/е",
    "latin": "ee",
    "answers": [
      "ee",
      "e"
    ],
    "hint": "Extended vowel used mostly in foreign or special spellings.",
    "isolate": "ᠧ",
    "initial": "ᠧ‍",
    "medial": "‍ᠧ‍",
    "final": "‍ᠧ"
  },
  {
    "glyph": "ᠨ",
    "name": "NA",
    "cyr": "н",
    "latin": "n",
    "answers": [
      "n"
    ],
    "hint": "Core consonant. Use it often as an anchor when reading endings.",
    "isolate": "ᠨ",
    "initial": "ᠨ‍",
    "medial": "‍ᠨ‍",
    "final": "‍ᠨ"
  },
  {
    "glyph": "ᠩ",
    "name": "ANG",
    "cyr": "ң",
    "latin": "ng",
    "answers": [
      "ng"
    ],
    "hint": "Often contrasted with ᠨ.",
    "isolate": "ᠩ",
    "initial": "ᠩ‍",
    "medial": "‍ᠩ‍",
    "final": "‍ᠩ"
  },
  {
    "glyph": "ᠪ",
    "name": "BA",
    "cyr": "б/п",
    "latin": "b",
    "answers": [
      "b",
      "p"
    ],
    "hint": "Can sound b or p depending on context.",
    "isolate": "ᠪ",
    "initial": "ᠪ‍",
    "medial": "‍ᠪ‍",
    "final": "‍ᠪ"
  },
  {
    "glyph": "ᠫ",
    "name": "PA",
    "cyr": "п",
    "latin": "p",
    "answers": [
      "p"
    ],
    "hint": "Core p letter.",
    "isolate": "ᠫ",
    "initial": "ᠫ‍",
    "medial": "‍ᠫ‍",
    "final": "‍ᠫ"
  },
  {
    "glyph": "ᠬ",
    "name": "QA",
    "cyr": "х",
    "latin": "q",
    "answers": [
      "q",
      "kh",
      "h"
    ],
    "hint": "Back-vowel velar. Vowel harmony helps resolve it.",
    "isolate": "ᠬ",
    "initial": "ᠬ‍",
    "medial": "‍ᠬ‍",
    "final": "‍ᠬ"
  },
  {
    "glyph": "ᠭ",
    "name": "GA",
    "cyr": "г",
    "latin": "g",
    "answers": [
      "g",
      "gh",
      "ɣ"
    ],
    "hint": "Very important contextual letter. Harmony and spelling patterns help.",
    "isolate": "ᠭ",
    "initial": "ᠭ‍",
    "medial": "‍ᠭ‍",
    "final": "‍ᠭ"
  },
  {
    "glyph": "ᠮ",
    "name": "MA",
    "cyr": "м",
    "latin": "m",
    "answers": [
      "m"
    ],
    "hint": "Broader body than ᠨ.",
    "isolate": "ᠮ",
    "initial": "ᠮ‍",
    "medial": "‍ᠮ‍",
    "final": "‍ᠮ"
  },
  {
    "glyph": "ᠯ",
    "name": "LA",
    "cyr": "л",
    "latin": "l",
    "answers": [
      "l"
    ],
    "hint": "Core l letter.",
    "isolate": "ᠯ",
    "initial": "ᠯ‍",
    "medial": "‍ᠯ‍",
    "final": "‍ᠯ"
  },
  {
    "glyph": "ᠰ",
    "name": "SA",
    "cyr": "с",
    "latin": "s",
    "answers": [
      "s"
    ],
    "hint": "Core s letter.",
    "isolate": "ᠰ",
    "initial": "ᠰ‍",
    "medial": "‍ᠰ‍",
    "final": "‍ᠰ"
  },
  {
    "glyph": "ᠱ",
    "name": "SHA",
    "cyr": "ш",
    "latin": "sh",
    "answers": [
      "sh"
    ],
    "hint": "Useful sh contrast against ᠰ.",
    "isolate": "ᠱ",
    "initial": "ᠱ‍",
    "medial": "‍ᠱ‍",
    "final": "‍ᠱ"
  },
  {
    "glyph": "ᠲ",
    "name": "TA",
    "cyr": "т",
    "latin": "t",
    "answers": [
      "t"
    ],
    "hint": "Often visually confusable with ᠳ.",
    "isolate": "ᠲ",
    "initial": "ᠲ‍",
    "medial": "‍ᠲ‍",
    "final": "‍ᠲ"
  },
  {
    "glyph": "ᠳ",
    "name": "DA",
    "cyr": "д",
    "latin": "d",
    "answers": [
      "d"
    ],
    "hint": "Often visually confusable with ᠲ.",
    "isolate": "ᠳ",
    "initial": "ᠳ‍",
    "medial": "‍ᠳ‍",
    "final": "‍ᠳ"
  },
  {
    "glyph": "ᠴ",
    "name": "CHA",
    "cyr": "ч",
    "latin": "ch",
    "answers": [
      "ch"
    ],
    "hint": "Core ch letter.",
    "isolate": "ᠴ",
    "initial": "ᠴ‍",
    "medial": "‍ᠴ‍",
    "final": "‍ᠴ"
  },
  {
    "glyph": "ᠵ",
    "name": "JA",
    "cyr": "ж/з",
    "latin": "j",
    "answers": [
      "j",
      "zh"
    ],
    "hint": "j- or zh-like depending on the word and transliteration style.",
    "isolate": "ᠵ",
    "initial": "ᠵ‍",
    "medial": "‍ᠵ‍",
    "final": "‍ᠵ"
  },
  {
    "glyph": "ᠶ",
    "name": "YA",
    "cyr": "й/я",
    "latin": "y",
    "answers": [
      "y"
    ],
    "hint": "Glide y letter.",
    "isolate": "ᠶ",
    "initial": "ᠶ‍",
    "medial": "‍ᠶ‍",
    "final": "‍ᠶ"
  },
  {
    "glyph": "ᠷ",
    "name": "RA",
    "cyr": "р",
    "latin": "r",
    "answers": [
      "r"
    ],
    "hint": "Core r letter.",
    "isolate": "ᠷ",
    "initial": "ᠷ‍",
    "medial": "‍ᠷ‍",
    "final": "‍ᠷ"
  },
  {
    "glyph": "ᠸ",
    "name": "WA",
    "cyr": "в",
    "latin": "w",
    "answers": [
      "w",
      "v"
    ],
    "hint": "Common w or v-type letter in learner charts.",
    "isolate": "ᠸ",
    "initial": "ᠸ‍",
    "medial": "‍ᠸ‍",
    "final": "‍ᠸ"
  },
  {
    "glyph": "ᠹ",
    "name": "FA",
    "cyr": "ф",
    "latin": "f",
    "answers": [
      "f"
    ],
    "hint": "Loan letter for foreign words.",
    "isolate": "ᠹ",
    "initial": "ᠹ‍",
    "medial": "‍ᠹ‍",
    "final": "‍ᠹ"
  },
  {
    "glyph": "ᠺ",
    "name": "KA",
    "cyr": "к",
    "latin": "k",
    "answers": [
      "k"
    ],
    "hint": "Extended loan letter.",
    "isolate": "ᠺ",
    "initial": "ᠺ‍",
    "medial": "‍ᠺ‍",
    "final": "‍ᠺ"
  },
  {
    "glyph": "ᠻ",
    "name": "KHA",
    "cyr": "х",
    "latin": "kh",
    "answers": [
      "kh"
    ],
    "hint": "Extended loan kh letter.",
    "isolate": "ᠻ",
    "initial": "ᠻ‍",
    "medial": "‍ᠻ‍",
    "final": "‍ᠻ"
  },
  {
    "glyph": "ᠼ",
    "name": "TSA",
    "cyr": "ц",
    "latin": "ts",
    "answers": [
      "ts"
    ],
    "hint": "Extended loan ts letter.",
    "isolate": "ᠼ",
    "initial": "ᠼ‍",
    "medial": "‍ᠼ‍",
    "final": "‍ᠼ"
  },
  {
    "glyph": "ᠽ",
    "name": "ZA",
    "cyr": "з",
    "latin": "z",
    "answers": [
      "z"
    ],
    "hint": "Extended loan z letter.",
    "isolate": "ᠽ",
    "initial": "ᠽ‍",
    "medial": "‍ᠽ‍",
    "final": "‍ᠽ"
  },
  {
    "glyph": "ᠾ",
    "name": "HAA",
    "cyr": "һ/х",
    "latin": "h",
    "answers": [
      "h"
    ],
    "hint": "Extended or foreign-use h letter.",
    "isolate": "ᠾ",
    "initial": "ᠾ‍",
    "medial": "‍ᠾ‍",
    "final": "‍ᠾ"
  },
  {
    "glyph": "ᠿ",
    "name": "ZRA",
    "cyr": "—",
    "latin": "zr",
    "answers": [
      "zr",
      "zh"
    ],
    "hint": "Rare chart letter; keep it as reference-level knowledge.",
    "isolate": "ᠿ",
    "initial": "ᠿ‍",
    "medial": "‍ᠿ‍",
    "final": "‍ᠿ"
  },
  {
    "glyph": "ᡀ",
    "name": "LHA",
    "cyr": "—",
    "latin": "lh",
    "answers": [
      "lh"
    ],
    "hint": "Rare chart letter.",
    "isolate": "ᡀ",
    "initial": "ᡀ‍",
    "medial": "‍ᡀ‍",
    "final": "‍ᡀ"
  },
  {
    "glyph": "ᡁ",
    "name": "ZHI",
    "cyr": "ж",
    "latin": "zh",
    "answers": [
      "zh"
    ],
    "hint": "Rare chart letter.",
    "isolate": "ᡁ",
    "initial": "ᡁ‍",
    "medial": "‍ᡁ‍",
    "final": "‍ᡁ"
  },
  {
    "glyph": "ᡂ",
    "name": "CHI",
    "cyr": "ч",
    "latin": "chi",
    "answers": [
      "chi",
      "ch"
    ],
    "hint": "Rare chart letter.",
    "isolate": "ᡂ",
    "initial": "ᡂ‍",
    "medial": "‍ᡂ‍",
    "final": "‍ᡂ"
  }
];

const lessons = [
  {
    "id": "lesson-1",
    "title": "Core back vowels",
    "glyphs": [
      "ᠠ",
      "ᠣ",
      "ᠤ",
      "ᠡ",
      "ᠢ"
    ]
  },
  {
    "id": "lesson-2",
    "title": "Front and extended vowels",
    "glyphs": [
      "ᠥ",
      "ᠦ",
      "ᠧ"
    ]
  },
  {
    "id": "lesson-3",
    "title": "Nasals and liquids",
    "glyphs": [
      "ᠨ",
      "ᠩ",
      "ᠮ",
      "ᠯ",
      "ᠷ"
    ]
  },
  {
    "id": "lesson-4",
    "title": "Core stops and fricatives",
    "glyphs": [
      "ᠪ",
      "ᠫ",
      "ᠬ",
      "ᠭ",
      "ᠰ",
      "ᠱ",
      "ᠲ",
      "ᠳ"
    ]
  },
  {
    "id": "lesson-5",
    "title": "Affricates and glides",
    "glyphs": [
      "ᠴ",
      "ᠵ",
      "ᠶ",
      "ᠸ"
    ]
  },
  {
    "id": "lesson-6",
    "title": "Loan letters",
    "glyphs": [
      "ᠹ",
      "ᠺ",
      "ᠻ",
      "ᠼ",
      "ᠽ",
      "ᠾ"
    ]
  },
  {
    "id": "lesson-7",
    "title": "Rare chart letters",
    "glyphs": [
      "ᠿ",
      "ᡀ",
      "ᡁ",
      "ᡂ"
    ]
  }
];

const challenges = [
  {
    "prompt": "Which glyph most closely matches the sound \"u\"?",
    "options": [
      {
        "glyph": "ᠣ",
        "label": "o"
      },
      {
        "glyph": "ᠤ",
        "label": "u"
      }
    ],
    "answer": 1,
    "explanation": "ᠤ is the u letter, while ᠣ is o."
  },
  {
    "prompt": "Which glyph most closely matches the front vowel \"ö / oe\"?",
    "options": [
      {
        "glyph": "ᠥ",
        "label": "oe"
      },
      {
        "glyph": "ᠦ",
        "label": "ue"
      }
    ],
    "answer": 0,
    "explanation": "ᠥ is oe/ö, while ᠦ is ue/ü."
  },
  {
    "prompt": "Which glyph best maps to \"ng\"?",
    "options": [
      {
        "glyph": "ᠨ",
        "label": "n"
      },
      {
        "glyph": "ᠩ",
        "label": "ng"
      }
    ],
    "answer": 1,
    "explanation": "ᠩ corresponds to ng, while ᠨ corresponds to n."
  },
  {
    "prompt": "Which glyph is the better match for \"p\"?",
    "options": [
      {
        "glyph": "ᠪ",
        "label": "b / p"
      },
      {
        "glyph": "ᠫ",
        "label": "p"
      }
    ],
    "answer": 1,
    "explanation": "ᠫ is the dedicated p letter. ᠪ can read as b or p depending on context."
  },
  {
    "prompt": "Which glyph is the better match for back-vowel \"q / kh\"?",
    "options": [
      {
        "glyph": "ᠬ",
        "label": "q / kh"
      },
      {
        "glyph": "ᠭ",
        "label": "g / gh"
      }
    ],
    "answer": 0,
    "explanation": "ᠬ is the q / kh-type letter, while ᠭ is the g / gh-type letter."
  },
  {
    "prompt": "Which glyph is the better match for \"d\"?",
    "options": [
      {
        "glyph": "ᠲ",
        "label": "t"
      },
      {
        "glyph": "ᠳ",
        "label": "d"
      }
    ],
    "answer": 1,
    "explanation": "ᠳ is d-like and ᠲ is t-like."
  },
  {
    "prompt": "Which glyph maps to \"sh\"?",
    "options": [
      {
        "glyph": "ᠰ",
        "label": "s"
      },
      {
        "glyph": "ᠱ",
        "label": "sh"
      }
    ],
    "answer": 1,
    "explanation": "ᠱ is sh, while ᠰ is s."
  },
  {
    "prompt": "Which glyph maps to \"j\" more directly in the core chart?",
    "options": [
      {
        "glyph": "ᠴ",
        "label": "ch"
      },
      {
        "glyph": "ᠵ",
        "label": "j"
      }
    ],
    "answer": 1,
    "explanation": "ᠵ is the j letter, while ᠴ is ch."
  },
  {
    "prompt": "Which glyph is the loan letter for \"k\"?",
    "options": [
      {
        "glyph": "ᠺ",
        "label": "k"
      },
      {
        "glyph": "ᠻ",
        "label": "kh"
      }
    ],
    "answer": 0,
    "explanation": "ᠺ is k, while ᠻ is kh."
  },
  {
    "prompt": "Which glyph is the loan letter for \"ts\"?",
    "options": [
      {
        "glyph": "ᠽ",
        "label": "z"
      },
      {
        "glyph": "ᠼ",
        "label": "ts"
      }
    ],
    "answer": 1,
    "explanation": "ᠼ is ts, while ᠽ is z."
  }
];

const cyrToLatin = {
  "а": "a",
  "б": "b",
  "в": "v",
  "г": "g",
  "д": "d",
  "е": "e",
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

const cyrToTraditionalApprox = {
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

const glyphIndex = {};
characters.forEach((item, index) => {
  glyphIndex[item.glyph] = index;
});

const state = {
  charIndex: 0,
  challengeIndex: 0,
  challengeAnswered: false,
  pendingGradeGlyph: null,
  selectedLessonId: lessons[0].id,
  score: 0,
  streak: 0,
  lastDate: "",
  srs: {}
};

function byId(id) {
  return document.getElementById(id);
}

function toDateStringLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayString() {
  return toDateStringLocal(new Date());
}

function parseDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
    return null;
  }

  const parts = value.split("-").map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);

  if (
    date.getFullYear() !== parts[0] ||
    date.getMonth() + 1 !== parts[1] ||
    date.getDate() !== parts[2]
  ) {
    return null;
  }

  return date;
}

function addDays(dateString, days) {
  const base = parseDateString(dateString) || new Date();
  base.setDate(base.getDate() + days);
  return toDateStringLocal(base);
}

function daysBetween(dateA, dateB) {
  const a = parseDateString(dateA);
  const b = parseDateString(dateB);
  if (!a || !b) {
    return 999;
  }
  return Math.round((b - a) / 86400000);
}

function dueStatus(dueDate) {
  const delta = daysBetween(todayString(), dueDate);
  if (delta === 0) {
    return "today";
  }
  if (delta < 0) {
    return `${Math.abs(delta)}d overdue`;
  }
  return `in ${delta}d`;
}

function defaultSrsRecord() {
  return {
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: todayString(),
    lastReviewed: "",
    seen: 0,
    correct: 0,
    wrong: 0
  };
}

function sanitizeSrsRecord(raw) {
  const fallback = defaultSrsRecord();
  if (!raw || typeof raw !== "object") {
    return fallback;
  }

  const dueDate = parseDateString(raw.dueDate) ? raw.dueDate : fallback.dueDate;
  const lastReviewed = parseDateString(raw.lastReviewed) ? raw.lastReviewed : "";

  return {
    ease: Math.min(3, Math.max(1.3, Number(raw.ease) || fallback.ease)),
    interval: Math.max(0, Math.round(Number(raw.interval) || 0)),
    repetitions: Math.max(0, Math.round(Number(raw.repetitions) || 0)),
    dueDate,
    lastReviewed,
    seen: Math.max(0, Math.round(Number(raw.seen) || 0)),
    correct: Math.max(0, Math.round(Number(raw.correct) || 0)),
    wrong: Math.max(0, Math.round(Number(raw.wrong) || 0))
  };
}

function ensureSrsRecords() {
  characters.forEach((item) => {
    state.srs[item.glyph] = sanitizeSrsRecord(state.srs[item.glyph]);
  });
}

function getSrs(glyph) {
  if (!state.srs[glyph]) {
    state.srs[glyph] = defaultSrsRecord();
  }
  return state.srs[glyph];
}

function isMasteredGlyph(glyph) {
  const record = getSrs(glyph);
  return record.repetitions >= MASTERY_REPETITIONS && record.interval >= MASTERY_INTERVAL_DAYS;
}

function getMasteredGlyphCount() {
  return characters.filter((item) => isMasteredGlyph(item.glyph)).length;
}

function compareDueEntries(a, b) {
  if (a.record.dueDate !== b.record.dueDate) {
    return a.record.dueDate.localeCompare(b.record.dueDate);
  }
  if (a.record.repetitions !== b.record.repetitions) {
    return a.record.repetitions - b.record.repetitions;
  }
  return a.glyph.localeCompare(b.glyph);
}

function getCardEntries(glyphList) {
  return glyphList.map((glyph) => ({
    glyph,
    record: getSrs(glyph)
  }));
}

function getDueCards(glyphList) {
  const today = todayString();
  return getCardEntries(glyphList || characters.map((item) => item.glyph))
    .filter((entry) => entry.record.dueDate <= today)
    .sort(compareDueEntries);
}

function getNextDueEntry() {
  const all = getCardEntries(characters.map((item) => item.glyph)).sort(compareDueEntries);
  return all[0] || null;
}

function getLessonStates() {
  const states = [];

  lessons.forEach((lesson, index) => {
    const mastered = lesson.glyphs.filter((glyph) => isMasteredGlyph(glyph)).length;
    const total = lesson.glyphs.length;
    const ratio = total === 0 ? 0 : mastered / total;
    const unlocked = index === 0 ? true : states[index - 1].ratio >= LESSON_UNLOCK_THRESHOLD;

    states.push({
      lesson,
      unlocked,
      mastered,
      total,
      ratio
    });
  });

  return states;
}

function getSelectedLesson() {
  return lessons.find((lesson) => lesson.id === state.selectedLessonId) || lessons[0];
}

function loadData() {
  let loaded = false;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      state.charIndex = Number(parsed.charIndex) || 0;
      state.challengeIndex = Number(parsed.challengeIndex) || 0;
      state.selectedLessonId = parsed.selectedLessonId || lessons[0].id;
      state.score = Number(parsed.score) || 0;
      state.streak = Number(parsed.streak) || 0;
      state.lastDate = parsed.lastDate || "";
      state.srs = parsed.srs && typeof parsed.srs === "object" ? parsed.srs : {};
      loaded = true;
    } catch {
      loaded = false;
    }
  }

  if (!loaded) {
    const legacy = localStorage.getItem(LEGACY_STATS_KEY);
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        state.score = Number(parsed.score) || 0;
        state.streak = Number(parsed.streak) || 0;
        state.lastDate = parsed.lastDate || "";
      } catch {
        // Ignore malformed legacy data.
      }
    }
  }

  if (state.charIndex < 0 || state.charIndex >= characters.length) {
    state.charIndex = 0;
  }

  if (state.challengeIndex < 0 || state.challengeIndex >= challenges.length) {
    state.challengeIndex = 0;
  }

  ensureSrsRecords();

  const unlockedLesson = getLessonStates().find((item) => item.unlocked);
  const selectedExists = lessons.some((lesson) => lesson.id === state.selectedLessonId);
  if (!selectedExists) {
    state.selectedLessonId = unlockedLesson ? unlockedLesson.lesson.id : lessons[0].id;
  }

  persistData();
}

function persistData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      charIndex: state.charIndex,
      challengeIndex: state.challengeIndex,
      selectedLessonId: state.selectedLessonId,
      score: state.score,
      streak: state.streak,
      lastDate: state.lastDate,
      srs: state.srs
    })
  );

  localStorage.setItem(
    LEGACY_STATS_KEY,
    JSON.stringify({
      score: state.score,
      streak: state.streak,
      lastDate: state.lastDate
    })
  );
}

function markPractice(points) {
  const today = todayString();

  if (!state.lastDate) {
    state.streak = 1;
    state.lastDate = today;
  } else if (state.lastDate !== today) {
    const gap = daysBetween(state.lastDate, today);
    state.streak = gap === 1 ? state.streak + 1 : 1;
    state.lastDate = today;
  }

  state.score += points;
  persistData();
}

function renderStats() {
  const due = getDueCards();
  const nextDue = getNextDueEntry();
  const mastered = getMasteredGlyphCount();

  byId("score").textContent = String(state.score);
  byId("streak").textContent = `${state.streak} day${state.streak === 1 ? "" : "s"}`;
  byId("dueCount").textContent = String(due.length);
  byId("dueCountInline").textContent = String(due.length);
  byId("masteredCount").textContent = `${mastered}/${characters.length}`;

  if (!nextDue) {
    byId("nextDueLabel").textContent = "-";
  } else {
    byId("nextDueLabel").textContent = `${nextDue.glyph} (${dueStatus(nextDue.record.dueDate)})`;
  }
}

function setFeedback(element, message, type) {
  element.textContent = message;
  element.className = `feedback ${type || ""}`;
}

function normalize(text) {
  return (text || "").trim().toLowerCase();
}

function setGradeControls(enabled, hint) {
  ["gradeAgainBtn", "gradeHardBtn", "gradeGoodBtn", "gradeEasyBtn"].forEach((id) => {
    byId(id).disabled = !enabled;
  });

  if (hint) {
    byId("gradeHint").textContent = hint;
  }
}

function updateCurrentCardDueHint() {
  const item = characters[state.charIndex];
  const record = getSrs(item.glyph);
  byId("charHint").textContent = `${item.hint} Review ${dueStatus(record.dueDate)}.`;
}

function renderCharacter() {
  const item = characters[state.charIndex];
  const record = getSrs(item.glyph);

  byId("charGlyph").textContent = item.glyph;
  byId("charName").textContent = item.name;
  byId("charCyr").textContent = item.cyr;
  byId("charLat").textContent = item.latin;
  byId("charHint").textContent = `${item.hint} Review ${dueStatus(record.dueDate)}.`;
  if (byId("formIsolate")) {
    byId("formIsolate").textContent = item.isolate || item.glyph;
    byId("formInitial").textContent = item.initial || item.glyph;
    byId("formMedial").textContent = item.medial || item.glyph;
    byId("formFinal").textContent = item.final || item.glyph;
  }
  byId("guess").value = "";

  state.pendingGradeGlyph = null;
  setGradeControls(false, "Submit an answer to unlock grading controls.");
  setFeedback(byId("charFeedback"), "", "");
}

function scheduleReview(glyph, grade, wasCorrect) {
  const record = getSrs(glyph);
  const today = todayString();

  record.seen += 1;
  if (wasCorrect) {
    record.correct += 1;
  } else {
    record.wrong += 1;
  }

  if (grade === "again") {
    record.repetitions = 0;
    record.interval = 0;
    record.ease = Math.max(1.3, record.ease - 0.2);
  }

  if (grade === "hard") {
    record.repetitions += 1;
    record.interval = record.repetitions === 1 ? 1 : Math.max(2, Math.round(Math.max(1, record.interval) * 1.2));
    record.ease = Math.max(1.3, record.ease - 0.15);
  }

  if (grade === "good") {
    record.repetitions += 1;
    if (record.repetitions === 1) {
      record.interval = 1;
    } else if (record.repetitions === 2) {
      record.interval = 3;
    } else {
      record.interval = Math.max(4, Math.round(Math.max(1, record.interval) * record.ease));
    }
    record.ease = Math.min(3, Math.max(1.3, record.ease + 0.02));
  }

  if (grade === "easy") {
    record.repetitions += 1;
    if (record.repetitions === 1) {
      record.interval = 3;
    } else if (record.repetitions === 2) {
      record.interval = 6;
    } else {
      record.interval = Math.max(7, Math.round(Math.max(1, record.interval) * (record.ease + 0.15)));
    }
    record.ease = Math.min(3, Math.max(1.3, record.ease + 0.08));
  }

  record.dueDate = addDays(today, record.interval);
  record.lastReviewed = today;

  persistData();
}

function applyGrade(grade) {
  if (!state.pendingGradeGlyph) {
    setFeedback(byId("charFeedback"), "Answer a card first, then choose a grade.", "warn");
    return;
  }

  const glyph = state.pendingGradeGlyph;
  scheduleReview(glyph, grade, true);

  const pointsByGrade = {
    again: 2,
    hard: 4,
    good: 6,
    easy: 8
  };

  markPractice(pointsByGrade[grade] || 2);
  state.pendingGradeGlyph = null;

  updateCurrentCardDueHint();
  renderStats();
  renderLessons();

  const record = getSrs(glyph);
  setFeedback(
    byId("charFeedback"),
    `Scheduled ${glyph} as ${grade}. Next review ${dueStatus(record.dueDate)}.`,
    "ok"
  );
  setGradeControls(false, "Grade saved. Continue with this card or load the next due card.");
}

function checkCharacter() {
  const item = characters[state.charIndex];
  const guess = normalize(byId("guess").value);

  if (!guess) {
    setFeedback(byId("charFeedback"), "Type an answer first.", "warn");
    return;
  }

  if (item.answers.includes(guess)) {
    state.pendingGradeGlyph = item.glyph;
    setFeedback(byId("charFeedback"), `Correct: ${item.glyph} -> ${item.latin}`, "ok");
    setGradeControls(true, "Great recall. Choose Again, Hard, Good, or Easy to schedule this card.");
  } else {
    scheduleReview(item.glyph, "again", false);
    markPractice(1);
    updateCurrentCardDueHint();
    renderStats();
    renderLessons();
    setFeedback(
      byId("charFeedback"),
      `Not quite. Expected ${item.answers.join(" / ")}. Scheduled as Again.`,
      "bad"
    );
    setGradeControls(false, "Incorrect answers are auto-scheduled as Again.");
  }
}

function jumpToGlyph(glyph) {
  if (Object.prototype.hasOwnProperty.call(glyphIndex, glyph)) {
    state.charIndex = glyphIndex[glyph];
    persistData();
    renderCharacter();
  }
}

function studyNextDue() {
  const lesson = getSelectedLesson();
  const lessonDue = getDueCards(lesson.glyphs);
  const globalDue = getDueCards();

  let target = lessonDue[0] || globalDue[0] || null;

  if (!target) {
    const unmastered = lesson.glyphs.find((glyph) => !isMasteredGlyph(glyph));
    if (unmastered) {
      target = {
        glyph: unmastered,
        record: getSrs(unmastered)
      };
    }
  }

  if (!target) {
    setFeedback(byId("charFeedback"), "No due cards right now. Great work.", "ok");
    return;
  }

  jumpToGlyph(target.glyph);
  setFeedback(
    byId("charFeedback"),
    `Loaded ${target.glyph} (${dueStatus(target.record.dueDate)}).`,
    "ok"
  );
}

function renderLessons() {
  const lessonSelect = byId("lessonSelect");
  const lessonStatus = byId("lessonStatus");
  const progressRoot = byId("lessonProgress");
  const states = getLessonStates();

  let selected = states.find((item) => item.lesson.id === state.selectedLessonId && item.unlocked);
  if (!selected) {
    selected = states.find((item) => item.unlocked) || states[0];
    state.selectedLessonId = selected.lesson.id;
    persistData();
  }

  lessonSelect.innerHTML = "";

  states.forEach((entry) => {
    const option = document.createElement("option");
    const pct = Math.round(entry.ratio * 100);
    option.value = entry.lesson.id;
    option.disabled = !entry.unlocked;
    option.textContent = `${entry.lesson.title} (${pct}%)${entry.unlocked ? "" : " - Locked"}`;
    if (entry.lesson.id === state.selectedLessonId) {
      option.selected = true;
    }
    lessonSelect.appendChild(option);
  });

  lessonStatus.textContent = `Current lesson: ${selected.lesson.title} (${selected.mastered}/${selected.total} mastered).`;

  progressRoot.innerHTML = "";
  states.forEach((entry) => {
    const pct = Math.round(entry.ratio * 100);
    const row = document.createElement("div");
    row.className = "lesson-row";
    row.innerHTML = `
      <div class="lesson-row-head">
        <strong>${entry.lesson.title}</strong>
        <span>${entry.mastered}/${entry.total} (${pct}%) • ${entry.unlocked ? "Unlocked" : "Locked"}</span>
      </div>
      <div class="lesson-bar">
        <div class="lesson-bar-fill" style="width:${pct}%"></div>
      </div>
    `;
    progressRoot.appendChild(row);
  });
}

function startLesson() {
  const states = getLessonStates();
  const selected = states.find((item) => item.lesson.id === state.selectedLessonId);

  if (!selected || !selected.unlocked) {
    byId("lessonStatus").textContent = "This lesson is locked. Master 80% of the previous lesson first.";
    return;
  }

  const dueInLesson = getDueCards(selected.lesson.glyphs);
  let targetGlyph = dueInLesson[0] ? dueInLesson[0].glyph : null;

  if (!targetGlyph) {
    targetGlyph = selected.lesson.glyphs.find((glyph) => !isMasteredGlyph(glyph)) || selected.lesson.glyphs[0];
  }

  jumpToGlyph(targetGlyph);
  setFeedback(byId("charFeedback"), `Started ${selected.lesson.title}.`, "ok");
}

function transliterate(input, map) {
  let out = "";

  for (const ch of input) {
    const lower = ch.toLowerCase();
    const mapped = map[lower];

    if (mapped === undefined) {
      out += ch;
      continue;
    }

    if (ch !== lower && mapped.length > 0) {
      out += mapped[0].toUpperCase() + mapped.slice(1);
    } else {
      out += mapped;
    }
  }

  return out;
}

function convertText(options = {}) {
  const countPractice = options.countPractice !== false;
  const src = byId("cyrInput").value || "";
  const latin = transliterate(src, cyrToLatin);
  const traditional = transliterate(src, cyrToTraditionalApprox);

  byId("latOutput").value = latin;
  byId("tradOutput").value = traditional;
  byId("verticalPreview").textContent = traditional || "ᠰᠠᠢᠨ";

  if (src.trim() && countPractice) {
    markPractice(2);
    renderStats();
  }
}

function renderChallenge() {
  const item = challenges[state.challengeIndex];
  state.challengeAnswered = false;

  byId("challengeStep").textContent = `Question ${state.challengeIndex + 1} of ${challenges.length}`;
  byId("challengePrompt").textContent = item.prompt;
  setFeedback(byId("challengeFeedback"), "", "");

  const optionsRoot = byId("challengeOptions");
  optionsRoot.innerHTML = "";

  item.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "opt";
    btn.innerHTML = `<div class="glyph">${option.glyph}</div><strong>${option.label}</strong>`;
    btn.addEventListener("click", () => selectChallenge(index));
    optionsRoot.appendChild(btn);
  });
}

function selectChallenge(index) {
  if (state.challengeAnswered) {
    return;
  }
  state.challengeAnswered = true;

  const item = challenges[state.challengeIndex];

  if (index === item.answer) {
    setFeedback(byId("challengeFeedback"), `Correct. ${item.explanation}`, "ok");
    markPractice(7);
    renderStats();
  } else {
    const correct = item.options[item.answer];
    setFeedback(
      byId("challengeFeedback"),
      `Not this time. Correct: ${correct.glyph} (${correct.label}). ${item.explanation}`,
      "bad"
    );
  }
}

function nextChallenge() {
  state.challengeIndex = (state.challengeIndex + 1) % challenges.length;
  persistData();
  renderChallenge();
}

function hasGlyphSupport(glyph) {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 40;
  const ctx = canvas.getContext("2d");
  ctx.font = '32px "Noto Sans Mongolian", "Mongolian Baiti", serif';

  const glyphWidth = ctx.measureText(glyph).width;
  const tofuWidth = ctx.measureText("\uFFFD").width;

  return Math.abs(glyphWidth - tofuWidth) > 0.15;
}

function runRenderCheck() {
  const uniqueGlyphs = Array.from(new Set(characters.map((item) => item.glyph)));
  const table = byId("renderTable");
  table.innerHTML = "";

  uniqueGlyphs.forEach((glyph) => {
    const ok = hasGlyphSupport(glyph);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="font-family: var(--font-script); font-size: 1.6rem;">${glyph}</td>
      <td>
        <span class="chip ${ok ? "ok" : "bad"}">${ok ? "Supported" : "Fallback/Unknown"}</span>
      </td>
    `;
    table.appendChild(row);
  });
}

function exportProgress() {
  const lessonStates = getLessonStates().map((entry) => ({
    id: entry.lesson.id,
    title: entry.lesson.title,
    unlocked: entry.unlocked,
    mastered: entry.mastered,
    total: entry.total,
    progressPercent: Math.round(entry.ratio * 100)
  }));

  const payload = {
    exportedAt: new Date().toISOString(),
    appVersion: "2.0.0",
    stats: {
      score: state.score,
      streak: state.streak,
      lastPracticeDate: state.lastDate,
      dueCards: getDueCards().length,
      masteredGlyphs: getMasteredGlyphCount()
    },
    selectedLessonId: state.selectedLessonId,
    lessonProgress: lessonStates,
    challengeState: {
      index: state.challengeIndex
    },
    srs: state.srs
  };

  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  const fileDate = todayString();
  anchor.href = url;
  anchor.download = `script-bridge-progress-${fileDate}.json`;
  anchor.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);

  byId("exportStatus").textContent = `Exported progress snapshot (${fileDate}).`;
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((btn) => btn.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      byId(tab.dataset.tab).classList.add("active");
    });
  });
}

function setupPad() {
  const canvas = byId("pad");
  const ctx = canvas.getContext("2d");
  let drawing = false;

  function drawGuides() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#edf3f0";
    ctx.lineWidth = 1;

    for (let x = 40; x < canvas.width; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.lineTo(x, canvas.height - 10);
      ctx.stroke();
    }
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    const p = point(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!drawing) {
      return;
    }

    const p = point(event);
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1c6052";
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  });

  function stop(event) {
    drawing = false;
    if (event && typeof event.pointerId === "number") {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore release errors.
      }
    }
  }

  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);
  canvas.addEventListener("pointerleave", stop);

  byId("clearPad").addEventListener("click", drawGuides);
  drawGuides();
}

function bindEvents() {
  byId("checkBtn").addEventListener("click", checkCharacter);

  byId("guess").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkCharacter();
    }
  });

  byId("prevBtn").addEventListener("click", () => {
    state.charIndex = (state.charIndex - 1 + characters.length) % characters.length;
    persistData();
    renderCharacter();
  });

  byId("nextBtn").addEventListener("click", () => {
    state.charIndex = (state.charIndex + 1) % characters.length;
    persistData();
    renderCharacter();
  });

  byId("studyDueBtn").addEventListener("click", studyNextDue);

  byId("gradeAgainBtn").addEventListener("click", () => applyGrade("again"));
  byId("gradeHardBtn").addEventListener("click", () => applyGrade("hard"));
  byId("gradeGoodBtn").addEventListener("click", () => applyGrade("good"));
  byId("gradeEasyBtn").addEventListener("click", () => applyGrade("easy"));

  byId("lessonSelect").addEventListener("change", (event) => {
    state.selectedLessonId = event.target.value;
    persistData();
    renderLessons();
  });

  byId("startLessonBtn").addEventListener("click", startLesson);
  byId("exportDataBtn").addEventListener("click", exportProgress);

  byId("convertBtn").addEventListener("click", () => convertText({ countPractice: true }));
  byId("nextChallenge").addEventListener("click", nextChallenge);
  byId("runCheck").addEventListener("click", runRenderCheck);
}

function init() {
  loadData();
  setupTabs();
  bindEvents();
  setupPad();
  renderLessons();
  renderStats();
  renderCharacter();
  renderChallenge();
  convertText({ countPractice: false });
  runRenderCheck();
}

init();
