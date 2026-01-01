import React, { useState } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminTable, { StatusBadge } from '@/components/admin/AdminTable';
import { mockPayments, formatCurrency, formatDate, type MockPayment } from '@/lib/mockAdminData';
import { useToast } from '@/hooks/use-toast';

const Payments = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter payments based on search and status
  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.communityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Payment data is being exported to CSV...",
    });
  };

  const columns = [
    {
      key: 'id',
      label: 'Payment ID',
      width: '15%',
      render: (value: string, row: MockPayment) => (
        <div>
          <div className="font-mono text-sm text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.razorpayOrderId}</div>
        </div>
      )
    },
    {
      key: 'userEmail',
      label: 'User',
      width: '20%',
      render: (value: string, row: MockPayment) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">ID: {row.userId}</div>
        </div>
      )
    },
    {
      key: 'communityName',
      label: 'Community',
      width: '25%',
      render: (value: string) => (
        <span className="text-gray-900">{value}</span>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      width: '12%',
      render: (value: number) => (
        <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: 'date',
      label: 'Date',
      width: '16%',
      render: (value: string) => (
        <span className="text-sm text-gray-500">{formatDate(value)}</span>
      )
    }
  ];

  const actions = [
    {
      label: 'View',
      onClick: (payment: MockPayment) => {
        toast({
          title: "Payment Details",
          description: `Viewing details for payment ${payment.id}`,
        });
      },
      variant: 'outline' as const
    }
  ];

  // Calculate stats
  const stats = {
    total: filteredPayments.length,
    completed: filteredPayments.filter(p => p.status === 'completed').length,
    pending: filteredPayments.filter(p => p.status === 'pending').length,
    failed: filteredPayments.filter(p => p.status === 'failed').length,
    totalAmount: filteredPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-1">Monitor and track all payment transactions</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="w-6 h-6 bg-green-600 rounded"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="w-6 h-6 bg-yellow-600 rounded"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="w-6 h-6 bg-purple-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by user, community, or payment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <AdminTable
        data={filteredPayments}
        columns={columns}
        actions={actions}
        emptyMessage="No payments found matching your criteria"
      />

      {/* Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {((stats.completed / stats.total) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {formatCurrency(stats.totalAmount / stats.completed || 0)}
            </div>
            <div className="text-sm text-gray-600">Average Transaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {stats.failed}
            </div>
            <div className="text-sm text-gray-600">Failed Transactions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;