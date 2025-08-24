import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  ExternalLink, 
  AlertTriangle,
  BookOpen,
  Search,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

// 引用源类型定义
interface CitationSource {
  id: string;
  title: string;
  authors: string[];
  year?: number;
  doi?: string;
  pmid?: string;
  isbn?: string;
  journal?: string;
  pages?: string;
  volume?: string;
  issue?: string;
  url?: string;
  citationType: 'paper' | 'book' | 'web' | 'dataset';
  verificationStatus: 'pending' | 'checking' | 'verified' | 'failed' | 'not_found';
  verificationDetails?: {
    doiValid?: boolean;
    pmidValid?: boolean;
    isbnValid?: boolean;
    crossrefMatch?: boolean;
    pubmedMatch?: boolean;
    metadataConsistent?: boolean;
    lastChecked?: string;
    issues?: string[];
  };
  suggestedReplacements?: CitationSource[];
}

// 验证统计
interface VerificationStats {
  total: number;
  verified: number;
  failed: number;
  pending: number;
  checking: number;
}

// 模拟的引用数据
const mockCitations: CitationSource[] = [
  {
    id: '1',
    title: 'Machine Learning in Academic Research: A Comprehensive Survey',
    authors: ['Zhang, W.', 'Liu, X.', 'Chen, Y.'],
    year: 2023,
    doi: '10.1038/s41586-023-06291-2',
    journal: 'Nature',
    volume: '618',
    pages: '123-145',
    citationType: 'paper',
    verificationStatus: 'pending'
  },
  {
    id: '2',
    title: 'Deep Learning Fundamentals',
    authors: ['Smith, J.', 'Anderson, K.'],
    year: 2022,
    isbn: '978-0-123456-78-9',
    citationType: 'book',
    verificationStatus: 'pending'
  },
  {
    id: '3',
    title: 'Natural Language Processing Techniques',
    authors: ['Brown, M.'],
    year: 2024,
    doi: '10.1016/j.artint.2024.103847',
    pmid: '38123456',
    journal: 'Artificial Intelligence',
    volume: '328',
    pages: '103847',
    citationType: 'paper',
    verificationStatus: 'pending'
  },
  {
    id: '4',
    title: 'Outdated AI Research Methods',
    authors: ['Old, A.'],
    year: 2015,
    doi: '10.1000/invalid.doi.123',
    journal: 'Deprecated Journal',
    citationType: 'paper',
    verificationStatus: 'pending',
    suggestedReplacements: [
      {
        id: '4a',
        title: 'Modern AI Research Methods: Updated Approaches',
        authors: ['New, B.', 'Current, C.'],
        year: 2023,
        doi: '10.1038/s41586-023-updated',
        journal: 'Nature',
        citationType: 'paper',
        verificationStatus: 'verified'
      }
    ]
  },
  {
    id: '5',
    title: 'Statistical Analysis Framework',
    authors: ['Data, S.'],
    year: 2023,
    url: 'https://github.com/example/dataset',
    citationType: 'dataset',
    verificationStatus: 'pending'
  }
];

// 验证状态图标组件
const VerificationStatusIcon: React.FC<{ status: CitationSource['verificationStatus'] }> = ({ status }) => {
  switch (status) {
    case 'verified':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'failed':
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case 'checking':
      return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
    case 'not_found':
      return <AlertCircle className="w-4 h-4 text-orange-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

// 验证状态徽章组件
const VerificationBadge: React.FC<{ status: CitationSource['verificationStatus'] }> = ({ status }) => {
  const { t } = useTranslation();
  const getStatusInfo = () => {
    switch (status) {
      case 'verified':
        return { label: t('result.citation.status.verified'), className: 'bg-green-100 text-green-700 border-green-200' };
      case 'failed':
        return { label: t('result.citation.status.failed'), className: 'bg-red-100 text-red-700 border-red-200' };
      case 'checking':
        return { label: t('result.citation.status.checking'), className: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'not_found':
        return { label: t('result.citation.status.not_found'), className: 'bg-orange-100 text-orange-700 border-orange-200' };
      default:
        return { label: t('result.citation.status.pending'), className: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const { label, className } = getStatusInfo();
  return <Badge variant="outline" className={className}>{label}</Badge>;
};

// 单个引用项组件
const CitationItem: React.FC<{
  citation: CitationSource;
  onVerify: (id: string) => void;
  onReplace: (originalId: string, replacementId: string) => void;
}> = ({ citation, onVerify, onReplace }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* 标题和作者 */}
            <div className="flex items-center gap-2 mb-2">
              <VerificationStatusIcon status={citation.verificationStatus} />
              <h4 className="font-medium text-gray-900 truncate">{citation.title}</h4>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {citation.authors.join(', ')} ({citation.year || t('result.citation.no_date')})
            </p>

            {/* 基本信息 */}
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {citation.citationType === 'paper' ? t('result.citation.type.paper') : 
                 citation.citationType === 'book' ? t('result.citation.type.book') :
                 citation.citationType === 'dataset' ? t('result.citation.type.dataset') : t('result.citation.type.web')}
              </Badge>
              
              {citation.journal && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                  {citation.journal}
                </Badge>
              )}
              
              {citation.doi && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                  DOI: {citation.doi}
                </Badge>
              )}
              
              {citation.pmid && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                  PMID: {citation.pmid}
                </Badge>
              )}
              
              {citation.isbn && (
                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                  ISBN: {citation.isbn}
                </Badge>
              )}
            </div>
          </div>

          {/* 状态和操作 */}
          <div className="flex flex-col items-end gap-2">
            <VerificationBadge status={citation.verificationStatus} />
            
            {citation.verificationStatus === 'pending' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onVerify(citation.id)}
                className="text-xs"
              >
                <Search className="w-3 h-3 mr-1" />
                {t('result.citation.verify')}
              </Button>
            )}

            {citation.verificationStatus === 'failed' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onVerify(citation.id)}
                className="text-xs text-red-600 border-red-200 hover:bg-red-50"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                {t('result.citation.retry')}
              </Button>
            )}
          </div>
        </div>

        {/* 验证详情 */}
        {citation.verificationDetails && citation.verificationStatus !== 'pending' && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-gray-500 hover:text-gray-700 mb-2"
            >
              {expanded ? t('result.citation.hide_details') : t('result.citation.show_details')} ▼
            </button>

            {expanded && (
              <div className="space-y-2 text-xs">
                {citation.verificationDetails.doiValid !== undefined && (
                  <div className="flex items-center gap-2">
                    {citation.verificationDetails.doiValid ? 
                      <CheckCircle className="w-3 h-3 text-green-600" /> : 
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                    }
                    <span>{t('result.citation.doi_validity')}: {citation.verificationDetails.doiValid ? t('result.citation.valid') : t('result.citation.invalid')}</span>
                  </div>
                )}

                {citation.verificationDetails.crossrefMatch !== undefined && (
                  <div className="flex items-center gap-2">
                    {citation.verificationDetails.crossrefMatch ? 
                      <CheckCircle className="w-3 h-3 text-green-600" /> : 
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                    }
                    <span>{t('result.citation.crossref_match')}: {citation.verificationDetails.crossrefMatch ? t('result.citation.match') : t('result.citation.no_match')}</span>
                  </div>
                )}

                {citation.verificationDetails.issues && citation.verificationDetails.issues.length > 0 && (
                  <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                    <div className="font-medium text-red-800 mb-1">{t('result.citation.issues_found')}:</div>
                    <ul className="list-disc list-inside space-y-1 text-red-700">
                      {citation.verificationDetails.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {citation.verificationDetails.lastChecked && (
                  <div className="text-gray-500 mt-2">
                    {t('result.citation.last_checked')}: {new Date(citation.verificationDetails.lastChecked).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 建议替换项 */}
        {citation.suggestedReplacements && citation.suggestedReplacements.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-700 mb-2">{t('result.citation.suggested_replacement')}:</div>
            {citation.suggestedReplacements.map((replacement) => (
              <div key={replacement.id} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-green-800 text-sm truncate">{replacement.title}</div>
                  <div className="text-xs text-green-700">
                    {replacement.authors.join(', ')} ({replacement.year})
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onReplace(citation.id, replacement.id)}
                  className="ml-2 bg-green-600 hover:bg-green-700 text-white text-xs"
                >
                  {t('result.citation.replace')}
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* 外部链接 */}
        {citation.verificationStatus === 'verified' && (citation.doi || citation.url) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex gap-2">
              {citation.doi && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`https://doi.org/${citation.doi}`, '_blank')}
                  className="text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {t('result.citation.doi_link')}
                </Button>
              )}
              {citation.url && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(citation.url, '_blank')}
                  className="text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {t('result.citation.original_link')}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// 主组件
const CitationVerificationPanel: React.FC = () => {
  const { t } = useTranslation();
  const [citations, setCitations] = useState<CitationSource[]>(mockCitations);
  const [isVerifying, setIsVerifying] = useState(false);
  const [stats, setStats] = useState<VerificationStats>({ total: 0, verified: 0, failed: 0, pending: 0, checking: 0 });

  // 计算统计数据
  useEffect(() => {
    const newStats = citations.reduce(
      (acc, citation) => {
        acc.total++;
        switch (citation.verificationStatus) {
          case 'verified':
            acc.verified++;
            break;
          case 'failed':
          case 'not_found':
            acc.failed++;
            break;
          case 'checking':
            acc.checking++;
            break;
          default:
            acc.pending++;
        }
        return acc;
      },
      { total: 0, verified: 0, failed: 0, pending: 0, checking: 0 }
    );
    setStats(newStats);
  }, [citations]);

  // 模拟验证过程
  const verifyCitation = async (citationId: string) => {
    // 设置为验证中
    setCitations(prev => prev.map(c => 
      c.id === citationId 
        ? { ...c, verificationStatus: 'checking' as const }
        : c
    ));

    // 模拟验证延迟
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // 模拟验证结果
    const citation = citations.find(c => c.id === citationId);
    if (!citation) return;

    let verificationResult: CitationSource['verificationStatus'];
    let verificationDetails: CitationSource['verificationDetails'] = {
      lastChecked: new Date().toISOString()
    };

    // 根据引用内容模拟不同的验证结果
    if (citation.doi === '10.1000/invalid.doi.123') {
      verificationResult = 'failed';
      verificationDetails = {
        ...verificationDetails,
        doiValid: false,
        crossrefMatch: false,
        issues: [
          t('result.citation.error.invalid_doi'),
          t('result.citation.error.no_crossref_match'),
          t('result.citation.error.journal_discontinued')
        ]
      };
    } else if (citation.doi?.includes('10.1038') || citation.doi?.includes('10.1016')) {
      verificationResult = 'verified';
      verificationDetails = {
        ...verificationDetails,
        doiValid: true,
        crossrefMatch: true,
        metadataConsistent: true,
        pubmedMatch: citation.pmid ? true : undefined,
        pmidValid: citation.pmid ? true : undefined
      };
    } else if (citation.isbn) {
      verificationResult = Math.random() > 0.3 ? 'verified' : 'not_found';
      verificationDetails = {
        ...verificationDetails,
        isbnValid: verificationResult === 'verified',
        issues: verificationResult === 'not_found' ? [t('result.citation.error.isbn_not_found')] : undefined
      };
    } else {
      verificationResult = Math.random() > 0.2 ? 'verified' : 'failed';
      verificationDetails = {
        ...verificationDetails,
        issues: verificationResult === 'failed' ? [t('result.citation.error.metadata_inconsistent'), t('result.citation.error.publication_info_error')] : undefined
      };
    }

    setCitations(prev => prev.map(c => 
      c.id === citationId 
        ? { 
            ...c, 
            verificationStatus: verificationResult,
            verificationDetails
          }
        : c
    ));

    // 显示结果通知
    if (verificationResult === 'verified') {
      toast.success(t('result.citation.toast.verification_success', { title: citation.title }));
    } else if (verificationResult === 'failed') {
      toast.error(t('result.citation.toast.verification_failed', { title: citation.title }));
    } else {
      toast.warning(t('result.citation.toast.verification_warning', { title: citation.title }));
    }
  };

  // 批量验证
  const verifyAll = async () => {
    setIsVerifying(true);
    const pendingCitations = citations.filter(c => c.verificationStatus === 'pending');
    
    for (const citation of pendingCitations) {
      await verifyCitation(citation.id);
      // 稍微延迟以避免过快的并发请求
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsVerifying(false);
    toast.success(t('result.citation.toast.batch_complete'));
  };

  // 替换引用
  const replaceCitation = (originalId: string, replacementId: string) => {
    const original = citations.find(c => c.id === originalId);
    const replacement = original?.suggestedReplacements?.find(r => r.id === replacementId);
    
    if (original && replacement) {
      setCitations(prev => prev.map(c => 
        c.id === originalId 
          ? { ...replacement, id: originalId }
          : c
      ));
      toast.success(t('result.citation.toast.replacement_success', { title: replacement.title }));
    }
  };

  const verificationProgress = stats.total > 0 ? (stats.verified + stats.failed) / stats.total * 100 : 0;

  return (
    <div className="space-y-6">
      {/* 头部统计 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <CardTitle>{t('result.citation.verification_center')}</CardTitle>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {t('result.citation.realtime_validation')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">{t('result.citation.total')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
              <div className="text-sm text-gray-500">{t('result.citation.verified')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-gray-500">{t('result.citation.failed')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.checking}</div>
              <div className="text-sm text-gray-500">{t('result.citation.verifying')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
              <div className="text-sm text-gray-500">{t('result.citation.pending')}</div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('result.citation.verification_progress')}</span>
              <span>{Math.round(verificationProgress)}%</span>
            </div>
            <Progress value={verificationProgress} className="h-2" />
          </div>

          {/* 批量操作 */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={verifyAll}
              disabled={isVerifying || stats.pending === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t('result.citation.verifying_status')}
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  {t('result.citation.batch_verify')} ({stats.pending})
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                const csvContent = citations.map(c => 
                  `"${c.title}","${c.authors.join('; ')}",${c.year},"${c.doi || ''}","${c.verificationStatus}"`
                ).join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'citation-verification-report.csv';
                a.click();
                toast.success(t('result.citation.toast.report_exported'));
              }}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {t('result.citation.export_report')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 引用列表 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('result.citation.details_count')} ({citations.length} 项)
        </h3>
        
        {citations.map((citation) => (
          <CitationItem
            key={citation.id}
            citation={citation}
            onVerify={verifyCitation}
            onReplace={replaceCitation}
          />
        ))}
      </div>

      {/* 验证说明 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="space-y-2 text-sm">
              <div className="font-medium text-blue-900">{t('result.citation.verification_mechanism')}</div>
              <ul className="space-y-1 text-blue-800 list-disc list-inside ml-2">
                <li><strong>DOI Verification</strong>: {t('result.citation.mechanism.doi')}</li>
                <li><strong>PMID Verification</strong>: {t('result.citation.mechanism.pmid')}</li>
                <li><strong>ISBN Verification</strong>: {t('result.citation.mechanism.isbn')}</li>
                <li><strong>Smart Replacement</strong>: {t('result.citation.mechanism.smart_replacement')}</li>
                <li><strong>Format Standards</strong>: {t('result.citation.mechanism.format_check')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CitationVerificationPanel;