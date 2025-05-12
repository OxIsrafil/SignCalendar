const BASE_URL = "https://signcalendarbackend.onrender.com/api/events";

function generateGoogleCalendarLink(event) {
  const title = encodeURIComponent(event.title);
  const desc = encodeURIComponent(event.description || '');
  const location = encodeURIComponent(event.location || '');
  const start = formatUTC(event.date, event.time);
  const end = start;

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${desc}&location=${location}&sf=true&output=xml`;
}

function formatUTC(date, time) {
  const dt = new Date(`${date}T${time}:00Z`);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  const h = String(dt.getUTCHours()).padStart(2, '0');
  const min = String(dt.getUTCMinutes()).padStart(2, '0');
  return `${y}${m}${d}T${h}${min}00Z`;
}

// Mobile nav toggle
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

// Submit form
const form = document.getElementById("eventForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
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

// Display events
const listContainer = document.getElementById("eventsList");
if (listContainer) {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(events => {
      listContainer.innerHTML = events.map(event => {
        const eventTime = new Date(`${event.date}T${event.time}`);
        const isPast = eventTime < new Date();

        return `
          <div class="event-card ${isPast ? 'past' : 'upcoming'}">
            <h3>${event.title}</h3>
            <p>${event.description || "No description."}</p>
            <p><strong>Date:</strong> ${event.date} <strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> 
              ${event.location ? `<a href="${event.location}" target="_blank">${event.location}</a>` : "N/A"}
            </p>
            ${event.hostName ? `<p><strong>Host:</strong> ${event.hostName}</p>` : ""}
            ${isPast ? `<p class="event-finished">✅ Event Finished</p>` : ""}
            <a href="${generateGoogleCalendarLink(event)}" class="btn calendar-btn" target="_blank">
              📅 Add to Google Calendar
            </a>
          </div>
        `;
      }).join('');
    });
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
