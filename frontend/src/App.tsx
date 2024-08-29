import React, { useState, useEffect, useRef } from 'react';
import { Container, TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { backend } from 'declarations/backend';

interface Message {
  content: string;
  timestamp: bigint;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const fetchMessages = async () => {
    const fetchedMessages = await backend.getMessages();
    setMessages(fetchedMessages);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;
    setLoading(true);
    await backend.sendMessage(newMessage);
    setNewMessage('');
    await fetchMessages();
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" className="h-screen flex flex-col">
      <Box className="flex-grow overflow-auto p-4" sx={{ bgcolor: 'secondary.main' }}>
        <Typography variant="h4" component="h1" gutterBottom className="text-center text-primary">
          IC Chat App
        </Typography>
        <Box className="flex flex-col">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-bubble ${index % 2 === 0 ? 'sent' : 'received'}`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </Box>
      </Box>
      <Box className="p-4 bg-white">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            disabled={loading}
            className="ml-2"
          >
            Send
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default App;
