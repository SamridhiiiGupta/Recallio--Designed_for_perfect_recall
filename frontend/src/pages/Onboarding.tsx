import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ArrowRight, Sparkles } from 'lucide-react'
import { useUserStore } from '../store/userStore'

const SUGGESTIONS = ['Alex', 'Maya', 'Jordan', 'Sam', 'Riley', 'Morgan', 'Taylor', 'Drew']

const MOTIVATIONS = [
  'Ready to remember everything you learn?',
  'Your brain is about to get a serious upgrade.',
  'Spaced repetition starts here.',
  'The science of memory, simplified.',
]

export function Onboarding() {
  const navigate = useNavigate()
  const { setName, name } = useUserStore()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [motivationIdx, setMotivationIdx] = useState(0)
  const [focused, setFocused] = useState(false)

  // Redirect if already named
  useEffect(() => {
    if (name) navigate('/dashboard')
  }, [name, navigate])

  // Cycle motivation text
  useEffect(() => {
    const t = setInterval(() => setMotivationIdx(i => (i + 1) % MOTIVATIONS.length), 3000)
    return () => clearInterval(t)
  }, [])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) { setError('Please enter your name to continue.'); return }
    if (trimmed.length < 2) { setError('Name must be at least 2 characters.'); return }
    if (trimmed.length > 40) { setError('Name too long.'); return }
    setName(trimmed)
    navigate('/dashboard')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#07070e',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,106,255,0.12) 0%, transparent 60%)',
      }} />
      <div style={{
        position: 'fixed', bottom: -200, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(124,106,255,0.06) 0%, transparent 70%)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: 480,
          background: 'rgba(18,18,26,0.85)',
          border: '1px solid rgba(60,60,80,0.7)',
          borderRadius: 28, padding: '52px 48px',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(124,106,255,0.08)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Top glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 200, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(124,106,255,0.8), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40,
            justifyContent: 'center',
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #7c6aff 0%, #a594ff 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(124,106,255,0.6)',
          }}>
            <Zap size={20} color="#fff" />
          </div>
          <div>
            <div style={{
              fontWeight: 800, fontSize: 18, color: '#f0f0ff',
              letterSpacing: '-0.5px', fontFamily: "'Syne', 'Space Grotesk', sans-serif",
              lineHeight: 1,
            }}>
              Recallio
            </div>
            <div style={{ fontSize: 9, color: 'rgba(240,240,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Designed for perfect recall
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: 32, textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: 28, fontWeight: 800, color: '#f0f0ff',
            margin: '0 0 10px', letterSpacing: '-1px',
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
          }}>
            What should we call you?
          </h1>

          {/* Cycling motivation */}
          <div style={{ height: 24, position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={motivationIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                style={{
                  fontSize: 14, color: 'rgba(240,240,255,0.42)',
                  margin: 0, position: 'absolute', width: '100%', textAlign: 'center',
                }}
              >
                {MOTIVATIONS[motivationIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: 16, position: 'relative' }}
        >
          <div style={{
            position: 'relative',
            borderRadius: 14,
            border: `1.5px solid ${focused ? '#7c6aff' : error ? '#ef4444' : 'rgba(60,60,80,0.8)'}`,
            boxShadow: focused ? '0 0 0 3px rgba(124,106,255,0.2)' : 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            background: 'rgba(12,12,20,0.8)',
          }}>
            <Sparkles
              size={16}
              style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                color: focused ? '#7c6aff' : 'rgba(240,240,255,0.25)',
                transition: 'color 0.2s', pointerEvents: 'none',
              }}
            />
            <input
              autoFocus
              type="text"
              value={value}
              onChange={e => { setValue(e.target.value); setError('') }}
              onKeyDown={handleKey}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Your name…"
              style={{
                width: '100%', padding: '17px 16px 17px 42px',
                background: 'transparent', border: 'none', outline: 'none',
                fontSize: 16, color: '#f0f0ff', fontWeight: 500,
                fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
                boxSizing: 'border-box', borderRadius: 14,
              }}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0 4px' }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick-fill suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 28 }}
        >
          {SUGGESTIONS.slice(0, 6).map(s => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.06, background: 'rgba(124,106,255,0.25)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setValue(s); setError('') }}
              style={{
                padding: '5px 13px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                background: value === s ? 'rgba(124,106,255,0.22)' : 'rgba(255,255,255,0.04)',
                color: value === s ? '#a594ff' : 'rgba(240,240,255,0.4)',
                border: `1px solid ${value === s ? 'rgba(124,106,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                cursor: 'pointer', transition: 'background 0.15s, color 0.15s',
              }}
            >
              {s}
            </motion.button>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={value.trim() ? { scale: 1.03, boxShadow: '0 16px 48px rgba(124,106,255,0.65)' } : {}}
          whileTap={value.trim() ? { scale: 0.97 } : {}}
          onClick={handleSubmit}
          style={{
            width: '100%', padding: '16px', borderRadius: 14,
            fontWeight: 700, fontSize: 16,
            background: value.trim()
              ? 'linear-gradient(135deg, #7c6aff 0%, #a594ff 100%)'
              : 'rgba(124,106,255,0.2)',
            color: value.trim() ? '#fff' : 'rgba(240,240,255,0.35)',
            border: 'none', cursor: value.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: value.trim() ? '0 8px 32px rgba(124,106,255,0.45)' : 'none',
            transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
          }}
        >
          Enter Recallio
          <ArrowRight size={18} />
        </motion.button>

        <p style={{
          fontSize: 12, color: 'rgba(240,240,255,0.22)',
          textAlign: 'center', marginTop: 16, margin: '16px 0 0',
        }}>
          Stored locally. No account required.
        </p>
      </motion.div>

      {/* Back to landing */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ color: '#a594ff' }}
        onClick={() => navigate('/')}
        style={{
          marginTop: 24, background: 'none', border: 'none',
          color: 'rgba(240,240,255,0.3)', fontSize: 13, cursor: 'pointer',
          fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
        }}
      >
        ← Back to landing
      </motion.button>
    </div>
  )
}
