/**
 * A.S.T.R.A Admin Dashboard Controller
 * Enforces Role-Based Access Control (RBAC) and manages CRUD operations for Projects, Events, and Members.
 */

let activeTab = "projects";

document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
});

function initDashboard() {
  const user = getCurrentUser();
  const loginScreen = document.getElementById("admin-login-screen");
  const dashboardScreen = document.getElementById("admin-dashboard-screen");
  const header = document.getElementById("admin-header");

  if (!user) {
    if (loginScreen) loginScreen.style.display = "flex";
    if (dashboardScreen) dashboardScreen.style.display = "none";
    if (header) header.style.display = "none";
    return;
  }

  // User is logged in -> Show Dashboard
  if (loginScreen) loginScreen.style.display = "none";
  if (dashboardScreen) dashboardScreen.style.display = "block";
  if (header) header.style.display = "flex";

  // Render User Info & Role Badge
  document.getElementById("display-user-name").innerText = user.name || user.email;
  const isSuperAdmin = user.role === "super_admin" || user.assignedDomain === "all";

  document.getElementById("display-user-role").innerText = isSuperAdmin ? "Super Admin" : "Domain Lead";
  document.getElementById("domain-scope-tag").innerText = isSuperAdmin ? "GLOBAL ACCESS" : (user.assignedDomain || "DOMAIN").toUpperCase();

  const scopeDesc = isSuperAdmin 
    ? "Full admin privileges over all club domains, events, member directory, and core team access."
    : `Restricted write access to <strong>${DOMAIN_NAMES[user.assignedDomain] || user.assignedDomain}</strong> domain projects only.`;
  document.getElementById("scope-description").innerHTML = scopeDesc;

  // Lock domain dropdown for Domain Leads
  const domainSelect = document.getElementById("project-domain");
  if (domainSelect) {
    if (!isSuperAdmin && user.assignedDomain) {
      domainSelect.value = user.assignedDomain;
      Array.from(domainSelect.options).forEach(opt => {
        if (opt.value !== user.assignedDomain) opt.disabled = true;
      });
    } else {
      Array.from(domainSelect.options).forEach(opt => opt.disabled = false);
    }
  }

  // Show User Role Management Tab only for Super Admins
  const userTabBtn = document.getElementById("tab-btn-users");
  if (userTabBtn) {
    userTabBtn.style.display = isSuperAdmin ? "inline-block" : "none";
  }

  // Load Initial Tab Data
  loadProjectsTable();
  loadEventsTable();
  loadMembersTable();
}

// Tab Switching Handler
function switchTab(tabName, btnElement) {
  activeTab = tabName;
  document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
  if (btnElement) btnElement.classList.add("active");

  document.getElementById("tab-content-projects").style.display = tabName === "projects" ? "block" : "none";
  document.getElementById("tab-content-events").style.display = tabName === "events" ? "block" : "none";
  document.getElementById("tab-content-members").style.display = tabName === "members" ? "block" : "none";
  document.getElementById("tab-content-users").style.display = tabName === "users" ? "block" : "none";

  if (tabName === "projects") loadProjectsTable();
  if (tabName === "events") loadEventsTable();
  if (tabName === "members") loadMembersTable();
}

// ----------------------------------------------------
// PROJECTS MANAGEMENT
// ----------------------------------------------------
async function loadProjectsTable() {
  const tbody = document.getElementById("projects-table-body");
  if (!tbody) return;

  const user = getCurrentUser();
  const isSuperAdmin = user?.role === "super_admin" || user?.assignedDomain === "all";
  const filterDomain = isSuperAdmin ? null : user.assignedDomain;

  const projects = await getProjects(filterDomain);

  if (projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#aaa; padding:2rem;">No projects found for this domain scope. Click <strong>+ Add New Project</strong> to upload one.</td></tr>`;
    return;
  }

  let html = "";
  projects.forEach(p => {
    const domainTag = DOMAIN_NAMES[p.domain] || p.domain;
    html += `
      <tr>
        <td><img src="${p.imageUrl || 'different-between-ux-and-ui.jpg'}" class="item-thumb" alt="thumb"/></td>
        <td><strong>${p.title}</strong><br><small style="color:#aaa;">${p.description ? p.description.substring(0, 45) + '...' : ''}</small></td>
        <td><span style="background:rgba(139,0,0,0.4); border:1px solid #FF4500; color:#ff7060; padding:2px 8px; border-radius:12px; font-size:0.78rem;">${domainTag}</span></td>
        <td><small style="color:#cccccc;">${p.duration || 'N/A'}</small></td>
        <td>${p.authorName || 'N/A'}</td>
        <td>
          <button class="btn-action-edit" onclick="editProject('${p.id}')">Edit</button>
          <button class="btn-action-delete" onclick="deleteProjectItem('${p.id}')">Delete</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function openProjectModal(projectData = null) {
  const modal = document.getElementById("project-modal");
  const form = document.getElementById("project-form");
  form.reset();

  const user = getCurrentUser();
  const isSuperAdmin = user?.role === "super_admin" || user?.assignedDomain === "all";

  if (projectData) {
    document.getElementById("project-modal-title").innerText = "Edit Project";
    document.getElementById("project-id").value = projectData.id;
    document.getElementById("project-title").value = projectData.title || "";
    document.getElementById("project-domain").value = projectData.domain || "web";
    document.getElementById("project-desc").value = projectData.description || "";
    document.getElementById("project-duration").value = projectData.duration || "";
    document.getElementById("project-image-url").value = projectData.imageUrl || "";
    document.getElementById("project-github").value = projectData.githubUrl || "";
    document.getElementById("project-demo").value = projectData.demoUrl || "";
    document.getElementById("project-author").value = projectData.authorName || "";
  } else {
    document.getElementById("project-modal-title").innerText = "Add New Project";
    document.getElementById("project-id").value = "";
    if (!isSuperAdmin && user?.assignedDomain) {
      document.getElementById("project-domain").value = user.assignedDomain;
    }
  }

  modal.style.display = "flex";
}

async function saveProject(e) {
  e.preventDefault();
  const id = document.getElementById("project-id").value;
  const title = document.getElementById("project-title").value.trim();
  const domain = document.getElementById("project-domain").value;
  const description = document.getElementById("project-desc").value.trim();
  const duration = document.getElementById("project-duration").value.trim();
  const imageUrl = document.getElementById("project-image-url").value.trim();
  const githubUrl = document.getElementById("project-github").value.trim();
  const demoUrl = document.getElementById("project-demo").value.trim();
  const authorName = document.getElementById("project-author").value.trim();

  const newProject = {
    title, domain, description, duration, imageUrl, githubUrl, demoUrl, authorName,
    createdAt: new Date().toISOString()
  };

  if (typeof firebase !== 'undefined' && db && !DEMO_MODE) {
    try {
      if (id) {
        await db.collection("projects").doc(id).update(newProject);
      } else {
        await db.collection("projects").add(newProject);
      }
    } catch(err) { console.warn("Firestore error:", err); }
  }

  let projects = JSON.parse(localStorage.getItem("astra_projects") || "[]");
  if (id) {
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) projects[idx] = { id, ...newProject };
  } else {
    projects.unshift({ id: "proj-" + Date.now(), ...newProject });
  }
  localStorage.setItem("astra_projects", JSON.stringify(projects));

  closeModals();
  loadProjectsTable();
}

async function editProject(id) {
  const projects = await getProjects();
  const p = projects.find(item => item.id === id);
  if (p) openProjectModal(p);
}

async function deleteProjectItem(id) {
  if (!confirm("Are you sure you want to delete this project?")) return;

  if (typeof firebase !== 'undefined' && db && !DEMO_MODE) {
    try {
      await db.collection("projects").doc(id).delete();
    } catch(err) { console.warn("Firestore delete error:", err); }
  }

  let projects = JSON.parse(localStorage.getItem("astra_projects") || "[]");
  projects = projects.filter(p => p.id !== id);
  localStorage.setItem("astra_projects", JSON.stringify(projects));

  loadProjectsTable();
}

// ----------------------------------------------------
// EVENTS MANAGEMENT
// ----------------------------------------------------
async function loadEventsTable() {
  const tbody = document.getElementById("events-table-body");
  if (!tbody) return;

  const events = await getEvents();
  if (events.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#aaa; padding:2rem;">No events found. Click <strong>+ Add New Event</strong> above.</td></tr>`;
    return;
  }

  let html = "";
  events.forEach(e => {
    html += `
      <tr>
        <td><img src="${e.imageUrl || 'a.jpg'}" class="item-thumb" alt="thumb"/></td>
        <td><strong>${e.title}</strong></td>
        <td>${e.date} | ${e.venue}</td>
        <td><span style="background:rgba(20,50,20,0.7); border:1px solid #4caf50; color:#a5d6a7; padding:2px 8px; border-radius:12px; font-size:0.78rem;">${e.status || 'Upcoming'}</span></td>
        <td>
          <button class="btn-action-edit" onclick="editEvent('${e.id}')">Edit</button>
          <button class="btn-action-delete" onclick="deleteEventItem('${e.id}')">Delete</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function openEventModal(eventData = null) {
  const modal = document.getElementById("event-modal");
  const form = document.getElementById("event-form");
  form.reset();

  if (eventData) {
    document.getElementById("event-modal-title").innerText = "Edit Event";
    document.getElementById("event-id").value = eventData.id;
    document.getElementById("event-title").value = eventData.title || "";
    document.getElementById("event-date").value = eventData.date || "";
    document.getElementById("event-venue").value = eventData.venue || "";
    document.getElementById("event-image-url").value = eventData.imageUrl || "";
    document.getElementById("event-reg-url").value = eventData.registrationUrl || "";
  } else {
    document.getElementById("event-modal-title").innerText = "Add Club Event";
    document.getElementById("event-id").value = "";
  }

  modal.style.display = "flex";
}

async function saveEvent(e) {
  e.preventDefault();
  const id = document.getElementById("event-id").value;
  const title = document.getElementById("event-title").value.trim();
  const date = document.getElementById("event-date").value.trim();
  const venue = document.getElementById("event-venue").value.trim();
  const imageUrl = document.getElementById("event-image-url").value.trim();
  const registrationUrl = document.getElementById("event-reg-url").value.trim();

  const newEvt = { title, date, venue, imageUrl, registrationUrl, status: "upcoming" };

  if (typeof firebase !== 'undefined' && db && !DEMO_MODE) {
    try {
      if (id) {
        await db.collection("events").doc(id).update(newEvt);
      } else {
        await db.collection("events").add(newEvt);
      }
    } catch(err) { console.warn("Firestore error:", err); }
  }

  let events = JSON.parse(localStorage.getItem("astra_events") || "[]");
  if (id) {
    const idx = events.findIndex(evt => evt.id === id);
    if (idx !== -1) events[idx] = { id, ...newEvt };
  } else {
    events.unshift({ id: "evt-" + Date.now(), ...newEvt });
  }
  localStorage.setItem("astra_events", JSON.stringify(events));

  closeModals();
  loadEventsTable();
}

async function editEvent(id) {
  const events = await getEvents();
  const evt = events.find(item => item.id === id);
  if (evt) openEventModal(evt);
}

async function deleteEventItem(id) {
  if (!confirm("Are you sure you want to delete this event?")) return;

  if (typeof firebase !== 'undefined' && db && !DEMO_MODE) {
    try { await db.collection("events").doc(id).delete(); } catch(err) {}
  }

  let events = JSON.parse(localStorage.getItem("astra_events") || "[]");
  events = events.filter(evt => evt.id !== id);
  localStorage.setItem("astra_events", JSON.stringify(events));

  loadEventsTable();
}

// ----------------------------------------------------
// MEMBERS MANAGEMENT
// ----------------------------------------------------
async function loadMembersTable() {
  const tbody = document.getElementById("members-table-body");
  if (!tbody) return;

  const members = await getMembers();
  if (members.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#aaa; padding:2rem;">No members found. Click <strong>+ Add Club Member</strong> above to create one.</td></tr>`;
    return;
  }

  const categoryLabels = {
    "1": "Faculty Coordinator",
    "2": "Core Executive Leadership",
    "3": "Technical Domain Lead",
    "4": "Technical Member"
  };

  let html = "";
  members.forEach(m => {
    html += `
      <tr>
        <td><img src="${m.imageUrl || 'a.jpg'}" class="item-thumb" alt="thumb"/></td>
        <td><strong>${m.name}</strong></td>
        <td>${m.role}</td>
        <td><span style="background:rgba(20,20,40,0.6); border:1px solid #6464c8; color:#aab; padding:2px 8px; border-radius:12px; font-size:0.78rem;">${categoryLabels[m.category] || 'Member'}</span></td>
        <td>
          <button class="btn-action-edit" onclick="editMember('${m.id}')">Edit</button>
          <button class="btn-action-delete" onclick="deleteMemberItem('${m.id}')">Delete</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function openMemberModal(memberData = null) {
  const modal = document.getElementById("member-modal");
  const form = document.getElementById("member-form");
  form.reset();

  if (memberData) {
    document.getElementById("member-modal-title").innerText = "Edit Member";
    document.getElementById("member-id").value = memberData.id;
    document.getElementById("member-name").value = memberData.name || "";
    document.getElementById("member-role").value = memberData.role || "";
    document.getElementById("member-category").value = memberData.category || "4";
    document.getElementById("member-domain").value = memberData.domain || "web";
    document.getElementById("member-image-url").value = memberData.imageUrl || "";
    document.getElementById("member-linkedin").value = memberData.linkedinUrl || "";
    document.getElementById("member-github").value = memberData.githubUrl || "";
  } else {
    document.getElementById("member-modal-title").innerText = "Add Club Member";
    document.getElementById("member-id").value = "";
  }

  modal.style.display = "flex";
}

async function saveMember(e) {
  e.preventDefault();
  const id = document.getElementById("member-id").value;
  const name = document.getElementById("member-name").value.trim();
  const role = document.getElementById("member-role").value.trim();
  const category = document.getElementById("member-category").value;
  const domain = document.getElementById("member-domain").value;
  const imageUrl = document.getElementById("member-image-url").value.trim();
  const linkedinUrl = document.getElementById("member-linkedin").value.trim();
  const githubUrl = document.getElementById("member-github").value.trim();

  const newMember = { name, role, category, domain, imageUrl, linkedinUrl, githubUrl };

  if (typeof firebase !== 'undefined' && db && !DEMO_MODE) {
    try {
      if (id) {
        await db.collection("members").doc(id).update(newMember);
      } else {
        await db.collection("members").add(newMember);
      }
    } catch(err) { console.warn("Firestore error:", err); }
  }

  let members = JSON.parse(localStorage.getItem("astra_members") || "[]");
  if (id) {
    const idx = members.findIndex(m => m.id === id);
    if (idx !== -1) members[idx] = { id, ...newMember };
  } else {
    members.unshift({ id: "mem-" + Date.now(), ...newMember });
  }
  localStorage.setItem("astra_members", JSON.stringify(members));

  closeModals();
  loadMembersTable();
}

async function editMember(id) {
  const members = await getMembers();
  const m = members.find(item => item.id === id);
  if (m) openMemberModal(m);
}

async function deleteMemberItem(id) {
  if (!confirm("Are you sure you want to delete this member?")) return;

  if (typeof firebase !== 'undefined' && db && !DEMO_MODE) {
    try { await db.collection("members").doc(id).delete(); } catch(err) {}
  }

  let members = JSON.parse(localStorage.getItem("astra_members") || "[]");
  members = members.filter(m => m.id !== id);
  localStorage.setItem("astra_members", JSON.stringify(members));

  loadMembersTable();
}

// Image File Upload Helper
function handleFileUpload(event, targetInputId) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById(targetInputId).value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function closeModals() {
  document.querySelectorAll(".form-modal-overlay").forEach(m => m.style.display = "none");
}
