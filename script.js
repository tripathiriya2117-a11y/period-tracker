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
  if (mood === "happy") return "😊";
  if (mood === "neutral") return "😐";
  if (mood === "sad") return "😞";
  return "";
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

/* ===== CYCLE ===== */
function getCycleStarts() {
  let starts = [];

  for (let i = 0; i < periods.length; i++) {
    let current = new Date(periods[i]);
    let prev = new Date(periods[i - 1]);

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
    cycleInfo.innerText = "Log 2 cycles for average";
    nextPeriod.innerText = "Next Period: --";
    if (cycleDayEl) cycleDayEl.innerText = "--";
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

  if (cycleDayEl) cycleDayEl.innerText = day;
  cycleInfo.innerText = `Avg cycle ${avgCycle} days`;

  let next = new Date(last);
  next.setDate(next.getDate() + avgCycle);

  nextPeriod.innerText = "Next Period: " + next.toDateString();

  let diff = Math.floor((today - next) / 86400000);

  if (diff > 0) {
    lateStatus.innerText = `Late by ${diff} days`;
  } else if (diff === 0) {
    lateStatus.innerText = "Expected today";
  } else {
    lateStatus.innerText = "";
  }
}

/* ===== UI UPDATE ===== */
function updateUI() {
  renderCalendar();
  updateCycle();

  // show today's mood
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
    updateUI();
  }
}

/* ===== INIT ===== */
updateUI();