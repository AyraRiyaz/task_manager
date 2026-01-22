# Task Management Frontend - MERN Stack Assessment

## Overview

This is a React-based frontend for a Simple Task Management application. It provides an intuitive user interface to create, read, update, and delete tasks with real-time status management.

---

## Architecture & Design Decisions

### 1. Technology Stack

- **Framework:** React 18 (with Hooks)
- **HTTP Client:** Axios (for API calls)
- **Styling:** Plain CSS (no dependencies for simplicity)
- **State Management:** React Hooks (useState, useEffect)

**Why these choices?**

- React for reusable component architecture
- Axios for promise-based HTTP requests with easy error handling
- Plain CSS to avoid unnecessary dependencies (keeps project lightweight)
- Hooks for modern, functional component approach

### 2. Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── TaskList.js        # Display all tasks in table
│   │   ├── TaskList.css
│   │   ├── TaskForm.js        # Modal form for creating tasks
│   │   └── TaskForm.css
│   ├── App.js                 # Main application logic
│   ├── App.css
│   ├── index.js               # React entry point
│   └── index.css              # Global styles
├── public/
│   └── index.html             # HTML template
└── package.json               # Dependencies
```

**Rationale:**

- **Components folder:** Reusable UI components
- **App.js:** Central state management and API integration
- **TaskList:** Presentational component (receives data as props)
- **TaskForm:** Modal component (controlled form with state)

### 3. Component Architecture

#### Parent Component (App.js)

- **Responsibility:** Central orchestration
- **State Management:** `tasks`, `showForm`, `loading`
- **API Communication:** Fetches data and handles requests
- **Props Down:** Passes data to child components
- **Events Up:** Child components call parent methods via callbacks

#### Child Components

- **TaskList.js:** Pure presentation of tasks
- **TaskForm.js:** Controlled form input with submission

**Why this pattern?**

- Single source of truth (state in App)
- Unidirectional data flow (easier to debug)
- Reusable components (TaskForm can be reused elsewhere)

---

## State Management

### App.js State

```javascript
const [tasks, setTasks] = useState([]);        // All tasks from API
const [showForm, setShowForm] = useState(false); // Modal visibility
const [loading, setLoading] = useState(false);   // Loading state
```

### State Flow

```
API Response → setTasks() → Re-render → TaskList displays tasks
User clicks Add → showForm = true → TaskForm modal appears
User submits form → handleAddTask() → API call → Refresh tasks
```

---

## API Integration

### Base Configuration

**File:** `App.js`

API_URL = 'https://task-management-api-gh4k.onrender.com/api/tasks'

### API Methods

#### 1. Fetch Tasks (on component mount)

```javascript
const fetchTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    setTasks(response.data.data);  // Extract data from response
  } catch (error) {
    console.error('Error fetching tasks:', error);
    alert('Failed to fetch tasks');
  }
};

useEffect(() => {
  fetchTasks();  // Called when component mounts
}, []);         // Empty dependency array = run once
```

**What happens:**

1. On component load, `useEffect` triggers
2. Axios makes GET request to `/api/tasks`
3. Response data updates `tasks` state
4. Component re-renders with task list

---

#### 2. Create Task

```javascript
const handleAddTask = async (title) => {
  try {
    setLoading(true);  // Disable form during request
    await axios.post(API_URL, { title });
    await fetchTasks();  // Refresh task list
    setShowForm(false);  // Close modal
  } catch (error) {
    alert('Failed to add task');
  } finally {
    setLoading(false);  // Re-enable form
  }
};
```

**Flow:**

1. User enters task title in modal
2. Submits form → `handleAddTask()` called
3. Loading state = true (disables inputs)
4. POST request sent to backend
5. Task list refreshed from API
6. Modal closes, form resets

---

#### 3. Update Task Status

```javascript
const handleUpdateStatus = async (id, currentStatus) => {
  // Determine next status based on current
  let newStatus;
  if (currentStatus === 'to-do') {
    newStatus = 'in-progress';
  } else if (currentStatus === 'in-progress') {
    newStatus = 'done';
  }

  try {
    await axios.put(`${API_URL}/${id}`, { status: newStatus });
    await fetchTasks();  // Refresh to reflect change
  } catch (error) {
    // Backend may reject invalid transition
    alert(error.response?.data?.message || 'Failed to update task');
  }
};
```

**Status Transition Logic:**

- `to-do` → "Start" button → `in-progress`
- `in-progress` → "Done" button → `completed`
- `completed` → Show checkmark ✓ (no further action)

**Why on frontend?**

- Provides immediate UI feedback
- Backend validates to prevent invalid requests
- Matches backend validation (defense-in-depth)

---

#### 4. Delete Task

```javascript
const handleDeleteTask = async (id) => {
  if (window.confirm('Are you sure you want to delete this task?')) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchTasks();  // Refresh list after deletion
    } catch (error) {
      alert('Failed to delete task');
    }
  }
};
```

**UX Considerations:**

- Confirmation dialog prevents accidental deletion
- Loading state prevents double-clicks
- List refreshes immediately after deletion

---

## Component Details

### TaskList.js

**Props Received:**

```javascript
{
  tasks: [],                    // Array of task objects
  onUpdateStatus: function,     // Callback for status change
  onDeleteTask: function        // Callback for deletion
}
```

**Renders:**

```html
<table>
  <thead>
    <tr>Task Title | Status | Action</tr>
  </thead>
  <tbody>
    {tasks.map(task => <TaskRow key={task._id} />)}
  </tbody>
</table>
```

**Action Buttons Logic:**

```javascript
if (status === 'to-do') {
  // Show "Start" button → calls onUpdateStatus
} else if (status === 'in-progress') {
  // Show "Done" button → calls onUpdateStatus  
} else if (status === 'completed') {
  // Show checkmark ✓ (no button)
}
```

**Delete Button:**

- Trash icon (🗑️) on every row
- Calls `onDeleteTask(id)` with confirmation

**Empty State:**

- Shows message when no tasks exist
- Encourages user to add first task

---

### TaskForm.js

**Purpose:** Modal form for creating new tasks

**Props:**

```javascript
{
  onSubmit: function,    // Called with task title
  onClose: function,     // Called when modal closes
  loading: boolean       // Disables form during submission
}
```

**Features:**

- **Modal Overlay:** Darkens background, prevents interaction
- **Controlled Input:** Value stored in component state
- **Form Validation:**
  ```javascript
  if (title.trim()) {
    onSubmit(title.trim());  // Only submit if title not empty
    setTitle('');             // Reset input
  }
  ```

**Button States:**

- Submit button **disabled** while loading
- Submit button **disabled** if input empty
- Close button **disabled** while loading

**User Flow:**

```
1. Click "+ Add New Task"
2. TaskForm modal appears with focus on input
3. Type task title
4. Click "Add" or press Enter
5. Modal closes, task added to list
6. Or click "Cancel" to close without adding
```

---

## User Interface Design

### Design Principles

1. **Simplicity:** Minimal UI elements, clear hierarchy
2. **Usability:** Large buttons, clear labels, meaningful colors
3. **Feedback:** Loading states, error alerts, visual confirmations
4. **Responsive:** Works on desktop and tablet

### Color Scheme

| Element          | Color                | Purpose                     |
| ---------------- | -------------------- | --------------------------- |
| Primary Button   | #007BFF (Blue)       | Main actions (Add)          |
| Success Button   | #28A745 (Green)      | Positive transitions (Done) |
| Secondary Button | #6C757D (Gray)       | Secondary actions (Start)   |
| Delete Button    | 🗑️ Emoji           | Clear affordance            |
| Checkmark        | ✓ (Green)           | Task completion             |
| Background       | #F5F5F5 (Light Gray) | Subtle, clean               |

### Typography

- **Title:** 2.5rem, Bold (visual hierarchy)
- **Headings:** 1.5rem, Semi-bold
- **Body:** 1rem, Regular weight
- **Font:** System fonts (cross-platform)

---

## State Management Flow

### Complete Data Flow Diagram

```
User Action → Event Handler → API Call → Response Handler → State Update → Re-render
    ↓              ↓              ↓             ↓                ↓             ↓
  Click      handleAddTask  POST /tasks    setTasks()      tasks = [...]   Display
  Button     (with title)   {title}        setShowForm()   showForm = false  updated list
```

### Example: Add Task Complete Flow

1. **User Interface**

   ```
   User types "Learn React" in modal
   User clicks "Add" button
   ```
2. **Event Handler**

   ```javascript
   handleAddTask("Learn React") {
     // Called by TaskForm onSubmit
   }
   ```
3. **API Call**

   ```javascript
   await axios.post(API_URL, { title: "Learn React" })
   ```
4. **Backend Response**

   ```json
   {
     "success": true,
     "message": "Task created successfully",
     "data": {
       "_id": "123",
       "title": "Learn React",
       "status": "to-do",
       "createdAt": "2026-01-22T10:00:00Z"
     }
   }
   ```
5. **State Update**

   ```javascript
   await fetchTasks()  // Refresh all tasks
   setShowForm(false)  // Close modal
   ```
6. **Re-render**

   ```
   New task appears in table
   Modal disappears
   Input field is cleared
   ```

---

## Error Handling

### Try-Catch Pattern

All API calls wrapped in try-catch:

```javascript
try {
  // API operation
  await axios.post(API_URL, data);
} catch (error) {
  // User-friendly error message
  alert(error.response?.data?.message || 'Failed to perform action');
  // Log for debugging
  console.error('Error:', error);
}
```

### Error Messages

| Error        | Cause                         | Message                 |
| ------------ | ----------------------------- | ----------------------- |
| Fetch Fails  | Network or API down           | "Failed to fetch tasks" |
| Add Fails    | Invalid input or server error | "Failed to add task"    |
| Update Fails | Invalid status transition     | Backend message shown   |
| Delete Fails | Task doesn't exist            | "Failed to delete task" |

### User Feedback

- **Alerts:** Block popups for errors (user must acknowledge)
- **Loading States:** Buttons disabled, show "Adding..." text
- **Console Logs:** Detailed errors for debugging

---

## Features Implemented

✅ **Create Task**

- Modal form for clean UI
- Auto-focus on input field
- Title validation (required, trimmed)
- Auto-sets status to "to-do"

✅ **View Tasks**

- Table display with sorting (newest first)
- Task title, status, actions in columns
- Empty state message

✅ **Update Task**

- "Start" button for to-do → in-progress
- "Done" button for in-progress → completed
- Visual checkmark for completed tasks
- Backend validates transitions

✅ **Delete Task**

- Delete button (trash icon) on each row
- Confirmation dialog to prevent accidents
- List refreshes after deletion

✅ **Status Management**

- Three-state workflow: to-do → in-progress → completed
- Visual feedback for each state
- Backend enforces valid transitions

✅ **User Experience**

- Loading states prevent double-submission
- Error alerts inform user of problems
- Modal separates form from task list
- Clean, responsive design

## Setup & Running

### Prerequisites

- Node.js 14+ installed

### Installation

```bash
cd frontend
npm install
```

### Start Development Server

```bash
npm start
```

Expected:

- Browser opens http://localhost:3000
- React app loads
- Tasks fetch from backend and display

## Summary

This frontend provides a **clean, intuitive interface** for task management with:

- ✅ Component-based React architecture
- ✅ Proper state management with Hooks
- ✅ Robust API integration with error handling
- ✅ User-friendly modal forms and confirmations
- ✅ Clear visual feedback and loading states
- ✅ Business logic enforcement (status transitions)
- ✅ Responsive, accessible design

The design prioritizes **simplicity and clarity** while maintaining professional quality suitable for a MERN stack assessment.
