(function () {
  const STORAGE_KEY = "script-bridge-studio-v1";
  const LESSON_UNLOCK_THRESHOLD = 0.8;
  const MASTERY_REPS = 3;
  const MASTERY_INTERVAL = 7;

  const deck = window.SCRIPT_BRIDGE.getCharacterDeck();
  const lessons = window.SCRIPT_BRIDGE.lessons;
  const confusables = window.SCRIPT_BRIDGE.confusables;

  const aliases = {
    "ᠥ": ["oe", "ö"],
    "ᠦ": ["ue", "ü"],
    "ᠪ": ["b", "p"],
    "ᠭ": ["g", "gh"],
    "ᠬ": ["kh", "q", "h"],
    "ᠻ": ["kh", "kha"],
    "ᠵ": ["j", "zh"],
    "ᠸ": ["w", "v"],
    "ᠧ": ["ee", "e"]
  };

  const glyphToIndex = {};
  deck.forEach((item, idx) => {
    glyphToIndex[item.glyph] = idx;
  });

  const state = {
    cardIndex: 0,
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

  function localDateString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function today() {
    return localDateString(new Date());
  }

  function parseDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
      return null;
    }
    const [y, m, d] = value.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() + 1 !== m || dt.getDate() !== d) {
      return null;
    }
    return dt;
  }

  function addDays(dateString, days) {
    const dt = parseDate(dateString) || new Date();
    dt.setDate(dt.getDate() + days);
    return localDateString(dt);
  }

  function daysDiff(a, b) {
    const da = parseDate(a);
    const db = parseDate(b);
    if (!da || !db) {
      return 999;
    }
    return Math.round((db - da) / 86400000);
  }

  function defaultSrsRecord() {
    return {
      ease: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: today(),
      seen: 0,
      correct: 0,
      wrong: 0,
      lastReviewed: ""
    };
  }

  function sanitizeRecord(raw) {
    const base = defaultSrsRecord();
    if (!raw || typeof raw !== "object") {
      return base;
    }
    return {
      ease: Math.min(3, Math.max(1.3, Number(raw.ease) || base.ease)),
      interval: Math.max(0, Math.round(Number(raw.interval) || 0)),
      repetitions: Math.max(0, Math.round(Number(raw.repetitions) || 0)),
      dueDate: parseDate(raw.dueDate) ? raw.dueDate : base.dueDate,
      seen: Math.max(0, Math.round(Number(raw.seen) || 0)),
      correct: Math.max(0, Math.round(Number(raw.correct) || 0)),
      wrong: Math.max(0, Math.round(Number(raw.wrong) || 0)),
      lastReviewed: parseDate(raw.lastReviewed) ? raw.lastReviewed : ""
    };
  }

  function getSrs(glyph) {
    if (!state.srs[glyph]) {
      state.srs[glyph] = defaultSrsRecord();
    }
    return state.srs[glyph];
  }

  function ensureSrsDeck() {
    deck.forEach((item) => {
      state.srs[item.glyph] = sanitizeRecord(state.srs[item.glyph]);
    });
  }

  function dueLabel(dateString) {
    const delta = daysDiff(today(), dateString);
    if (delta === 0) {
      return "today";
    }
    if (delta < 0) {
      return `${Math.abs(delta)}d overdue`;
    }
    return `in ${delta}d`;
  }

  function isMastered(glyph) {
    const rec = getSrs(glyph);
    return rec.repetitions >= MASTERY_REPS && rec.interval >= MASTERY_INTERVAL;
  }

  function lessonStates() {
    const out = [];
    lessons.forEach((lesson, idx) => {
      const mastered = lesson.glyphs.filter((g) => isMastered(g)).length;
      const total = lesson.glyphs.length;
      const ratio = total ? mastered / total : 0;
      const unlocked = idx === 0 ? true : out[idx - 1].ratio >= LESSON_UNLOCK_THRESHOLD;
      out.push({ lesson, mastered, total, ratio, unlocked });
    });
    return out;
  }

  function getDueCards(glyphs) {
    const target = glyphs || deck.map((d) => d.glyph);
    const now = today();
    return target
      .map((glyph) => ({ glyph, rec: getSrs(glyph) }))
      .filter((entry) => entry.rec.dueDate <= now)
      .sort((a, b) => {
        if (a.rec.dueDate !== b.rec.dueDate) {
          return a.rec.dueDate.localeCompare(b.rec.dueDate);
        }
        return a.rec.repetitions - b.rec.repetitions;
      });
  }

  function nextDueCard() {
    return deck
      .map((d) => ({ glyph: d.glyph, rec: getSrs(d.glyph) }))
      .sort((a, b) => {
        if (a.rec.dueDate !== b.rec.dueDate) {
          return a.rec.dueDate.localeCompare(b.rec.dueDate);
        }
        return a.rec.repetitions - b.rec.repetitions;
      })[0] || null;
  }

  function acceptedAnswers(item) {
    const set = new Set([item.latin.toLowerCase()]);
    if (aliases[item.glyph]) {
      aliases[item.glyph].forEach((alt) => set.add(alt.toLowerCase()));
    }
    return Array.from(set);
  }

  function shuffle(list) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function buildCardChoices(item) {
    const accepted = new Set(acceptedAnswers(item));
    const distractors = shuffle(deck)
      .map((entry) => entry.latin.toLowerCase())
      .filter((latin) => latin && !accepted.has(latin))
      .filter((latin, idx, arr) => arr.indexOf(latin) === idx)
      .slice(0, 3);

    const choices = [{ value: item.latin.toLowerCase(), correct: true }];
    distractors.forEach((latin) => choices.push({ value: latin, correct: false }));

    while (choices.length < 4) {
      choices.push({ value: `option-${choices.length + 1}`, correct: false, label: "?" });
    }
    return shuffle(choices);
  }

  function setFeedback(id, msg, type) {
    const node = byId(id);
    if (!node) return;
    node.textContent = msg;
    node.className = `feedback ${type || ""}`;
  }

  function setVerticalGlyph(node, value) {
    if (!node) return;
    node.innerHTML = "";
    const span = document.createElement("span");
    span.className = "glyph-vertical";
    span.textContent = value || "";
    node.appendChild(span);
  }

  function setGradeEnabled(enabled, hintText) {
    ["gradeAgainBtn", "gradeHardBtn", "gradeGoodBtn", "gradeEasyBtn"].forEach((id) => {
      const btn = byId(id);
      if (btn) btn.disabled = !enabled;
    });
    byId("gradeHint").textContent = hintText;
  }

  function persist() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        cardIndex: state.cardIndex,
        challengeIndex: state.challengeIndex,
        selectedLessonId: state.selectedLessonId,
        score: state.score,
        streak: state.streak,
        lastDate: state.lastDate,
        srs: state.srs
      })
    );
  }

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      ensureSrsDeck();
      persist();
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      state.cardIndex = Number(parsed.cardIndex) || 0;
      state.challengeIndex = Number(parsed.challengeIndex) || 0;
      state.selectedLessonId = parsed.selectedLessonId || lessons[0].id;
      state.score = Number(parsed.score) || 0;
      state.streak = Number(parsed.streak) || 0;
      state.lastDate = parsed.lastDate || "";
      state.srs = parsed.srs && typeof parsed.srs === "object" ? parsed.srs : {};
    } catch {
      state.cardIndex = 0;
    }

    if (state.cardIndex < 0 || state.cardIndex >= deck.length) {
      state.cardIndex = 0;
    }
    if (state.challengeIndex < 0 || state.challengeIndex >= confusables.length) {
      state.challengeIndex = 0;
    }

    if (!lessons.some((l) => l.id === state.selectedLessonId)) {
      state.selectedLessonId = lessons[0].id;
    }

    ensureSrsDeck();
    persist();
  }

  function markPractice(points) {
    const now = today();
    if (!state.lastDate) {
      state.streak = 1;
      state.lastDate = now;
    } else if (state.lastDate !== now) {
      const gap = daysDiff(state.lastDate, now);
      state.streak = gap === 1 ? state.streak + 1 : 1;
      state.lastDate = now;
    }
    state.score += points;
    persist();
  }

  function schedule(glyph, grade, wasCorrect) {
    const rec = getSrs(glyph);
    rec.seen += 1;
    rec.lastReviewed = today();
    if (wasCorrect) {
      rec.correct += 1;
    } else {
      rec.wrong += 1;
    }

    if (grade === "again") {
      rec.repetitions = 0;
      rec.interval = 0;
      rec.ease = Math.max(1.3, rec.ease - 0.2);
    }

    if (grade === "hard") {
      rec.repetitions += 1;
      rec.interval = rec.repetitions <= 1 ? 1 : Math.max(2, Math.round(rec.interval * 1.2));
      rec.ease = Math.max(1.3, rec.ease - 0.15);
    }

    if (grade === "good") {
      rec.repetitions += 1;
      if (rec.repetitions === 1) rec.interval = 1;
      else if (rec.repetitions === 2) rec.interval = 3;
      else rec.interval = Math.max(4, Math.round(Math.max(1, rec.interval) * rec.ease));
      rec.ease = Math.min(3, rec.ease + 0.03);
    }

    if (grade === "easy") {
      rec.repetitions += 1;
      if (rec.repetitions === 1) rec.interval = 3;
      else if (rec.repetitions === 2) rec.interval = 6;
      else rec.interval = Math.max(7, Math.round(Math.max(1, rec.interval) * (rec.ease + 0.18)));
      rec.ease = Math.min(3, rec.ease + 0.08);
    }

    rec.dueDate = addDays(today(), rec.interval);
    persist();
  }

  function renderStats() {
    const due = getDueCards();
    const next = nextDueCard();
    const mastered = deck.filter((item) => isMastered(item.glyph)).length;

    byId("scoreValue").textContent = String(state.score);
    byId("streakValue").textContent = `${state.streak} day${state.streak === 1 ? "" : "s"}`;
    byId("dueValue").textContent = String(due.length);
    byId("masteredValue").textContent = `${mastered}/${deck.length}`;
    byId("queueDueCount").textContent = String(due.length);
    byId("nextDueValue").textContent = next ? `${next.glyph} (${dueLabel(next.rec.dueDate)})` : "-";
  }

  function renderCard() {
    const item = deck[state.cardIndex];
    const rec = getSrs(item.glyph);
    setVerticalGlyph(byId("charGlyph"), item.glyph);
    byId("charName").textContent = item.name;
    byId("charCyr").textContent = item.cyr;
    byId("charLatin").textContent = item.latin;
    byId("charHint").textContent = `${item.hint} Next review: ${dueLabel(rec.dueDate)}.`;
    const choicesWrap = byId("cardChoices");
    choicesWrap.innerHTML = "";

    buildCardChoices(item).forEach((choice) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mc-option";
      btn.textContent = choice.label || choice.value;
      btn.addEventListener("click", () => checkCardAnswer(btn, choice.value));
      choicesWrap.appendChild(btn);
    });

    setFeedback("cardFeedback", "", "");
    state.pendingGradeGlyph = null;
    setGradeEnabled(false, "Answer correctly first, then choose a review grade.");
  }

  function moveCard(delta) {
    state.cardIndex = (state.cardIndex + delta + deck.length) % deck.length;
    persist();
    renderCard();
  }

  function jumpToGlyph(glyph) {
    if (!Object.prototype.hasOwnProperty.call(glyphToIndex, glyph)) {
      return;
    }
    state.cardIndex = glyphToIndex[glyph];
    persist();
    renderCard();
  }

  function checkCardAnswer(targetBtn, selectedValue) {
    const item = deck[state.cardIndex];
    if (state.pendingGradeGlyph) {
      setFeedback("cardFeedback", "Choose a grade to continue.", "warn");
      return;
    }

    if (!targetBtn || !selectedValue) {
      setFeedback("cardFeedback", "Select an answer first.", "warn");
      return;
    }

    const optionButtons = Array.from(document.querySelectorAll("#cardChoices .mc-option"));
    optionButtons.forEach((btn) => {
      btn.disabled = true;
    });

    const accepted = acceptedAnswers(item);

    if (accepted.includes(selectedValue)) {
      state.pendingGradeGlyph = item.glyph;
      targetBtn.classList.add("correct");
      setFeedback("cardFeedback", `Correct: ${item.glyph} -> ${item.latin}. Choose a grade.`, "ok");
      setGradeEnabled(true, "Grade this recall to schedule its next review.");
    } else {
      targetBtn.classList.add("wrong");
      const correctBtn = optionButtons.find((btn) => accepted.includes((btn.textContent || "").toLowerCase()));
      if (correctBtn) {
        correctBtn.classList.add("correct");
      }
      schedule(item.glyph, "again", false);
      markPractice(1);
      renderStats();
      renderLessons();
      renderCard();
      setFeedback("cardFeedback", `Not correct. Accepted: ${accepted.join(" / ")}. Scheduled Again.`, "bad");
      setGradeEnabled(false, "Incorrect answers are auto-scheduled as Again.");
    }
  }

  function applyGrade(grade) {
    if (!state.pendingGradeGlyph) {
      setFeedback("cardFeedback", "Answer a card correctly before grading.", "warn");
      return;
    }

    const points = { again: 2, hard: 4, good: 6, easy: 8 };
    const glyph = state.pendingGradeGlyph;
    schedule(glyph, grade, true);
    markPractice(points[grade] || 2);
    state.pendingGradeGlyph = null;

    renderStats();
    renderLessons();
    renderCard();
    const rec = getSrs(glyph);
    setFeedback("cardFeedback", `Saved grade ${grade}. ${glyph} is due ${dueLabel(rec.dueDate)}.`, "ok");
  }

  function studyNextDue() {
    const selected = lessons.find((l) => l.id === state.selectedLessonId) || lessons[0];
    const lessonDue = getDueCards(selected.glyphs);
    const globalDue = getDueCards();
    const target = lessonDue[0] || globalDue[0];

    if (!target) {
      setFeedback("cardFeedback", "No due cards right now. Nice work.", "ok");
      return;
    }

    jumpToGlyph(target.glyph);
    setFeedback("cardFeedback", `Loaded due card ${target.glyph}.`, "ok");
  }

  function renderLessons() {
    const select = byId("lessonSelect");
    const progress = byId("lessonProgress");
    const status = byId("lessonStatus");
    const states = lessonStates();

    const unlockedSelected = states.find(
      (s) => s.lesson.id === state.selectedLessonId && s.unlocked
    );
    if (!unlockedSelected) {
      state.selectedLessonId = (states.find((s) => s.unlocked) || states[0]).lesson.id;
      persist();
    }

    select.innerHTML = "";

    states.forEach((entry) => {
      const option = document.createElement("option");
      const pct = Math.round(entry.ratio * 100);
      option.value = entry.lesson.id;
      option.disabled = !entry.unlocked;
      option.textContent = `${entry.lesson.title} (${pct}%)${entry.unlocked ? "" : " - Locked"}`;
      if (entry.lesson.id === state.selectedLessonId) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    const current = states.find((s) => s.lesson.id === state.selectedLessonId) || states[0];
    status.textContent = `Current lesson: ${current.lesson.title} (${current.mastered}/${current.total} mastered).`;

    progress.innerHTML = "";
    states.forEach((entry) => {
      const row = document.createElement("div");
      const pct = Math.round(entry.ratio * 100);
      row.className = "lesson-card";
      row.innerHTML = `
        <div class="metric-item">
          <span>${entry.lesson.title}</span>
          <strong>${entry.mastered}/${entry.total} · ${pct}% · ${entry.unlocked ? "Unlocked" : "Locked"}</strong>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      `;
      progress.appendChild(row);
    });
  }

  function startLesson() {
    const states = lessonStates();
    const selected = states.find((s) => s.lesson.id === state.selectedLessonId);

    if (!selected || !selected.unlocked) {
      byId("lessonStatus").textContent = "Lesson is locked. Master 80% of previous lesson first.";
      return;
    }

    const due = getDueCards(selected.lesson.glyphs);
    const target = due[0] || selected.lesson.glyphs.find((glyph) => !isMastered(glyph)) || selected.lesson.glyphs[0];
    jumpToGlyph(target.glyph || target);
    setFeedback("cardFeedback", `Started ${selected.lesson.title}.`, "ok");
  }

  function convert() {
    const source = byId("sourceInput").value || "";
    const detail = window.SCRIPT_BRIDGE.transliterateDetailed(source);
    const system = detail.sourceSystem || window.SCRIPT_BRIDGE.detectInputSystem(source);
    const latin = detail.latinOutput || (system === "cyrillic" ? window.SCRIPT_BRIDGE.transliterateToLatin(source) : source);
    const trad = detail.primary || window.SCRIPT_BRIDGE.transliterateToTraditional(source);

    byId("sourceSystem").textContent = system;
    byId("latinOutput").value = latin;
    byId("traditionalOutput").value = trad;
    setVerticalGlyph(byId("tradPreview"), trad || "ᠰᠠᠢᠨ");
    byId("convertMethod").textContent = detail.method || "rules";
    byId("convertConfidence").textContent = `${Math.round((detail.confidence || 0) * 100)}%`;

    const statsWrap = byId("convertStats");
    statsWrap.innerHTML = "";
    if (detail.stats) {
      const words = document.createElement("span");
      words.className = "rule-chip";
      words.textContent = `Words: ${detail.stats.words}`;
      statsWrap.appendChild(words);

      const lex = document.createElement("span");
      lex.className = "rule-chip";
      lex.textContent = `Lexicon hits: ${detail.stats.lexiconWords}`;
      statsWrap.appendChild(lex);
    }

    const altList = byId("tradCandidates");
    altList.innerHTML = "";
    const alternatives = (detail.candidates || []).slice(1, 5);
    if (!alternatives.length) {
      const li = document.createElement("li");
      li.textContent = "No additional alternatives for this input.";
      altList.appendChild(li);
    } else {
      alternatives.forEach((candidate) => {
        const li = document.createElement("li");
        const conf = Math.round((candidate.confidence || 0) * 100);
        li.textContent = `${candidate.text} (${conf}%)`;
        altList.appendChild(li);
      });
    }

    if (source.trim()) {
      markPractice(2);
      renderStats();
    }
  }

  function renderChallenge() {
    const item = confusables[state.challengeIndex];
    state.challengeAnswered = false;

    byId("challengeStep").textContent = `Question ${state.challengeIndex + 1} of ${confusables.length}`;
    byId("challengePrompt").textContent = item.prompt;
    setFeedback("challengeFeedback", "", "");

    const wrap = byId("challengeOptions");
    wrap.innerHTML = "";

    item.options.forEach((option, idx) => {
      const btn = document.createElement("button");
      btn.className = "challenge-option";
      btn.type = "button";
      const glyphWrap = document.createElement("div");
      glyphWrap.className = "glyph-focus";
      setVerticalGlyph(glyphWrap, option.glyph);

      const label = document.createElement("div");
      label.textContent = option.label;

      btn.appendChild(glyphWrap);
      btn.appendChild(label);
      btn.addEventListener("click", () => answerChallenge(idx));
      wrap.appendChild(btn);
    });
  }

  function answerChallenge(idx) {
    if (state.challengeAnswered) {
      return;
    }
    state.challengeAnswered = true;

    const item = confusables[state.challengeIndex];
    if (idx === item.answer) {
      setFeedback("challengeFeedback", `Correct. ${item.explanation}`, "ok");
      markPractice(5);
      renderStats();
    } else {
      const correct = item.options[item.answer];
      setFeedback(
        "challengeFeedback",
        `Not this time. Correct answer: ${correct.glyph} (${correct.label}). ${item.explanation}`,
        "bad"
      );
    }
  }

  function nextChallenge() {
    state.challengeIndex = (state.challengeIndex + 1) % confusables.length;
    persist();
    renderChallenge();
  }

  function hasGlyphSupport(glyph) {
    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 42;
    const ctx = canvas.getContext("2d");
    ctx.font = '32px "Noto Sans Mongolian", "Mongolian Baiti", serif';
    const glyphW = ctx.measureText(glyph).width;
    const tofuW = ctx.measureText("\uFFFD").width;
    return Math.abs(glyphW - tofuW) > 0.1;
  }

  function runRenderCheck() {
    const tbody = byId("renderTable");
    tbody.innerHTML = "";

    deck.forEach((item) => {
      const tr = document.createElement("tr");
      const ok = hasGlyphSupport(item.glyph);
      tr.innerHTML = `
        <td class="glyph">${item.glyph}</td>
        <td>${item.name}</td>
        <td><span class="status-chip ${ok ? "ok" : "bad"}">${ok ? "Supported" : "Fallback"}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function setTab(tabName) {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `tab-${tabName}`);
    });
  }

  function bind() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => setTab(btn.dataset.tab));
    });

    byId("prevCardBtn").addEventListener("click", () => moveCard(-1));
    byId("nextCardBtn").addEventListener("click", () => moveCard(1));

    byId("studyDueBtn").addEventListener("click", studyNextDue);
    byId("gradeAgainBtn").addEventListener("click", () => applyGrade("again"));
    byId("gradeHardBtn").addEventListener("click", () => applyGrade("hard"));
    byId("gradeGoodBtn").addEventListener("click", () => applyGrade("good"));
    byId("gradeEasyBtn").addEventListener("click", () => applyGrade("easy"));

    byId("lessonSelect").addEventListener("change", (event) => {
      state.selectedLessonId = event.target.value;
      persist();
      renderLessons();
    });
    byId("startLessonBtn").addEventListener("click", startLesson);

    byId("convertBtn").addEventListener("click", convert);
    byId("nextChallengeBtn").addEventListener("click", nextChallenge);
    byId("runRenderBtn").addEventListener("click", runRenderCheck);
  }

  function init() {
    load();
    bind();
    renderStats();
    renderLessons();
    renderCard();
    renderChallenge();
    runRenderCheck();
    convert();
    setTab("cards");
  }

  init();
})();
