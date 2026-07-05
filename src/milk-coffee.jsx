// milk-coffee.jsx — 奶咖配方计算器 (primary). Implements the Excel formula live.
import { useState } from 'react';
import { Card, SectionLabel, Chip, Slider, Icon, fmt } from './shared';

// coef = 打发膨胀系数，每个杯型有推荐默认值
export const CUP_PRESETS = [
  { name: 'Cortado',    cn: '可塔朵',   vol: 120, n: 1.5, coef: 1.00, emoji: '☕' },
  { name: '短笛咖啡',    cn: 'Piccolo',  vol:  90, n: 2.0, coef: 1.10, emoji: '🥛' },
  { name: 'Flat White', cn: '馥芮白',   vol: 160, n: 3.0, coef: 1.15, emoji: '🤍' },
  { name: '拿铁 小',     cn: 'Latte S',  vol: 200, n: 4.0, coef: 1.25, emoji: '🥤' },
  { name: '拿铁 中',     cn: 'Latte M',  vol: 250, n: 4.0, coef: 1.25, emoji: '🥤' },
  { name: '拿铁 大',     cn: 'Latte L',  vol: 300, n: 5.0, coef: 1.25, emoji: '🧋' },
  { name: 'Cappuccino', cn: '卡布奇诺', vol: 150, n: 3.0, coef: 1.40, emoji: '☕' },
];

export const VOLS  = [90, 120, 150, 160, 180, 200, 220, 250, 300, 350, 400];
export const COEFS = [1.00, 1.10, 1.15, 1.20, 1.25, 1.30, 1.40, 1.50];

// ── 杯型预设 Chip（emoji + 中文名 + 容量·系数） ─────────────────────────────
function CupChip({ preset, active, onClick }) {
  const label = preset.cn || preset.name;
  return (
    <button onClick={onClick} style={{
      appearance: 'none', border: 'none', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      padding: '10px 14px',
      background: active ? 'var(--gold)' : 'var(--goldTint)',
      borderRadius: 16, flexShrink: 0,
      transition: 'all .16s ease',
      boxShadow: active ? '0 4px 14px -4px var(--gold)' : 'none',
    }}>
      <span style={{ fontSize: 24, lineHeight: 1 }}>{preset.emoji}</span>
      <span style={{
        fontSize: 13, fontWeight: 700, fontFamily: 'var(--cjk)',
        color: active ? '#fff' : 'var(--ink)',
        whiteSpace: 'nowrap', marginTop: 2,
      }}>{label}</span>
      <span style={{
        fontSize: 10, fontFamily: 'var(--num)',
        color: active ? 'rgba(255,255,255,0.8)' : 'var(--ink3)',
        whiteSpace: 'nowrap',
      }}>{preset.vol}ml · ×{preset.coef.toFixed(2)}</span>
    </button>
  );
}

// ── 玻璃杯分层可视化 ────────────────────────────────────────────────────────
function GlassViz({ esp, rawMilk, foam, vol }) {
  const h = v => `${Math.max(0, (v / vol) * 100)}%`;
  return (
    <div style={{ width: 96, height: 132, position: 'relative', flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '14px 14px 22px 22px',
        border: '2.5px solid var(--ink)', opacity: 0.92,
        overflow: 'hidden', background: 'var(--goldTint)',
        display: 'flex', flexDirection: 'column-reverse',
      }}>
        <div style={{ height: h(esp), background: 'linear-gradient(180deg,#7a4d2a,var(--espresso))', transition: 'height .35s cubic-bezier(.4,1.2,.5,1)' }} />
        <div style={{ height: h(rawMilk), background: 'var(--milk)', transition: 'height .35s cubic-bezier(.4,1.2,.5,1)' }} />
        <div style={{ height: h(foam), background: 'var(--foam)', transition: 'height .35s cubic-bezier(.4,1.2,.5,1)' }} />
      </div>
    </div>
  );
}

function LegendDot({ color, label, value, unit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 11, height: 11, borderRadius: 3, background: color, flexShrink: 0, border: '1px solid rgba(0,0,0,0.08)' }} />
      <span style={{ fontSize: 13, color: 'var(--ink2)', flex: 1 }}>{label}</span>
      <span style={{ fontFamily: 'var(--num)', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>
        {value}<span style={{ fontSize: 11, color: 'var(--ink3)', marginLeft: 2 }}>{unit}</span>
      </span>
    </div>
  );
}

// ── 主组件 ──────────────────────────────────────────────────────────────────
export function MilkCoffee() {
  const [vol,  setVol]  = useState(250);
  const [n,    setN]    = useState(4.0);
  const [coef, setCoef] = useState(1.25);

  // 配方公式
  const esp        = vol / (1 + coef * n);
  const foamedMilk = vol - esp;
  const rawMilk    = foamedMilk / coef;
  const foam       = foamedMilk - rawMilk;
  const check      = esp + foamedMilk;

  // 匹配预设：vol + n + coef 三者同时对齐
  const activePreset = CUP_PRESETS.find(
    p => p.vol === vol && p.n === n && Math.abs(p.coef - coef) < 0.001
  );

  // 选中预设同时设置 vol / n / coef
  function selectPreset(p) { setVol(p.vol); setN(p.n); setCoef(p.coef); }

  const heroLabel = activePreset
    ? `${activePreset.name}${activePreset.cn ? ' · ' + activePreset.cn : ''} · 1:${n}`
    : `${vol}ml · 1:${n}`;

  return (
    <div style={{ padding: '0 16px 124px' }}>

      {/* ── 标题 ── */}
      <div style={{ padding: '8px 2px 18px' }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--ink)', letterSpacing: 0.4, lineHeight: 1.15 }}>
          奶咖<span style={{ color: 'var(--gold)' }}>配方</span>计算器
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--ink2)', marginTop: 5 }}>
          Flair 58 · 选杯型与比例，自动算出浓缩与牛奶
        </div>
      </div>

      {/* ── Hero 结果卡 ── */}
      <Card pad={20} style={{ marginBottom: 16, background: 'linear-gradient(160deg, var(--card), var(--goldTint))' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <GlassViz esp={esp} rawMilk={rawMilk} foam={foam} vol={vol} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink2)', fontWeight: 600 }}>{heroLabel}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginTop: 2 }}>
              <span style={{ fontFamily: 'var(--num)', fontWeight: 'var(--numW)', fontSize: 46, lineHeight: 1, color: 'var(--gold)' }}>
                {fmt(esp, 1)}
              </span>
              <span style={{ fontSize: 16, color: 'var(--ink2)', fontWeight: 600, paddingBottom: 5, whiteSpace: 'nowrap' }}>g 浓缩</span>
            </div>
            <div style={{ height: 1, background: 'var(--card-border)', margin: '12px 0' }} />
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
              <span style={{ fontFamily: 'var(--num)', fontWeight: 'var(--numW)', fontSize: 32, lineHeight: 1, color: 'var(--ink)' }}>
                {fmt(rawMilk, 0)}
              </span>
              <span style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 600, paddingBottom: 3 }}>ml 牛奶</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 9, marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--card-border)' }}>
          <LegendDot color="var(--espresso)" label="浓缩液重"         value={fmt(esp, 1)}      unit="g"  />
          <LegendDot color="var(--milk)"     label="原始牛奶用量"     value={fmt(rawMilk, 0)}  unit="ml" />
          <LegendDot color="var(--foam)"     label="奶泡体积（参考）" value={fmt(foam, 0)}     unit="ml" />
        </div>
      </Card>

      {/* ── 1. 杯型预设 ── */}
      <Card style={{ marginBottom: 14 }}>
        <SectionLabel index="1">杯型预设</SectionLabel>
        <div
          style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, margin: '0 -2px' }}
          className="hscroll"
        >
          {CUP_PRESETS.map(p => (
            <CupChip
              key={p.name}
              preset={p}
              active={!!activePreset && activePreset.name === p.name}
              onClick={() => selectPreset(p)}
            />
          ))}
        </div>
        {activePreset && (
          <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 10 }}>
            {activePreset.name}{activePreset.cn ? ` · ${activePreset.cn}` : ''} · {activePreset.vol}ml · 1:{activePreset.n} · 打发系数 ×{activePreset.coef.toFixed(2)}
          </div>
        )}
      </Card>

      {/* ── 2. 杯容量（自定义） ── */}
      <Card style={{ marginBottom: 14 }}>
        <SectionLabel index="2" right={<span style={{ fontSize: 13, color: 'var(--ink3)' }}>{vol} ml</span>}>
          杯容量
        </SectionLabel>
        <div
          style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, margin: '0 -2px' }}
          className="hscroll"
        >
          {VOLS.map(v => <Chip key={v} active={v === vol} onClick={() => setVol(v)}>{v}</Chip>)}
        </div>
      </Card>

      {/* ── 3. 牛奶比例 N ── */}
      <Card style={{ marginBottom: 14 }}>
        <SectionLabel index="3" right={
          <span style={{ fontFamily: 'var(--num)', fontWeight: 700, fontSize: 18, color: 'var(--gold)', whiteSpace: 'nowrap' }}>
            1 : {n.toFixed(1)}
          </span>
        }>牛奶比例 N</SectionLabel>
        <Slider value={n} min={1} max={8} step={0.5} onChange={setN} format={x => `1:${x}`} />
        <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 6 }}>
          根据咖啡豆烘焙度调整，深烘豆适当增加牛奶比例
        </div>
      </Card>

      {/* ── 4. 打发膨胀系数 ── */}
      <Card style={{ marginBottom: 14 }}>
        <SectionLabel index="4" right={<span style={{ fontSize: 13, color: 'var(--ink3)' }}>默认 1.25</span>}>
          打发膨胀系数
        </SectionLabel>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {COEFS.map(c => (
            <Chip key={c} active={Math.abs(c - coef) < 0.001} onClick={() => setCoef(c)}>
              {c.toFixed(2)}
            </Chip>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 10 }}>
          不打发=1.00 · 短笛≈1.10 · 馥芮白≈1.15 · 拿铁≈1.20~1.30 · 卡布≈1.30~1.50
        </div>
      </Card>

      {/* ── 明细与校验 ── */}
      <Card>
        <SectionLabel>明细与校验</SectionLabel>
        <div style={{ display: 'grid', gap: 11 }}>
          <DetailRow label="浓缩液重"       formula="容量 ÷ (1 + 系数 × N)"   value={fmt(esp, 1)}        unit="g"  />
          <DetailRow label="打发后牛奶体积"  formula="容量 − 浓缩液重"          value={fmt(foamedMilk, 0)} unit="ml" />
          <DetailRow label="原始牛奶用量"    formula="打发后牛奶 ÷ 系数"        value={fmt(rawMilk, 0)}    unit="ml" />
          <DetailRow label="奶泡体积"        formula="打发后牛奶 − 原始牛奶"    value={fmt(foam, 0)}       unit="ml" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '11px 14px', borderRadius: 14, background: 'var(--goldTint)' }}>
          <span style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={14} stroke="#fff" sw={2.6} />
          </span>
          <span style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 600, flex: 1 }}>合计校验</span>
          <span style={{ fontFamily: 'var(--num)', fontWeight: 700, fontSize: 14.5, color: 'var(--ink)' }}>
            浓缩 + 牛奶 = {fmt(check, 0)} ml
          </span>
        </div>
      </Card>
    </div>
  );
}

function DetailRow({ label, formula, value, unit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, color: 'var(--ink)', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink3)', fontFamily: 'var(--num)' }}>{formula}</div>
      </div>
      <span style={{ fontFamily: 'var(--num)', fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>{value}</span>
      <span style={{ fontSize: 12, color: 'var(--ink3)', marginLeft: 3, width: 22 }}>{unit}</span>
    </div>
  );
}
