
const API_URL = "http://localhost:3001/employees";

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("employeeTableBody");
// employee array and make a new row in table

  function renderEmployees(list) {
    tbody.innerHTML = "";

    list.forEach(emp => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
      <td>
        <div class="d-flex align-items-center gap-3 ">
          <img src="${emp.profile}" width="40" height="40" class="rounded-circle">
          <span>${emp.name}</span>
        </div>
      </td>
      <td>${emp.gender}</td>
      <td>
  ${emp.department.map(dep => `
    <span style="
      background-color:#E9FEA5; 
      padding:2px 6px; 
      border-radius:10px; 
      font-size:0.85rem; 
      margin-right:4px;
      display:inline-block;
    ">
      ${dep}
    </span>
  `).join('')}
</td>

      <td>₹ ${emp.salary}</td>
      <td>${emp.startDate}</td>
      <td>
  <button class="btn p-0 border-0 bg-transparent delete-btn" data-id="${emp.id}">
    <i class="bi bi-trash"
       style="font-size:14px; color:#4f6d8a !important;"></i>
  </button>

  <button class="btn p-0 border-0 bg-transparent edit-btn ms-3" data-id="${emp.id}">
    <i class="bi bi-pencil"
       style="font-size:14px; color:#4f6d8a !important;"></i>
  </button>
</td>

    `;
      tbody.appendChild(tr);
    });
  }

  function loadEmployees() {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => renderEmployees(data.reverse()));
  }
  

  loadEmployees();

  tbody.addEventListener("click", e => {
    // Delete button 

    if (e.target.closest(".delete-btn")) {
      const id = e.target.closest(".delete-btn").dataset.id;
      if (confirm("Delete this employee?")) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
          .then(() => loadEmployees());
      }
    }

    // Edit
    if (e.target.closest(".edit-btn")) {
      const id = e.target.closest(".edit-btn").dataset.id;
      localStorage.setItem("editId", id);
      window.location.href = "index.html";
    }
  });

  // search btn
  const searchBtn = document.getElementById("opensearch");
const searchInput = document.getElementById("searchInput");
const searchIcon = document.getElementById("searchIcon");

searchBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  // to show search input area
  searchInput.classList.remove("d-none");

  //to  hide search icon
  searchIcon.classList.add("d-none");

  searchInput.focus();
});

// Click outside then icon appear again 

document.addEventListener("click", () => {
  searchInput.classList.add("d-none");
  searchIcon.classList.remove("d-none");
});

  
  // Search
  document.getElementById("searchInput").addEventListener("input", e => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const q = e.target.value.toLowerCase();
        const filtered = data.filter(emp =>
          emp.name.toLowerCase().includes(q) ||
          emp.gender.toLowerCase().includes(q) ||
          emp.department.join(", ").toLowerCase().includes(q)
        );
        renderEmployees(filtered);
      });
  });
});

