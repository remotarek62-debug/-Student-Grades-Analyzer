const form = document.getElementById("studentForm");
const studentIdInput = document.getElementById("studentId");
const averageInput = document.getElementById("average");
const allStudentsBody = document.getElementById("allStudents");
const weakStudentsBody = document.getElementById("weakStudents");
const totalCount = document.getElementById("totalCount");
const weakCount = document.getElementById("weakCount");
const message = document.getElementById("message");
const clearAllButton = document.getElementById("clearAll");

const students = [];

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const id = studentIdInput.value.trim();
  const average = Number(averageInput.value);

  if (!/^\d+$/.test(id)) {
    showMessage("رقم الطالب يجب أن يحتوي على أرقام فقط.", "error");
    return;
  }

  if (averageInput.value.trim() === "" || !Number.isFinite(average) || average < 0 || average > 100) {
    showMessage("أدخلي متوسطًا صحيحًا من 0 إلى 100.", "error");
    return;
  }

  if (students.some(student => student.id === id)) {
    showMessage("رقم الطالب موجود بالفعل. أدخلي رقمًا مختلفًا.", "error");
    return;
  }

  students.push({ id, average });
  renderStudents();
  form.reset();
  studentIdInput.focus();
  showMessage("تمت إضافة الطالب بنجاح.", "success");
});

clearAllButton.addEventListener("click", function () {
  if (students.length === 0) {
    showMessage("القائمة فارغة بالفعل.", "error");
    return;
  }

  students.length = 0;
  renderStudents();
  showMessage("تم مسح جميع بيانات الطلاب.", "success");
});

function isWeakStudent(average) {
  return average >= 40 && average <= 49;
}

function getNewAverage(average) {
  return isWeakStudent(average) ? Math.min(average + 5, 50) : average;
}

function renderStudents() {
  allStudentsBody.innerHTML = "";
  weakStudentsBody.innerHTML = "";

  const weakStudents = students.filter(student => isWeakStudent(student.average));

  if (students.length === 0) {
    allStudentsBody.innerHTML = '<tr class="empty-row"><td colspan="4">لا توجد بيانات حتى الآن.</td></tr>';
  }

  if (weakStudents.length === 0) {
    weakStudentsBody.innerHTML = '<tr class="empty-row"><td colspan="3">لا يوجد طلاب متعثرون حاليًا.</td></tr>';
  }

  students.forEach(student => {
    const weak = isWeakStudent(student.average);
    const newAverage = getNewAverage(student.average);

    const row = document.createElement("tr");
    [student.id, formatAverage(student.average), formatAverage(newAverage)].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const statusCell = document.createElement("td");
    const status = document.createElement("span");
    status.className = weak ? "status weak" : "status normal";
    status.textContent = weak ? "متعثر" : "غير متعثر";
    statusCell.appendChild(status);
    row.appendChild(statusCell);
    allStudentsBody.appendChild(row);

    if (weak) {
      const weakRow = document.createElement("tr");
      [student.id, formatAverage(student.average), formatAverage(newAverage)].forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        weakRow.appendChild(cell);
      });
      weakStudentsBody.appendChild(weakRow);
    }
  });

  totalCount.textContent = students.length;
  weakCount.textContent = weakStudents.length;
}

function formatAverage(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
}
