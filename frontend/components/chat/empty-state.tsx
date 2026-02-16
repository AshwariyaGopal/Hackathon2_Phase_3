import { Bot, Sparkles } from "lucide-react";

export function EmptyChatState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center justify-center gap-8 max-w-2xl w-full">
        <div className="relative shrink-0">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-20 animate-pulse"></div>
          <div className="relative p-6 bg-card border border-primary/10 rounded-full shadow-2xl">
            <Bot className="w-16 h-16 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg border-2 border-background">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Meet your <span className="text-primary">AI Assistant</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-lg leading-relaxed font-medium">
            Master your productivity with natural language. 
            What would you like to achieve today?
          </p>
        </div>
      </div>
    </div>
  );
}
