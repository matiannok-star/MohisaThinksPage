import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Sparkles, Send, Workflow, BarChart3, MessageSquare, Mic, MicOff } from "lucide-react";
import { Input } from "../ui/input";
import { useToast } from "../../hooks/use-toast";
import { useTypingAnimation } from "../../hooks/use-typing-animation";
import { useVoiceAgent } from "../voice/voice-agent";

// Mode-specific response generators
const generateChatResponse = (userInput: string, conversationHistory: string[]) => {
  const responses = [
    `I understand you're interested in "${userInput}". Let me help you explore automation solutions for that!`,
    `Great question about ${userInput}! Based on your needs, I can design a custom solution that saves you time and resources.`,
    `Thanks for sharing that! Regarding "${userInput}", I've helped many clients automate similar processes with excellent results.`,
    conversationHistory.length > 2 
      ? `Building on what we discussed earlier about ${conversationHistory[conversationHistory.length - 2]}, your idea about "${userInput}" is a natural next step!`
      : `I'd love to help with ${userInput}. What's your current workflow like?`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const generateWorkflowResponse = (userInput: string, conversationHistory: string[]) => {
  const responses = [
    `🔄 WORKFLOW ANALYSIS: For "${userInput}", I recommend a 3-step automation:\n1. Data capture via webhook\n2. Processing with AI\n3. Auto-routing to your systems\n\nEstimated setup time: 2-3 hours`,
    `⚡ I can build a workflow for "${userInput}" using n8n. This will include:\n• Trigger setup\n• Data transformation\n• Integration with your tools\n• Error handling & logging`,
    `📊 Workflow Blueprint for your request:\n→ Input: ${userInput}\n→ Processing: AI-powered automation\n→ Output: Instant results to your dashboard\n\nWould you like me to detail each step?`,
    conversationHistory.length > 2
      ? `🔗 Perfect! This "${userInput}" workflow can integrate seamlessly with what we discussed earlier. I'll create a unified automation pipeline.`
      : `🛠️ For "${userInput}", I'll design an efficient workflow. What triggers would you like to use?`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const generateAnalysisResponse = (userInput: string, conversationHistory: string[]) => {
  const responses = [
    `📈 ANALYSIS: "${userInput}"\n\n✓ Automation Potential: High (85%)\n✓ Time Savings: ~15 hrs/week\n✓ ROI Timeline: 2-3 months\n✓ Complexity: Medium\n\nRecommended approach: Gradual implementation with MVP first.`,
    `🎯 Impact Assessment for "${userInput}":\n• Current manual effort: ~20 hrs/month\n• Post-automation: ~2 hrs/month\n• Error reduction: 90%+\n• Cost efficiency: 4x improvement\n\nShall we proceed with implementation planning?`,
    `💡 Strategic Analysis:\nYour "${userInput}" use case shows strong automation indicators:\n→ Repetitive patterns detected\n→ High volume processing\n→ Clear success metrics\n\nConfidence score: 92%`,
    conversationHistory.length > 2
      ? `📊 Cross-referencing with our previous discussion about ${conversationHistory[conversationHistory.length - 2]}...\n\nCombined automation of both processes could yield 40% additional efficiency gains!`
      : `🔍 Analyzing "${userInput}"... This process has 3 key optimization points. Want to see the breakdown?`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

// Message component with typing animation
interface MessageBubbleProps {
  message: { role: "user" | "assistant"; text: string };
  isLatest: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isLatest 
}) => {
  const { displayedText } = useTypingAnimation(
    message.text,
    20,
    message.role === "assistant" && isLatest
  );
  
  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground border border-border"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-line">{displayedText}</p>
      </div>
    </div>
  );
};

const InteractiveSection = () => {
  const { toast } = useToast();
  const { toggleSession, isActive } = useVoiceAgent();
  const [activeTab, setActiveTab] = useState<"chat" | "workflow" | "analysis">("chat");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { role: "user" as const, text: inputValue };
    const userInput = inputValue;
    setMessages((prev) => [...prev, userMessage]);
    setConversationContext((prev) => [...prev, userInput]);
    setInputValue("");
    setIsTyping(true);

    // Generate mode-specific, context-aware response
    setTimeout(() => {
      let aiResponse = "";
      
      switch (activeTab) {
        case "chat":
          aiResponse = generateChatResponse(userInput, conversationContext);
          break;
        case "workflow":
          aiResponse = generateWorkflowResponse(userInput, conversationContext);
          break;
        case "analysis":
          aiResponse = generateAnalysisResponse(userInput, conversationContext);
          break;
      }

      const aiMessage = { role: "assistant" as const, text: aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTabClick = (tab: "chat" | "workflow" | "analysis") => {
    setActiveTab(tab);
    const descriptions = {
      chat: "General AI assistant for automation queries",
      workflow: "Technical workflow builder with step-by-step guides",
      analysis: "Data-driven insights and optimization metrics"
    };
    
    toast({
      title: `${tab.charAt(0).toUpperCase() + tab.slice(1)} Mode`,
      description: descriptions[tab],
    });
  };

  return (
    <section id="interactive" className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/30 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI IN ACTION</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              See <span className="text-primary">Automation</span> Live
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch how AI-powered automation responds to real business challenges
            </p>
          </div>

          {/* Interactive Chat Interface */}
          <Card className="border-primary/30 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-primary animate-pulse"}`} />
                  AI Automation Assistant
                </div>
                {/* Tab buttons */}
                <div className="flex gap-2 flex-wrap justify-center">
                  <Button
                    variant={activeTab === "chat" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTabClick("chat")}
                    className="gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </Button>
                  <Button
                    variant={activeTab === "workflow" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTabClick("workflow")}
                    className="gap-2"
                  >
                    <Workflow className="w-4 h-4" />
                    Workflow
                  </Button>
                  <Button
                    variant={activeTab === "analysis" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTabClick("analysis")}
                    className="gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analysis
                  </Button>
                  {/* Global Voice Trigger */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSession}
                    className={`gap-2 border-primary/50 text-primary hover:bg-primary/10 ${isActive ? "bg-primary/10 border-primary text-red-400 hover:text-red-500 hover:border-red-500" : ""}`}
                  >
                    {isActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isActive ? "End Session" : "Voice Mode"}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Messages display area */}
              <div className="min-h-[400px] max-h-[500px] overflow-y-auto space-y-4 p-4 bg-background/50 rounded-lg">
                {messages.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="text-6xl mb-4">
                      {activeTab === "chat" && "💬"}
                      {activeTab === "workflow" && "⚙️"}
                      {activeTab === "analysis" && "📊"}
                    </div>
                    <h3 className="text-xl font-semibold">
                      {activeTab === "chat" && "Start a Conversation"}
                      {activeTab === "workflow" && "Build Your Workflow"}
                      {activeTab === "analysis" && "Analyze Your Process"}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {activeTab === "chat" && "Ask me about automating your business processes, integrating tools, or building custom workflows!"}
                      {activeTab === "workflow" && "Describe your automation needs and I'll design a step-by-step workflow with technical specifications."}
                      {activeTab === "analysis" && "Share your process details and I'll provide data-driven insights, efficiency metrics, and ROI projections."}
                    </p>
                    <div className="pt-4">
                       <Button variant="link" onClick={toggleSession} className="text-primary">
                         {isActive ? "Tap here to stop voice chat" : "Or try speaking to Mohisa AI directly \u2192"}
                       </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <MessageBubble 
                        key={index} 
                        message={message} 
                        isLatest={index === messages.length - 1}
                      />
                    ))}
                    {isTyping && (
                      <div className="flex justify-start animate-fade-in">
                        <div className="bg-muted text-foreground border border-border p-4 rounded-lg">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input area */}
              <div className="flex gap-2">
                <Input
                  placeholder={
                    activeTab === "chat" 
                      ? "Ask AI to automate anything..." 
                      : activeTab === "workflow"
                      ? "Describe your automation workflow..."
                      : "What process should I analyze?"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {conversationContext.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  💭 Remembering context from {conversationContext.length} previous {conversationContext.length === 1 ? 'message' : 'messages'}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Real-time Processing", desc: "Instant responses and automation triggers" },
              { title: "Multi-tool Integration", desc: "Connect 100+ apps and services" },
              { title: "Smart Decision Making", desc: "AI-powered logic and workflows" },
            ].map((feature, index) => (
              <Card key={index} className="text-center p-6 bg-card/30 border-border hover:border-primary/50 transition-all">
                <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveSection;