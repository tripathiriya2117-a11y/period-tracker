/* ===== STORAGE ===== */
let periods = JSON.parse(localStorage.getItem("periods")) || [];
let currentDate = new Date();

function saveData() {
  localStorage.setItem("periods", JSON.stringify(periods));
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

  for (let i = 0; i < firstDay; i++) {
    calendar.innerHTML += `<div></div>`;
  }

  for (let i = 1; i <= totalDays; i++) {
    let dateObj = new Date(year, month, i);
    let dateStr = formatDate(dateObj);

    let isLogged = periods.includes(dateStr);

    calendar.innerHTML += `
      <div class="day ${isLogged ? "logged" : ""}" 
           onclick="toggleDate('${dateStr}')">
        ${i}
      </div>
    `;
  }
}

function changeMonth(direction) {
  currentDate.setMonth(currentDate.getMonth() + direction);
  renderCalendar();
}

/* ===== DATE TOGGLE ===== */
function toggleDate(date) {
  if (periods.includes(date)) {
    periods = periods.filter(d => d !== date);
  } else {
    periods.push(date);
  }

  periods.sort();
  saveData();
  updateUI();
}

/* ===== FIND CYCLE STARTS ===== */
function getCycleStarts() {
  let starts = [];

  for (let i = 0; i < periods.length; i++) {
    let current = new Date(periods[i]);
    let prev = new Date(periods[i - 1]);

    if (i === 0 || (current - prev) > (1000 * 60 * 60 * 24)) {
      starts.push(periods[i]);
    }
  }

  return starts;
}

/* ===== CYCLE + PREDICTION ===== */
function updateCycle() {
  let cycleInfo = document.getElementById("cycleInfo");
  let nextPeriod = document.getElementById("nextPeriod");
  let lateStatus = document.getElementById("lateStatus");

  let starts = getCycleStarts();

  if (starts.length < 2) {
    cycleInfo.innerText = "Log at least 2 cycles";
    nextPeriod.innerText = "Next Period: --";
    if (lateStatus) lateStatus.innerText = "";
    return;
  }

  let total = 0;

  for (let i = 1; i < starts.length; i++) {
    let d1 = new Date(starts[i]);
    let d2 = new Date(starts[i - 1]);
    total += (d1 - d2);
  }

  let avgCycle = Math.round(
    total / (starts.length - 1) / (1000 * 60 * 60 * 24)
  );

  let last = new Date(starts[starts.length - 1]);
  let today = new Date();

  let daysSince = Math.floor(
    (today - last) / (1000 * 60 * 60 * 24)
  );

  cycleInfo.innerText = `Day ${daysSince} • Avg cycle ${avgCycle} days`;

  let next = new Date(last);
  next.setDate(next.getDate() + avgCycle);

  nextPeriod.innerText = "Next Period: " + next.toDateString();

  /* ===== LATE LOGIC ===== */
  if (lateStatus) {
    let todayNormalized = new Date();
    todayNormalized.setHours(0, 0, 0, 0);

    let nextNormalized = new Date(next);
    nextNormalized.setHours(0, 0, 0, 0);

    let diff = Math.floor(
      (todayNormalized - nextNormalized) / (1000 * 60 * 60 * 24)
    );

    if (diff > 0) {
      lateStatus.innerText = `Late by ${diff} days`;
      lateStatus.style.color = "red";
    } else if (diff === 0) {
      lateStatus.innerText = "Expected today";
      lateStatus.style.color = "#e88fa3";
    } else {
      lateStatus.innerText = "";
    }
  }
}

/* ===== MAIN ===== */
function updateUI() {
  renderCalendar();
  updateCycle();
}

/* ===== INIT ===== */
updateUI();

/* ===== CLEAR DATA ===== */
function clearData() {
  if (confirm("Are you sure you want to delete all data?")) {
    localStorage.removeItem("periods");
    periods = [];
    updateUI();
  }
}