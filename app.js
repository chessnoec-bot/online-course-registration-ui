// app.js

// ---------- Student Registration logic ----------
const sessions = [
  { id: "CHEM101-01", course: "CHEM 101", time: "MW 10:00", modality: "In-person", max: 2, enrolled: 1 },
  { id: "INFO465-01", course: "INFO 465", time: "TTh 1:00", modality: "Online", max: 3, enrolled: 3 },
  { id: "MATH211-02", course: "MATH 211", time: "MW 2:00", modality: "In-person", max: 5, enrolled: 2 }
];

let studentEnrolled = ["CHEM101-01"]; // starts enrolled in 1 class

function $(id) { return document.getElementById(id); }

function renderStudentTables() {
  const enrolledBody = $("enrolledBody");
  const availableBody = $("availableBody");
  if (!enrolledBody || !availableBody) return; // not on this page

  enrolledBody.innerHTML = "";
  availableBody.innerHTML = "";

  // Enrolled table
  for (const sessionId of studentEnrolled) {
    const s = sessions.find(x => x.id === sessionId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.course}</td>
      <td>${s.time}</td>
      <td>${s.modality}</td>
    `;
    enrolledBody.appendChild(tr);
  }

  // Available table
  for (const s of sessions) {
    const isDup = studentEnrolled.includes(s.id);
    const isFull = s.enrolled >= s.max;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.course}</td>
      <td>${s.time}</td>
      <td>${s.modality}</td>
      <td>${s.enrolled}/${s.max}</td>
      <td>
        <button data-session="${s.id}" ${isDup || isFull ? "disabled" : ""}>
          Register
        </button>
      </td>
    `;
    availableBody.appendChild(tr);
  }

  // Hook buttons
  availableBody.querySelectorAll("button[data-session]").forEach(btn => {
    btn.addEventListener("click", () => registerSession(btn.dataset.session));
  });
}

function showMessage(type, text) {
  const box = $("messageBox");
  if (!box) return;
  box.className = type === "error" ? "error" : "notice";
  box.textContent = text;
}

function registerSession(sessionId) {
  const s = sessions.find(x => x.id === sessionId);

  // Validation 1: duplicate
  if (studentEnrolled.includes(sessionId)) {
    showMessage("error", "Already enrolled in this session.");
    return;
  }

  // Validation 2: full
  if (s.enrolled >= s.max) {
    showMessage("error", "Class is full. You cannot register.");
    return;
  }

  // If valid, register
  studentEnrolled.push(sessionId);
  s.enrolled += 1;

  showMessage("ok", "Success! You are registered.");
  renderStudentTables();
}

// ---------- Course Search (simple) ----------
function courseSearch() {
  const dept = $("dept")?.value || "";
  const instructor = ($("instructor")?.value || "").toLowerCase();
  const number = ($("courseNumber")?.value || "").toLowerCase();

  const rows = document.querySelectorAll("#courseResults tbody tr");
  if (!rows.length) return;

  rows.forEach(r => {
    const text = r.textContent.toLowerCase();
    const match =
      (dept === "" || text.includes(dept.toLowerCase())) &&
      (instructor === "" || text.includes(instructor)) &&
      (number === "" || text.includes(number));

    r.style.display = match ? "" : "none";
  });
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  renderStudentTables();
  const searchBtn = $("searchBtn");
  if (searchBtn) searchBtn.addEventListener("click", courseSearch);
});
