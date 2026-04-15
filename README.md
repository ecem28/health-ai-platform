# 🧠 HealthAI Platform

HealthAI is a web-based collaboration platform that connects **Engineers** and **Healthcare Professionals (Doctors)** to build innovative AI-powered healthcare solutions.

---

## 🚀 Features

### 👤 User System

* Register/Login with `.edu` email
* Role-based system:

  * 🧑‍💻 Engineer
  * 🩺 Doctor (with specialization)

---

### 📌 Post System

* Users can create posts
* Doctors define **medical fields**
* Engineers define **AI methods**
* Posts are visible to all users

---

### 📩 Request System

* Users can send collaboration requests
* Request includes:

  * Message
  * Sender info
  * Field compatibility

---

### 📅 Meeting System

* Requests can be **accepted/rejected**
* When accepted:

  * Meeting date & time selected
  * Meeting link added (Zoom / Google Meet)
* Users can join meetings directly

---

### 📊 Dashboard

* Overview cards:

  * My Posts
  * Incoming Requests
  * Meetings
* Clickable navigation system

---

## 🛠️ Technologies Used

* React (Vite)
* JavaScript (ES6+)
* CSS (custom UI)
* LocalStorage (state persistence)
* Docker 🐳

---

## 🐳 Run with Docker

```bash
# Build image
docker build -t healthai-app .

# Run container
docker run -p 5173:5173 healthai-app
```

👉 Open in browser:

```
http://localhost:5173
```

---

## 📁 Project Structure

```
health-ai-platform/
│
├── backend/
├── docs/
├── frontend/   ← React + Docker app
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
```

---

## ⚠️ Notes

* Latest development version is on the **dev branch**
* This project is a prototype for collaboration workflow
* Data is stored locally using LocalStorage

---

## 💡 Future Improvements

* Backend integration (Node.js / Spring Boot)
* Database (PostgreSQL)
* Real-time chat system
* Advanced filtering & search
* Deployment (AWS / Vercel)

---

## 👩‍💻 Authors

Ecem Tüysüz
Gizem Fatma Kılıç

---
