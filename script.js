// Load existing tickets when the page starts
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

// Pagination variables
let currentPage = 1;
const rowsPerPage = 5; 

// Function to generate alphanumeric Ticket IDs
function generateTicketID() {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestampPart = Date.now().toString().slice(-4);
  return `${randomPart}${timestampPart}`;
}

const ticketForm = document.getElementById("ticketForm");
const ticketModal = document.getElementById("ticketModal");
const ticketTableBody = document.getElementById("ticketTableBody");
const addTicketBtn = document.getElementById("addTicketBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchBox = document.getElementById("searchBox");
let editId = null;

addTicketBtn.onclick = () => {
  editId = null;
  document.getElementById("modalTitle").innerText = "Add Ticket";
  ticketForm.reset();
  ticketModal.style.display = "flex";
};

cancelBtn.onclick = () => (ticketModal.style.display = "none");

ticketForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  const status = document.getElementById("status").value;

  if (!title) {
    alert("Title is required!");
    return;
  }

  if (editId === null) {
    // Add new ticket
    const ticket = {
      id: generateTicketID(),
      title,
      description,
      category,
      priority,
      status,
      date: new Date().toLocaleDateString(),
    };
    tickets.push(ticket);
    currentPage = 1;
  } else {
    // Update existing ticket
    tickets = tickets.map((t) =>
      t.id === editId ? { ...t, title, description, category, priority, status } : t
    );
  }

  localStorage.setItem("tickets", JSON.stringify(tickets));
  renderTickets();
  ticketModal.style.display = "none";
});

//  Render tickets with pagination
function renderTickets() {
  ticketTableBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedTickets = tickets.slice(start, end);

  paginatedTickets.forEach((t) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.id}</td>
      <td>${t.title}</td>
      <td><span class="status-badge ${getStatusClass(t.status)}">${t.status}</span></td>
      <td>${t.priority}</td>
      <td>${t.date}</td>
      <td>
        <button onclick="editTicket('${t.id}')">Edit</button>
        <button onclick="deleteTicket('${t.id}')">Delete</button>
      </td>
    `;
    ticketTableBody.appendChild(row);
  });

  updateDashboard();
  renderPagination();
}

// Render pagination buttons
function renderPagination() {
  const totalPages = Math.ceil(tickets.length / rowsPerPage);
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = "";

  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.innerText = "Previous";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderTickets();
    }
  };

  const nextBtn = document.createElement("button");
  nextBtn.innerText = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTickets();
    }
  };

  const pageInfo = document.createElement("span");
  pageInfo.innerText = ` Page ${currentPage} of ${totalPages} `;

  paginationDiv.appendChild(prevBtn);
  paginationDiv.appendChild(pageInfo);
  paginationDiv.appendChild(nextBtn);
}

//  Status color
function getStatusClass(status) {
  if (status === "Open") return "status-open";
  if (status === "In Progress") return "status-progress";
  if (status === "Closed") return "status-closed";
  return "";
}

//  Edit ticket
function editTicket(id) {
  const ticket = tickets.find((t) => t.id === id);
  editId = id;
  document.getElementById("modalTitle").innerText = "Edit Ticket";
  document.getElementById("title").value = ticket.title;
  document.getElementById("description").value = ticket.description;
  document.getElementById("category").value = ticket.category;
  document.getElementById("priority").value = ticket.priority;
  document.getElementById("status").value = ticket.status;
  ticketModal.style.display = "flex";
}

function deleteTicket(id) {
  if (confirm("Are you sure you want to delete this ticket?")) {
    tickets = tickets.filter((t) => t.id !== id);
    localStorage.setItem("tickets", JSON.stringify(tickets));

    const totalPages = Math.ceil(tickets.length / rowsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;

    renderTickets();
  }
}
searchBox.addEventListener("keyup", () => {
  const value = searchBox.value.toLowerCase();
  const filtered = tickets.filter(
    (t) =>
      t.title.toLowerCase().includes(value) ||
      t.status.toLowerCase().includes(value)
  );
  renderFiltered(filtered);
});


function renderFiltered(list) {
  ticketTableBody.innerHTML = "";
  list.forEach((t) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.id}</td>
      <td>${t.title}</td>
      <td><span class="status-badge ${getStatusClass(t.status)}">${t.status}</span></td>
      <td>${t.priority}</td>
      <td>${t.date}</td>
      <td>
        <button onclick="editTicket('${t.id}')">Edit</button>
        <button onclick="deleteTicket('${t.id}')">Delete</button>
      </td>
    `;
    ticketTableBody.appendChild(row);
  });
}

// Dashboard counts
function updateDashboard() {
  const open = tickets.filter((t) => t.status === "Open").length;
  const progress = tickets.filter((t) => t.status === "In Progress").length;
  const closed = tickets.filter((t) => t.status === "Closed").length;

  document.getElementById("openCount").innerText = `Open: ${open}`;
  document.getElementById("progressCount").innerText = `In Progress: ${progress}`;
  document.getElementById("closedCount").innerText = `Closed: ${closed}`;


const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  window.location.href = "Login.html";
}
document.getElementById("logoutBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("loggedInUser"); 
    window.location.href = "Login.html";
  }
});

//  Load tickets when page fully loaded
window.addEventListener("load", () => {
  tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  renderTickets();
});

