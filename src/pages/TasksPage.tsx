import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { Task, Project, Priority, Status } from '../types';
import TaskCard from '../components/TaskCard';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { Plus, Filter, Search, X } from 'lucide-react';

const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [projectFilter, setProjectFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedTasks, fetchedProjects] = await Promise.all([
          taskService.getAllTasks(),
          projectService.getAllProjects(),
        ]);
  
        let filteredTasks = fetchedTasks;
  
        // Filter tasks based on user role
        if (user?.role === 'user') {
          filteredTasks = fetchedTasks.filter(task => task.assignedTo?.toString() === user.id.toString());
        }
  
        setTasks(filteredTasks);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (user) {
      fetchData();
    }
  }, [user]);
  
  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };
  
  const clearFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
    setProjectFilter('');
    setSearchQuery('');
  };
  
  // Apply filters and search
  const filteredTasks = tasks.filter(task => {
    // Apply status filter
    if (statusFilter && task.status !== statusFilter) {
      return false;
    }
    
    // Apply priority filter
    if (priorityFilter && task.priority !== priorityFilter) {
      return false;
    }
    
    // Apply project filter
    if (projectFilter && task.projectId !== projectFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="mt-1 text-gray-500">
              Manage and organize all your tasks
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/tasks/new">
              <Button
                leftIcon={<Plus className="h-4 w-4" />}
              >
                New Task
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardBody className="p-4">
            <div className="flex items-center mb-2">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              
              {(statusFilter || priorityFilter || projectFilter || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="ml-auto flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-5 w-5 text-gray-400" />}
                  fullWidth
                />
              </div>
              
              <Select
                options={[
                  { value: '', label: 'All Statuses' },
                   { value: 'To Do', label: 'Pending' },
                { value: 'In Progress', label: 'Started' },
                { value: 'Open', label: 'Waiting' },
                { value: 'Closed', label: 'Done' },
                ]}
                value={statusFilter}
                onChange={(value: string) => setStatusFilter(value as Status | '')}
                fullWidth
              />
              
              <Select
                options={[
                  { value: '', label: 'All Priorities' },
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
                value={priorityFilter}
                onChange={(value: string) => setPriorityFilter(value as Priority | '')}
                fullWidth
              />
              
              <Select
                options={[
                  { value: '', label: 'All Projects' },
                  ...projects.map(project => ({
                    value: project.id,
                    label: project.name,
                  })),
                ]}
                value={projectFilter}
                onChange={setProjectFilter}
                fullWidth
              />
            </div>
          </CardBody>
        </Card>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div key={task.id} onClick={() => handleTaskClick(task.id)}>
                  <TaskCard task={task} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 mb-4">No tasks found matching your criteria</p>
                {(statusFilter || priorityFilter || projectFilter || searchQuery) ? (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Link to="/tasks/new">
                    <Button
                      leftIcon={<Plus className="h-4 w-4" />}
                    >
                      Create Task
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;