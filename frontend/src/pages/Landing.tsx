import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Zap, ArrowRight, Brain, BarChart3, Layers,
  Sparkles, ChevronRight, Star, Play, RotateCcw,
} from 'lucide-react'
import { useUserStore } from '../store/userStore'

// ─── Data ────────────────────────────────────────────────────────────────────

const CYCLING_WORDS = ['Smarter.', 'Faster.', 'Deeper.', 'Longer.']

const DEMO_CARDS = [
  {
    front: 'What is the SM-2 spaced repetition algorithm?',
    back: 'Developed by Piotr Woźniak in 1987. Schedules reviews using an ease factor (EF) and interval that grows exponentially — showing cards just before you\'d forget them.',
    type: 'Conceptual',
  },
  {
    front: 'Define: Opportunity Cost',
    back: 'The value of the next-best alternative forgone when making a decision. If you spend 2 hours studying, the opportunity cost is the value of what else you could have done.',
    type: 'Definition',
  },
  {
    front: 'What is a neurotransmitter?',
    back: 'A chemical messenger released by neurons at synapses to transmit signals to other neurons, muscles, or glands. Examples: dopamine, serotonin, acetylcholine.',
    type: 'Definition',
  },
  {
    front: 'What is Big-O notation used for?',
    back: 'Describes the asymptotic upper bound of an algorithm\'s time or space complexity as input size grows. O(n) = linear, O(log n) = logarithmic, O(n²) = quadratic.',
    type: 'Conceptual',
  },
]

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Card Generation',
    desc: 'Drop any PDF — textbook, lecture slides, research paper. Our AI reads and generates comprehensive flashcards in seconds: definitions, concepts, worked examples, and edge cases.',
    color: '#7c6aff',
    glow: 'rgba(124,106,255,0.25)',
    bg: 'rgba(124,106,255,0.08)',
  },
  {
    icon: Brain,
    title: 'Spaced Repetition',
    desc: 'Powered by the proven SM-2 algorithm. Cards you know well fade away. Cards you struggle with resurface more often — until you\'ve truly mastered them.',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.25)',
    bg: 'rgba(34,197,94,0.08)',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    desc: 'Track your learning with GitHub-style heatmaps, retention curves, accuracy charts, and per-deck mastery breakdowns. Know exactly where to focus.',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.25)',
    bg: 'rgba(56,189,248,0.08)',
  },
  {
    icon: Layers,
    title: '6 Smart Card Types',
    desc: 'Definition, Conceptual, Example, Cloze, Basic, and Edge Case. Each type is tuned for a different kind of knowledge — so nothing slips through the cracks.',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.25)',
    bg: 'rgba(249,115,22,0.08)',
  },
]

const TESTIMONIALS = [
  {
    name: 'Priya M.',
    role: 'Medical Student, Year 3',
    text: 'I used to spend hours making flashcards manually. Recallio generates 40 cards from a lecture PDF in under a minute. My retention has genuinely gone up this semester.',
    rating: 5,
    initials: 'PM',
    color: '#7c6aff',
  },
  {
    name: 'James T.',
    role: 'CS Graduate Student',
    text: 'The SM-2 scheduling is on another level. I\'ve been studying algorithms for FAANG interviews and spaced repetition makes sure nothing fades. Best study tool I\'ve used.',
    rating: 5,
    initials: 'JT',
    color: '#22c55e',
  },
  {
    name: 'Sofia R.',
    role: 'Law Student',
    text: 'Finally a study tool that doesn\'t feel like a chore. The UI is gorgeous and the AI understands legal nuance when generating cards. I\'m actually looking forward to review sessions.',
    rating: 5,
    initials: 'SR',
    color: '#38bdf8',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function RecallioLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = size === 'lg' ? 52 : size === 'md' ? 36 : 28
  const zapSize = size === 'lg' ? 26 : size === 'md' ? 18 : 14
  const nameSize = size === 'lg' ? 28 : size === 'md' ? 17 : 14
  const tagSize = size === 'lg' ? 11 : 9

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size === 'lg' ? 16 : 10 }}>
      <div style={{
        width: iconSize, height: iconSize, borderRadius: size === 'lg' ? 16 : 10,
        background: 'linear-gradient(135deg, #7c6aff 0%, #a594ff 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 24px rgba(124,106,255,0.55), 0 0 60px rgba(124,106,255,0.2)',
        flexShrink: 0,
      }}>
        <Zap size={zapSize} color="#fff" />
      </div>
      <div>
        <div style={{
          fontWeight: 800, fontSize: nameSize, color: '#f0f0ff',
          letterSpacing: '-0.6px', fontFamily: "'Syne', 'Space Grotesk', sans-serif",
          lineHeight: 1,
        }}>
          Recallio
        </div>
        <div style={{
          fontSize: tagSize, color: 'rgba(240,240,255,0.35)',
          letterSpacing: '1.5px', marginTop: 2, textTransform: 'uppercase',
          fontWeight: 500,
        }}>
          Designed for perfect recall
        </div>
      </div>
    </div>
  )
}

function CyclingWord() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % CYCLING_WORDS.length), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <span style={{ display: 'inline-block', minWidth: 220, position: 'relative' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #7c6aff 0%, #a594ff 45%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {CYCLING_WORDS[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function FloatingOrb({ x, y, size, color, delay = 0 }: { x: string; y: string; size: number; color: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function NavBar({ onEnter }: { onEnter: () => void }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 68,
        background: scrolled ? 'rgba(10,10,15,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(42,42,58,0.5)' : '1px solid transparent',
        transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
      }}
    >
      <RecallioLogo size="sm" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <motion.button
          whileHover={{ color: '#f0f0ff' }}
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            background: 'none', border: 'none', color: 'rgba(240,240,255,0.5)',
            fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '8px 12px',
          }}
        >
          Features
        </motion.button>
        <motion.button
          whileHover={{ color: '#f0f0ff' }}
          onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            background: 'none', border: 'none', color: 'rgba(240,240,255,0.5)',
            fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '8px 12px',
          }}
        >
          Demo
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(124,106,255,0.65)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onEnter}
          style={{
            padding: '9px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14,
            background: 'linear-gradient(135deg, #7c6aff 0%, #a594ff 100%)',
            color: '#fff', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 20px rgba(124,106,255,0.45)',
          }}
        >
          Enter App <ChevronRight size={14} />
        </motion.button>
      </div>
    </motion.nav>
  )
}

function HeroSection({ onStart }: { onStart: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Ambient orbs */}
      <FloatingOrb x="10%" y="20%" size={500} color="rgba(124,106,255,0.12)" delay={0} />
      <FloatingOrb x="70%" y="60%" size={400} color="rgba(34,197,94,0.08)" delay={1.5} />
      <FloatingOrb x="50%" y="10%" size={300} color="rgba(56,189,248,0.07)" delay={0.8} />

      <motion.div style={{ y, opacity, position: 'relative', zIndex: 1, maxWidth: 900, width: '100%' }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 100,
            background: 'rgba(124,106,255,0.1)',
            border: '1px solid rgba(124,106,255,0.35)',
            marginBottom: 36, fontSize: 13, color: '#a594ff', fontWeight: 600,
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#22c55e', boxShadow: '0 0 10px #22c55e',
            display: 'inline-block', flexShrink: 0,
          }} />
          Powered by Groq · llama-3.3-70b · SM-2 Algorithm
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(54px, 9vw, 100px)',
            fontWeight: 800, lineHeight: 1.0,
            color: '#f0f0ff', margin: '0 0 20px',
            letterSpacing: '-3.5px',
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
          }}
        >
          Study <CyclingWord />
          <br />
          <span style={{ color: 'rgba(240,240,255,0.28)', fontWeight: 700, letterSpacing: '-2px' }}>
            Remember everything.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontSize: 20, color: 'rgba(240,240,255,0.52)', maxWidth: 520,
            lineHeight: 1.7, margin: '0 auto 44px', fontWeight: 400,
          }}
        >
          Upload any PDF. Get AI-generated flashcards. Let spaced repetition
          cement knowledge into long-term memory. Actually learn — not just cram.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 24px 64px rgba(124,106,255,0.65)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            style={{
              padding: '17px 36px', borderRadius: 14, fontWeight: 700, fontSize: 16,
              background: 'linear-gradient(135deg, #7c6aff 0%, #a594ff 100%)',
              color: '#fff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 8px 32px rgba(124,106,255,0.55)',
            }}
          >
            Start Learning Free
            <ArrowRight size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.09)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '17px 36px', borderRadius: 14, fontWeight: 600, fontSize: 16,
              background: 'rgba(255,255,255,0.05)', color: 'rgba(240,240,255,0.8)',
              border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <Play size={16} /> See Demo
          </motion.button>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          style={{
            display: 'flex', gap: 0, marginTop: 80,
            background: 'rgba(22,22,31,0.65)',
            border: '1px solid rgba(42,42,58,0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: 20, overflow: 'hidden',
            flexWrap: 'wrap', justifyContent: 'center',
          }}
        >
          {[
            { value: '6', label: 'Card Types', color: '#a594ff' },
            { value: 'SM-2', label: 'Algorithm', color: '#22c55e' },
            { value: 'AI', label: 'Powered', color: '#38bdf8' },
            { value: '∞', label: 'Decks', color: '#f97316' },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                textAlign: 'center', padding: '24px 40px',
                borderRight: i < 3 ? '1px solid rgba(42,42,58,0.6)' : 'none',
              }}
            >
              <div style={{
                fontSize: 30, fontWeight: 800, color: s.color,
                fontFamily: "'Syne', sans-serif",
                textShadow: `0 0 20px ${s.color}66`,
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(240,240,255,0.35)', marginTop: 4, letterSpacing: '1px', textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

function DemoSection() {
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = DEMO_CARDS[cardIdx]

  const nextCard = () => {
    setFlipped(false)
    setTimeout(() => setCardIdx(i => (i + 1) % DEMO_CARDS.length), 320)
  }

  const prevCard = () => {
    setFlipped(false)
    setTimeout(() => setCardIdx(i => (i - 1 + DEMO_CARDS.length) % DEMO_CARDS.length), 320)
  }

  return (
    <section id="demo" style={{ padding: '100px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <div style={{
            display: 'inline-block', fontSize: 12, color: '#7c6aff',
            fontWeight: 700, letterSpacing: '3px', marginBottom: 16,
            textTransform: 'uppercase',
          }}>
            Interactive Demo
          </div>
          <h2 style={{
            fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, color: '#f0f0ff',
            margin: '0 0 16px', letterSpacing: '-2px',
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
          }}>
            Feel the difference
          </h2>
          <p style={{ color: 'rgba(240,240,255,0.45)', fontSize: 17, maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
            Click the card to flip it. This is exactly how review sessions feel in Recallio.
          </p>
        </motion.div>

        {/* Flashcard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Card scene */}
          <div style={{ perspective: '1400px', marginBottom: 24, cursor: 'pointer' }} onClick={() => setFlipped(f => !f)}>
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.58, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformStyle: 'preserve-3d', height: 280, position: 'relative' }}
            >
              {/* Front */}
              <div style={{
                position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                borderRadius: 24, padding: '36px 40px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                background: 'linear-gradient(145deg, rgba(28,28,42,0.97) 0%, rgba(20,20,32,0.97) 100%)',
                border: '1px solid rgba(60,60,80,0.7)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 11, padding: '4px 12px', borderRadius: 8, fontWeight: 700,
                    background: 'rgba(124,106,255,0.18)', color: '#a594ff', letterSpacing: '0.5px',
                  }}>
                    {card.type}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(240,240,255,0.28)' }}>Tap to reveal →</span>
                </div>
                <p style={{
                  fontSize: 22, fontWeight: 600, color: '#f0f0ff',
                  textAlign: 'center', lineHeight: 1.55, margin: 0,
                }}>
                  {card.front}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {DEMO_CARDS.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: i === cardIdx ? 20 : 6, height: 6,
                        borderRadius: 3, transition: 'all 0.3s',
                        background: i === cardIdx ? '#7c6aff' : 'rgba(255,255,255,0.15)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Back */}
              <div style={{
                position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                borderRadius: 24, padding: '36px 40px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                background: 'linear-gradient(145deg, rgba(32,26,56,0.98) 0%, rgba(22,20,44,0.98) 100%)',
                border: '1px solid rgba(124,106,255,0.45)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(124,106,255,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 11, padding: '4px 12px', borderRadius: 8, fontWeight: 700,
                    background: 'rgba(124,106,255,0.18)', color: '#a594ff', letterSpacing: '0.5px',
                  }}>
                    {card.type}
                  </span>
                  <span style={{
                    fontSize: 11, padding: '4px 12px', borderRadius: 8, fontWeight: 700,
                    background: 'rgba(34,197,94,0.15)', color: '#22c55e',
                  }}>
                    Answer ✓
                  </span>
                </div>
                <p style={{
                  fontSize: 17, color: 'rgba(240,240,255,0.88)',
                  textAlign: 'center', lineHeight: 1.75, margin: 0,
                }}>
                  {card.back}
                </p>
                <div style={{ height: 18 }} />
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={prevCard}
              style={{
                padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: 'rgba(255,255,255,0.05)', color: 'rgba(240,240,255,0.55)',
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
              }}
            >
              ← Prev
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setFlipped(f => !f)}
              style={{
                padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                background: flipped ? 'rgba(34,197,94,0.15)' : 'rgba(124,106,255,0.18)',
                color: flipped ? '#22c55e' : '#a594ff',
                border: `1px solid ${flipped ? 'rgba(34,197,94,0.3)' : 'rgba(124,106,255,0.35)'}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <RotateCcw size={13} />
              {flipped ? 'Hide Answer' : 'Show Answer'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={nextCard}
              style={{
                padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: 'rgba(255,255,255,0.05)', color: 'rgba(240,240,255,0.55)',
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
              }}
            >
              Next →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" style={{ padding: '100px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{
            display: 'inline-block', fontSize: 12, color: '#7c6aff',
            fontWeight: 700, letterSpacing: '3px', marginBottom: 16, textTransform: 'uppercase',
          }}>
            Why Recallio
          </div>
          <h2 style={{
            fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, color: '#f0f0ff',
            margin: '0 0 16px', letterSpacing: '-2px',
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
          }}>
            Built different
          </h2>
          <p style={{ color: 'rgba(240,240,255,0.45)', fontSize: 17, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Every feature is designed around one goal: making you actually remember what you learn.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, boxShadow: `0 24px 60px rgba(0,0,0,0.4), 0 0 40px ${f.glow}` }}
                style={{
                  padding: '32px', borderRadius: 20, cursor: 'default',
                  background: 'rgba(22,22,31,0.7)',
                  border: '1px solid rgba(42,42,58,0.8)',
                  backdropFilter: 'blur(12px)',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14, marginBottom: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: f.bg,
                  boxShadow: `0 0 20px ${f.glow}`,
                }}>
                  <Icon size={24} style={{ color: f.color }} />
                </div>
                <h3 style={{
                  fontSize: 17, fontWeight: 700, color: '#f0f0ff',
                  margin: '0 0 10px', letterSpacing: '-0.3px',
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(240,240,255,0.48)', lineHeight: 1.75, margin: 0 }}>
                  {f.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section style={{ padding: '100px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{
            display: 'inline-block', fontSize: 12, color: '#7c6aff',
            fontWeight: 700, letterSpacing: '3px', marginBottom: 16, textTransform: 'uppercase',
          }}>
            Social Proof
          </div>
          <h2 style={{
            fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, color: '#f0f0ff',
            margin: '0 0 16px', letterSpacing: '-2px',
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
          }}>
            Students love it
          </h2>
          <p style={{ color: 'rgba(240,240,255,0.45)', fontSize: 17, maxWidth: 420, margin: '0 auto', lineHeight: 1.7 }}>
            Real students. Real results. Real retention.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              style={{
                padding: '28px', borderRadius: 20,
                background: 'rgba(22,22,31,0.7)',
                border: '1px solid rgba(42,42,58,0.8)',
                backdropFilter: 'blur(12px)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Glow accent */}
              <div style={{
                position: 'absolute', top: -40, right: -40,
                width: 120, height: 120, borderRadius: '50%',
                background: `radial-gradient(circle, ${t.color}22 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 18 }}>
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} size={13} style={{ color: '#eab308', fill: '#eab308' }} />
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontSize: 15, color: 'rgba(240,240,255,0.72)',
                lineHeight: 1.75, margin: '0 0 24px', fontStyle: 'italic',
              }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${t.color}66, ${t.color}33)`,
                  border: `1px solid ${t.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: t.color,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f0ff' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(240,240,255,0.4)', marginTop: 1 }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ onStart }: { onStart: () => void }) {
  return (
    <section style={{ padding: '100px 24px 140px', position: 'relative' }}>
      <FloatingOrb x="20%" y="20%" size={400} color="rgba(124,106,255,0.1)" delay={0} />
      <FloatingOrb x="60%" y="50%" size={300} color="rgba(165,148,255,0.08)" delay={2} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: 680, margin: '0 auto', textAlign: 'center',
          padding: '72px 48px', borderRadius: 28, position: 'relative',
          background: 'rgba(22,22,31,0.7)',
          border: '1px solid rgba(124,106,255,0.25)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 0 80px rgba(124,106,255,0.12), 0 40px 80px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Inner glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center top, rgba(124,106,255,0.1) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 100, marginBottom: 28,
            background: 'rgba(124,106,255,0.12)',
            border: '1px solid rgba(124,106,255,0.3)',
            fontSize: 13, color: '#a594ff', fontWeight: 600,
          }}>
            <Zap size={13} /> Free to use · No account required
          </div>

          <h2 style={{
            fontSize: 'clamp(40px, 6vw, 62px)', fontWeight: 800, color: '#f0f0ff',
            margin: '0 0 20px', lineHeight: 1.1, letterSpacing: '-2.5px',
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
          }}>
            Transform how
            <br />
            you learn. Today.
          </h2>

          <p style={{
            fontSize: 18, color: 'rgba(240,240,255,0.5)',
            lineHeight: 1.7, margin: '0 0 40px', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Stop forgetting what you study. Start building real, lasting knowledge with Recallio.
          </p>

          <motion.button
            whileHover={{ scale: 1.06, boxShadow: '0 24px 72px rgba(124,106,255,0.7)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            style={{
              padding: '18px 48px', borderRadius: 14, fontWeight: 800, fontSize: 17,
              background: 'linear-gradient(135deg, #7c6aff 0%, #a594ff 100%)',
              color: '#fff', border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 10,
              boxShadow: '0 8px 40px rgba(124,106,255,0.55)',
              letterSpacing: '-0.3px',
            }}
          >
            Start Learning Free <ArrowRight size={20} />
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(42,42,58,0.6)',
      padding: '32px 48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(10,10,15,0.5)',
      flexWrap: 'wrap', gap: 16,
    }}>
      <RecallioLogo size="sm" />
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {['Groq API', 'FastAPI', 'SM-2 SRS', 'React 19'].map(t => (
          <span key={t} style={{ fontSize: 12, color: 'rgba(240,240,255,0.25)', letterSpacing: '0.5px' }}>
            {t}
          </span>
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(240,240,255,0.2)' }}>
        © 2025 Recallio
      </div>
    </footer>
  )
}

// ─── Background canvas (stars + grid) ────────────────────────────────────────

function LandingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let raf = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 3
    }
    resize()
    window.addEventListener('resize', resize)

    // Grid
    const drawGrid = () => {
      const spacing = 72
      ctx.strokeStyle = 'rgba(124,106,255,0.04)'
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
      }
    }

    // Stars
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
    }))

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawGrid()

      stars.forEach(s => {
        s.phase += s.speed
        const a = s.opacity * (0.5 + 0.5 * Math.sin(s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,190,255,${a})`
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }
    draw(0)

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  )
}

// ─── Main Landing Page ────────────────────────────────────────────────────────

export function Landing() {
  const navigate = useNavigate()
  const { name } = useUserStore()

  const handleEnter = () => {
    if (name) {
      navigate('/dashboard')
    } else {
      navigate('/onboarding')
    }
  }

  return (
    <div style={{
      background: '#07070e',
      minHeight: '100vh',
      fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <LandingBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <NavBar onEnter={handleEnter} />
        <HeroSection onStart={handleEnter} />
        <DemoSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection onStart={handleEnter} />
        <Footer />
      </div>
    </div>
  )
}
