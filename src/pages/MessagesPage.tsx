import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, Message, Profile, Match } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface Conversation {
  match: Match
  otherProfile: Profile
  lastMessage?: Message
}

export default function MessagesPage() {
  const { matchId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  useEffect(() => {
    if (matchId && conversations.length > 0) {
      const conv = conversations.find(c => c.match.id === matchId)
      if (conv) {
        setSelectedConversation(conv)
        fetchMessages(matchId)
      }
    }
  }, [matchId, conversations])

  async function fetchConversations() {
    if (!user) return

    const { data: matchData } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)

    if (!matchData) {
      setLoading(false)
      return
    }

    const convs = await Promise.all(
      matchData.map(async (match) => {
        const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherUserId)
          .maybeSingle()

        const { data: lastMsg } = await supabase
          .from('messages')
          .select('*')
          .eq('match_id', match.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        return {
          match,
          otherProfile: profile as Profile,
          lastMessage: lastMsg as Message | undefined,
        }
      })
    )

    setConversations(convs)
    setLoading(false)
  }

  async function fetchMessages(matchId: string) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })

    if (data) {
      setMessages(data as Message[])
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !selectedConversation || !newMessage.trim()) return

    const { data } = await supabase
      .from('messages')
      .insert({
        match_id: selectedConversation.match.id,
        sender_id: user.id,
        content: newMessage.trim(),
      })
      .select()
      .maybeSingle()

    if (data) {
      setMessages(prev => [...prev, data as Message])
      setNewMessage('')
    }
  }

  if (loading) {
    return <div className="loading-page">Loading messages...</div>
  }

  if (selectedConversation) {
    return (
      <div className="messages-page active-chat">
        <div className="chat-header">
          <button className="back-btn" onClick={() => {
            setSelectedConversation(null)
            navigate('/messages')
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2>{selectedConversation.otherProfile.name}</h2>
        </div>

        <div className="messages-list">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`message ${msg.sender_id === user?.id ? 'sent' : 'received'}`}
            >
              <p>{msg.content}</p>
              <span className="message-time">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="message-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" disabled={!newMessage.trim()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="messages-page">
      <h1>Messages</h1>
      {conversations.length === 0 ? (
        <div className="empty-state">
          <p>No conversations yet. Match with someone to start chatting!</p>
          <button className="btn-primary" onClick={() => navigate('/discover')}>
            Discover People
          </button>
        </div>
      ) : (
        <div className="conversations-list">
          {conversations.map(conv => (
            <div
              key={conv.match.id}
              className="conversation-item"
              onClick={() => navigate(`/messages/${conv.match.id}`)}
            >
              <div className="conversation-avatar">
                {conv.otherProfile.avatar_url || conv.otherProfile.photo_urls?.[0] ? (
                  <img
                    src={conv.otherProfile.avatar_url || conv.otherProfile.photo_urls?.[0]}
                    alt={conv.otherProfile.name}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {conv.otherProfile.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="conversation-preview">
                <h3>{conv.otherProfile.name}</h3>
                <p>{conv.lastMessage?.content || 'Start a conversation!'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
