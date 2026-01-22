import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import axios from 'axios';
import './App.css';

const API_URL = 'https://task-management-api-gh4k.onrender.com/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks');
    }
  };

  const handleAddTask = async (title) => {
    try {
      setLoading(true);
      await axios.post(API_URL, { title });
      await fetchTasks();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    let newStatus;
    if (currentStatus === 'to-do') {
      newStatus = 'in-progress';
    } else if (currentStatus === 'in-progress') {
      newStatus = 'done';
    }

    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus });
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      alert(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        await fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  return (
    <div className="app">
      <h1 className="app-title">Simple Task Tracker</h1>
      
      <div className="add-task-section">
        <button className="add-task-btn" onClick={() => setShowForm(true)}>
          + Add New Task
        </button>
      </div>

      <TaskList 
        tasks={tasks} 
        onUpdateStatus={handleUpdateStatus}
        onDeleteTask={handleDeleteTask}
      />

      {showForm && (
        <TaskForm 
          onSubmit={handleAddTask} 
          onClose={() => setShowForm(false)}
          loading={loading}
        />
      )}
    </div>
  );
}

export default App;
