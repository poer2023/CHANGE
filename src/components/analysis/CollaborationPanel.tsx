/**
 * 协作和版本管理组件
 * 提供多人协作支持、版本对比、评论批注、变更历史追踪等功能
 */

import React, { useState, useEffect } from 'react';
import { Paper, User } from '../../types';

interface CollaborationPanelProps {
  paper: Paper;
  currentUser: User;
  collaborators: User[];
  versions: PaperVersion[];
  comments: Comment[];
  onInviteCollaborator?: (email: string, role: CollaboratorRole) => void;
  onCreateVersion?: (description: string) => void;
  onRestoreVersion?: (versionId: string) => void;
  onAddComment?: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  onResolveComment?: (commentId: string) => void;
  isLoading?: boolean;
}

interface PaperVersion {
  id: string;
  version: string;
  description: string;
  createdBy: User;
  createdAt: Date;
  wordCount: number;
  changes: VersionChange[];
  isAutoSave: boolean;
  tags: string[];
}

interface VersionChange {
  type: 'addition' | 'deletion' | 'modification';
  section: string;
  content: string;
  position: number;
  author: User;
}

interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  section?: string;
  position?: number;
  resolved: boolean;
  replies: CommentReply[];
  type: 'comment' | 'suggestion' | 'approval' | 'question';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

interface CommentReply {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
}

type CollaboratorRole = 'owner' | 'editor' | 'reviewer' | 'viewer';

interface CollaboratorPermission {
  role: CollaboratorRole;
  canEdit: boolean;
  canComment: boolean;
  canInvite: boolean;
  canManageVersions: boolean;
  canDelete: boolean;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  paper,
  currentUser,
  collaborators,
  versions,
  comments,
  onInviteCollaborator,
  onCreateVersion,
  onRestoreVersion,
  onAddComment,
  onResolveComment,
  isLoading = false
}) => {
  const [selectedTab, setSelectedTab] = useState<'collaborators' | 'versions' | 'comments' | 'activity'>('collaborators');
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showVersionDiff, setShowVersionDiff] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<CollaboratorRole>('reviewer');
  const [commentFilter, setCommentFilter] = useState<'all' | 'unresolved' | 'my-comments'>('all');

  const getCollaboratorPermissions = (role: CollaboratorRole): CollaboratorPermission => {
    const permissions: Record<CollaboratorRole, CollaboratorPermission> = {
      owner: {
        role: 'owner',
        canEdit: true,
        canComment: true,
        canInvite: true,
        canManageVersions: true,
        canDelete: true
      },
      editor: {
        role: 'editor',
        canEdit: true,
        canComment: true,
        canInvite: false,
        canManageVersions: true,
        canDelete: false
      },
      reviewer: {
        role: 'reviewer',
        canEdit: false,
        canComment: true,
        canInvite: false,
        canManageVersions: false,
        canDelete: false
      },
      viewer: {
        role: 'viewer',
        canEdit: false,
        canComment: false,
        canInvite: false,
        canManageVersions: false,
        canDelete: false
      }
    };
    return permissions[role];
  };

  const getRoleColor = (role: CollaboratorRole) => {
    const colors = {
      owner: 'bg-purple-100 text-purple-800',
      editor: 'bg-blue-100 text-blue-800',
      reviewer: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    return colors[role];
  };

  const getRoleLabel = (role: CollaboratorRole) => {
    const labels = {
      owner: '所有者',
      editor: '编辑者',
      reviewer: '审阅者',
      viewer: '查看者'
    };
    return labels[role];
  };

  const getCommentTypeIcon = (type: string) => {
    const icons = {
      comment: '💬',
      suggestion: '💡',
      approval: '✅',
      question: '❓'
    };
    return icons[type as keyof typeof icons] || '💬';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'border-red-200 bg-red-50',
      medium: 'border-yellow-200 bg-yellow-50',
      low: 'border-blue-200 bg-blue-50'
    };
    return colors[priority as keyof typeof colors] || 'border-gray-200 bg-gray-50';
  };

  const filteredComments = comments.filter(comment => {
    switch (commentFilter) {
      case 'unresolved':
        return !comment.resolved;
      case 'my-comments':
        return comment.author.id === currentUser.id;
      default:
        return true;
    }
  });

  const renderCollaboratorsTab = () => (
    <div className="space-y-6">
      {/* 邀请协作者 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">邀请协作者</h3>
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱地址
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="输入协作者邮箱"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              角色
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as CollaboratorRole)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="reviewer">审阅者</option>
              <option value="editor">编辑者</option>
              <option value="viewer">查看者</option>
            </select>
          </div>
          <button
            onClick={() => {
              if (inviteEmail && onInviteCollaborator) {
                onInviteCollaborator(inviteEmail, inviteRole);
                setInviteEmail('');
              }
            }}
            disabled={!inviteEmail}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            邀请
          </button>
        </div>
      </div>

      {/* 协作者列表 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">协作者 ({collaborators.length + 1})</h3>
        <div className="space-y-3">
          {/* 当前用户 */}
          <CollaboratorCard
            user={currentUser}
            role="owner"
            isCurrentUser={true}
            onRoleChange={() => {}}
            onRemove={() => {}}
          />
          
          {/* 其他协作者 */}
          {collaborators.map((collaborator) => (
            <CollaboratorCard
              key={collaborator.id}
              user={collaborator}
              role="reviewer" // 实际应该从数据获取
              isCurrentUser={false}
              onRoleChange={(newRole) => {
                console.log(`Change ${collaborator.name} role to ${newRole}`);
              }}
              onRemove={() => {
                console.log(`Remove ${collaborator.name}`);
              }}
            />
          ))}
        </div>
      </div>

      {/* 权限说明 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">权限说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { role: 'owner' as CollaboratorRole, description: '拥有所有权限，可以管理协作者和删除论文' },
            { role: 'editor' as CollaboratorRole, description: '可以编辑内容、添加评论、管理版本' },
            { role: 'reviewer' as CollaboratorRole, description: '可以查看内容、添加评论和建议' },
            { role: 'viewer' as CollaboratorRole, description: '只能查看内容，无法编辑或评论' }
          ].map((item) => (
            <div key={item.role} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(item.role)}`}>
                  {getRoleLabel(item.role)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVersionsTab = () => (
    <div className="space-y-6">
      {/* 创建新版本 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">创建新版本</h3>
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              版本描述
            </label>
            <input
              type="text"
              placeholder="描述这个版本的主要变更..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => onCreateVersion?.('手动创建的版本')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            创建版本
          </button>
        </div>
      </div>

      {/* 版本对比 */}
      {selectedVersions.length === 2 && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">版本对比</h3>
            <button
              onClick={() => setShowVersionDiff(!showVersionDiff)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {showVersionDiff ? '隐藏' : '显示'}对比
            </button>
          </div>
          
          {showVersionDiff && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-center text-gray-600">版本对比功能将在这里显示</p>
              {/* 这里会显示详细的版本差异对比 */}
            </div>
          )}
        </div>
      )}

      {/* 版本历史 */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">版本历史</h3>
          <div className="text-sm text-gray-500">
            {selectedVersions.length > 0 && `已选择 ${selectedVersions.length} 个版本`}
          </div>
        </div>

        <div className="space-y-3">
          {versions.map((version, index) => (
            <VersionCard
              key={version.id}
              version={version}
              isLatest={index === 0}
              isSelected={selectedVersions.includes(version.id)}
              onSelect={(selected) => {
                if (selected) {
                  if (selectedVersions.length < 2) {
                    setSelectedVersions([...selectedVersions, version.id]);
                  }
                } else {
                  setSelectedVersions(selectedVersions.filter(id => id !== version.id));
                }
              }}
              onRestore={() => onRestoreVersion?.(version.id)}
              canSelect={selectedVersions.length < 2 || selectedVersions.includes(version.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderCommentsTab = () => (
    <div className="space-y-6">
      {/* 添加评论 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">添加评论</h3>
        <div className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="输入您的评论或建议..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                <option value="comment">评论</option>
                <option value="suggestion">建议</option>
                <option value="question">问题</option>
                <option value="approval">认可</option>
              </select>
              <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                <option value="low">低优先级</option>
                <option value="medium">中优先级</option>
                <option value="high">高优先级</option>
              </select>
            </div>
            <button
              onClick={() => {
                if (newComment.trim() && onAddComment) {
                  onAddComment({
                    content: newComment,
                    author: currentUser,
                    section: '全文',
                    resolved: false,
                    replies: [],
                    type: 'comment',
                    priority: 'medium',
                    tags: []
                  });
                  setNewComment('');
                }
              }}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              添加评论
            </button>
          </div>
        </div>
      </div>

      {/* 评论过滤 */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={() => setCommentFilter('all')}
              className={`px-3 py-1 rounded text-sm ${
                commentFilter === 'all' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              全部 ({comments.length})
            </button>
            <button
              onClick={() => setCommentFilter('unresolved')}
              className={`px-3 py-1 rounded text-sm ${
                commentFilter === 'unresolved' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              未解决 ({comments.filter(c => !c.resolved).length})
            </button>
            <button
              onClick={() => setCommentFilter('my-comments')}
              className={`px-3 py-1 rounded text-sm ${
                commentFilter === 'my-comments' 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              我的评论 ({comments.filter(c => c.author.id === currentUser.id).length})
            </button>
          </div>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          评论列表 ({filteredComments.length})
        </h3>
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onResolve={() => onResolveComment?.(comment.id)}
              onReply={(replyContent) => {
                console.log(`Reply to comment ${comment.id}: ${replyContent}`);
              }}
            />
          ))}
          
          {filteredComments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>暂无评论</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-6">
      {/* 活动时间线 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
        <div className="space-y-4">
          <ActivityItem
            user={currentUser}
            action="创建了新版本 v1.3"
            time="2小时前"
            type="version"
          />
          <ActivityItem
            user={collaborators[0] || currentUser}
            action="添加了评论到第三章"
            time="4小时前"
            type="comment"
          />
          <ActivityItem
            user={currentUser}
            action="邀请了新的协作者"
            time="昨天"
            type="collaboration"
          />
          <ActivityItem
            user={collaborators[0] || currentUser}
            action="修改了论文标题"
            time="2天前"
            type="edit"
          />
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{versions.length}</div>
          <div className="text-sm text-gray-500">版本数量</div>
        </div>
        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="text-2xl font-bold text-green-600">
            {comments.filter(c => !c.resolved).length}
          </div>
          <div className="text-sm text-gray-500">待解决评论</div>
        </div>
        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">{collaborators.length + 1}</div>
          <div className="text-sm text-gray-500">协作者</div>
        </div>
        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">5</div>
          <div className="text-sm text-gray-500">今日活动</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* 头部 */}
        <div className="mb-6 bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">协作与版本管理</h1>
              <p className="text-gray-600">
                管理论文《{paper.title}》的协作者、版本历史和评论反馈
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">最后更新:</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* 标签导航 */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { key: 'collaborators', label: '协作者', count: collaborators.length + 1 },
              { key: 'versions', label: '版本历史', count: versions.length },
              { key: 'comments', label: '评论', count: comments.filter(c => !c.resolved).length },
              { key: 'activity', label: '活动记录' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ${
                  selectedTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedTab === tab.key
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* 内容区域 */}
        <div className="min-h-96">
          {selectedTab === 'collaborators' && renderCollaboratorsTab()}
          {selectedTab === 'versions' && renderVersionsTab()}
          {selectedTab === 'comments' && renderCommentsTab()}
          {selectedTab === 'activity' && renderActivityTab()}
        </div>
      </div>
    </div>
  );
};

// 协作者卡片组件
interface CollaboratorCardProps {
  user: User;
  role: CollaboratorRole;
  isCurrentUser: boolean;
  onRoleChange: (newRole: CollaboratorRole) => void;
  onRemove: () => void;
}

const CollaboratorCard: React.FC<CollaboratorCardProps> = ({
  user,
  role,
  isCurrentUser,
  onRoleChange,
  onRemove
}) => {
  const getRoleColor = (role: CollaboratorRole) => {
    const colors = {
      owner: 'bg-purple-100 text-purple-800',
      editor: 'bg-blue-100 text-blue-800',
      reviewer: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    return colors[role];
  };

  const getRoleLabel = (role: CollaboratorRole) => {
    const labels = {
      owner: '所有者',
      editor: '编辑者',
      reviewer: '审阅者',
      viewer: '查看者'
    };
    return labels[role];
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
          ) : (
            <span className="text-sm font-medium text-gray-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">{user.name}</span>
            {isCurrentUser && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">您</span>
            )}
          </div>
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(role)}`}>
          {getRoleLabel(role)}
        </span>
        
        {!isCurrentUser && (
          <div className="flex space-x-2">
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value as CollaboratorRole)}
              className="text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="editor">编辑者</option>
              <option value="reviewer">审阅者</option>
              <option value="viewer">查看者</option>
            </select>
            <button
              onClick={onRemove}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              移除
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 版本卡片组件
interface VersionCardProps {
  version: PaperVersion;
  isLatest: boolean;
  isSelected: boolean;
  canSelect: boolean;
  onSelect: (selected: boolean) => void;
  onRestore: () => void;
}

const VersionCard: React.FC<VersionCardProps> = ({
  version,
  isLatest,
  isSelected,
  canSelect,
  onSelect,
  onRestore
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`border rounded-lg p-4 ${isSelected ? 'border-blue-500 bg-blue-50' : 'hover:shadow-sm'} transition-all`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            disabled={!canSelect}
            className="mt-1 rounded text-blue-600 focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-900">{version.version}</span>
              {isLatest && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">最新</span>
              )}
              {version.isAutoSave && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">自动保存</span>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">{version.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>创建者: {version.createdBy.name}</span>
              <span>{formatDate(version.createdAt)}</span>
              <span>{version.wordCount.toLocaleString()} 字</span>
            </div>
            
            {version.changes.length > 0 && (
              <div className="mt-2 text-xs">
                <span className="text-gray-600">主要变更: </span>
                <span className="text-gray-800">
                  {version.changes.slice(0, 3).map(change => change.section).join(', ')}
                  {version.changes.length > 3 && '...'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {/* 查看详情 */}}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            查看
          </button>
          {!isLatest && (
            <button
              onClick={onRestore}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              恢复
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 评论卡片组件
interface CommentCardProps {
  comment: Comment;
  currentUser: User;
  onResolve: () => void;
  onReply: (content: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  currentUser,
  onResolve,
  onReply
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const getCommentTypeIcon = (type: string) => {
    const icons = {
      comment: '💬',
      suggestion: '💡',
      approval: '✅',
      question: '❓'
    };
    return icons[type as keyof typeof icons] || '💬';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'border-red-200 bg-red-50',
      medium: 'border-yellow-200 bg-yellow-50',
      low: 'border-blue-200 bg-blue-50'
    };
    return colors[priority as keyof typeof colors] || 'border-gray-200 bg-gray-50';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`border rounded-lg p-4 ${getPriorityColor(comment.priority)} ${
      comment.resolved ? 'opacity-60' : ''
    }`}>
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          {comment.author.avatar ? (
            <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full" />
          ) : (
            <span className="text-xs font-medium text-gray-600">
              {comment.author.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">{comment.author.name}</span>
            <span className="text-lg">{getCommentTypeIcon(comment.type)}</span>
            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
            {comment.section && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {comment.section}
              </span>
            )}
            {comment.resolved && (
              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">
                已解决
              </span>
            )}
          </div>
          
          <p className="text-gray-700 mb-3">{comment.content}</p>
          
          <div className="flex items-center space-x-4 text-sm">
            {!comment.resolved && (
              <button
                onClick={onResolve}
                className="text-green-600 hover:text-green-800"
              >
                解决
              </button>
            )}
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-blue-600 hover:text-blue-800"
            >
              {comment.replies.length > 0 ? `回复 (${comment.replies.length})` : '回复'}
            </button>
          </div>
          
          {/* 回复列表 */}
          {showReplies && (
            <div className="mt-3 ml-4 space-y-2">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex items-start space-x-2 p-2 bg-white rounded">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-600">
                      {reply.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-800">{reply.author.name}</span>
                      <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{reply.content}</p>
                  </div>
                </div>
              ))}
              
              {/* 添加回复 */}
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-white">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="添加回复..."
                    rows={2}
                    className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex justify-end mt-1 space-x-2">
                    <button
                      onClick={() => setReplyContent('')}
                      className="text-xs text-gray-600 hover:text-gray-800"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => {
                        if (replyContent.trim()) {
                          onReply(replyContent);
                          setReplyContent('');
                        }
                      }}
                      disabled={!replyContent.trim()}
                      className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      回复
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 活动项组件
interface ActivityItemProps {
  user: User;
  action: string;
  time: string;
  type: 'version' | 'comment' | 'collaboration' | 'edit';
}

const ActivityItem: React.FC<ActivityItemProps> = ({ user, action, time, type }) => {
  const getTypeIcon = (type: string) => {
    const icons = {
      version: '📋',
      comment: '💬',
      collaboration: '👥',
      edit: '✏️'
    };
    return icons[type as keyof typeof icons] || '📝';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      version: 'bg-blue-100',
      comment: 'bg-green-100',
      collaboration: 'bg-purple-100',
      edit: 'bg-yellow-100'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100';
  };

  return (
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-full ${getTypeColor(type)}`}>
        <span className="text-sm">{getTypeIcon(type)}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{user.name}</span> {action}
        </p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};

export default CollaborationPanel;