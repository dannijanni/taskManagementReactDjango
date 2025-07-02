import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import ProjectForm from '../components/ProjectForm';
import Alert from '../components/ui/Alert';
import { ArrowLeft } from 'lucide-react';


const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newProject = await projectService.createProject(formData);
      console.log('Project created successfully:', newProject);
      console.log(formData);
      navigate(`/projects/${newProject.id}`);
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/projects"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>
        </div>
        
        <Card>
          <CardHeader className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
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
            
            <ProjectForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default NewProjectPage;