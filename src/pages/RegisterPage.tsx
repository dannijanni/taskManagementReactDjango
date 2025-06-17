import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { Mail, Lock, User, CheckSquare } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
  });
  
  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    clearError();
    
    try {
      await register(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Error is handled by the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CheckSquare className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardBody className="p-8">
            {error && (
              <Alert
                variant="error"
                title="Registration Failed"
                className="mb-4"
              >
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Full Name"
                    autoComplete="name"
                    required
                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                    error={errors.name?.message}
                    fullWidth
                    {...field}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    required
                    leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                    error={errors.email?.message}
                    fullWidth
                    {...field}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    required
                    leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                    error={errors.password?.message}
                    fullWidth
                    {...field}
                  />
                )}
              />

              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Role"
                    options={[
                      { value: 'user', label: 'Standard User' },
                      { value: 'admin', label: 'Administrator' },
                    ]}
                    error={errors.role?.message}
                    fullWidth
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />

              <div>
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isSubmitting}
                >
                  Sign up
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;