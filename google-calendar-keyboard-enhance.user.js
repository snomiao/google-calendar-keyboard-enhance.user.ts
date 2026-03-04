// ==UserScript==
// @name              [SNOLAB] Google Calendar keyboard enhance
// @name:en           [SNOLAB] Google Calendar keyboard enhance
// @name:zh           [SNOLAB] Google 日历键盘操作增强
// @name:zh-CN        [SNOLAB] Google 日历键盘操作增强
// @name:zh-TW        [SNOLAB] Google 日曆鍵盤操作增強
// @name:ja           [SNOLAB] Google カレンダー キーボード操作強化
// @name:ko           [SNOLAB] Google 캘린더 키보드 향상
// @name:es           [SNOLAB] Google Calendar mejorado con teclado
// @name:fr           [SNOLAB] Google Calendar amélioration clavier
// @name:de           [SNOLAB] Google Kalender Tastaturverbesserung
// @name:ru           [SNOLAB] Google Календарь улучшение клавиатуры
// @namespace         https://userscript.snomiao.com/
// @version           0.3.0
// @description       Move and resize Google Calendar events with keyboard hotkeys (no mouse needed). Vim-style Alt+HJKL shortcuts to drag events between days and time slots. Alt+Shift+HJKL to expand/shrink event duration. Reschedule events without clicking.
// @description:en    Move and resize Google Calendar events with keyboard hotkeys (no mouse needed). Vim-style Alt+HJKL shortcuts to drag events between days and time slots. Alt+Shift+HJKL to expand/shrink event duration. Reschedule events without clicking.
// @description:zh    用键盘快捷键移动和调整Google日历事件（无需鼠标）。Vim风格Alt+HJKL拖拽日程到不同日期和时间段，Alt+Shift+HJKL扩展/缩小事件时长。键盘重新安排日程，告别鼠标拖拽。
// @description:zh-CN 用键盘快捷键移动和调整Google日历事件（无需鼠标）。Vim风格Alt+HJKL拖拽日程到不同日期和时间段，Alt+Shift+HJKL扩展/缩小事件时长。键盘重新安排日程，告别鼠标拖拽。
// @description:zh-TW 用鍵盤快捷鍵移動和調整Google日曆事件（無需滑鼠）。Vim風格Alt+HJKL拖曳日程到不同日期和時段，Alt+Shift+HJKL擴展/縮小事件時長。鍵盤重新安排行程，告別滑鼠拖曳。
// @description:ja    マウス不要！キーボードショートカットでGoogleカレンダーの予定を移動・リサイズ。Vim風Alt+HJKLで予定を別の日や時間帯にドラッグ、Alt+Shift+HJKLで予定の長さを調整。キーボードだけでスケジュール変更。
// @description:ko    마우스 없이 키보드 단축키로 Google 캘린더 일정 이동 및 크기 조절. Vim 스타일 Alt+HJKL로 일정을 다른 날짜와 시간대로 드래그, Alt+Shift+HJKL로 일정 길이 조절. 키보드만으로 일정 재조정.
// @description:es    Mueve y redimensiona eventos de Google Calendar con atajos de teclado (sin ratón). Teclas Vim Alt+HJKL para arrastrar eventos entre días y franjas horarias. Alt+Shift+HJKL para expandir/reducir la duración. Reprograma eventos sin hacer clic.
// @description:fr    Déplacez et redimensionnez les événements Google Calendar avec des raccourcis clavier (sans souris). Touches Vim Alt+HJKL pour glisser les événements entre jours et créneaux horaires. Alt+Shift+HJKL pour étendre/réduire la durée. Replanifiez sans cliquer.
// @description:de    Google Kalender-Ereignisse per Tastatur verschieben und skalieren (keine Maus nötig). Vim-Stil Alt+HJKL zum Ziehen von Terminen zwischen Tagen und Zeitfenstern. Alt+Shift+HJKL zum Erweitern/Verkürzen der Dauer. Termine ohne Klicken umplanen.
// @description:ru    Перемещайте и изменяйте размер событий Google Календаря с помощью горячих клавиш (без мыши). Vim-стиль Alt+HJKL для перетаскивания событий между днями и временными слотами. Alt+Shift+HJKL для расширения/сжатия длительности. Перепланируйте без кликов.
// @author            snomiao@gmail.com
// @match             *://calendar.google.com/*
// @grant             none
// @downloadURL       https://update.greasyfork.org/scripts/439210/%5BSNOLAB%5D%20Google%20Calendar%20keyboard%20enhance.user.js
// @updateURL         https://update.greasyfork.org/scripts/439210/%5BSNOLAB%5D%20Google%20Calendar%20keyboard%20enhance.meta.js
// ==/UserScript==

// --- Init ---

// window.gkcs_verbose = true;
window.gkcs_unload?.();
window.gkcs_unload = main();

function main() {
  const ac = new AbortController()
  const signal = ac.signal
  console.clear();

  const jk = accTicker((d) => d && eventMove([0, d]), { signal });
  const hl = accTicker((d) => d && eventMove([d, 0]), { signal });
  const sjk = accTicker((d) => d && eventExpand([0, d]), { signal });
  const shl = accTicker((d) => d && eventExpand([d, 0]), { signal });

  hotkeys({
    "ctrl+b": () => $visible(sel.Menu)?.click(),
    "alt+v": () => copyPatternReport(),

    "alt+k": () => jk(-24),
    "alt+j": () => jk(+24),
    "alt+h": () => hl(-7),
    "alt+l": () => hl(+7),
    "alt+shift+k": () => sjk(-24),
    "alt+shift+j": () => sjk(+24),
    "alt+shift+h": () => shl(-7),
    "alt+shift+l": () => shl(+7),
    "k up": () => (jk(0), sjk(0)),
    "j up": () => (jk(0), sjk(0)),
    "h up": () => (hl(0), shl(0)),
    "l up": () => (hl(0), shl(0)),
  }, { signal, capture: true })
  return () => ac.abort()
}

function hotkeys(m, { signal, capture } = {}) {
  window.addEventListener(
    "keydown",
    (event) => {
      const k =
        (event.altKey ? "alt+" : "") +
        (event.ctrlKey ? "ctrl+" : "") +
        (event.metaKey ? "meta+" : "") +
        (event.shiftKey ? "shift+" : "") +
        event.code.replace(/^Key/, "");
      const f = m[k.toLowerCase()];
      if (f) {
        event.stopPropagation();
        event.preventDefault();
        if (event.repeat) return;
        f();
      }
    },
    { signal, capture },
  );
  window.addEventListener(
    "keyup",
    (event) => {
      const k = event.code.replace(/^Key/, '').toLowerCase();
      m[k + ' up']?.();
    },
    { signal, capture },
  );
}
function accTicker(f, { signal } = {}) {
  let x, v, a, g, t, id;
  const reset = () => x = v = a = g = t = 0;
  const active = () => Math.max(...[v, a, g].map((e) => Math.abs(e))) > 0.08;
  signal?.addEventListener('abort', () => id = (clearInterval(id) || reset()))
  reset()
  return function tick(_a) {
    g = _a ?? g
    if (_a !== undefined && id) return;
    t1 = Date.now();
    let dt = (t1 - (t || t1)) / 1e3;
    t = t1;
    const d = (_) => dt * _
    const s = Math.sign(g)
    x += (s * +!id) + d(v += d(a = s * Math.abs(g) ** (1.3 + dt)));
    g || (a /= Math.E, a |= 0, v /= Math.E, v |= 0)
    // console.log({ x, v, a, g, t: new Date(t).toISOString(), dt })
    o = x | 0; o && (f(o), x -= o);
    id = active() ? (id || setInterval(tick, 1)) : (clearInterval(id) || reset());
  };
}

// --- Selectors (Japanese + English) ---

const sel = {
  Menu: '[aria-label="メインドロワー"]',
  Summary: [
    '[aria-label="タイトルと日時を追加"]',
    '[aria-label="タイトルを追加"]',
    '[aria-label="タイトル"]',
    '[aria-label="Title"]',
  ].join(","),
  StartDate: '[aria-label="開始日"],[aria-label="Start date"]',
  StartTime: '[aria-label="開始時間"],[aria-label="Start time"]',
  EndTime: '[aria-label="終了時間"],[aria-label="End time"]',
  EndDate: '[aria-label="終了日"],[aria-label="End date"]',
  AllDay: '[aria-label="終日"],[aria-label="All day"]',
  TimeZone: '[aria-label="タイムゾーン"],[aria-label="Time zone"]',
  Guests: '[aria-label="ゲスト"],[aria-label="Guests"]',
};

// --- Event move / expand ---

const SPAN_PRECISION = 15 * 60_000; // 15 minutes in ms

function po2dt([dday, dtime]) {
  return dday * 86_400_000 + dtime * SPAN_PRECISION;
}

async function eventMove([dx, dy]) {
  console.log('eventMove')
  if (dy && (await tryAddTime())) return;
  try {
    eventDrag([dx, dy]);
  } catch (err) {
    console.error(err)
    await inputDateTimeChange(po2dt([dx, dy]), 0);
  }
}

async function eventExpand([dx, dy]) {
  console.log('eventExpand')
  if (dy && (await tryAddTime())) return;
  try {
    eventDrag([dx, dy], { expand: true });
  } catch (err) {
    console.error(err)
    await inputDateTimeChange(0, po2dt([dx, dy]));
  }
}

// --- Drag simulation ---

let dragging = null;

function eventDrag([dx, dy], { expand = false } = {}) {
  $visible(sel.Summary)?.focus();

  if (!dragging) {
    const floatingBtns = [
      ...new Set(
        [...$$('div[role="button"][tabIndex="0"]'),
          // ...$$('div:has([role="button"][tabIndex="0"])')

        ]
          .filter((e) => getComputedStyle(e).zIndex === "5004")
          .reverse()

      ),
    ];

    if (floatingBtns.length > 1) throw new Error("Multiple floating");
    if (!floatingBtns[0]) throw new Error("no event selected");

    const target = expand
      ? floatingBtns[0].querySelector('*[data-dragsource-type="3"]')
      : floatingBtns[0];
    if (!target) throw new Error("no dragTarget exists");

    const pos = centerOf(target);
    dragging = { pos, target };
    posHint(pos);
    target.dispatchEvent(new MouseEvent("mousedown", mouseOpts(pos)));
    document.dispatchEvent(new MouseEvent("mousemove", mouseOpts(pos)));
  }

  const container = document.querySelector('[role="row"][data-dragsource-type="4"]');
  const gridcells = [...container.querySelectorAll('[role="gridcell"]')];
  const rect = container.getBoundingClientRect();
  const w = rect.width / gridcells.length;
  const h = rect.height / 24 / 4;

  dragging.pos = [dragging.pos[0] + dx * w, dragging.pos[1] + dy * h];
  posHint(dragging.pos);
  document.body.dispatchEvent(new MouseEvent("mousemove", mouseOpts(dragging.pos)));

  const onKeyUp = (e) => {
    if (!["AltLeft", "AltRight"].includes(e.code)) return;
    window.removeEventListener("keyup", onKeyUp);
    dragging = null;
    document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
  };
  window.addEventListener("keyup", onKeyUp);
}

// --- Date/time input manipulation ---

async function inputDateTimeChange(sdt = 0, edt = 0) {
  if (!$visible(sel.StartDate)) {
    const tz = $visible(sel.TimeZone) ?? DIE("tz not found");
    const editBtn =
      parents(tz)
        .find((e) => e.querySelector('[role="button"]'))
        ?.querySelector('[role="button"]') ?? DIE("No editable input");
    editBtn.click();
    await sleep(64);
  }

  const startDateInput = $visible(sel.StartDate);
  const startTimeInput = $visible(sel.StartTime);
  const endTimeInput = $visible(sel.EndTime);
  const endDateInput = $visible(sel.EndDate);
  if (!startDateInput) throw new Error("no startDateInput");

  const startDate = await parseDateInput(startDateInput, startTimeInput);
  const endDate = await parseDateInput(endDateInput ?? startDateInput, endTimeInput);
  const newStart = new Date(+startDate + sdt);
  const newEnd = new Date(+endDate + edt);
  const [sd0, st0] = splitISO(startDate);
  const [ed0, et0] = splitISO(endDate);
  const [sd1, st1] = splitISO(newStart);
  const [ed1, et1] = splitISO(newEnd);

  if (window.gkcs_verbose) {
    console.table({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      newStart: newStart.toISOString(),
      newEnd: newEnd.toISOString(),
    });
  }

  if (startDateInput && sd1 !== sd0) await setInputValue(startDateInput, sd1);
  if (endDateInput && ed1 !== ed0) await setInputValue(endDateInput, ed1);
  if (startTimeInput && st1 !== st0) await setInputValue(startTimeInput, st1);
  if (endTimeInput && et1 !== et0) await setInputValue(endTimeInput, et1);

  $visible(sel.Summary)?.focus();
}

async function parseDateInput(dateInput, timeInput) {
  const dataDate = dateInput.getAttribute("data-date");
  const icalEl = parents(dateInput).find((e) => e.getAttribute("data-ical"));
  if (!icalEl) throw new Error("dataIcalElement not found");
  const raw = dataDate || icalEl.getAttribute("data-ical");
  if (!raw) throw new Error("no datestring");
  const dateStr = raw.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  const timeStr = timeInput?.value || "00:00";
  return new Date(`${dateStr} ${timeStr} Z`);
}

function splitISO(date) {
  const m = date.toISOString().match(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
  if (!m) throw new Error("bad date");
  return [m[1], m[2]];
}

async function setInputValue(el, value) {
  if (!el) throw new Error("no element");
  el.value = value;
  el.dispatchEvent(new InputEvent("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
  el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, keyCode: 13 }));
  el.focus();
  await sleep(0);
  el.blur();
}

async function tryAddTime() {
  const btn = $$("button").find((e) => ["Add time", "時間を追加"].includes(e.textContent ?? ""));
  if (!btn) return false;
  btn.click();
  await sleep(64);
  return true;
}

// --- Copy pattern report (Alt+V) ---

async function copyPatternReport() {
  const items = $$("input,[role=button]")
    .map((el) => {
      const label = el.ariaLabel ?? "";
      if (!label) return null;
      const { selector, depth } = uniqueSelector(el);
      return { label, selector, depth };
    })
    .filter(Boolean);
  console.table(items);
  await navigator.clipboard.writeText(JSON.stringify(items, null, 2));
}

// --- Selector generation ---

function uniqueSelector(element) {
  for (let depth = 0; ; depth++) {
    const selector = buildSelector(element, depth);
    if ($$(selector).length <= 1) return { selector, depth };
  }
}

function buildSelector(element, depth = 0) {
  const tag = element.tagName.toLowerCase();
  const attrs = ["aria-label", "data-key", "role", "type"]
    .map((name) => {
      const val = element.getAttribute(name);
      if (val === null) return "";
      return val && !val.includes("\n") ? `[${name}="${val}"]` : val === "" ? `[${name}]` : "";
    })
    .join("");
  let base = `${tag}${attrs}`;
  if (depth <= 0) return base;

  const build = (e) => buildSelector(e, depth - 1);
  const next = element.nextElementSibling;
  if (next) base = `${base}:has(+${build(next).replace(/:has\(.*?\)/g, "")})`;
  const prev = element.previousElementSibling;
  if (prev) return `${build(prev)}+${base}`;
  const parent = element.parentElement;
  if (!parent) return base;
  const children = [...parent.children];
  const nth = children.indexOf(element) + 1;
  const nthLast = children.length - nth + 1;
  if (!nth) return base;
  return `${build(parent)}>${base}:nth-child(${nth}):nth-last-child(${nthLast})`;
}

// --- DOM helpers ---

function $$(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function $visible(sel, root = document) {
  return $$(sel, root).find((el) => el.getClientRects().length) ?? null;
}

function parents(el) {
  const result = [];
  for (let p = el?.parentElement; p; p = p.parentElement) result.push(p);
  return result;
}

function centerOf(el) {
  const { x, y, width, height } = el.getBoundingClientRect();
  return [x + width / 2, y + height / 2];
}

function mouseOpts([x, y]) {
  return {
    isTrusted: true,
    bubbles: true,
    button: 0,
    buttons: 1,
    cancelable: true,
    clientX: x,
    clientY: y,
    x,
    y,
  };
}

function posHint([x, y]) {
  const div = document.createElement("div");
  Object.assign(div.style, {
    background: "red",
    position: "absolute",
    left: x + "px",
    top: y + "px",
    width: "1px",
    height: "1px",
    zIndex: "10000",
  });
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 200);
}

function sleep(ms = 0) {
  return new Promise((r) => setTimeout(r, ms));
}
function DIE(msg) {
  throw new Error(msg);
}
