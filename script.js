// Marks the page as JS-enabled so the case-file tabs can appear.
// Without JavaScript every case file stays visible as a normal list.
document.documentElement.classList.add("js");

/* ---------- 1. Next-word demo ---------- */
// Illustrative probabilities, not output from a real model.
const guesses = [
  { word: "Argentina", p: 46 },
  { word: "Uruguay", p: 21 },
  { word: "Paraguay", p: 14 },
  { word: "South", p: 9 },
  { word: "Brazil", p: 6 },
];

const demoBtn = document.getElementById("demo-btn");
const bars = document.getElementById("demo-bars");
const blank = document.querySelector(".blank");

demoBtn.addEventListener("click", () => {
  bars.innerHTML = "";
  guesses.forEach(({ word, p }) => {
    const li = document.createElement("li");
    li.innerHTML =
      `<span>${word}</span>` +
      `<span class="track" aria-hidden="true"><span class="fill"></span></span>` +
      `<span class="pct">${p}%</span>`;
    bars.appendChild(li);
  });
  bars.hidden = false;
  blank.textContent = guesses[0].word;

  // Let the browser paint width 0 first, then grow the bars.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bars.querySelectorAll(".fill").forEach((fill, i) => {
        fill.style.width = guesses[i].p * 2 + "%"; // scaled so 50% fills the track
      });
    });
  });

  demoBtn.textContent = "Run it again";
});

/* ---------- 2. Accessible tabs for the case files ---------- */
// Follows the WAI-ARIA tabs pattern: arrow keys, Home and End move between tabs.
document.querySelectorAll("[data-tabs]").forEach((group) => {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));

  function select(index, focus = true) {
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute("aria-selected", on);
      tab.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    if (focus) tabs[index].focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));
    tab.addEventListener("keydown", (e) => {
      const last = tabs.length - 1;
      const moves = {
        ArrowRight: i === last ? 0 : i + 1,
        ArrowLeft: i === 0 ? last : i - 1,
        Home: 0,
        End: last,
      };
      if (e.key in moves) {
        e.preventDefault();
        select(moves[e.key]);
      }
    });
  });

  select(0, false);
});

/* ---------- 3. Highlight the current section in the menu ---------- */
const links = [...document.querySelectorAll(".site-header li a")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href")));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) =>
        a.setAttribute("aria-current", a.getAttribute("href") === "#" + entry.target.id)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => s && observer.observe(s));
