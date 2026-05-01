# Bichig

A static, multi-page web app for learning Traditional Mongolian script with guided lessons, study tools, and writing quizzes.

## Files

- `index.html` — home/overview page for the full app experience
- `studio.html` — character training studio (SRS cards, transliteration lab, confusable challenges, render checks)
- `freehand.html` — dedicated script-writing quiz page with typed/freehand answer modes, random word generation, and Cyrillic/Latin prompt selection
- `lessons.html` — detailed lesson path with beginner-friendly grammar notes
- `cheatsheet.html` — concise quick-reference page with all listed letters, forms, and rules
- `styles.css` — shared visual theme and responsive layout
- `app-common.js` — shared character data + transliteration helpers used by studio and freehand pages
- `app-studio.js` — Studio page logic
- `app-freehand.js` — freehand pad and writing quiz logic
- `app-cheatsheet.js` — cheat-sheet table renderer
- `app.js` — legacy single-page script kept for reference

## Run

Open `index.html` directly in a browser, or serve the folder with any static server.

## Notes

- For better script rendering, use a Mongolian-capable font such as Noto Sans Mongolian.
- The converter now uses a hybrid approach: phrase/word lexicon overrides + rule-based fallback + ranked alternative candidates with confidence.
- `window.SCRIPT_BRIDGE.transliterateDetailed(input)` returns conversion metadata (`primary`, `candidates`, `confidence`, and method) used by Studio and Freehand quiz.
- The app includes core and extended chart coverage, while lessons still prioritize the most useful beginner letters first.
