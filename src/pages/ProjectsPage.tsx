import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus, Search, Layers, Calendar, Users } from 'lucide-react';
import { formatDate } from '../lib/utils';

const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const fetchedProjects = await projectService.getAllProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };
  
  // Apply search
  const filteredProjects = projects.filter(project => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        project.name.toLowerCase().includes(query) ||
        (project.description && project.description.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-gray-500">
              Manage and organize all your projects
            </p>
          </div>
          {user?.role === 'admin' && (
            <div className="mt-4 md:mt-0">
              <Link to="/projects/new">
                <Button
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  New Project
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            className="max-w-md"
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <Card 
                  key={project.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                >
                  <CardBody className="p-6">
                    <div
                      onClick={() => handleProjectClick(project.id)}
                      role="button"
                      tabIndex={0}
                      className="outline-none"
                      style={{ cursor: 'pointer' }}
                      onKeyPress={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleProjectClick(project.id);
                        }
                      }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                          <Layers className="h-6 w-6" />
                        </div>
                        <h3 className="ml-3 text-xl font-medium text-gray-900">{project.name}</h3>
                      </div>
                      
                      {project.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                      )}
                      
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Created: {formatDate(project.createdAt, 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 mb-4">No projects found matching your criteria</p>
                {searchQuery ? (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                ) : (
                  user?.role === 'admin' && (
                    <Link to="/projects/new">
                      <Button
                        leftIcon={<Plus className="h-4 w-4" />}
                      >
                        Create Project
                      </Button>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;