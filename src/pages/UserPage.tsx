import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userServices';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import UserForm from '../components/UserForm';
import { Search, Plus, User, Mail, Shield } from 'lucide-react';

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const fetchedUsers = await userService.getAllUsers();
        console.log('Fetched users:', fetchedUsers); // Log the fetched users
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getRoleName = (role: any) => {
    console.log('Role data:', role); // Log the role data
    if (typeof role === 'number') {
      switch (role) {
        case 1:
          return 'Standard User';
        case 2:
          return 'Administrator';
        default:
          return 'Unknown Role';
      }
    } else if (typeof role === 'string') {
      switch (role.toLowerCase()) {
        case 'user':
          return 'Standard User';
        case 'admin':
          return 'Administrator';
        default:
          return 'Unknown Role';
      }
    } else {
      return 'Unknown Role';
    }
  };

  const handleCreateUser = async (userData: any) => {
    setIsSubmitting(true);
    try {
      const newUser = await userService.createUser(userData);
      setUsers([...users, newUser]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (userData: any) => {
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      const updatedUser = await userService.updateUser(currentUser.id, userData);
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (user: any) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="mt-1 text-gray-500">Manage and organize all your users</p>
          </div>
          {/* {user?.role === 'admin' && (
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                New User
              </Button>
            </div>
          )} */}
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search users..."
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <Card key={user.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                  <CardBody className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <User className="h-6 w-6" />
                      </div>
                      <h3 className="ml-3 text-xl font-medium text-gray-900">{user.name}</h3>
                    </div>

                    <div className="flex items-center text-gray-500 mb-2">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{user.email}</span>
                    </div>

                    <div className="flex items-center text-gray-500">
                      <Shield className="h-4 w-4 mr-2" />
                      <span>{getRoleName(user.role || user.role_id)}</span>
                    </div>

                    {user?.role === 'admin' && (
                      <div className="mt-4">
                        <Button
                          onClick={() => handleEditClick(user)}
                          size="sm"
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 mb-4">No users found matching your criteria</p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create User"
        >
          <UserForm
            onSubmit={handleCreateUser}
            isSubmitting={isSubmitting}
          />
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit User"
        >
          <UserForm
            user={currentUser}
            onSubmit={handleUpdateUser}
            isSubmitting={isSubmitting}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UsersPage;
