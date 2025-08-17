import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  CheckCircle, 
  AlertTriangle, 
  Edit2, 
  Save, 
  ArrowRight, 
  Zap, 
  FileText,
  TrendingUp,
  Clock,
  Info
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AnalysisResult, ExtractedFormData } from './FormAnalyzer';

type AnalysisResultsProps = {
  analysisResult: AnalysisResult;
  onDataEdit?: (updatedData: ExtractedFormData) => void;
  onProceed?: (finalData: ExtractedFormData) => void;
  onReanalyze?: () => void;
};

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysisResult,
  onDataEdit,
  onProceed,
  onReanalyze,
}) => {
  const [editingField, setEditingField] = useState<keyof ExtractedFormData | null>(null);
  const [localData, setLocalData] = useState<ExtractedFormData>(analysisResult.extractedData);

  const fieldLabels: Record<keyof ExtractedFormData, string> = {
    essayType: 'Essay类型',
    topic: '论文主题',
    essayLength: '字数要求',
    lengthType: '长度单位',
    essayLevel: '学术水平',
    citationStyle: '引用格式',
    language: '语言',
    audience: '目标读者',
    thesis: '论点',
    structure: '段落结构',
    materials: '补充材料',
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return '高';
    if (confidence >= 0.6) return '中';
    return '低';
  };

  const handleFieldEdit = (field: keyof ExtractedFormData, value: string) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onDataEdit?.(updatedData);
  };

  const handleSaveField = (field: keyof ExtractedFormData) => {
    setEditingField(null);
    // 触发保存回调
    onDataEdit?.(localData);
  };

  const totalFields = Object.keys(fieldLabels).length;
  const extractedCount = analysisResult.extractedFields.length;
  const completionRate = Math.round((extractedCount / totalFields) * 100);

  const renderFieldValue = (field: keyof ExtractedFormData) => {
    const value = localData[field];
    const confidence = analysisResult.confidence[field] || 0;
    const isExtracted = analysisResult.extractedFields.includes(field);
    const isEditing = editingField === field;

    if (!isExtracted) {
      return (
        <div className="text-sm text-gray-500 italic">
          未提取 - 需要手动填写
        </div>
      );
    }

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={value || ''}
            onChange={(e) => handleFieldEdit(field, e.target.value)}
            className="flex-1"
            autoFocus
          />
          <Button size="sm" onClick={() => handleSaveField(field)}>
            <Save className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">{value}</span>
          <Badge 
            variant="outline" 
            className={`text-xs ${getConfidenceColor(confidence)}`}
          >
            置信度: {getConfidenceText(confidence)}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingField(field)}
          className="h-6 w-6 p-0"
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 分析概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            AI分析结果
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 完成度统计 */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{extractedCount}</div>
              <div className="text-xs text-muted-foreground">已提取字段</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">{analysisResult.remainingFields.length}</div>
              <div className="text-xs text-muted-foreground">待填写字段</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
              <div className="text-xs text-muted-foreground">完成度</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>智能填写进度</span>
              <span>{extractedCount}/{totalFields}</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Info className="h-4 w-4 text-blue-600" />
            <div className="text-sm text-blue-700">
              AI已为您自动填写了 <strong>{extractedCount}</strong> 个字段，
              还有 <strong>{analysisResult.remainingFields.length}</strong> 个字段需要您手动完成。
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 已提取字段 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            已提取字段 ({extractedCount})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysisResult.extractedFields.map((field) => (
            <div key={field} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{fieldLabels[field]}</label>
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  已提取
                </Badge>
              </div>
              {renderFieldValue(field)}
            </div>
          ))}
          
          {extractedCount === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>未能自动提取表单字段</p>
              <p className="text-xs">您可以重新分析或手动填写表单</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 待填写字段 */}
      {analysisResult.remainingFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              待填写字段 ({analysisResult.remainingFields.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {analysisResult.remainingFields.map((field) => (
                <div key={field} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">{fieldLabels[field]}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-orange-50 rounded-lg">
              <div className="text-sm text-orange-700">
                这些字段将在下一步的渐进式表单中为您逐一展示，您可以根据需要进行填写。
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 分析日志 */}
      <Accordion type="single" collapsible>
        <AccordionItem value="analysis-log">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              查看分析详情 ({analysisResult.analysisLog.length} 条记录)
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {analysisResult.analysisLog.map((log, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-blue-600">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{log}</span>
                    </div>
                  ))}
                  
                  {analysisResult.analysisLog.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <FileText className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm">暂无分析记录</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={onReanalyze}
        >
          重新分析
        </Button>
        
        <Button
          onClick={() => onProceed?.(localData)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          继续填写表单
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;