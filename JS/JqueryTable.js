const API_URL = "http://localhost:3001/employees";

$(document).ready(function () {
  const tbody = $("#employeeTableBody");

  //Rendering Employees 
  function renderEmployees(data) {
    tbody.empty();

    data.forEach(emp => {
      const deptHTML = emp.department
        .map(dep => `
          <span style="
            background-color:#d4edda;
            padding:2px 6px;
            border-radius:10px;
            font-size:0.85rem;
            margin-right:4px;
            display:inline-block;">
            ${dep}
          </span>
        `)
        .join("");

      tbody.append(`
        <tr>
          <td>
            <div class="d-flex align-items-center gap-2">
              <img src="${emp.profile}" width="40" height="40" class="rounded-circle">
              <span>${emp.name}</span>
            </div>
          </td>

          <td>${emp.gender}</td>
          <td>${deptHTML}</td>
          <td>₹ ${emp.salary}</td> 
          <td>${emp.startDate}</td>

          <td>
          <button type="button"
          class="btn btn-sm btn-outline-primary edit-btn edit-icon-btn"
          data-id="${emp.id}">
          <i class="bi bi-pencil-square"></i>
        </button>
        
        <button type="button"
        class="btn btn-sm btn-outline-danger delete-btn delete-icon-btn"
        data-id="${emp.id}">
        <i class="bi bi-trash"></i>
      </button>
      
          </td>
        </tr>
      `);
    });
  }

  // for loading data 

  function loadEmployees() {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => renderEmployees(data))
      .catch(err => console.error("Load error:", err));
  }

  loadEmployees();

  // To delete a Employee detail

  tbody.on("click", ".delete-btn", function (e) {
    e.preventDefault();

    const id = $(this).data("id");
    const confirmDelete = confirm("Are you sure you want to delete this employee?");

    if (!confirmDelete) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => loadEmployees())
      .catch(err => console.error("Delete error:", err));
  });

  // To edit the details of a employees

  tbody.on("click", ".edit-btn", function () {
    const id = $(this).data("id");
    localStorage.setItem("editId", id);
    window.location.href = "EmpForm.html";
  });

// Search a user using name,department

  $("#searchInput").on("input", function () {
    const q = $(this).val().toLowerCase();
  
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(emp => {
          const nameMatch = emp.name.toLowerCase().includes(q);
          const genderMatch = emp.gender.toLowerCase().includes(q);
          const deptMatch = emp.department.join(" ").toLowerCase().includes(q);
  
          return nameMatch || genderMatch || deptMatch;
        });
  
        renderEmployees(filtered);
      });
  });
  
});
