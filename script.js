/* ===== STORAGE ===== */
let periods = JSON.parse(localStorage.getItem("periods")) || [];
let moods = JSON.parse(localStorage.getItem("moods")) || {};
let selectedDate = null;
let currentDate = new Date();

function saveData() {
  localStorage.setItem("periods", JSON.stringify(periods));
}

function saveMoods() {
  localStorage.setItem("moods", JSON.stringify(moods));
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

/* ===== CALENDAR ===== */
function renderCalendar() {
  let calendar = document.getElementById("calendar");
  let monthYear = document.getElementById("monthYear");

  if (!calendar || !monthYear) return;

  calendar.innerHTML = "";

  let year = currentDate.getFullYear();
  let month = currentDate.getMonth();

  let firstDay = new Date(year, month, 1).getDay();
  let totalDays = new Date(year, month + 1, 0).getDate();

  monthYear.innerText = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  // empty spaces
  for (let i = 0; i < firstDay; i++) {
    calendar.innerHTML += `<div></div>`;
  }

  // days
  for (let i = 1; i <= totalDays; i++) {
    let dateObj = new Date(year, month, i);
    let dateStr = formatDate(dateObj);

    let isLogged = periods.includes(dateStr);
    let mood = moods[dateStr];

    let today = formatDate(new Date());
    let isToday = dateStr === today;

    calendar.innerHTML += `
      <div class="day ${isLogged ? "logged" : ""} ${isToday ? "today" : ""}" 
           onclick="toggleDate('${dateStr}')">
        ${i}
        ${mood ? `<div class="mood">${getEmoji(mood)}</div>` : ""}
      </div>
    `;
  }
}

/* ===== EMOJI ===== */
function getEmoji(mood) {
  const emojiMap = {
    happy: "😊",
    neutral: "😐",
    sad: "😞"
  };
  return emojiMap[mood] || "";
}

/* ===== MONTH NAV ===== */
function changeMonth(direction) {
  currentDate.setMonth(currentDate.getMonth() + direction);
  renderCalendar();
}

/* ===== DATE CLICK ===== */
function toggleDate(date) {
  selectedDate = date;

  if (periods.includes(date)) {
    periods = periods.filter(d => d !== date);
  } else {
    periods.push(date);
  }

  periods.sort();
  saveData();

  // show mood popup
  let moodBox = document.getElementById("moodBox");
  if (moodBox) {
    moodBox.classList.remove("hidden");
  }

  updateUI();
}

/* ===== SET MOOD (popup) ===== */
function setMood(mood) {
  if (selectedDate) {
    moods[selectedDate] = mood;
    saveMoods();
  }

  let moodBox = document.getElementById("moodBox");
  if (moodBox) {
    moodBox.classList.add("hidden");
  }

  updateUI();
}

/* ===== SET TODAY MOOD (home section) ===== */
function setTodayMood(mood) {
  let today = formatDate(new Date());
  moods[today] = mood;
  saveMoods();
  updateUI();
}

/* ===== CYCLE CALCULATIONS ===== */
function getCycleStarts() {
  let starts = [];

  for (let i = 0; i < periods.length; i++) {
    let current = new Date(periods[i]);
    let prev = i > 0 ? new Date(periods[i - 1]) : null;

    if (i === 0 || (current - prev) > 86400000) {
      starts.push(periods[i]);
    }
  }

  return starts;
}

function updateCycle() {
  let cycleInfo = document.getElementById("cycleInfo");
  let nextPeriod = document.getElementById("nextPeriod");
  let lateStatus = document.getElementById("lateStatus");
  let cycleDayEl = document.getElementById("cycleDay");

  let starts = getCycleStarts();

  if (starts.length < 2) {
    if (cycleInfo) cycleInfo.innerText = "Log 2 cycles for average";
    if (nextPeriod) nextPeriod.innerText = "Next Period: --";
    if (cycleDayEl) cycleDayEl.innerText = "--";
    if (lateStatus) lateStatus.innerText = "";
    return;
  }

  let total = 0;
  for (let i = 1; i < starts.length; i++) {
    total += (new Date(starts[i]) - new Date(starts[i - 1]));
  }

  let avgCycle = Math.round(total / (starts.length - 1) / 86400000);

  let last = new Date(starts[starts.length - 1]);
  let today = new Date();

  let day = Math.floor((today - last) / 86400000);

  if (cycleInfo) cycleInfo.innerText = `Avg cycle ${avgCycle} days`;
  if (cycleDayEl) cycleDayEl.innerText = day;

  let next = new Date(last);
  next.setDate(next.getDate() + avgCycle);

  if (nextPeriod) nextPeriod.innerText = "Next Period: " + next.toDateString();

  let diff = Math.floor((today - next) / 86400000);

  if (lateStatus) {
    if (diff > 0) {
      lateStatus.innerText = `Late by ${diff} days`;
    } else if (diff === 0) {
      lateStatus.innerText = "Expected today";
    } else {
      lateStatus.innerText = "";
    }
  }
}

/* ===== UI UPDATE ===== */
function updateUI() {
  renderCalendar();
  updateCycle();

  // ===== INSIGHTS (ADD THIS) =====
  let insightEl = document.getElementById("cycleInsights");
  if (insightEl) {
    insightEl.innerText = generateInsights();
  }

  // ===== TODAY MOOD =====
  let today = formatDate(new Date());
  let mood = moods[today];
  let todayMoodEl = document.getElementById("todayMood");

  if (todayMoodEl) {
    todayMoodEl.innerText = mood ? getEmoji(mood) : "--";
  }
}

/* ===== CLEAR ===== */
function clearData() {
  if (confirm("Delete all data?")) {
    localStorage.clear();
    periods = [];
    moods = {};
    selectedDate = null;
    updateUI();
  }
}

function generateInsights() {
  let starts = getCycleStarts();

  if (starts.length === 0) {
    return "No data logged yet.";
  }

  if (starts.length === 1) {
    return "Log one more cycle to unlock insights.";
  }

  // Calculate cycles
  let cycles = [];
  for (let i = 1; i < starts.length; i++) {
    let diff = (new Date(starts[i]) - new Date(starts[i - 1])) / 86400000;
    cycles.push(diff);
  }

  let avgCycle = Math.round(
    cycles.reduce((a, b) => a + b, 0) / cycles.length
  );

  // Cycle consistency
  let variation = Math.max(...cycles) - Math.min(...cycles);
  let consistency = variation <= 3 ? "regular" : "irregular";

  // Mood analysis
  let moodCount = { happy: 0, neutral: 0, sad: 0 };
  for (let date in moods) {
    let m = moods[date];
    if (moodCount[m] !== undefined) {
      moodCount[m]++;
    }
  }

  let dominantMood = Object.keys(moodCount).reduce((a, b) =>
    moodCount[a] > moodCount[b] ? a : b
  );

  let moodText = {
    happy: "generally positive",
    neutral: "mostly neutral",
    sad: "often low"
  };

  return `Cycle is ${consistency} (avg ${avgCycle} days). Mood is ${moodText[dominantMood]}.`;
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', function() {
  updateUI();
});