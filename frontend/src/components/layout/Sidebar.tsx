import { useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Upload, BookOpen, Layers,
  BarChart3, History, Info, Zap, LogOut,
} from 'lucide-react'
import { useUserStore } from '../../store/userStore'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload PDF', icon: Upload },
  { to: '/review', label: 'Review', icon: BookOpen },
  { to: '/decks', label: 'Decks', icon: Layers },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/history', label: 'History', icon: History },
  { to: '/about', label: 'About', icon: Info },
]

function MagneticNavItem({ to, label, icon: Icon }: typeof links[0]) {
  const itemRef = useRef<HTMLAnchorElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = itemRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`
    el.style.transition = 'transform 0.1s linear'
  }

  const onLeave = () => {
    const el = itemRef.current
    if (!el) return
    el.style.transform = 'translate(0,0)'
    el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)'
  }

  return (
    <NavLink
      ref={itemRef}
      to={to}
      end={to === '/dashboard'}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="nav-item"
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 12px', borderRadius: '10px',
        fontSize: '14px', fontWeight: 500,
        textDecoration: 'none', position: 'relative', overflow: 'hidden',
        color: isActive ? '#fff' : 'var(--text-secondary)',
        background: isActive
          ? 'linear-gradient(135deg, var(--accent) 0%, #a594ff 100%)'
          : 'transparent',
        boxShadow: isActive ? '0 4px 20px rgba(124,106,255,0.4)' : 'none',
        transition: 'color 0.2s, background 0.2s, box-shadow 0.2s',
      })}
    >
      {({ isActive }) => (
        <>
          {!isActive && (
            <span
              className="nav-hover-bg"
              style={{
                position: 'absolute', inset: 0, borderRadius: 'inherit',
                background: 'linear-gradient(135deg, rgba(124,106,255,0.15) 0%, rgba(124,106,255,0.05) 100%)',
                opacity: 0, transition: 'opacity 0.25s', pointerEvents: 'none',
              }}
            />
          )}
          <Icon
            size={16}
            style={{
              flexShrink: 0, position: 'relative', zIndex: 1,
              filter: isActive ? 'drop-shadow(0 0 6px rgba(255,255,255,0.6))' : 'none',
            }}
          />
          <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
          {isActive && (
            <span
              style={{
                position: 'absolute', right: 10, width: 6, height: 6,
                borderRadius: '50%', background: 'rgba(255,255,255,0.8)',
                boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                animation: 'pulse-dot 2s ease-in-out infinite',
              }}
            />
          )}
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  const { name, clearName } = useUserStore()
  const navigate = useNavigate()

  const handleSignOut = () => {
    clearName()
    navigate('/')
  }

  return (
    <>
      <style>{`
        .nav-item:hover .nav-hover-bg { opacity: 1 !important; }
        .nav-item:hover { color: var(--text-primary) !important; }
        @keyframes pulse-dot {
          0%,100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        @keyframes logo-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .logo-icon:hover { animation: logo-spin 0.6s ease; }
      `}</style>

      <aside
        style={{
          background: 'rgba(17,17,24,0.85)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(42,42,58,0.8)',
          width: 240, flexShrink: 0,
          height: '100vh', display: 'flex', flexDirection: 'column',
          position: 'sticky', top: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            className="logo-icon"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent) 0%, #a594ff 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(124,106,255,0.5)',
              cursor: 'default', flexShrink: 0,
            }}
          >
            <Zap size={18} color="#fff" />
          </div>
          <div>
            <div style={{
              fontWeight: 800, fontSize: 17, color: 'var(--text-primary)', lineHeight: 1,
              letterSpacing: '-0.4px', fontFamily: "'Syne', 'Space Grotesk', sans-serif",
            }}>
              Recallio
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Perfect Recall
            </div>
          </div>
        </div>

        {/* User greeting */}
        {name && (
          <div style={{
            margin: '0 12px 4px',
            padding: '10px 12px', borderRadius: 10,
            background: 'rgba(124,106,255,0.08)',
            border: '1px solid rgba(124,106,255,0.15)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: 2 }}>
              STUDYING AS
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              👋 {name}
            </div>
          </div>
        )}

        <div style={{ height: 1, background: 'var(--border)', margin: '8px 12px' }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {links.map(l => <MagneticNavItem key={l.to} {...l} />)}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Sign out */}
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 12px', borderRadius: 10, border: 'none',
              background: 'transparent', cursor: 'pointer', width: '100%',
              color: 'var(--text-muted)', fontSize: 13, fontWeight: 500,
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#ef4444'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
            }}
          >
            <LogOut size={14} /> Back to Landing
          </button>

          <div style={{
            fontSize: 11, color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 12px',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--green)', boxShadow: '0 0 6px var(--green)',
            }} />
            Groq · SM-2 · SQLite
          </div>
        </div>
      </aside>
    </>
  )
}
