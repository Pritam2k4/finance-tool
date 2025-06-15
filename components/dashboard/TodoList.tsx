
import React, { useState, ChangeEvent } from 'react';
import { TodoTask } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';

// Placeholder Icons
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>;
const PencilIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>;
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>;


interface TodoListProps {
  tasks: TodoTask[];
  onTasksChange: (tasks: TodoTask[]) => void;
}

const TodoList: React.FC<TodoListProps> = ({ tasks, onTasksChange }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTaskDueTime, setNewTaskDueTime] = useState('');
  const [editingTask, setEditingTask] = useState<TodoTask | null>(null);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: TodoTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      priority: newTaskPriority,
      dueTime: newTaskDueTime || undefined,
      createdAt: Date.now(),
    };
    onTasksChange([newTask, ...tasks]);
    setNewTaskText('');
    setNewTaskPriority('Medium');
    setNewTaskDueTime('');
  };

  const handleToggleTask = (id: string) => {
    onTasksChange(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleDeleteTask = (id: string) => {
    onTasksChange(tasks.filter(task => task.id !== id));
  };
  
  const handleEditTask = (task: TodoTask) => {
    setEditingTask(task);
  };

  const handleSaveEdit = () => {
    if (editingTask) {
      onTasksChange(tasks.map(task => task.id === editingTask.id ? editingTask : task));
      setEditingTask(null);
    }
  };
  
  const handleEditingTaskChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (editingTask) {
      setEditingTask({ ...editingTask, [e.target.name]: e.target.value });
    }
  };
  
  const priorityColors = {
    High: 'bg-red-500/80 dark:bg-red-400/80',
    Medium: 'bg-yellow-500/80 dark:bg-yellow-400/80',
    Low: 'bg-green-500/80 dark:bg-green-400/80',
  };

  const sortedTasks = [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt);

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddTask} className="p-4 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-lg shadow space-y-3">
        <Input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="What's your next mission, warrior?"
          className="text-lg"
          wrapperClassName="mb-0"
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as 'High'|'Medium'|'Low')}
              className="w-full sm:w-auto px-3 py-2.5 rounded-md bg-background-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-primary-light outline-none"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <Input
              type="time"
              value={newTaskDueTime}
              onChange={(e) => setNewTaskDueTime(e.target.value)}
              className="w-full sm:w-auto"
              wrapperClassName="mb-0 flex-grow"
            />
            <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto" leftIcon={<PlusIcon className="w-5 h-5"/>}>
              Add Task
            </Button>
        </div>
      </form>

      {sortedTasks.length === 0 && <p className="text-center text-text-muted-light dark:text-text-muted-dark py-4">No tasks yet. Plan your conquest!</p>}

      <ul className="space-y-3">
        {sortedTasks.map(task => (
          <li
            key={task.id}
            className={`flex items-center p-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-lg shadow-md transition-all duration-300 ${
              task.completed ? 'opacity-60' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
              className="form-checkbox h-5 w-5 text-primary dark:text-primary-light rounded border-gray-400 dark:border-gray-500 focus:ring-primary/50 mr-3 cursor-pointer"
            />
            <div className="flex-grow">
              <span className={`font-medium ${task.completed ? 'line-through text-text-muted-light dark:text-text-muted-dark' : 'text-text-light dark:text-text-dark'}`}>
                {task.text}
              </span>
              <div className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5 flex items-center space-x-2">
                <span className={`px-1.5 py-0.5 text-xs font-semibold text-white rounded-full ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                {task.dueTime && <span>Due: {task.dueTime}</span>}
              </div>
            </div>
            <div className="flex space-x-1.5 ml-2">
              <Button onClick={() => handleEditTask(task)} variant="ghost" size="sm" className="!p-1.5" aria-label="Edit task">
                <PencilIcon className="w-4 h-4" />
              </Button>
              <Button onClick={() => handleDeleteTask(task.id)} variant="ghost" size="sm" className="!p-1.5 !text-red-500 hover:!bg-red-500/10" aria-label="Delete task">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingTask(null)}>
          <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-xl w-full max-w-lg text-left animate-slideInUp" onClick={e => e.stopPropagation()}>
            <h4 className="text-xl font-zen-dots text-primary dark:text-primary-light mb-4">Edit Task</h4>
            <Input
              label="Task Description"
              name="text"
              value={editingTask.text}
              onChange={handleEditingTaskChange}
              className="mb-3"
            />
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label htmlFor="editPriority" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Priority</label>
                <select
                  id="editPriority"
                  name="priority"
                  value={editingTask.priority}
                  onChange={handleEditingTaskChange}
                  className="w-full px-3 py-2.5 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-primary-light outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="flex-1">
                <Input
                  label="Due Time"
                  type="time"
                  name="dueTime"
                  value={editingTask.dueTime || ''}
                  onChange={handleEditingTaskChange}
                  wrapperClassName="mb-0"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button onClick={() => setEditingTask(null)} variant="ghost">Cancel</Button>
              <Button onClick={handleSaveEdit} variant="primary">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
