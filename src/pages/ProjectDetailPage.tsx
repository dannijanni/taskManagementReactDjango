import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { Project, Task } from '../types';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import TaskCard from '../components/TaskCard';
import Modal from '../components/ui/Modal';
import ProjectForm from '../components/ProjectForm';
import Alert from '../components/ui/Alert';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus,
  Layers,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '../lib/utils';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!projectId) throw new Error('Project ID is required');
        
        const [fetchedProject, allTasks] = await Promise.all([
          projectService.getProjectById(projectId),
          taskService.getAllTasks(),
        ]);
        
        setProject(fetchedProject);
        
        // Filter tasks by projectId
        const projectTasks = allTasks.filter(task => task.projectId === projectId);
        setTasks(projectTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
        console.error('Error fetching project:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [projectId]);
  
  const handleEdit = async (formData: any) => {
    if (!project) return;
    
    setIsSubmitting(true);
    try {
      const updatedProject = await projectService.updateProject(project.id, formData);
      setProject(updatedProject);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update project:', err);
      setError(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!project) return;
    
    setIsSubmitting(true);
    try {
      await projectService.deleteProject(project.id);
      setIsDeleteModalOpen(false);
      navigate('/projects');
    } catch (err) {
      console.error('Failed to delete project:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete project');
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
  
  if (error || !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Alert variant="error" title="Error">
          {error || 'Project not found'}
        </Alert>
        <div className="mt-4">
          <Link to="/projects">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/projects"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                <Layers className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            </div>
            
            {user?.role === 'admin' && (
              <div className="flex space-x-2 mt-4 sm:mt-0">
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
                {project.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                  </div>
                )}
              </div>
              
              <div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                        <span>Created</span>
                      </div>
                      <span className="font-medium">{formatDate(project.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                        <span>Last Updated</span>
                      </div>
                      <span className="font-medium">{formatDate(project.updatedAt)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Total Tasks</span>
                      <span className="font-medium">{tasks.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Project Tasks */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          
          <div className="mt-2 sm:mt-0">
            <Link to={`/tasks/new?projectId=${project.id}`}>
              <Button
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Task
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <Link to={`/tasks/${task.id}`} key={task.id}>
                <TaskCard task={task} />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 mb-4">No tasks assigned to this project yet</p>
              <Link to={`/tasks/new?projectId=${project.id}`}>
                <Button
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Task
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Project"
        >
          <ProjectForm
            project={project}
            onSubmit={handleEdit}
            isSubmitting={isSubmitting}
          />
        </Modal>
        
        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Project"
        >
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Are you sure you want to delete this project?
            </h3>
            <p className="mt-2 text-gray-500">
              This action cannot be undone. This will permanently delete the project and may affect any associated tasks.
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
      </div>
    </div>
  );
};

export default ProjectDetailPage;