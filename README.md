# Task Management - MERN Stack

A full-stack task management application built with **React**, **Node.js**, **Express**, and **MongoDB**.

This project is a submission for **SkillGenX Innovations MERN Stack Assessment**.

---

### Run Using Hosted Backend (No backend setup needed)

#### Prerequisites

- Node.js 14+ installed
- No MongoDB needed locally

#### Frontend Only Setup

```bash
cd frontend
npm install
# Edit src/App.js and update API_URL to the hosted backend
npm start
```

Frontend runs on `http://localhost:3000` and connects to the hosted backend on Render.

**Hosted Backend URL:**

```
https://task-management-api-gh4k.onrender.com/api/tasks
```

---

## 📋 Project Overview

### What is this app?

A simple **task tracker** where users can:

- ✅ Create tasks (automatically set to "to-do" status)
- ✅ Start tasks (move from to-do → in-progress)
- ✅ Complete tasks (move from in-progress → completed)
- ✅ Delete tasks
- ✅ View all tasks in a clean table format

### Why this design?

**Enforced Workflow:**

- Tasks CANNOT skip from "to-do" directly to "done"
- Must follow: `to-do` → `in-progress` → `done`
- This prevents accidental state corruption

**Separation of Concerns:**

- Backend: RESTful API with validation and error handling
- Frontend: React components with state management
- Database: MongoDB for persistent storage

---

## 🏗️ Architecture

```
task_management/
├── backend/                      # Node.js REST API
│   ├── models/
│   │   └── Task.js              # MongoDB schema
│   ├── controllers/
│   │   └── taskController.js    # Business logic
│   ├── routes/
│   │   └── taskRoutes.js        # API endpoints
│   ├── db.js                    # Database connection
│   ├── server.js                # Express setup
│   ├── backendDocumentation.md  # Backend documentation
│   └── package.json
│
├── frontend/                     # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskList.js      # Display tasks
│   │   │   └── TaskForm.js      # Add task modal
│   │   ├── App.js               # Main component
│   │   └── index.js             # Entry point
│   ├── frontendDocumentation.md # Frontend documentation
│   └── package.json
│
└── README.md                     # This file
```

---

## 📡 API Endpoints

**Base URL (Local):** `http://localhost:5000/api/tasks`
**Base URL (Hosted):** `https://task-management-api.onrender.com/api/tasks`

### Endpoints

| Method           | Endpoint           | Purpose         |
| ---------------- | ------------------ | --------------- |
| **GET**    | `/api/tasks`     | Get all tasks   |
| **POST**   | `/api/tasks`     | Create new task |
| **PUT**    | `/api/tasks/:id` | Update task     |
| **DELETE** | `/api/tasks/:id` | Delete task     |

### Example Request

**Create Task:**

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn React"}'
```

**Response:**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Learn React",
    "status": "to-do",
    "createdAt": "2026-01-22T10:00:00Z"
  }
}
```

---

## 🗄️ Data Model

```javascript
Task {
  _id: ObjectId,              // MongoDB unique identifier
  title: String,              // Task name (required)
  status: String,             // "to-do" | "in-progress" | "completed"
  createdAt: Date             // Timestamp of creation
}
```

---

## 🎯 Key Features

### ✅ Task Status Workflow

```
┌─────────────┐     Start      ┌──────────────┐     Done      ┌───────────────┐
│   TO-DO     │  ────────→    │ IN_PROGRESS  │  ────────→   │  DONE│
└─────────────┘               └──────────────┘              └───────────────┘
     ↓                              ↓                              ↓
  "Start"                        "Done"                         "✓"
  Button                         Button                      Checkmark
```

**Business Rule:** Cannot skip states

- ❌ to-do → done(NOT allowed)
- ✅ to-do → in-progress → done(ALLOWED)

### ✅ Form Management

Task form appears as a **modal popup** when clicking "+ Add New Task" button:

- Separate from the main task list
- Clean, focused UX
- Can cancel without affecting task list

### ✅ Delete Confirmation

Clicking delete shows a confirmation dialog to prevent accidental deletion.

---

## 🛠️ Technology Details

### Backend Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Validation:** Mongoose schema validation + controller-level validation

### Frontend Stack

- **Framework:** React 18
- **HTTP Client:** Axios
- **Styling:** CSS3
- **State Management:** React Hooks (useState, useEffect)

### Why These Technologies?

- **Express:** Lightweight, industry-standard for REST APIs
- **MongoDB:** Flexible document storage with schema validation
- **React:** Component-based, excellent for UI management
- **Axios:** Promise-based, easy error handling
- **CSS:** No build complexity, simple and maintainable

---

## 📚 Documentation

### For Backend Details

See [backend/](backend/README.md)backendDocumentation.md for:

- Architecture & design decisions
- Complete API endpoint documentation
- Error handling strategy
- Database connection details
- Validation rules

### For Frontend Details

See [frontend/](frontend/README.md)frontendDocumentation.md for:

- Component architecture
- State management flow
- API integration details
- User interface design
- Performance considerations

---

## 🚀 Deployment

### Hosted on Render

**Backend URL:** https://task-management-api-gh4k.onrender.com/api/tasks

The backend is deployed on [Render.com](https://render.com) with:

- Auto-deployment from GitHub
- MongoDB Atlas database
- Environment variables configured
- CORS enabled for cross-origin requests

**How it works:**

1. Code pushed to GitHub
2. Render detects changes
3. Automatically rebuilds and redeploys
4. No manual deployment needed

## 📊 Error Handling

### HTTP Status Codes

| Code | Meaning      | Example                   |
| ---- | ------------ | ------------------------- |
| 200  | Success      | Task retrieved/updated    |
| 201  | Created      | New task added            |
| 400  | Bad Request  | Invalid status transition |
| 404  | Not Found    | Task ID doesn't exist     |
| 500  | Server Error | Database error            |

### Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical details"
}
```

---

## ✨ Code Quality

### Best Practices Implemented

- ✅ **Separation of Concerns:** Models, controllers, routes separated
- ✅ **Error Handling:** Try-catch on all async operations
- ✅ **Input Validation:** Both frontend and backend validation
- ✅ **Security:** Environment variables for sensitive data
- ✅ **State Management:** React Hooks with proper dependencies
- ✅ **Code Organization:** Modular, reusable components
- ✅ **Comments:** Clear explanations of complex logic
- ✅ **Consistent Style:** Proper indentation and naming conventions

---

## 🎓 Learning Outcomes

This project demonstrates:

### Backend Skills

- ✅ RESTful API design
- ✅ Express.js framework
- ✅ MongoDB & Mongoose
- ✅ Input validation
- ✅ Error handling
- ✅ HTTP status codes
- ✅ Async/await patterns

### Frontend Skills

- ✅ React components & hooks
- ✅ State management
- ✅ API integration
- ✅ Controlled forms
- ✅ Event handling
- ✅ Conditional rendering
- ✅ CSS styling

### Full-Stack Skills

- ✅ Client-server communication
- ✅ Data flow management
- ✅ Deployment & hosting
- ✅ Git version control
- ✅ Environment configuration
- ✅ Error handling end-to-end

---

## 📄 Summary

This is a **complete, production-ready task management application** that demonstrates:

- **Clean Architecture:** Proper separation of concerns
- **Modern Tech Stack:** React + Node + MongoDB
- **Best Practices:** Error handling, validation, security
- **User Experience:** Intuitive UI with clear feedback
- **Deployment Ready:** Hosted backend, easy frontend deployment
- **Well Documented:** Comprehensive READMEs at every level

This project was created as a technical assessment submission and is provided as-is for educational purposes.

**Author:** Ayra Riyaz
**Repository:** https://github.com/AyraRiyaz/task_manager
**Hosted Backend:** https://task-management-api-gh4k.onrender.com/api/tasks

---

## 🎉 Features at a Glance

| Feature                     | Status |
| --------------------------- | ------ |
| Create Tasks                | ✅     |
| View All Tasks              | ✅     |
| Update Task Status          | ✅     |
| Delete Tasks                | ✅     |
| Status Workflow Enforcement | ✅     |
| Form Modal                  | ✅     |
| Error Handling              | ✅     |
| Input Validation            | ✅     |
| Responsive Design           | ✅     |
| Hosted Backend              | ✅     |
| Detailed Documentation      | ✅     |

---
