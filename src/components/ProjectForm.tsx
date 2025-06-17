import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import { Project } from '../types';

const projectSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectFormData) => void;
  isSubmitting: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  project, 
  onSubmit, 
  isSubmitting 
}) => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project 
      ? {
          ...project,
        }
      : {
          name: '',
          description: '',
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            label="Project Name"
            error={errors.name?.message}
            fullWidth
            required
            {...field}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Textarea
            label="Description"
            error={errors.description?.message}
            fullWidth
            {...field}
          />
        )}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;