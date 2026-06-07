// app-pwa.jsx — production full-screen shell (no device frame, no tweaks)
const { useState: useStatePWA, useEffect: useEffectPWA } = React;

const PWA_TABS = [
  { id: 'milk', label: '奶咖配方', icon: 'cup' },
  { id: 'iced', label: '冰手冲',   icon: 'ice' },
];

function PWATabBar({ tab, setTab }) {
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40,
      paddingTop: 10, paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
      background: 'linear-gradient(0deg, var(--bg) 64%, transparent)',
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex', gap: 4,
        background: 'var(--card)', border: '1px solid var(--card-border)',
        borderRadius: 999, padding: 6,
        boxShadow: '0 8px 26px -10px rgba(40,30,10,0.28)',
      }}>
        {PWA_TABS.map(t => {
          const active = t.id === tab;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              appearance: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
              padding: active ? '11px 18px' : '11px 14px',
              borderRadius: 999, transition: 'all .2s ease',
              background: active ? 'var(--gold)' : 'transparent',
              color: active ? '#fff' : 'var(--ink2)',
            }}>
              <Icon name={t.icon} size={21} stroke={active ? '#fff' : 'var(--ink2)'} />
              {active && <span style={{ fontSize: 14.5, fontWeight: 700, fontFamily: 'var(--cjk)', whiteSpace: 'nowrap' }}>{t.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PWAApp() {
  const [tab, setTab] = useStatePWA(() => localStorage.getItem('cc.tab') || 'milk');
  useEffectPWA(() => { localStorage.setItem('cc.tab', tab); }, [tab]);

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg)',
      color: 'var(--ink)', fontFamily: 'var(--cjk)', position: 'relative',
    }}>
      {/* gold light at bottom */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, height: 260, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(120% 80% at 50% 130%, var(--bgWave), transparent 70%)',
      }} />
      {/* scroll content; top respects the notch / status bar */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 520, margin: '0 auto',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)',
      }}>
        {tab === 'milk' && <MilkCoffee />}
        {tab === 'iced' && <IcedPourOver />}
      </div>
      <PWATabBar tab={tab} setTab={setTab} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PWAApp />);
