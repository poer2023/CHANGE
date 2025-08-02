import React from 'react';
import { Card, Button, Input } from '@/components';
import { Search, Plus, Filter, MoreVertical } from 'lucide-react';

export const Papers: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Papers</h1>
          <p className="text-gray-600 mt-1">Manage your research papers and documents.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Paper
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search papers..."
              icon={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} hover className="h-fit">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  AI in Medical Diagnosis: A Comprehensive Review {i}
                </h3>
                <p className="text-sm text-gray-600">
                  Last edited 2 hours ago
                </p>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            
            <p className="text-sm text-gray-700 mb-4 line-clamp-3">
              This paper explores the current state and future prospects of artificial intelligence 
              applications in medical diagnosis, covering machine learning algorithms, 
              deep learning models, and their clinical implementations...
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                  Draft
                </span>
                <span className="text-xs text-gray-500">2,431 words</span>
              </div>
              <Button size="sm" variant="ghost">
                Open
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};