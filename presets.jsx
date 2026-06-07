// presets.jsx — 预设对照 (cup type reference table, 系数统一 1.25)
function Presets() {
  const coef = 1.25;
  const rows = CUP_PRESETS.map(p => {
    const esp = p.vol / (1 + coef * p.n);
    const rawMilk = (p.vol - esp) / coef;
    return { ...p, esp, rawMilk };
  });
  return (
    <div style={{ padding: '0 16px 124px' }}>
      <div style={{ padding: '8px 2px 18px' }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--ink)', letterSpacing: 0.4, lineHeight: 1.15 }}>
          杯型<span style={{ color: 'var(--gold)' }}>预设</span>对照
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--ink2)', marginTop: 5 }}>常见奶咖杯型一览（打发系数统一 1.25）</div>
      </div>

      <Card pad={6}>
        {/* head */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px 8px', fontSize: 11.5, color: 'var(--ink3)', fontWeight: 600 }}>
          <span style={{ flex: 1 }}>杯型 / 比例</span>
          <span style={{ width: 64, textAlign: 'right' }}>浓缩 g</span>
          <span style={{ width: 64, textAlign: 'right' }}>牛奶 ml</span>
        </div>
        {rows.map((r, i) => (
          <div key={r.name} style={{
            display: 'flex', alignItems: 'center', padding: '13px 14px',
            borderTop: i ? '1px solid var(--card-border)' : 'none',
          }}>
            <span style={{ fontSize: 20, marginRight: 11, width: 24, textAlign: 'center' }}>{r.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 700 }}>{r.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink3)', fontFamily: 'var(--num)' }}>{r.vol}ml · 1:{r.n}{r.cn ? ` · ${r.cn}` : ''}</div>
            </div>
            <span style={{ width: 64, textAlign: 'right', fontFamily: 'var(--num)', fontWeight: 700, fontSize: 16, color: 'var(--gold)' }}>{fmt(r.esp, 1)}</span>
            <span style={{ width: 64, textAlign: 'right', fontFamily: 'var(--num)', fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{fmt(r.rawMilk, 0)}</span>
          </div>
        ))}
      </Card>

      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 14, padding: '0 4px' }}>
        <Icon name="info" size={16} stroke="var(--ink3)" />
        <span style={{ fontSize: 12.5, color: 'var(--ink2)', lineHeight: 1.5 }}>浓缩液重 + 打发后牛奶 = 杯容量。表中牛奶为实际称量用量，打发后体积会因系数膨胀。</span>
      </div>
    </div>
  );
}

Object.assign(window, { Presets });
