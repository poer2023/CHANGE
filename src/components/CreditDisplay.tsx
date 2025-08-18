import React from 'react';
import { useCredit } from '@/contexts/CreditContext';
import { formatWordCount, formatPrice } from '@/lib/pricing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Crown, TrendingUp } from 'lucide-react';

interface CreditDisplayProps {
  onRecharge?: () => void;
  showDetails?: boolean;
}

export function CreditDisplay({ onRecharge, showDetails = false }: CreditDisplayProps) {
  const { 
    getBalance, 
    balance,
    transactions,
    rechargeHistory 
  } = useCredit();

  const currentBalance = getBalance();
  const totalSpending = balance.totalSpent;
  const vipLevel = balance.vipLevel;
  const consumptionHistory = transactions.filter(t => t.type === 'usage').slice(0, 5);
  const rechargeHistoryData = rechargeHistory.slice(0, 5);

  // 获取下一个VIP等级的要求
  function getNextVipRequirement(): number {
    const nextLevel = vipLevel.level + 1;
    const vipLevels = [0, 100, 500, 1500, 5000]; // 对应 VIP_LEVELS 中的 requiredSpending
    return vipLevels[nextLevel] || vipLevels[vipLevels.length - 1];
  }

  return (
    <div className="space-y-4">
      {/* 余额和VIP状态卡片 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">字数余额</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{formatWordCount(currentBalance)}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={vipLevel.level > 0 ? "default" : "secondary"} className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  {vipLevel.name}
                </Badge>
                {vipLevel.discount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {vipLevel.discount}% 折扣
                  </Badge>
                )}
              </div>
            </div>
            {onRecharge && (
              <Button size="sm" onClick={onRecharge}>
                充值
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* VIP进度卡片 */}
      {vipLevel.level < 4 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP进度</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>累计消费: {formatPrice(totalSpending)}</span>
                <span>下一等级还需: {formatPrice(getNextVipRequirement() - totalSpending)}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, (totalSpending / getNextVipRequirement()) * 100)}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 详细信息 */}
      {showDetails && (
        <>
          {/* 最近消费记录 */}
          {consumptionHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">最近消费</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {consumptionHistory.map((record) => (
                    <div key={record.id} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium">{record.description}</span>
                        <div className="text-xs text-muted-foreground">
                          {formatWordCount(Math.abs(record.wordCount))} • {new Date(record.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{formatPrice(record.amount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 最近充值记录 */}
          {rechargeHistoryData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">最近充值</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rechargeHistoryData.map((record) => (
                    <div key={record.id} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium">{record.packageName}</span>
                        <div className="text-xs text-muted-foreground">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600">
                          +{formatWordCount(record.wordCount + (record.bonusWords || 0))}
                        </div>
                        {record.bonusWords && (
                          <div className="text-xs text-blue-600">
                            含赠送{formatWordCount(record.bonusWords)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default CreditDisplay;