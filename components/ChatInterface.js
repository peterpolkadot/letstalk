import { useState } from 'react';

export default function ChatInterface({ botAlias, botName, botEmoji }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          botAlias: botAlias
        })
      });

      const data = await response.json();

      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className='bg-white border-2 border-gray-200 rounded-xl overflow-hidden'>
      {/* Chat Header */}
      <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4'>
        <div className='flex items-center gap-2'>
          <span className='text-2xl'>{botEmoji}</span>
          <div>
            <h3 className='font-semibold'>Chat with {botName}</h3>
            <p className='text-xs text-blue-100'>Ask me anything!</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className='h-96 overflow-y-auto p-4 space-y-4'>
        {messages.length === 0 && (
          <div className='text-center text-gray-400 py-12'>
            <p className='text-4xl mb-2'>{botEmoji}</p>
            <p>Start a conversation with {botName}!</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={'max-w-xs lg:max-w-md px-4 py-2 rounded-lg ' + (msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800')}>
              <p className='text-sm whitespace-pre-wrap'>{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className='flex justify-start'>
            <div className='bg-gray-100 px-4 py-2 rounded-lg'>
              <p className='text-sm text-gray-500'>Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className='border-t-2 border-gray-200 p-4'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Type your message...'
            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}