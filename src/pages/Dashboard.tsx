import React from 'react';
import { Card, Button } from '@/components';
import { Plus, FileText, FolderOpen, TrendingUp, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your writing progress.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Paper
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="feature-icon">
              <FileText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">12</h3>
              <p className="text-sm text-gray-600">Active Papers</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="feature-icon">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">5</h3>
              <p className="text-sm text-gray-600">Projects</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="feature-icon">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">2,431</h3>
              <p className="text-sm text-gray-600">Words Today</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="feature-icon">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">3.2h</h3>
              <p className="text-sm text-gray-600">Writing Time</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Papers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Papers" className="h-fit">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Research Paper {i}</h4>
                  <p className="text-sm text-gray-600">Last edited 2 hours ago</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                  Draft
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Writing Progress" className="h-fit">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Daily Goal</span>
                <span className="text-sm text-gray-600">2,431 / 3,000 words</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '81%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Weekly Goal</span>
                <span className="text-sm text-gray-600">8,240 / 15,000 words</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-accent-600 h-2 rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;