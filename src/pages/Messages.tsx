import { useState, useEffect, useRef } from 'react';
import { supabase, type Match, type Message, type Profile } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Send, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import './Messages.css';

interface MatchWithProfile extends Match {
  other_profile: Profile;
  last_message?: Message;
}

export default function Messages() {
  const { user, profile } = useAuth();
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchWithProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user]);

  useEffect(() => {
    if (selectedMatch) {
      loadMessages(selectedMatch.id);
    }
  }, [selectedMatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMatches() {
    if (!user || !profile) return;

    const { data: matchData } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (!matchData) {
      setLoading(false);
      return;
    }

    const matchesWithProfiles: MatchWithProfile[] = await Promise.all(
      matchData.map(async (match) => {
        const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
        const { data: otherProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherUserId)
          .maybeSingle();

        const { data: lastMessage } = await supabase
          .from('messages')
          .select('*')
          .eq('match_id', match.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          ...match,
          other_profile: otherProfile!,
          last_message: lastMessage
        };
      })
    );

    const validMatches = matchesWithProfiles.filter(m => m.other_profile);
    setMatches(validMatches);
    setLoading(false);
  }

  async function loadMessages(matchId: string) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    setMessages(data || []);

    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('match_id', matchId)
      .neq('sender_id', user?.id)
      .is('read_at', null);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch || !user || sending) return;

    setSending(true);
    const { error } = await supabase
      .from('messages')
      .insert({
        match_id: selectedMatch.id,
        sender_id: user.id,
        content: newMessage.trim()
      });

    if (!error) {
      setNewMessage('');
      await loadMessages(selectedMatch.id);
    }
    setSending(false);
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  if (loading) {
    return (
      <div className="messages-page">
        <div className="messages-loading">
          <div className="loading-spinner" />
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className={`messages-list ${selectedMatch ? 'mobile-hidden' : ''}`}>
        <div className="messages-header">
          <h1>Messages</h1>
        </div>

        {matches.length === 0 ? (
          <div className="messages-empty">
            <MessageCircle size={48} />
            <h2>No matches yet</h2>
            <p>Start swiping to find friends and begin conversations!</p>
          </div>
        ) : (
          <div className="matches-list">
            {matches.map((match) => (
              <motion.div
                key={match.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`match-item ${selectedMatch?.id === match.id ? 'active' : ''}`}
                onClick={() => setSelectedMatch(match)}
              >
                <img
                  src={match.other_profile?.avatar_url}
                  alt={match.other_profile?.name}
                  className="match-avatar"
                />
                <div className="match-info">
                  <div className="match-header">
                    <h3>{match.other_profile?.name}</h3>
                    <span className="match-time">
                      {match.last_message ? formatTime(match.last_message.created_at) : 'New'}
                    </span>
                  </div>
                  <p className="match-preview">
                    {match.last_message?.content || 'Start a conversation!'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className={`chat-container ${selectedMatch ? '' : 'mobile-hidden'}`}>
        {selectedMatch ? (
          <>
            <div className="chat-header">
              <button
                className="back-btn"
                onClick={() => setSelectedMatch(null)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <img
                src={selectedMatch.other_profile?.avatar_url}
                alt={selectedMatch.other_profile?.name}
                className="chat-avatar"
              />
              <div className="chat-user-info">
                <h2>{selectedMatch.other_profile?.name}</h2>
                <span className="chat-status">
                  {selectedMatch.other_profile?.hobbies?.slice(0, 2).join(', ')}
                </span>
              </div>
            </div>

            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="chat-empty">
                  <p>Say hello to {selectedMatch.other_profile?.name}!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-bubble ${msg.sender_id === user?.id ? 'sent' : 'received'}`}
                  >
                    <p>{msg.content}</p>
                    <span className="message-time">{formatTime(msg.created_at)}</span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sending}
              />
              <button type="submit" disabled={!newMessage.trim() || sending}>
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="chat-placeholder">
            <MessageCircle size={64} />
            <h2>Select a conversation</h2>
            <p>Choose a match to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
