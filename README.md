# SmartPlanner – Study Planner Web Application

SmartPlanner is a full-stack productivity web application designed to help students manage their academic workload efficiently.
It allows users to organize tasks, track deadlines through a calendar view, and visualize study progress with analytics.

---

## 🚀 Features

* **User Authentication**

  * Secure login and signup with email and password
  * JWT based authentication

* **Task Management**

  * Create, edit, and delete study tasks
  * Set deadlines and subjects
  * Assign task priority levels
  * Completed tasks are permanently locked

* **Calendar View**

  * View tasks by deadline date
  * Pending tasks highlighted in the calendar
  * Select a date to view tasks due that day

* **Progress Analytics**

  * Visualize completed vs pending tasks
  * Charts showing workload distribution by subject
  * Completion rate tracking

* **Dark / Light Mode**

  * Toggle between themes
  * Optimized UI for readability

* **Responsive UI**

  * Clean modern dashboard interface
  * Works across different screen sizes

---

## 🛠 Tech Stack

### Frontend

* **React**
* **TypeScript**
* **TailwindCSS**
* **shadcn/ui**
* **Recharts**
* **Wouter (routing)**

### Backend

* **Node.js**
* **Express.js**

### Database

* **PostgreSQL**
* **Neon Database**
* **Drizzle ORM**

### Authentication

* **JWT (JSON Web Tokens)**
* **bcrypt for password hashing**

---

## 📂 Project Structure

```
smartplanner/
│
├── client/          # React frontend
│   ├── components
│   ├── pages
│   ├── hooks
│   └── styles
│
├── server/          # Express backend
│   ├── routes
│   ├── db
│   └── auth
│
├── shared/          # Shared schemas/types
│
├── package.json
└── README.md
```

---

## 📊 Future Improvements

Possible features that can be added:

* Email notifications for upcoming deadlines
* Drag-and-drop calendar tasks
* Pomodoro study timer
* Mobile optimization
* User profile settings
* Task reminders

---

## 👨‍💻 Author

**Muralidharan Ramprabhu**

B.Tech Information Technology – VIT Vellore

---

## 📜 Live at

(https://smartplanner-u1qj.onrender.com)
