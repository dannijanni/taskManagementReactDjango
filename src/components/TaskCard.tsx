import React from 'react';
import { Task } from '../types';
import Badge from './ui/Badge';
import { Card, CardBody } from './ui/Card';
import { formatDate, getPriorityColor, getStatusColor } from '../lib/utils';
import { CalendarDays } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <div
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full"
      onClick={onClick}
    >
      <Card>
        <CardBody>
          <h3 className="font-medium text-lg mb-2 line-clamp-1">{task.title}</h3>
          
          {task.description && (
            <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{task.description}</p>
          )}
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            
            <Badge className={getStatusColor(task.status)}>
  {task.status === 'Open' 
    ? 'To Do' 
    : task.status === 'In Progress' 
      ? 'In Progress' 
      : 'Completed'}
</Badge>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TaskCard;