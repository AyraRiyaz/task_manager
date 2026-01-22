import React from 'react';
import './TaskList.css';

function TaskList({ tasks, onUpdateStatus, onDeleteTask }) {
  const getStatusDisplay = (status) => {
    if (status === 'to-do') return 'To-do';
    if (status === 'in-progress') return 'In-progress';
    if (status === 'done') return 'Done';
    return status;
  };

  const getActionButton = (task) => {
    if (task.status === 'to-do') {
      return (
        <button 
          className="action-btn start-btn"
          onClick={() => onUpdateStatus(task._id, task.status)}
        >
          Start
        </button>
      );
    } else if (task.status === 'in-progress') {
      return (
        <button 
          className="action-btn done-btn"
          onClick={() => onUpdateStatus(task._id, task.status)}
        >
          Done
        </button>
      );
    } else {
      return <span className="checkmark">✓</span>;
    }
  };

  return (
    <div className="task-list-container">
      <h2 className="task-list-title">Task List</h2>
      
      <table className="task-table">
        <thead>
          <tr>
            <th>Task Title</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="3" className="no-tasks">No tasks available</td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task._id}>
                <td className="task-title">{task.title}</td>
                <td className="task-status">{getStatusDisplay(task.status)}</td>
                <td className="task-action">
                  {getActionButton(task)}
                  <button 
                    className="delete-btn"
                    onClick={() => onDeleteTask(task._id)}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
