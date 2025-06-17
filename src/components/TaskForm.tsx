import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import Button from './ui/Button';
import { Task, Project, User } from '../types';
import { format } from 'date-fns';

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  dueDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Please enter a valid date',
  }),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['To Do', 'In Progress', 'Open', 'Closed']),
  projectId: z.string().optional(),
  assignedTo: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  projects: Project[];
  users: User[];
  onSubmit: (data: TaskFormData) => void;
  isSubmitting: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  projects,
  users,
  onSubmit,
  isSubmitting
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || '',
          dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd'),
          priority:
            task.priority === 'low' || task.priority === 'medium' || task.priority === 'high'
              ? task.priority
              : 'medium',
          status:
            ['To Do', 'In Progress', 'Closed', 'Open'].includes(String(task.status))
              ? (task.status as 'To Do' | 'In Progress' | 'Closed' | 'Open')
              : 'To Do',
          projectId: task.projectId || '',
          assignedTo: task.assignedTo ? String(task.assignedTo) : '',
        }
      : {
          title: '',
          description: '',
          dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          priority: 'medium',
          status: 'To Do',
          projectId: '',
          assignedTo: '',
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input
            label="Title"
            error={errors.title?.message}
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

      <Controller
        name="dueDate"
        control={control}
        render={({ field }) => (
          <Input
            type="date"
            label="Due Date"
            error={errors.dueDate?.message}
            fullWidth
            required
            {...field}
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select
              label="Priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              error={errors.priority?.message}
              fullWidth
              {...field}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              options={[
                { value: 'To Do', label: 'Pending' },
                { value: 'In Progress', label: 'Started' },
                { value: 'Open', label: 'Waiting' },
                { value: 'Closed', label: 'Done' },
              ]}
              error={errors.status?.message}
              fullWidth
              {...field}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <Controller
        name="projectId"
        control={control}
        render={({ field }) => (
          <Select
            label="Project"
            options={[
              { value: '', label: 'None' },
              ...projects.map(project => ({
                value: String(project.id),
                label: project.name,
              })),
            ]}
            error={errors.projectId?.message}
            fullWidth
            {...field}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="assignedTo"
        control={control}
        render={({ field }) => (
          <Select
            label="Assign To"
            options={[
              { value: '', label: 'None' },
              ...users.map(user => ({
                value: String(user.id),
                label: user.full_name ?? user.name,
              })),
            ]}
            error={errors.assignedTo?.message}
            fullWidth
            {...field}
            onChange={field.onChange}
          />
        )}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
