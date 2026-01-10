# ✈️ Airline Ops — Baggage Tracker

**Role Context:**  
Ramp Agent — CLT  
Shift: PM Ops

A full-stack internal operations tool built to simulate how airline ramp agents track and manage passenger baggage in real time.

Built with **React, Node.js, Express, and MongoDB**.

This project was designed from the perspective of a real airline ramp agent to reflect real operational workflows used at major airports.

---

## 🚀 What This App Does

The Baggage Tracker allows operations teams to:

• Register bags by tag number  
• Assign bags to flights and passengers  
• Track baggage status in real time  
• See operational counts (Checked In, Loaded, In Transit, Delivered)  
• Update bag status as it moves through the airport  
• Search and filter by tag number  
• Edit and delete baggage records

This simulates the exact flow used in airline ground operations.

---

## 🧠 Why This Matters

Airlines handle **tens of thousands of bags per day**.  
A single lost bag creates:

• Customer dissatisfaction  
• Delays  
• Manual labor  
• Financial loss

This tool models how modern airline IT systems track baggage from:

**Check-in → Aircraft Load → In-Transit → Arrival → Delivery**

The same lifecycle used by major airline operations systems.

It demonstrates how software can directly support real-world logistics operations.

---

## 🧩 System Architecture

React Frontend  
→ Axios API Client  
→ Node + Express REST API  
→ MongoDB (Atlas)

## 🛠️ Tech Stack

**Frontend**

- React
- Axios
- Custom UI / Styling

**Backend**

- Node.js
- Express
- MongoDB (Atlas)
- Mongoose
- dotenv

**Dev Tools**

- Concurrently
- Nodemon
- ESLint

---

## 📦 Features

- Real-time CRUD for baggage records
- Status-based tracking
- Operational dashboard with live counts
- MongoDB persistent storage
- One-command startup for frontend & backend
- Secure environment variable handling

---

## ⚡ One-Click Startup

After cloning the repo:

npm install
npm run dev

This starts:

- Backend API on port 5050
- React frontend on port 3000

---

## 🔐 Environment Setup

Create a `.env` file inside `backend/` using this template:

MONGO_URL=your_mongodb_connection_string
PORT=5050

An example file is provided:

backend/.env.example

Your real credentials should **never** be committed.

---

## 🧑‍💻 Author

**Marcos Tavarez**  
Fleet Service (Ramp Agent) — Charlotte Douglas International Airport  
Aspiring Software Engineer & IT Applications Developer

This project was built to demonstrate how real airline operations can be improved through modern full-stack software.

---

## 🏁 Final Note

This is not a tutorial project.  
This is a **real-world operational system** modeled from airline ground handling experience.

It was built to show how engineering and operations come together.
