// configuration purpose

const API_URL = "http://localhost:3001/employees";

// fetch data input 
function getRadioValue(name) {
  return $(`input[name="${name}"]:checked`).val() || null;
}

function getCheckboxValues(name) {
  return $(`input[name="${name}"]:checked`)
    .map(function () {
      return this.value;
    })
    .get();
}

// validation added without filling data submit not completed

function validateForm() {
  let valid = true;

  const name = $("#name").val().trim();
  const profile = getRadioValue("profile");
  const gender = getRadioValue("gender");
  const department = getCheckboxValues("department");
  const salary = $("#salary").val();
  const day = $("#day").val();
  const month = $("#month").val();
  const year = $("#year").val();

  $("#n").toggle(!name);
  $("#pi").toggle(!profile);
  $("#g").toggle(!gender);
  $("#d").toggle(department.length === 0);
  $("#s").toggle(!salary);

  if (day === "Day" || month === "Month" || year === "Year") {
    $("#dateError").show();
    valid = false;
  } else {
    $("#dateError").hide();
  }

  if (!name || !profile || !gender || !department.length || !salary) {
    valid = false;
  }

  return valid;
}

// Edit the emplye details

const editId = localStorage.getItem("editId");

if (editId) {
  fetch(`${API_URL}/${editId}`)
    .then(res => res.json())
    .then(emp => {
      $("#name").val(emp.name);
      $(`input[name="profile"][value="${emp.profile}"]`).prop("checked", true);
      $(`input[name="gender"][value="${emp.gender}"]`).prop("checked", true);

      emp.department.forEach(dep => {
        $(`input[name="department"][value="${dep}"]`).prop("checked", true);
      });

      $("#salary").val(emp.salary);

      const [day, month, year] = emp.startDate.split(" ");
      $("#day").val(day);
      $("#month").val(month);
      $("#year").val(year);

      $("textarea").val(emp.notes || "");
    });
}

// Submit the form 
$("#empform").on("submit", async function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  const employee = {
    name: $("#name").val().trim(),
    profile: getRadioValue("profile"),
    gender: getRadioValue("gender"),
    department: getCheckboxValues("department"),
    salary: $("#salary").val(),
    startDate: `${$("#day").val()} ${$("#month").val()} ${$("#year").val()}`,
    notes: $("textarea").val()
  };

  const url = editId ? `${API_URL}/${editId}` : API_URL;
  const method = editId ? "PUT" : "POST";

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee)
  });

  localStorage.removeItem("editId");

  //redirectt to table page 
  window.location.href = "EmpTable.html";
});
