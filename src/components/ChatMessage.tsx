import { useState } from "react";
import { ChevronDown, User, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CollapsibleInfoCard {
  id: string;
  title: string;
  summary: string;
  content: string;
  items?: string[];
  isDefaultOpen?: boolean;
}

interface ChatMessageProps {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  infoCards?: CollapsibleInfoCard[];
}

const CollapsibleInfoCard = ({ card }: { card: CollapsibleInfoCard }) => {
  const [isOpen, setIsOpen] = useState(card.isDefaultOpen || false);

  return (
    <div className="bg-[#F7F8FA] rounded-[10px] border border-gray-200 overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span className="text-base font-medium text-gray-900">{card.title}</span>
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-500 transition-transform duration-[180ms] ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </div>
      
      <div className={`overflow-hidden transition-all duration-[180ms] ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-8 opacity-70'
      }`}>
        <div className="px-3 pb-3">
          {!isOpen ? (
            <p className="text-sm text-gray-600 truncate">{card.summary}</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-700 leading-relaxed">{card.content}</p>
              {card.items && card.items.length > 0 && (
                <ul className="ml-4 space-y-1.5">
                  {card.items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatMessage = ({ message }: { message: ChatMessageProps }) => {
  return (
    <Card className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 shadow-sm">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {message.type === 'user' ? (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <User className="h-3 w-3 text-primary-foreground" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
              <Bot className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-900 leading-relaxed mb-3">
            {message.content}
          </div>
          
          {message.infoCards && message.infoCards.length > 0 && (
            <div className="space-y-3">
              {message.infoCards.map((card) => (
                <CollapsibleInfoCard key={card.id} card={card} />
              ))}
            </div>
          )}
          
          <div className="mt-2 text-xs text-[#6B7280]">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatMessage;