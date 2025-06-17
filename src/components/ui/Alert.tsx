import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className,
}) => {
  const variantStyles = {
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      content: 'text-blue-700',
      Icon: Info,
    },
    success: {
      container: 'bg-green-50 border-green-200',
      icon: 'text-green-400',
      title: 'text-green-800',
      content: 'text-green-700',
      Icon: CheckCircle,
    },
    warning: {
      container: 'bg-amber-50 border-amber-200',
      icon: 'text-amber-400',
      title: 'text-amber-800',
      content: 'text-amber-700',
      Icon: AlertCircle,
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-400',
      title: 'text-red-800',
      content: 'text-red-700',
      Icon: XCircle,
    },
  };

  const { container, icon, title: titleStyle, content, Icon } = variantStyles[variant];

  return (
    <div className={cn('p-4 border-l-4 rounded-md', container, className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', icon)} />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={cn('text-sm font-medium', titleStyle)}>
              {title}
            </h3>
          )}
          <div className={cn('text-sm', content)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;