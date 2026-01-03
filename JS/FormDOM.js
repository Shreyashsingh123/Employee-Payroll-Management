
const API_URL = "http://localhost:3001/employees";

// for checked radio value 
function getRadioValue(name) {
  const radios = document.getElementsByName(name);
  for (let r of radios) if (r.checked) return r.value;
  return null;
}

// for checkboxed value 
function getCheckboxValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map(cb => cb.value);
}

// Validation
function validateForm() {
  let valid = true;

  // Name validation
  const name = document.getElementById("name").value.trim();
    // niche red line generate karne ke liye h

    if (!name) {
      document.getElementById("n").style.display = "block";
      valid = false;
    } else document.getElementById("n").style.display = "none";

  const profile = getRadioValue("profile");
  document.getElementById("pi").style.display = profile ? "none" : "block";
  if (!profile) valid = false;

  const gender = getRadioValue("gender");
  document.getElementById("g").style.display = gender ? "none" : "block";
  if (!gender) valid = false;

  // Department validation
  const department = getCheckboxValues("department");
  document.getElementById("d").style.display = department.length ? "none" : "block";
  if (!department.length) valid = false;

  // Salary validation
  const salary = document.getElementById("salary").value;
  document.getElementById("s").style.display = salary ? "none" : "block";
  if (!salary) valid = false;

  // Date validation purpose
  const day = document.getElementById("day").value;
const month = document.getElementById("month").value;
const year = document.getElementById("year").value;

if(day === "Day" || month === "Month" || year === "Year") {
    document.getElementById("dateError").style.display = "block";
    valid = false;
} else {
    document.getElementById("dateError").style.display = "none";
}

  return valid;
}


// for edit feature
const editId = localStorage.getItem("editId");

async function prefillForm() {
  if(!editId) return;

  try {
    const res = await fetch(`${API_URL}/${editId}`);
    if(!res.ok) throw new Error("Failed to fetch employee data");
    const emp = await res.json();

    document.getElementById("name").value = emp.name || "";

    const profileInput = document.querySelector(`input[name="profile"][value="${emp.profile}"]`);
    if(profileInput) profileInput.checked = true;

    const genderInput = document.querySelector(`input[name="gender"][value="${emp.gender}"]`);
    if(genderInput) genderInput.checked = true;

    emp.department.forEach(dep => {
      const depInput = document.querySelector(`input[name="department"][value="${dep}"]`);
      if(depInput) depInput.checked = true;
    });

    document.getElementById("salary").value = emp.salary || "";

    if(emp.startDate) {
      const parts = emp.startDate.split(" ");
      if(parts.length === 3) {
        document.getElementById("day").value = parts[0];
        document.getElementById("month").value = parts[1];
        document.getElementById("year").value = parts[2];
      }
    }

    document.querySelector("textarea").value = emp.notes || "";

  } catch(err) {
    console.error(err);
  }
}

prefillForm();

// Handle Submit button

document.getElementById("empform").addEventListener("submit", async function(e){
  e.preventDefault();

  if(!validateForm()) return;

  const day = document.getElementById("day").value;
  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;

  // created a employee object to etch dtaa and send to api

  const employee = {
    name: document.getElementById("name").value.trim(),
    profile: getRadioValue("profile"),
    gender: getRadioValue("gender"),
    department: getCheckboxValues("department"),
    salary: document.getElementById("salary").value,
    startDate: `${day} ${month} ${year}`,
    notes: document.querySelector("textarea").value
  };

  try {
    const url = editId ? `${API_URL}/${editId}` : API_URL;
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(employee)
    });

    if(!res.ok) throw new Error("Employee not saved !");

    localStorage.removeItem("editId");

    // Direct redirect without alert
    window.location.href = "EmpTable.html";

  } catch(err) {
    console.error(err);
    alert("Something went wrong. !");
  }
});

