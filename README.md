# 🗓️ SiGN Calendar Scheduler

**SiGN Scheduler** is a clean, mobile-responsive public event calendar built for the [Sign Protocol](https://sign.global) community — made to organize, browse, and track Twitter Spaces, workshops, and on-chain meetups in one beautiful place.

> 🧪 A product of **Sign Lab**  
> ❤️ Built by [@OxIsrafil](https://x.com/OxIsrafil) & [@Hikaru___san](https://x.com/Hikaru___san)

---

## ✨ Features

- 🧠 Event scheduling with title, description, date, time & X Space link
- 🔁 Smart clash detection (no double booking)
- 📅 Add to Google Calendar with UTC format
- 🌙 Light/Dark mode toggle
- 📱 Mobile-first responsive layout
- 💾 MongoDB Atlas backend integration
- 🧭 404 page, animated loader, collapsible nav

---

## 🚀 Live Site

🔗 [https://signcalendar.vercel.app/] (https://signcalendar.vercel.app/)

---

## ⚙️ Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **Hosting:** Vercel + GitHub

---

## 🧪 Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/OxIsrafil/SignCalendar.git
cd SignCalendar

# 2. Install backend dependencies
cd backend
npm install

# 3. Set up your environment variables
echo MONGO_URI=your_mongodb_uri_here > .env

# 4. Run the backend
node server.js

# 5. Open frontend/index.html in your browser
