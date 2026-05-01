(function () {
  const state = {
    mode: "typed",
    expected: "",
    expectedRevealed: false,
    acceptedSpellings: [],
    quizSourceMode: "random",
    promptScript: "cyrillic",
    lastRandomIndex: -1
  };

  const quizWordBank =
    (window.SCRIPT_BRIDGE.getQuizWordBank && window.SCRIPT_BRIDGE.getQuizWordBank()) || [
      { cyr: "Сайн", latin: "sain" },
      { cyr: "Монгол", latin: "mongol" },
      { cyr: "Ном", latin: "nom" },
      { cyr: "Хүн", latin: "hun" },
      { cyr: "Хэл", latin: "hel" }
    ];

  function byId(id) {
    return document.getElementById(id);
  }

  function setFeedback(msg, type) {
    const node = byId("quizFeedback");
    node.textContent = msg;
    node.className = `feedback ${type || ""}`;
  }

  function setQuizSourceMode(mode) {
    state.quizSourceMode = mode === "input" ? "input" : "random";
    byId("inputSourceModeBtn").classList.toggle("active", state.quizSourceMode === "input");
    byId("randomSourceModeBtn").classList.toggle("active", state.quizSourceMode === "random");
    byId("inputSourcePanel").classList.toggle("hide", state.quizSourceMode !== "input");
    byId("randomSourcePanel").classList.toggle("hide", state.quizSourceMode !== "random");
  }

  function setPromptScript(script) {
    state.promptScript = script === "latin" ? "latin" : "cyrillic";
    byId("sourceCyrBtn").classList.toggle("active", state.promptScript === "cyrillic");
    byId("sourceLatinBtn").classList.toggle("active", state.promptScript === "latin");
    byId("quizInput").placeholder =
      state.promptScript === "latin" ? "Example: sain" : "Example: Сайн";
  }

  function uniqueTraditional(values) {
    const seen = new Set();
    const out = [];
    (values || []).forEach((value) => {
      const text = String(value || "").trim();
      if (!text) return;
      const key = window.SCRIPT_BRIDGE.normalizeTraditionalForCompare(text);
      if (!key || seen.has(key)) return;
      seen.add(key);
      out.push(text);
    });
    return out;
  }

  function renderAcceptedSpellings(showValues) {
    const wrap = byId("quizAcceptedWrap");
    wrap.innerHTML = "";

    if (!state.acceptedSpellings.length) {
      const chip = document.createElement("span");
      chip.className = "rule-chip";
      chip.textContent = "No accepted spellings yet.";
      wrap.appendChild(chip);
      return;
    }

    if (!showValues) {
      const chip = document.createElement("span");
      chip.className = "rule-chip";
      chip.textContent = `${state.acceptedSpellings.length} accepted variant${state.acceptedSpellings.length === 1 ? "" : "s"} available`;
      wrap.appendChild(chip);
      return;
    }

    state.acceptedSpellings.forEach((text, index) => {
      const chip = document.createElement("span");
      chip.className = "rule-chip";
      chip.textContent = index === 0 ? `${text} (primary)` : text;
      wrap.appendChild(chip);
    });
  }

  function createPad(canvasId, options) {
    const canvas = byId(canvasId);
    const ctx = canvas.getContext("2d");
    const strokes = [];
    let activeStroke = null;

    const config = {
      strokeColor: (options && options.strokeColor) || "#145b4d",
      strokeWidth: (options && options.strokeWidth) || 4,
      drawBackground: (options && options.drawBackground) || null,
      onAfterDraw: (options && options.onAfterDraw) || null
    };

    function pointFromEvent(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    function redraw() {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (typeof config.drawBackground === "function") {
        config.drawBackground(ctx, canvas);
      }

      ctx.strokeStyle = config.strokeColor;
      ctx.lineWidth = config.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      strokes.forEach((stroke) => {
        if (!stroke.length) return;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i += 1) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      });

      if (typeof config.onAfterDraw === "function") {
        config.onAfterDraw(ctx, canvas);
      }
    }

    function clear() {
      strokes.length = 0;
      redraw();
    }

    function undo() {
      if (strokes.length > 0) {
        strokes.pop();
      }
      redraw();
    }

    function snapshot() {
      return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    canvas.addEventListener("pointerdown", (event) => {
      activeStroke = [];
      const p = pointFromEvent(event);
      activeStroke.push(p);
      strokes.push(activeStroke);
      canvas.setPointerCapture(event.pointerId);
      redraw();
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!activeStroke) {
        return;
      }
      activeStroke.push(pointFromEvent(event));
      redraw();
    });

    function stop(event) {
      if (activeStroke && activeStroke.length < 2) {
        const p = activeStroke[0];
        activeStroke.push({ x: p.x + 0.1, y: p.y + 0.1 });
      }
      activeStroke = null;
      if (event && typeof event.pointerId === "number") {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch {
          // ignore release errors
        }
      }
    }

    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);
    canvas.addEventListener("pointerleave", stop);

    redraw();

    return {
      clear,
      undo,
      redraw,
      snapshot,
      canvas,
      ctx,
      setAfterDraw(fn) {
        config.onAfterDraw = fn;
        redraw();
      }
    };
  }

  function templateLayout(canvas, text) {
    const noSpacesLength = (text || "").replace(/\s+/g, "").length || 1;
    const size = Math.max(58, Math.min(120, Math.round(canvas.width / (noSpacesLength + 2))));
    return {
      font: `${size}px \"Noto Sans Mongolian\", \"Mongolian Baiti\", serif`,
      x: canvas.width / 2,
      y: canvas.height / 2
    };
  }

  function drawQuizTemplate(ctx, canvas) {
    const showTemplate = byId("showTemplateToggle").checked;
    if (!showTemplate || !state.expected) {
      return;
    }

    const layout = templateLayout(canvas, state.expected);
    ctx.font = layout.font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(89, 127, 116, 0.22)";
    ctx.fillText(state.expected, layout.x, layout.y);
  }

  function setMode(mode) {
    state.mode = mode;
    byId("typedModeBtn").classList.toggle("active", mode === "typed");
    byId("freehandModeBtn").classList.toggle("active", mode === "freehand");
    byId("typedModePanel").classList.toggle("hide", mode !== "typed");
    byId("freehandModePanel").classList.toggle("hide", mode !== "freehand");
  }

  function maskExpected() {
    if (!state.expected) {
      byId("quizExpectedMasked").textContent = "•••";
      return;
    }
    byId("quizExpectedMasked").textContent = state.expectedRevealed ? state.expected : "•••";
  }

  function pickRandomWord() {
    if (!quizWordBank.length) {
      return "";
    }

    let idx = Math.floor(Math.random() * quizWordBank.length);
    if (quizWordBank.length > 1 && idx === state.lastRandomIndex) {
      idx = (idx + 1) % quizWordBank.length;
    }
    state.lastRandomIndex = idx;

    const entry = quizWordBank[idx];
    return state.promptScript === "latin" ? entry.latin : entry.cyr;
  }

  function generateRandomQuiz(quizPad) {
    const prompt = pickRandomWord();
    if (!prompt) {
      setFeedback("No random words available yet.", "warn");
      return;
    }
    byId("quizInput").value = prompt;
    generateQuiz(quizPad, prompt);
  }

  function generateQuiz(quizPad, sourceOverride) {
    const source = sourceOverride || byId("quizInput").value || "";
    if (!source.trim()) {
      setFeedback("Enter a word first.", "warn");
      return;
    }

    const detail = window.SCRIPT_BRIDGE.transliterateDetailed(source);
    const system = detail.sourceSystem || window.SCRIPT_BRIDGE.detectInputSystem(source);
    const expected = String(detail.primary || "").trim();

    const acceptedFromDetail = (detail.candidates || []).map((candidate) => candidate.text);
    state.acceptedSpellings = uniqueTraditional([expected, ...acceptedFromDetail]).slice(0, 6);
    if (!state.acceptedSpellings.length && expected) {
      state.acceptedSpellings = [expected];
    }

    state.expected = state.acceptedSpellings[0] || expected;
    state.expectedRevealed = false;

    byId("quizPromptText").textContent = source.trim();
    byId("quizSystem").textContent = system;
    byId("quizConvertMeta").textContent = `Converter: ${detail.method || "rules"} · confidence ${Math.round((detail.confidence || 0) * 100)}%`;
    maskExpected();
    renderAcceptedSpellings(false);

    byId("typedAnswer").value = "";
    quizPad.clear();
    quizPad.redraw();

    setFeedback("Quiz ready. Write the word in Traditional script.", "ok");
  }

  function revealExpected() {
    if (!state.expected) {
      setFeedback("Generate a quiz first.", "warn");
      return;
    }
    state.expectedRevealed = true;
    maskExpected();
    renderAcceptedSpellings(true);
    setFeedback("Answer revealed.", "warn");
  }

  function checkTyped() {
    if (!state.expected) {
      setFeedback("Generate a quiz first.", "warn");
      return;
    }

    const user = byId("typedAnswer").value || "";
    const accepted = state.acceptedSpellings.length ? state.acceptedSpellings : [state.expected];
    const ok = accepted.some((candidate) => window.SCRIPT_BRIDGE.compareTraditional(user, candidate));

    if (ok) {
      setFeedback("Correct typed answer. Nice work.", "ok");
    } else {
      renderAcceptedSpellings(true);
      setFeedback("Not a match yet. One of the accepted spellings is shown below.", "bad");
    }
  }

  function scoreAgainstTarget(userData, quizPad, targetText) {
    const template = document.createElement("canvas");
    template.width = quizPad.canvas.width;
    template.height = quizPad.canvas.height;
    const tctx = template.getContext("2d");
    tctx.fillStyle = "#ffffff";
    tctx.fillRect(0, 0, template.width, template.height);

    const layout = templateLayout(template, targetText);
    tctx.font = layout.font;
    tctx.textAlign = "center";
    tctx.textBaseline = "middle";
    tctx.fillStyle = "#000000";
    tctx.fillText(targetText, layout.x, layout.y);

    const templateData = tctx.getImageData(0, 0, template.width, template.height).data;

    let userCount = 0;
    let templateCount = 0;
    let overlap = 0;

    for (let i = 0; i < userData.length; i += 4) {
      const ur = userData[i];
      const ug = userData[i + 1];
      const ub = userData[i + 2];
      const ua = userData[i + 3];

      const tr = templateData[i];
      const ta = templateData[i + 3];

      const userInk = ua > 0 && (ur < 170 || ug < 170 || ub < 170);
      const templateInk = ta > 10 && tr < 200;

      if (userInk) userCount += 1;
      if (templateInk) templateCount += 1;
      if (userInk && templateInk) overlap += 1;
    }

    const precision = overlap / Math.max(1, userCount);
    const recall = overlap / Math.max(1, templateCount);
    const score = 0.6 * recall + 0.4 * precision;

    return { score, recall, precision, userCount, target: targetText };
  }

  function evaluateFreehand(quizPad) {
    if (!state.expected) {
      setFeedback("Generate a quiz first.", "warn");
      return;
    }

    const userData = quizPad.snapshot().data;
    const accepted = state.acceptedSpellings.length ? state.acceptedSpellings : [state.expected];
    const results = accepted.map((target) => scoreAgainstTarget(userData, quizPad, target));
    results.sort((a, b) => b.score - a.score);
    const best = results[0];

    if (!best || best.userCount < 120) {
      setFeedback("Freehand input is too small. Write larger strokes and try again.", "warn");
      return;
    }

    if (best.score >= 0.2 && best.recall >= 0.14) {
      const isPrimary = window.SCRIPT_BRIDGE.compareTraditional(best.target, state.expected);
      setFeedback(
        `Freehand looks correct (${isPrimary ? "primary" : "accepted alternative"}). Score ${Math.round(best.score * 100)}%.`,
        "ok"
      );
    } else {
      renderAcceptedSpellings(true);
      setFeedback(
        `Not close enough yet. Closest accepted target scored ${Math.round(best.score * 100)}%. Try slower, centered strokes.`,
        "bad"
      );
    }
  }

  function init() {
    const quizPad = createPad("quizPad", {
      drawBackground: null,
      strokeWidth: 4,
      strokeColor: "#145b4d",
      onAfterDraw: drawQuizTemplate
    });

    byId("typedModeBtn").addEventListener("click", () => setMode("typed"));
    byId("freehandModeBtn").addEventListener("click", () => setMode("freehand"));
    byId("inputSourceModeBtn").addEventListener("click", () => setQuizSourceMode("input"));
    byId("randomSourceModeBtn").addEventListener("click", () => {
      setQuizSourceMode("random");
      generateRandomQuiz(quizPad);
    });
    byId("sourceCyrBtn").addEventListener("click", () => setPromptScript("cyrillic"));
    byId("sourceLatinBtn").addEventListener("click", () => setPromptScript("latin"));

    byId("showTemplateToggle").addEventListener("change", () => quizPad.redraw());

    byId("generateQuizBtn").addEventListener("click", () => generateQuiz(quizPad));
    byId("randomQuizBtn").addEventListener("click", () => generateRandomQuiz(quizPad));
    byId("revealAnswerBtn").addEventListener("click", revealExpected);
    byId("checkTypedBtn").addEventListener("click", checkTyped);

    byId("clearQuizPadBtn").addEventListener("click", () => quizPad.clear());
    byId("undoQuizPadBtn").addEventListener("click", () => quizPad.undo());
    byId("checkFreehandBtn").addEventListener("click", () => evaluateFreehand(quizPad));

    byId("quizInput").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (state.quizSourceMode !== "input") {
          return;
        }
        generateQuiz(quizPad);
      }
    });

    setMode("typed");
    setQuizSourceMode("random");
    setPromptScript("cyrillic");
    byId("quizPromptText").textContent = "-";
    maskExpected();
    byId("quizConvertMeta").textContent = "Converter: -";
    renderAcceptedSpellings(false);
    generateRandomQuiz(quizPad);
  }

  init();
})();
