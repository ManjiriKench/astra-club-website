/**
 * A.S.T.R.A Secret Authentication & Stealth Login Trigger
 * Enables hidden login access via:
 * 1. Ctrl + Shift + A (Keyboard shortcut)
 * 2. Triple clicking the A.S.T.R.A logo
 * 3. Double clicking footer copyright text
 */

// Domain mapping dictionary
const DOMAIN_NAMES = {
  web: "Full Stack, UI/UX & DevOps",
  aiml: "AI, ML & Data Science",
  cybersec: "Cybersecurity",
  iot: "Robotics & IoT",
  research: "Innovation & Research",
  interdisc: "Interdisciplinary & Collaborative Labs",
  all: "Super Admin (All Domains)"
};

// Initial Demo Core Users (Used when in DEMO_MODE or as initial seed data)
const DEMO_USERS = {
  "admin@astra.club": {
    email: "admin@astra.club",
    name: "President / VP",
    role: "super_admin",
    assignedDomain: "all"
  },
  "weblead@astra.club": {
    email: "weblead@astra.club",
    name: "Web Dev Lead",
    role: "domain_lead",
    assignedDomain: "web"
  },
  "aimllead@astra.club": {
    email: "aimllead@astra.club",
    name: "AI/ML Lead",
    role: "domain_lead",
    assignedDomain: "aiml"
  },
  "cyberlead@astra.club": {
    email: "cyberlead@astra.club",
    name: "Cybersecurity Lead",
    role: "domain_lead",
    assignedDomain: "cybersec"
  },
  "iotlead@astra.club": {
    email: "iotlead@astra.club",
    name: "Robotics & IoT Lead",
    role: "domain_lead",
    assignedDomain: "iot"
  },
  "rndlead@astra.club": {
    email: "rndlead@astra.club",
    name: "RnD Lead",
    role: "domain_lead",
    assignedDomain: "research"
  }
};

// State
let currentUser = null;
let logoClickCount = 0;
let logoClickTimer = null;

// Initialize Secret Listeners
document.addEventListener("DOMContentLoaded", () => {
  setupStealthTriggers();
  injectLoginModal();
  checkCurrentSession();
});

// Setup Secret Triggers
function setupStealthTriggers() {
  // 1. Keyboard Shortcut: Ctrl + Shift + A
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      openLoginModal();
    }
  });

  // 2. Logo Triple Click
  document.querySelectorAll(".logo, span.title").forEach(logo => {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => {
      logoClickCount++;
      if (logoClickCount === 1) {
        logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 1200);
      } else if (logoClickCount >= 3) {
        clearTimeout(logoClickTimer);
        logoClickCount = 0;
        openLoginModal();
      }
    });
  });

  // 3. Footer Double Click
  const footer = document.querySelector("footer");
  if (footer) {
    footer.addEventListener("dblclick", () => {
      openLoginModal();
    });
  }
}

// Inject Hidden Login Modal HTML if not present
function injectLoginModal() {
  if (document.getElementById("astra-secret-modal")) return;

  const modalHtml = `
    <div id="astra-secret-modal" class="astra-modal-overlay" style="display:none;">
      <div class="astra-modal-content">
        <button class="astra-modal-close" onclick="closeLoginModal()">&times;</button>
        <div class="astra-modal-header">
          <img src="A2.png" alt="A.S.T.R.A" class="astra-modal-logo"/>
          <h3>A.S.T.R.A Core Portal</h3>
          <p>Role-Based Team Access</p>
        </div>
        <form id="astra-login-form" onsubmit="handleSecretLogin(event)">
          <div class="astra-form-group">
            <label for="astra-email">Core Member Email</label>
            <input type="email" id="astra-email" placeholder="e.g. weblead@astra.club" required />
          </div>
          <div class="astra-form-group">
            <label for="astra-password">Password</label>
            <input type="password" id="astra-password" placeholder="••••••••" required />
          </div>
          <div id="astra-login-error" class="astra-login-error" style="display:none;"></div>
          <button type="submit" id="astra-login-btn" class="astra-modal-btn">Access Dashboard</button>
        </form>
        <div class="astra-demo-hint">
          <small>💡 <strong>Demo Credentials:</strong><br>
          Super Admin: <code>admin@astra.club</code> / <code>admin123</code><br>
          Web Dev Lead: <code>weblead@astra.club</code> / <code>lead123</code><br>
          AI/ML Lead: <code>aimllead@astra.club</code> / <code>lead123</code></small>
        </div>
        <div style="margin-top:1rem; text-align:center;">
          <a href="index.html" style="color:#ff7060; font-size:0.82rem; text-decoration:none; opacity:0.8;" onmouseover="this.style.opacity='1';" onmouseout="this.style.opacity='0.8';">← Back to Main Website</a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  injectModalStyles();
}

// Inject Secret Modal CSS
function injectModalStyles() {
  if (document.getElementById("astra-modal-styles")) return;

  const styles = `
    .astra-modal-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
      z-index: 10000; display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.3s ease;
    }
    .astra-modal-content {
      background: linear-gradient(135deg, #180505 0%, #0a0a0a 100%);
      border: 2px solid #c40000; border-radius: 1.2rem;
      padding: 2.2rem; width: 90%; max-width: 420px;
      box-shadow: 0 0 35px rgba(255, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
      position: relative; color: white; font-family: 'Poppins', sans-serif;
    }
    .astra-modal-close {
      position: absolute; top: 15px; right: 18px; background: none; border: none;
      color: #ff7060; font-size: 1.8rem; cursor: pointer; transition: 0.2s;
    }
    .astra-modal-close:hover { color: white; transform: scale(1.1); }
    .astra-modal-header { text-align: center; margin-bottom: 1.5rem; }
    .astra-modal-logo { height: 60px; filter: drop-shadow(0 0 6px #c40000); margin-bottom: 0.5rem; }
    .astra-modal-header h3 { font-family: 'Poppins', sans-serif; font-weight: 700; color: #fff6db; font-size: 1.5rem; margin: 0; }
    .astra-modal-header p { color: #ff7060; font-size: 0.85rem; margin-top: 0.2rem; font-weight: 500; }
    .astra-form-group { margin-bottom: 1.2rem; text-align: left; }
    .astra-form-group label { display: block; font-size: 0.85rem; color: #ffd6aa; margin-bottom: 0.4rem; font-weight: 600; }
    .astra-form-group input {
      width: 100%; padding: 0.75rem 1rem; border-radius: 8px;
      background: #0d0d0d; border: 1px solid #441010; color: white; font-size: 0.95rem; outline: none; transition: 0.25s;
    }
    .astra-form-group input:focus { border-color: #ff1c1c; box-shadow: 0 0 10px rgba(255, 28, 28, 0.4); }
    .astra-modal-btn {
      width: 100%; padding: 0.8rem; border-radius: 40px; background: #c40000; color: white;
      font-weight: 700; font-size: 1rem; border: none; cursor: pointer; transition: 0.3s;
      box-shadow: 0 0 15px rgba(255, 0, 0, 0.4); margin-top: 0.5rem;
    }
    .astra-modal-btn:hover { background: #ff1c1c; color: #fff6db; box-shadow: 0 0 25px rgba(255, 60, 60, 0.7); transform: translateY(-2px); }
    .astra-login-error { color: #ff4a4a; background: rgba(255,0,0,0.15); border: 1px solid #ff4a4a; padding: 0.5rem; border-radius: 6px; font-size: 0.85rem; margin-bottom: 1rem; text-align: center; }
    .astra-demo-hint { margin-top: 1.2rem; padding-top: 0.8rem; border-top: 1px solid #331010; color: #aaa; font-size: 0.75rem; text-align: center; }
    .astra-demo-hint code { background: #220808; padding: 2px 5px; border-radius: 4px; color: #ffd6aa; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `;

  const styleTag = document.createElement("style");
  styleTag.id = "astra-modal-styles";
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);
}

// Modal open / close
function openLoginModal() {
  const modal = document.getElementById("astra-secret-modal");
  if (modal) {
    modal.style.display = "flex";
    document.getElementById("astra-email")?.focus();
  }
}
function closeLoginModal() {
  const modal = document.getElementById("astra-secret-modal");
  if (modal) modal.style.display = "none";
}

// Handle Secret Login Submission
async function handleSecretLogin(e) {
  e.preventDefault();
  const email = document.getElementById("astra-email").value.trim().toLowerCase();
  const password = document.getElementById("astra-password").value;
  const errorDiv = document.getElementById("astra-login-error");
  const loginBtn = document.getElementById("astra-login-btn");

  errorDiv.style.display = "none";
  loginBtn.innerText = "Authenticating...";

  try {
    if (typeof firebase !== 'undefined' && auth && !DEMO_MODE) {
      // Firebase Live Authentication
      const userCred = await auth.signInWithEmailAndPassword(email, password);
      const user = userCred.user;
      
      // Fetch user profile from Firestore
      const userDoc = await db.collection("users").doc(user.uid).get();
      let userData = { email: user.email, uid: user.uid };

      if (userDoc.exists) {
        userData = { ...userData, ...userDoc.data() };
      } else {
        // Fallback default role if Firestore doc not created yet
        const isSuperAdminEmail = email.includes("admin") || email.includes("president") || email.includes("vp") || email.includes("leaddev") || email.includes("yash");
        userData.role = isSuperAdminEmail ? "super_admin" : "domain_lead";
        userData.assignedDomain = isSuperAdminEmail ? "all" : extractDomainFromEmail(email);
      }

      sessionStorage.setItem("astra_user", JSON.stringify(userData));
      currentUser = userData;
    } else {
      // Demo / Offline Authentication Mode
      await new Promise(r => setTimeout(r, 600)); // Simulate API delay
      
      if (DEMO_USERS[email]) {
        currentUser = DEMO_USERS[email];
        sessionStorage.setItem("astra_user", JSON.stringify(currentUser));
      } else {
        // Generic fallback login for any core member email entered in demo mode
        const domain = extractDomainFromEmail(email);
        currentUser = {
          email: email,
          name: email.split("@")[0].toUpperCase(),
          role: email.includes("admin") || email.includes("president") || email.includes("vp") ? "super_admin" : "domain_lead",
          assignedDomain: domain
        };
        sessionStorage.setItem("astra_user", JSON.stringify(currentUser));
      }
    }

    loginBtn.innerText = "Success! Redirecting...";
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 500);

  } catch (err) {
    console.error("Login failed:", err);
    errorDiv.innerText = err.message || "Invalid credentials. Access denied.";
    errorDiv.style.display = "block";
    loginBtn.innerText = "Access Dashboard";
  }
}

// Helper to determine domain from email prefix in demo mode
function extractDomainFromEmail(email) {
  if (email.includes("web") || email.includes("fullstack")) return "web";
  if (email.includes("ai") || email.includes("ml") || email.includes("ds")) return "aiml";
  if (email.includes("cyber") || email.includes("sec")) return "cybersec";
  if (email.includes("iot") || email.includes("robot")) return "iot";
  if (email.includes("rnd") || email.includes("research")) return "research";
  return "web";
}

// Session check utility
function checkCurrentSession() {
  const saved = sessionStorage.getItem("astra_user");
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
    } catch(e) {}
  }
}

function getCurrentUser() {
  if (!currentUser) {
    checkCurrentSession();
  }
  return currentUser;
}

function logoutUser() {
  sessionStorage.removeItem("astra_user");
  if (typeof firebase !== 'undefined' && auth) {
    auth.signOut();
  }
  window.location.href = "index.html";
}
