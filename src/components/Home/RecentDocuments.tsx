import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Grid3X3,
  List,
  Filter,
  MoreHorizontal,
  PenTool,
  Eye,
  Download,
  Share,
  Edit,
  Archive,
  Trash2,
  FileImage,
  Plus,
  Upload,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocItem, HomeFilters, DocStatus } from '@/types/home';
import { getStatusLabel, getStatusBadgeVariant } from '@/lib/mockHomeData';
import { useTranslation } from '@/hooks/useTranslation';

interface RecentDocumentsProps {
  documents: DocItem[];
  filters: HomeFilters;
  onFiltersChange: (filters: HomeFilters) => void;
  onDocumentAction: (doc: DocItem, action: string) => void;
}

const RecentDocuments: React.FC<RecentDocumentsProps> = ({
  documents,
  filters,
  onFiltersChange,
  onDocumentAction
}) => {
  const { t } = useTranslation();
  const [localSearch, setLocalSearch] = useState('');

  const handleStatusFilter = (status: DocStatus | 'all') => {
    onFiltersChange({ ...filters, status });
  };

  const handleSortChange = (sortBy: string) => {
    const newOrder = filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    onFiltersChange({ ...filters, sortBy: sortBy as any, sortOrder: newOrder });
  };

  const handleViewChange = (view: 'table' | 'cards') => {
    onFiltersChange({ ...filters, view });
  };

  const handleSearchChange = (search: string) => {
    setLocalSearch(search);
    // Debounce the actual filter update
    const timeoutId = setTimeout(() => {
      onFiltersChange({ ...filters, search });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('recent.time.just_now');
    if (diffMins < 60) return t('recent.time.minutes_ago').replace('${minutes}', diffMins.toString());
    if (diffHours < 24) return t('recent.time.hours_ago').replace('${hours}', diffHours.toString());
    if (diffDays < 7) return t('recent.time.days_ago').replace('${days}', diffDays.toString());
    
    return date.toLocaleDateString('zh-CN', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: DocStatus) => {
    const label = getStatusLabel(status);
    
    switch (status) {
      case 'draft':
        return (
          <Badge variant="draft" className="text-xs">
            {label}
          </Badge>
        );
      case 'generating':
        return (
          <Badge variant="running" className="text-xs">
            {label}
          </Badge>
        );
      case 'ready':
        return (
          <Badge variant="ready" className="text-xs">
            {label}
          </Badge>
        );
      case 'gate1':
        return (
          <Badge variant="gate1" className="text-xs">
            {label}
          </Badge>
        );
      case 'addon':
        return (
          <Badge variant="addon" className="text-xs">
            {label}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {label}
          </Badge>
        );
    }
  };

  const getActionButton = (doc: DocItem) => {
    switch (doc.status) {
      case 'draft':
        return (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1 rounded-xl"
            onClick={() => onDocumentAction(doc, 'continue')}
          >
            <PenTool className="size-3" />
            {t('recent.continue_writing')}
          </Button>
        );
      case 'generating':
        return (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1 rounded-xl"
            disabled
          >
            {t('recent.generating')}
          </Button>
        );
      case 'ready':
        return (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1 rounded-xl"
            onClick={() => onDocumentAction(doc, 'view')}
          >
            <Eye className="size-3" />
            {t('recent.view_result')}
          </Button>
        );
      case 'gate1':
        return (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1 text-amber-600 border-amber-200 hover:bg-amber-50 rounded-xl"
            onClick={() => onDocumentAction(doc, 'unlock')}
          >
            {t('recent.unlock_generate')}
          </Button>
        );
      case 'addon':
        return (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 rounded-xl"
            onClick={() => onDocumentAction(doc, 'export')}
          >
            <Download className="size-3" />
            {t('recent.export')}
          </Button>
        );
      default:
        return null;
    }
  };

  // Empty state
  if (documents.length === 0) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {t('recent.title')}
          </h2>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <FileImage className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">{t('recent.empty.title')}</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md leading-[1.4]">
              {t('recent.empty.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => onDocumentAction({} as DocItem, 'new')}
                className="gap-2 rounded-xl"
              >
                <Plus className="size-4" />
                {t('recent.empty.new_document')}
              </Button>
              <Button
                onClick={() => onDocumentAction({} as DocItem, 'upload')}
                variant="secondary"
                className="gap-2 rounded-xl"
              >
                <Upload className="size-4" />
                {t('recent.empty.upload_resources')}
              </Button>
              <Button
                onClick={() => onDocumentAction({} as DocItem, 'autopilot')}
                variant="outline"
                className="gap-2 rounded-xl"
              >
                <Zap className="size-4" />
                {t('recent.empty.autopilot')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 text-text">
            {t('recent.title')}
          </h2>
          <p className="text-body text-text-muted mt-1">
            {documents.length} {t('recent.document_count')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={filters.view === 'table' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2"
              onClick={() => handleViewChange('table')}
            >
              <List className="h-3 w-3" />
            </Button>
            <Button
              variant={filters.view === 'cards' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2"
              onClick={() => handleViewChange('cards')}
            >
              <Grid3X3 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status filter */}
        <Select value={filters.status} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('recent.filters.all')}</SelectItem>
            <SelectItem value="draft">{t('recent.filters.draft')}</SelectItem>
            <SelectItem value="generating">{t('recent.filters.generating')}</SelectItem>
            <SelectItem value="ready">{t('recent.filters.ready')}</SelectItem>
            <SelectItem value="gate1">{t('recent.filters.gate1')}</SelectItem>
            <SelectItem value="addon">{t('recent.filters.addon')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('recent.search_placeholder')}
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>

        {/* Sort */}
        <Select 
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-');
            onFiltersChange({ ...filters, sortBy: sortBy as any, sortOrder: sortOrder as any });
          }}
        >
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt-desc">{t('recent.sort.newest')}</SelectItem>
            <SelectItem value="updatedAt-asc">{t('recent.sort.oldest')}</SelectItem>
            <SelectItem value="title-asc">{t('recent.sort.title_az')}</SelectItem>
            <SelectItem value="title-desc">{t('recent.sort.title_za')}</SelectItem>
            <SelectItem value="words-desc">{t('recent.sort.most_words')}</SelectItem>
            <SelectItem value="words-asc">{t('recent.sort.least_words')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {filters.view === 'table' ? (
        <Card className="rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead
                  className="cursor-pointer hover:text-foreground w-[40%]"
                  onClick={() => handleSortChange('title')}
                >
                  {t('recent.table.filename')}
                </TableHead>
                <TableHead>{t('recent.table.status')}</TableHead>
                <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSortChange('words')}>
                  {t('recent.table.words')}
                </TableHead>
                <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSortChange('cites')}>
                  {t('recent.table.citations')}
                </TableHead>
                <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSortChange('updatedAt')}>
                  {t('recent.table.updated')}
                </TableHead>
                <TableHead className="w-32">{t('recent.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium text-sm line-clamp-2 pr-4">
                      {doc.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(doc.status)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {doc.words.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {doc.cites}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(doc.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getActionButton(doc)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem onClick={() => onDocumentAction(doc, 'continue')}>
                            <PenTool className="h-3 w-3 mr-2" />
                            {t('recent.actions.continue')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDocumentAction(doc, 'view')}>
                            <Eye className="h-3 w-3 mr-2" />
                            {t('recent.actions.view')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-3 w-3 mr-2" />
                            {t('recent.actions.rename')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-3 w-3 mr-2" />
                            {t('recent.actions.archive')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            <Trash2 className="h-3 w-3 mr-2" />
                            {t('recent.actions.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        // Cards view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-medium line-clamp-2 flex-1">
                    {doc.title}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onDocumentAction(doc, 'continue')}>
                        {t('recent.actions.continue')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDocumentAction(doc, 'view')}>
                        {t('recent.actions.view')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {getStatusBadge(doc.status)}
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{doc.words.toLocaleString()} {t('recent.words')}</span>
                  <span>{doc.cites} {t('recent.citations')}</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {formatDate(doc.updatedAt)}
                </div>

                {getActionButton(doc)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentDocuments;