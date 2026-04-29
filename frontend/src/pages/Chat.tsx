import { useState, useRef, useEffect } from 'react';
import { Send, User, BrainCircuit, Loader2 } from 'lucide-react';
import api from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your SymptomSync AI Health Assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat', { message: userMessage.text });
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.data.response,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I encountered an error. Please try again later.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Health Assistant</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Chat with our AI for general health inquiries.</p>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '24px' }}>
        
        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  maxWidth: '80%',
                  flexDirection: isUser ? 'row-reverse' : 'row'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isUser ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isUser ? <User size={20} color="#fff" /> : <BrainCircuit size={20} color="#fff" />}
                  </div>
                  
                  <div style={{
                    background: isUser ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    padding: '1rem 1.5rem',
                    borderRadius: '16px',
                    borderTopLeftRadius: !isUser ? '4px' : '16px',
                    borderTopRightRadius: isUser ? '4px' : '16px',
                    color: '#fff',
                    lineHeight: '1.5',
                    border: isUser ? 'none' : '1px solid var(--glass-border)'
                  }}>
                    {msg.text.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
               <div style={{ display: 'flex', gap: '1rem', maxWidth: '80%', flexDirection: 'row' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BrainCircuit size={20} color="#fff" />
                 </div>
                 <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem 1.5rem', borderRadius: '16px', borderTopLeftRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--glass-border)' }}>
                   <Loader2 size={18} className="animate-spin" color="var(--primary)" />
                   <span style={{ color: 'var(--text-muted)' }}>Thinking...</span>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your health question here..."
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none'
              }}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn" 
              style={{ padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              disabled={isLoading || !input.trim()}
            >
              <Send size={18} />
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
