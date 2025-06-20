import React from 'react';
import { Badge } from './badge';
import { CheckCircle, Clock, Eye, Star, X } from 'lucide-react';

interface StatusBadgeProps {
  status: string | number;
  variant?: 'default' | 'with-icon';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'default',
  size = 'sm'
}) => {
  const getStatusConfig = (status: string | number) => {
    const statusStr = typeof status === 'number' ? status.toString() : status.toLowerCase();
    
    switch (statusStr) {
      case '0':
      case 'pending':
        return {
          text: variant === 'with-icon' ? '⏳ Pending' : 'Pending',
          icon: Clock,
          badgeVariant: 'default' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case '1':
      case 'reviewed':
        return {
          text: variant === 'with-icon' ? '👀 Reviewed' : 'Reviewed',
          icon: Eye,
          badgeVariant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case '2':
      case 'shortlisted':
        return {
          text: variant === 'with-icon' ? '⭐ Shortlisted' : 'Shortlisted',
          icon: Star,
          badgeVariant: 'default' as const,
          className: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case '3':
      case 'accepted':
        return {
          text: variant === 'with-icon' ? '✅ Accepted' : 'Accepted',
          icon: CheckCircle,
          badgeVariant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case '4':
      case 'rejected':
        return {
          text: variant === 'with-icon' ? '❌ Rejected' : 'Rejected',
          icon: X,
          badgeVariant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          text: typeof status === 'string' ? status : 'Unknown',
          icon: Clock,
          badgeVariant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';

  return (
    <Badge 
      variant={config.badgeVariant}
      className={`${config.className} ${sizeClass} font-medium border`}
    >
      {config.text}
    </Badge>
  );
};

export default StatusBadge;
