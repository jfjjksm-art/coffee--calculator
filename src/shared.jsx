// shared.jsx — theme maps, icons, primitive UI for the coffee calculator
import { useState, useEffect, useRef } from 'react';

// ── Palettes ───────────────────────────────────────────────
// Each palette is a flat token map applied as CSS variables on the device root.
export const PALETTES = {
  '焦糖金': {
    bg: '#F6F0E4', bgWave: 'rgba(201,154,63,0.16)',
    card: '#FFFFFF', cardBorder: 'rgba(120,92,40,0.09)',
    ink: '#221B12', ink2: '#8B7E6B', ink3: '#BDB09A',
    gold: '#C2912E', goldDeep: '#A9791F', goldSoft: '#F4E9CF', goldTint: '#FBF5E8',
    blue: '#2C6FDB', blueSoft: '#E5EEFB',
    espresso: '#603A1E', milk: '#F1E5CC', foam: '#FBF4E4',
    track: '#EFE7D6',
  },
  '拿铁棕': {
    bg: '#F4ECDF', bgWave: 'rgba(150,104,55,0.16)',
    card: '#FFFCF7', cardBorder: 'rgba(120,80,40,0.10)',
    ink: '#2A2017', ink2: '#8E7C66', ink3: '#C0B19B',
    gold: '#A56B33', goldDeep: '#8A5526', goldSoft: '#EFDCC4', goldTint: '#F8EEE0',
    blue: '#C2632B', blueSoft: '#F6E3D2',
    espresso: '#4E2C16', milk: '#EFE0C7', foam: '#FAF1DF',
    track: '#EBDFCB',
  },
  '冷萃蓝': {
    bg: '#F2F3EE', bgWave: 'rgba(44,111,219,0.12)',
    card: '#FFFFFF', cardBorder: 'rgba(50,70,110,0.09)',
    ink: '#1B2230', ink2: '#71798A', ink3: '#A9B0BE',
    gold: '#2C6FDB', goldDeep: '#1E59BC', goldSoft: '#DCE8FA', goldTint: '#EFF4FC',
    blue: '#C2912E', blueSoft: '#F4E9CF',
    espresso: '#3C2A18', milk: '#E9EDE6', foam: '#F6F8F4',
    track: '#E4E7E0',
  },
  '深色': {
    bg: '#100E0B', bgWave: 'rgba(217,174,85,0.10)',
    card: '#1B1813', cardBorder: 'rgba(255,255,255,0.07)',
    ink: '#F3ECDE', ink2: '#9D9484', ink3: '#6A6457',
    gold: '#D9AE55', goldDeep: '#E7C271', goldSoft: '#39301F', goldTint: '#211C13',
    blue: '#5C9BF2', blueSoft: '#1E2738',
    espresso: '#5A3417', milk: '#E7D8BB', foam: '#F3E9D0',
    track: '#2A251C',
  },
};

export const FONTS = {
  '默认': { cjk: "'Noto Sans SC', system-ui, sans-serif", num: "'Sora', system-ui, sans-serif", numWeight: 700 },
  '圆润': { cjk: "'Noto Sans SC', system-ui, sans-serif", num: "'Baloo 2', system-ui, sans-serif", numWeight: 700 },
  '等宽': { cjk: "'Noto Sans SC', system-ui, sans-serif", num: "'Space Mono', monospace", numWeight: 700 },
};

export const fmt = (n, d = 0) => {
  if (!isFinite(n)) return '—';
  const r = Number(n.toFixed(d));
  return r.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 });
};

// ── Icons (simple line glyphs) ─────────────────────────────
export function Icon({ name, size = 24, stroke = 'currentColor', sw = 1.9, fill = 'none' }) {
  const p = { fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    cup: <g><path {...p} d="M5 9h12v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V9Z"/><path {...p} d="M17 10h2.2a2.2 2.2 0 0 1 0 4.4H17"/><path {...p} d="M8 3c-.6 1 .6 1.6 0 2.6M12 3c-.6 1 .6 1.6 0 2.6"/></g>,
    ice: <g><path {...p} d="M12 4 6 7.2v6.6L12 17l6-3.2V7.2L12 4Z"/><path {...p} d="M12 4v13M6 7.2l12 6.6M18 7.2 6 13.8"/></g>,
    grid: <g><rect {...p} x="4" y="4" width="7" height="7" rx="1.6"/><rect {...p} x="13" y="4" width="7" height="7" rx="1.6"/><rect {...p} x="4" y="13" width="7" height="7" rx="1.6"/><rect {...p} x="13" y="13" width="7" height="7" rx="1.6"/></g>,
    chevR: <path {...p} d="m9 5 7 7-7 7"/>,
    check: <path {...p} d="m5 12 5 5L20 6"/>,
    minus: <path {...p} d="M5 12h14"/>,
    plus: <path {...p} d="M12 5v14M5 12h14"/>,
    info: <g><circle {...p} cx="12" cy="12" r="9"/><path {...p} d="M12 11v5M12 7.5v.5"/></g>,
    swap: <g><path {...p} d="M7 8h11l-3-3M17 16H6l3 3"/></g>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>{paths[name]}</svg>;
}

// ── Card ────────────────────────────────────────────────────
export function Card({ children, style = {}, pad = 18 }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius)', padding: pad,
      boxShadow: '0 1px 2px rgba(40,30,10,0.04), 0 8px 24px -16px rgba(40,30,10,0.18)',
      ...style,
    }}>{children}</div>
  );
}

// Section label like "1. 选杯型"
export function SectionLabel({ index, children, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        {index != null && <span style={{ fontFamily: 'var(--num)', fontWeight: 700, color: 'var(--gold)', fontSize: 18 }}>{index}</span>}
        <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', letterSpacing: 0.2 }}>{children}</span>
      </div>
      {right}
    </div>
  );
}

// Selectable chip
export function Chip({ active, onClick, children, sub }) {
  return (
    <button onClick={onClick} style={{
      appearance: 'none', cursor: 'pointer', border: 'none',
      background: active ? 'var(--gold)' : 'var(--goldTint)',
      color: active ? '#fff' : 'var(--ink2)',
      borderRadius: 13, padding: sub ? '8px 13px' : '9px 15px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
      transition: 'all .16s ease', flexShrink: 0,
      boxShadow: active ? '0 4px 12px -4px var(--gold)' : 'none',
    }}>
      <span style={{ fontFamily: 'var(--num)', fontWeight: 700, fontSize: 16, lineHeight: 1.1 }}>{children}</span>
      {sub && <span style={{ fontSize: 10.5, fontWeight: 500, opacity: .8 }}>{sub}</span>}
    </button>
  );
}

// Segmented control
export function Segmented({ value, options, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'var(--track)', borderRadius: 13, padding: 3, gap: 3 }}>
      {options.map(o => {
        const v = typeof o === 'object' ? o.value : o;
        const label = typeof o === 'object' ? o.label : o;
        const active = v === value;
        return (
          <button key={v} onClick={() => onChange(v)} style={{
            appearance: 'none', border: 'none', cursor: 'pointer', flex: 1,
            background: active ? 'var(--card)' : 'transparent',
            color: active ? 'var(--ink)' : 'var(--ink2)',
            fontWeight: active ? 700 : 500, fontSize: 14.5,
            borderRadius: 10, padding: '8px 6px', transition: 'all .16s ease',
            boxShadow: active ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
            fontFamily: 'var(--cjk)',
          }}>{label}</button>
        );
      })}
    </div>
  );
}

// Slider with bubble value
export function Slider({ value, min, max, step, onChange, format }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ position: 'relative', padding: '4px 0' }}>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--gold)', height: 28 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ fontSize: 12, color: 'var(--ink3)', fontFamily: 'var(--num)' }}>{format ? format(min) : min}</span>
        <span style={{ fontSize: 12, color: 'var(--ink3)', fontFamily: 'var(--num)' }}>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

// Stepper
export function Stepper({ value, min, max, step, onChange, unit }) {
  const dec = () => onChange(Math.max(min, Math.round((value - step) * 100) / 100));
  const inc = () => onChange(Math.min(max, Math.round((value + step) * 100) / 100));
  const btn = { width: 40, height: 40, borderRadius: 12, border: 'none', cursor: 'pointer',
    background: 'var(--goldTint)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <button onClick={dec} style={btn}><Icon name="minus" size={20} stroke="var(--gold)" /></button>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, minWidth: 78, justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--num)', fontWeight: 'var(--numW)', fontSize: 30, color: 'var(--ink)' }}>{value}</span>
        <span style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 600 }}>{unit}</span>
      </div>
      <button onClick={inc} style={btn}><Icon name="plus" size={20} stroke="var(--gold)" /></button>
    </div>
  );
}
