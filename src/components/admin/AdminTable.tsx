import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStatusColor } from '@/lib/mockAdminData';

interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface Action {
  label: string;
  onClick: (row: any) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  disabled?: (row: any) => boolean;
  loading?: (row: any) => boolean;
}

interface AdminTableProps {
  data: any[];
  columns: Column[];
  actions?: Action[];
  loading?: boolean;
  emptyMessage?: string;
}

const AdminTable: React.FC<AdminTableProps> = ({
  data,
  columns,
  actions = [],
  loading = false,
  emptyMessage = 'No data available'
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : (
                      <span className="text-gray-900">{row[column.key]}</span>
                    )}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {actions.map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          size="sm"
                          variant={action.variant || 'outline'}
                          onClick={() => action.onClick(row)}
                          disabled={action.disabled ? action.disabled(row) : false}
                          className="min-w-[80px]"
                        >
                          {action.loading && action.loading(row) ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                          ) : (
                            action.label
                          )}
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Status Badge Component
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <Badge className={`${getStatusColor(status)} border font-medium`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </Badge>
);

export default AdminTable;