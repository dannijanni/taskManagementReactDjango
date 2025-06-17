import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { formatDate } from '../lib/utils';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
        
        <Card className="mb-6">
          <CardHeader className="border-b border-gray-200 pb-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <User className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardBody className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Role</span>
                    <p className="font-medium text-gray-900 capitalize">{user.role}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Account Created</span>
                    <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    leftIcon={<Settings className="h-5 w-5" />}
                    onClick={() => navigate('/profile/settings')}
                  >
                    Account Settings
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:bg-red-50"
                    leftIcon={<LogOut className="h-5 w-5" />}
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;