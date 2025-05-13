const BASE_URL = "https://signcalendarbackend.onrender.com/api/events";

// Google Calendar URL
function generateGoogleCalendarLink(event) {
  const title = encodeURIComponent(event.title);
  const desc = encodeURIComponent(event.description || '');
  const location = encodeURIComponent(event.location || '');
  const start = formatUTC(event.date, event.time);
  const end = start;
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${desc}&location=${location}&sf=true&output=xml`;
}

// Format UTC for Google Calendar
function formatUTC(date, time) {
  const dt = new Date(`${date}T${time}:00Z`);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  const h = String(dt.getUTCHours()).padStart(2, '0');
  const min = String(dt.getUTCMinutes()).padStart(2, '0');
  return `${y}${m}${d}T${h}${min}00Z`;
}

// Human-readable UTC date
function formatDisplayDate(dateStr, timeStr) {
  const dt = new Date(`${dateStr}T${timeStr}Z`);
  const date = dt.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const time = dt.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: "UTC"
  });
  return `Date: ${date} – Time: ${time} UTC`;
}

// Countdown
function getCountdown(dateStr, timeStr) {
  const eventTime = new Date(`${dateStr}T${timeStr}Z`);
  const now = new Date();
  const diff = eventTime - now;
  if (diff <= 0) return "";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `⏳ ${hours}h ${mins}m left`;
}

// Nav toggle
const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("navLinks");
if (toggle) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

// Loader
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("fade-out");
    setTimeout(() => loader.style.display = "none", 1000);
  }
});

// Convert time to UTC before submitting
function convertTimeToUTC(date, time) {
  const localDate = new Date(`${date}T${time}`);
  const utcHours = String(localDate.getUTCHours()).padStart(2, '0');
  const utcMinutes = String(localDate.getUTCMinutes()).padStart(2, '0');
  return `${utcHours}:${utcMinutes}`;
}

// Form submit (convert to UTC)
const form = document.getElementById("eventForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (data.host) {
      data.hostName = data.host;
      delete data.host;
    }

    if (data.date && data.time) {
      data.time = convertTimeToUTC(data.date, data.time);
    }

    const msg = document.getElementById("formMsg");

    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 409) {
        msg.textContent = "Event clash detected!";
        msg.style.color = "orange";
      } else if (res.ok) {
        msg.textContent = "Event submitted for review!";
        msg.style.color = "green";
        form.reset();
      } else {
        msg.textContent = "Error submitting event.";
        msg.style.color = "red";
      }
    } catch (err) {
      msg.textContent = "Server error.";
      msg.style.color = "red";
    }
  });
}

// Render events
const listContainer = document.getElementById("eventsList");
const filterTabs = document.getElementById("eventFilterTabs");
let currentTab = "all";

function renderEvents(events) {
  const now = new Date();
  const filtered = events
    .filter(e => {
      const time = new Date(`${e.date}T${e.time}Z`);
      return currentTab === "all" || (currentTab === "upcoming" && time > now) || (currentTab === "finished" && time <= now);
    })
    .map(event => {
      const eventTime = new Date(`${event.date}T${event.time}Z`);
      const isPast = eventTime < now;
      const formatted = formatDisplayDate(event.date, event.time);
      const countdown = !isPast ? getCountdown(event.date, event.time) : "";

      return `
        <div class="event-card ${isPast ? 'past' : 'upcoming'}">
          <h3>${event.title}</h3>
          <p>${event.description || "No description."}</p>
          <p>${formatted}</p>
          ${event.location ? `<p><strong>Location:</strong> <a href="${event.location}" target="_blank">${event.location}</a></p>` : ""}
          ${event.hostName ? `<p><strong>Host:</strong> ${event.hostName}</p>` : ""}
          ${countdown ? `<p class="countdown">${countdown}</p>` : ""}
          ${isPast ? `<p class="event-finished">✅ Event Finished</p>` : ""}
          <a href="${generateGoogleCalendarLink(event)}" class="btn calendar-btn" target="_blank">
            📅 Add to Google Calendar
          </a>
        </div>
      `;
    }).join('');

  listContainer.innerHTML = filtered || `<p>No events found for this tab.</p>`;
}

// Load + filter
if (listContainer) {
  let cachedEvents = [];
  fetch(BASE_URL)
    .then(res => res.json())
    .then(events => {
      cachedEvents = events;
      renderEvents(events);
    });

  if (filterTabs) {
    filterTabs.addEventListener("click", (e) => {
      if (e.target.dataset.tab) {
        currentTab = e.target.dataset.tab;
        document.querySelectorAll("#eventFilterTabs button").forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
        renderEvents(cachedEvents);
      }
    });
  }
}

// Theme toggle
const themeBtn = document.getElementById("themeToggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
}
