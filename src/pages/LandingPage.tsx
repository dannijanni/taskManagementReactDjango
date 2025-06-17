import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Calendar, 
  Users, 
  Clock,
  BarChart4,
  Shield
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Manage tasks with</span>
                <span className="block text-blue-600">effortless clarity</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                TaskFlow helps teams organize, track, and manage their work with a beautifully simple interface.
              </p>
              <div className="mt-8 sm:mt-10 flex justify-center">
                <div className="rounded-md shadow">
                  <Link to="/register">
                    <Button size="lg" variant="primary">
                      Get Started
                    </Button>
                  </Link>
                </div>
                <div className="ml-3">
                  <Link to="/login">
                    <Button size="lg" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Designed for productivity
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to manage tasks efficiently in one place.
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="transform transition-all duration-200 hover:scale-105">
                <CardBody className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-5">
                    <CheckSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Intuitive Task Management</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Create, organize, and track tasks with a clean and intuitive interface.
                  </p>
                </CardBody>
              </Card>
              
              <Card className="transform transition-all duration-200 hover:scale-105">
                <CardBody className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white mb-5">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Project Organization</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Group tasks into projects and track progress across multiple initiatives.
                  </p>
                </CardBody>
              </Card>
              
              <Card className="transform transition-all duration-200 hover:scale-105">
                <CardBody className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-amber-500 text-white mb-5">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Role-Based Access</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Control who can view, edit, and manage tasks with powerful permission settings.
                  </p>
                </CardBody>
              </Card>
              
              <Card className="transform transition-all duration-200 hover:scale-105">
                <CardBody className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-5">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Due Date Tracking</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Never miss a deadline with clear due date visibility and priority markers.
                  </p>
                </CardBody>
              </Card>
              
              <Card className="transform transition-all duration-200 hover:scale-105">
                <CardBody className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-5">
                    <BarChart4 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Status Tracking</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Visualize progress with clear status indicators for every task.
                  </p>
                </CardBody>
              </Card>
              
              <Card className="transform transition-all duration-200 hover:scale-105">
                <CardBody className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mb-5">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Secure & Reliable</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Your data is protected with industry-standard security practices.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Try TaskFlow today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <CheckSquare className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">TaskFlow</span>
          </div>
          <div className="mt-8 text-center text-gray-500">
            <p>&copy; 2025 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;