import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { Task, Project } from '../types';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import TaskCard from '../components/TaskCard';
import { 
  Plus, 
  List, 
  Layers, 
  Clock,
  CalendarClock,
  CheckSquare2
} from 'lucide-react';
import Button from '../components/ui/Button';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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

  
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const highPriorityTasks = tasks.filter(task => task.priority === 'high');
  
  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'No Project';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-gray-500">
            Here's an overview of your tasks and projects
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Task Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <List className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Total Tasks</h3>
                      <p className="text-3xl font-bold text-gray-700">{tasks.length}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
              
              <Card className="bg-white">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">In Progress</h3>
                      <p className="text-3xl font-bold text-gray-700">{inProgressTasks.length}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
              
              <Card className="bg-white">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600">
                      <CalendarClock className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">High Priority</h3>
                      <p className="text-3xl font-bold text-gray-700">{highPriorityTasks.length}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
              
              <Card className="bg-white">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <CheckSquare2 className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Completed</h3>
                      <p className="text-3xl font-bold text-gray-700">{completedTasks.length}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            
            {/* Recent Tasks */}
            <Card className="mb-8">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
                <Link to="/tasks/new">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    New Task
                  </Button>
                </Link>
              </CardHeader>
              <CardBody>
                {tasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.slice(0, 6).map(task => (
                      <Link to={`/tasks/${task.id}`} key={task.id}>
                        <TaskCard task={task} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No tasks found. Create your first task!</p>
                    <div className="mt-4">
                      <Link to="/tasks/new">
                        <Button
                          variant="primary"
                          leftIcon={<Plus className="h-4 w-4" />}
                        >
                          Create Task
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                
                {tasks.length > 6 && (
                  <div className="mt-6 text-center">
                    <Link to="/tasks">
                      <Button variant="outline">
                        View All Tasks
                      </Button>
                    </Link>
                  </div>
                )}
              </CardBody>
            </Card>
            
            {/* Projects Section (Admin Only) */}
            {user?.role === 'admin' && (
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                  <Link to="/projects/new">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="h-4 w-4" />}
                    >
                      New Project
                    </Button>
                  </Link>
                </CardHeader>
                <CardBody>
                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projects.slice(0, 3).map(project => (
                        <Link to={`/projects/${project.id}`} key={project.id}>
                          <Card className="h-full hover:shadow-md transition-shadow duration-200">
                            <CardBody className="p-6">
                              <div className="flex items-center mb-4">
                                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                  <Layers className="h-5 w-5" />
                                </div>
                                <h3 className="ml-3 text-lg font-medium text-gray-900">{project.name}</h3>
                              </div>
                              {project.description && (
                                <p className="text-gray-600 line-clamp-2">{project.description}</p>
                              )}
                            </CardBody>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No projects found. Create your first project!</p>
                      <div className="mt-4">
                        <Link to="/projects/new">
                          <Button
                            variant="primary"
                            leftIcon={<Plus className="h-4 w-4" />}
                          >
                            Create Project
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {projects.length > 3 && (
                    <div className="mt-6 text-center">
                      <Link to="/projects">
                        <Button variant="outline">
                          View All Projects
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;