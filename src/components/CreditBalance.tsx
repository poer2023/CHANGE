import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Coins, Plus } from 'lucide-react';
import { useCredit } from '@/contexts/CreditContext';
import RechargeDialog from '@/components/RechargeDialog';

interface CreditBalanceProps {
  showRechargeButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'badge';
}

const CreditBalance: React.FC<CreditBalanceProps> = ({
  showRechargeButton = true,
  size = 'md',
  variant = 'default'
}) => {
  const { getBalance } = useCredit();
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);

  if (variant === 'badge') {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={getBalance() < 20 ? "destructive" : "secondary"} className="gap-1">
          <Coins className="h-3 w-3" />
          {getBalance()} 积分
        </Badge>
        {showRechargeButton && getBalance() < 50 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setRechargeDialogOpen(true)}
            className="h-6 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            充值
          </Button>
        )}
        <RechargeDialog
          open={rechargeDialogOpen}
          onOpenChange={setRechargeDialogOpen}
        >
          <Button size="sm">充值</Button>
        </RechargeDialog>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1">
          <Coins className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{getBalance()}</span>
          <span className="text-muted-foreground">积分</span>
        </div>
        {showRechargeButton && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setRechargeDialogOpen(true)}
          >
            充值
          </Button>
        )}
        <RechargeDialog
          open={rechargeDialogOpen}
          onOpenChange={setRechargeDialogOpen}
        >
          <Button size="sm">充值</Button>
        </RechargeDialog>
      </div>
    );
  }

  // Default variant
  return (
    <Card className="w-fit">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Coins className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">可用积分</p>
              <p className={`font-semibold ${
                size === 'sm' ? 'text-lg' : 
                size === 'md' ? 'text-xl' : 'text-2xl'
              } ${getBalance() < 20 ? 'text-red-600' : 'text-gray-900'}`}>
                {getBalance().toLocaleString()}
              </p>
            </div>
          </div>
          
          {showRechargeButton && (
            <Button 
              onClick={() => setRechargeDialogOpen(true)}
              size={size === 'lg' ? 'default' : 'sm'}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              充值
            </Button>
          )}
        </div>
        
        {getBalance() < 50 && (
          <div className="mt-3 p-2 bg-orange-50 rounded-md">
            <p className="text-xs text-orange-600">
              余额较低，建议及时充值以确保服务使用
            </p>
          </div>
        )}
      </CardContent>
      
      <RechargeDialog
        open={rechargeDialogOpen}
        onOpenChange={setRechargeDialogOpen}
      >
        <Button size="sm">充值</Button>
      </RechargeDialog>
    </Card>
  );
};

export default CreditBalance;