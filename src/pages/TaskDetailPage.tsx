import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { Task, Project, Status, User } from '../types';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/TaskForm';
import Alert from '../components/ui/Alert';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  Layers,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { formatDate, getPriorityColor, getStatusColor } from '../lib/utils';
import { userService } from '../services/userServices';

const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!taskId) throw new Error('Task ID is required');
        
        const fetchedTask = await taskService.getTaskById(taskId);
        let fetchedUsers: User[] = [];
        if (userId) {
          const user = await userService.getUserById(userId);
          if (user) {
            fetchedUsers = [user];
          }
        }
        setTask(fetchedTask);
        
        if (fetchedTask.projectId) {
          const fetchedProject = await projectService.getProjectById(fetchedTask.projectId);
          setProject(fetchedProject);
        }
        if (fetchedTask.assignedTo) {
          const fetchedUser = await userService.getUserById(fetchedTask.assignedTo);
          setUsers(fetchedUser ? [fetchedUser] : []);
        }
        
        
        const allProjects = await projectService.getAllProjects();
        const fetchedAllUsers = await userService.getAllUsers();
        setProjects(allProjects);
        setUsers(fetchedAllUsers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load task');
        console.error('Error fetching task:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTask();
  }, [taskId]);
  
  const handleEdit = async (formData: any) => {
    if (!task) return;
    
    setIsSubmitting(true);
    try {
      const updatedTask = await taskService.updateTask(task.id, formData);
      setTask(updatedTask);
      setIsEditModalOpen(false);
      
      if (updatedTask.projectId !== task.projectId) {
        if (updatedTask.projectId) {
          const fetchedProject = await projectService.getProjectById(updatedTask.projectId);
          setProject(fetchedProject);
        } else {
          setProject(null);
        }
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: Status) => {
  if (!task) return;

  setIsSubmitting(true);
  try {
    // Use updateTask API to change status directly
    const updatedTask = await taskService.updateTask(task.id.toString(), { status: newStatus });
    setTask(updatedTask);
  } catch (err) {
    console.error('Failed to update task status:', err);
    setError(err instanceof Error ? err.message : 'Failed to update task status');
  } finally {
    setIsSubmitting(false);
  }
};
  
  const handleDelete = async () => {
    if (!task) return;
    
    setIsSubmitting(true);
    try {
      await taskService.deleteTask(task.id);
      setIsDeleteModalOpen(false);
      navigate('/tasks');
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !task) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Alert variant="error" title="Error">
          {error || 'Task not found'}
        </Alert>
        <div className="mt-4">
          <Link to="/tasks">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Tasks
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'todo':
        return <Info className="h-5 w-5 text-gray-600" />;
      default:
        return null;
    }
  };
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'low':
        return <AlertTriangle className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  const renderStatusHistory = () => {
    if (!task?.statusHistory.length) return null;

    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Status History</h3>
        <div className="space-y-3">
          {task.statusHistory.map((change) => (
            <div key={change.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(change.newStatus)}>
                  {change.newStatus.charAt(0).toUpperCase() + change.newStatus.slice(1)}
                </Badge>
                <span className="text-gray-500">from</span>
                <Badge className={getStatusColor(change.previousStatus)}>
                  {change.previousStatus.charAt(0).toUpperCase() + change.previousStatus.slice(1)}
                </Badge>
              </div>
              <div className="text-gray-500">
                {formatDate(change.changedAt, 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTaskActions = () => {
    if (!task) return null;

    return (
      <div className="flex space-x-2 mt-4">
        {task.status !== 'Closed' && (
          <Button
            variant="outline"
            onClick={() => setIsCloseModalOpen(true)}
          >
            Close Task
          </Button>
        )}
        
        {user?.role === 'admin' && task.status === 'Closed' && (
          <Button
            variant="outline"
            onClick={() => setIsReopenModalOpen(true)}
          >
            Reopen Task
          </Button>
        )}
        
        {user?.role === 'admin' && (
          <Button
            variant="danger"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Task
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/tasks"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tasks
          </Link>
        </div>
        
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">{task.title}</h1>
            
            {user?.role === 'admin' && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit className="h-4 w-4" />}
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete
                </Button>
              </div>
            )}
          </CardHeader>
          
          <CardBody className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {task.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
                  </div>
                )}
                
                {project && (
                  <div className="mb-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Project</h2>
                    <div className="flex items-center">
                      <Layers className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-gray-700">{project.name}</span>
                    </div>
                  </div>
                )}

                {renderStatusHistory()}
              </div>
              
              <div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                        <span>Due Date</span>
                      </div>
                      <span className="font-medium">{formatDate(task.dueDate)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        {getPriorityIcon(task.priority)}
                        <span className="ml-2">Priority</span>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        {getStatusIcon(task.status)}
                        <span className="ml-2">Status</span>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status === 'todo' 
                          ? 'To Do' 
                          : task.status === 'in-progress' 
                            ? 'In Progress' 
                            : 'Completed'
                        }
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Created</span>
                      <span className="text-gray-600 text-sm">{formatDate(task.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Last Updated</span>
                      <span className="text-gray-600 text-sm">{formatDate(task.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {renderTaskActions()}
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Task"
        >
          <TaskForm
            task={task}
            projects={projects}
            onSubmit={handleEdit}
            isSubmitting={isSubmitting} users={users}          />
        </Modal>
        
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Task"
        >
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Are you sure you want to delete this task?
            </h3>
            <p className="mt-2 text-gray-500">
              This action cannot be undone. This will permanently delete the task.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                isLoading={isSubmitting}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isCloseModalOpen}
          onClose={() => setIsCloseModalOpen(false)}
          title="Close Task"
        >
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Are you sure you want to close this task?
            </h3>
            <p className="mt-2 text-gray-500">
              This will mark the task as closed. Only administrators can reopen closed tasks.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsCloseModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleStatusChange('Closed');
                  setIsCloseModalOpen(false);
                }}
                isLoading={isSubmitting}
              >
                Close Task
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isReopenModalOpen}
          onClose={() => setIsReopenModalOpen(false)}
          title="Reopen Task"
        >
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-blue-500 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Are you sure you want to reopen this task?
            </h3>
            <p className="mt-2 text-gray-500">
              This will change the task status back to "To Do".
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsReopenModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleStatusChange('To Do');
                  setIsReopenModalOpen(false);
                }}
                isLoading={isSubmitting}
              >
                Reopen Task
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TaskDetailPage;