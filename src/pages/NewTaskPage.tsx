import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { userService } from '../services/userServices';
import { Project, User } from '../types';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import TaskForm from '../components/TaskForm';
import Alert from '../components/ui/Alert';
import { ArrowLeft } from 'lucide-react';

const NewTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedProjects = await projectService.getAllProjects();
        const fetchedUsers = await userService.getAllUsers();
        setProjects(fetchedProjects);
        setUsers(fetchedUsers);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const newTask = await taskService.createTask(formData);
      console.log('Task created successfully:', newTask);
      console.log(formData);
      //navigate(`/tasks/${newTask.id}`);
      navigate('/tasks');
    } catch (err) {
      console.error('Failed to create task:', err);
      console.log(formData);
      setError(err instanceof Error ? err.message : 'Failed to create task');
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <CardHeader className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          </CardHeader>

          <CardBody className="py-6">
            {error && (
              <Alert
                variant="error"
                title="Error"
                className="mb-6"
              >
                {error}
              </Alert>
            )}

            <TaskForm
              projects={projects}
              users={users}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default NewTaskPage;
