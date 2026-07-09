import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import Avatar from '../components/Avatar'

export default function ChatConversation() {
  const navigate = useNavigate()
  const { chatId } = useParams()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [otherName, setOtherName] = useState('')
  const [otherAvatar, setOtherAvatar] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const polling = useRef(null)
  const typingTimeout = useRef(null)
  const userId = localStorage.getItem('mingle_userId')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/chats/${chatId}/messages`)
        const newMsgs = res.data.messages || []
        setMessages(prev => newMsgs.length > prev.length ? newMsgs : prev)
        if (newMsgs.length > 0) {
          const chatRes = await api.get('/chats')
          const c = chatRes.data.chats.find(x => x.id === chatId)
          if (c) { setOtherName(c.other_name || 'User'); setOtherAvatar(c.other_avatar || '') }
        }
      } catch {}
    }
    load()
    polling.current = setInterval(load, 3000)
    return () => clearInterval(polling.current)
  }, [chatId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const handleSend = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    try {
      const res = await api.post(`/chats/${chatId}/messages`, { text: text.trim() })
      setMessages(prev => [...prev, res.data.message])
      setText('')
    } catch {} finally { setSending(false) }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleTyping = (value) => {
    setText(value)
    setIsTyping(true)
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => setIsTyping(false), 1500)
  }

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased h-screen flex flex-col">
      <header className="bg-surface/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3 px-gutter h-16 max-w-container-max mx-auto">
          <button onClick={() => navigate('/chats')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="relative flex-shrink-0">
            <Avatar src={otherAvatar} name={otherName} size={40} />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#4CAF50] border-2 border-surface" />
          </div>
          <div>
            <h1 className="font-label-md text-label-md text-on-surface font-medium">{otherName || 'Chat'}</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant/60">Online</p>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto px-gutter py-4 space-y-2 max-w-container-max mx-auto w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-container/5 via-surface to-surface">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container mb-4">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">No messages yet. Say hello!</p>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === userId
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isMe ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
              <div className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-3 ${
                isMe ? 'bg-primary text-on-primary rounded-br-md' : 'bg-surface-container-high text-on-surface rounded-bl-md'
              } shadow-sm`}>
                <p className="font-body-md text-body-md">{msg.text}</p>
                <p className={`font-label-sm text-label-sm mt-1 flex items-center gap-1 ${isMe ? 'text-on-primary/60' : 'text-on-surface-variant/60'}`}>
                  {new Date(msg.created_at + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>}
                </p>
              </div>
            </div>
          )
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface-container-high rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-on-surface-variant/40 animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 rounded-full bg-on-surface-variant/40 animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 rounded-full bg-on-surface-variant/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>
      <div className="sticky bottom-0 bg-surface/90 backdrop-blur-lg border-t border-outline-variant/20 p-gutter pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-sm max-w-container-max mx-auto">
          <button className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors flex-shrink-0 active:scale-90">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <div className="flex-1 relative">
            <input type="text" value={text} onChange={e => handleTyping(e.target.value)} onKeyDown={handleKeyDown}
              className="w-full pl-4 pr-4 py-3 bg-surface-container-high rounded-xl text-on-surface font-body-md placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20 transition-all duration-200"
              placeholder="Type a message..." />
          </div>
          <button onClick={handleSend} disabled={!text.trim() || sending}
            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-on-primary disabled:opacity-40 hover:opacity-90 active:scale-90 transition-all duration-200 flex-shrink-0 shadow-[0_4px_10px_rgba(216,27,96,0.3)]">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
