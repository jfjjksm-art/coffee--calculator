// iced-pourover.jsx — 冰手冲配方 v2（物理热平衡模型）
// 热平衡方程：H·Cp·(Tb−Tt) = I·(Lf + Cp·Tt)，H+I=W
// 化简得：I = W·Cp·(Tb−Tt) / (Lf + Cp·Tb)
const { useState: useStateIP } = React;

const Cp = 4.186;  // 水的比热容 J/(g·℃)
const Lf = 334;    // 冰的熔化热 J/g

// 滤杯预设
const DRIPPER_PRESETS = [
  { id: 'v60',     label: 'V60',      A: 2.0, K: 0.84 },
  { id: 'origami', label: 'Origami',  A: 2.0, K: 0.85 },
  { id: 'orea',    label: 'Orea',     A: 2.1, K: 0.82 },
  { id: 'kalita',  label: 'Kalita',   A: 2.0, K: 0.84 },
  { id: 'custom',  label: '自定义',    A: null, K: null },
];

// 风味模式
const FLAVOR_MODES = [
  { id: 'crisp',   label: '清爽', range: '5–8℃',   tt: 6,  hint: '强调冰感，夏日消暑首选' },
  { id: 'balance', label: '平衡', range: '8–12℃',  tt: 10, hint: '风味与冰感兼顾，日常推荐' },
  { id: 'sweet',   label: '甜感', range: '12–15℃', tt: 13, hint: '保留更多甜感，适合浅烘精品豆' },
  { id: 'custom',  label: '自定义', range: '',      tt: null, hint: '' },
];

const RATIOS = [13, 14, 15, 16, 17, 18];

// ── 玻璃杯可视化：底部冰层 + 上部热水（咖啡色） ──────────────────────────────
function IcedGlassViz({ hotPct, icePct }) {
  return (
    <div style={{ width: 96, height: 132, position: 'relative', flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '14px 14px 22px 22px',
        border: '2.5px solid var(--ink)', opacity: 0.92, overflow: 'hidden',
        background: 'var(--goldTint)', display: 'flex', flexDirection: 'column-reverse',
      }}>
        {/* 热水/咖啡层 */}
        <div style={{
          height: `${hotPct}%`,
          background: 'linear-gradient(180deg,#a0622a,var(--espresso))',
          transition: 'height .35s cubic-bezier(.4,1.2,.5,1)',
        }} />
        {/* 冰层 */}
        <div style={{
          height: `${icePct}%`,
          background: 'linear-gradient(180deg,#e8f4fb,#c5e0ee)',
          transition: 'height .35s cubic-bezier(.4,1.2,.5,1)',
          position: 'relative',
        }}>
          {icePct > 8 && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>🧊</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 主组件 ──────────────────────────────────────────────────────────────────
function IcedPourOver() {
  const [dose,       setDose]       = useStateIP(20);
  const [ratio,      setRatio]      = useStateIP(15);
  const [tempHot,    setTempHot]    = useStateIP(92);
  const [flavorMode, setFlavorMode] = useStateIP('balance');
  const [tempTarget, setTempTarget] = useStateIP(10);
  const [dripper,    setDripper]    = useStateIP('v60');
  const [absorbCoef, setAbsorbCoef] = useStateIP(2.0);
  const [tempCoef,   setTempCoef]   = useStateIP(0.84);

  function handleDripperChange(id) {
    setDripper(id);
    const p = DRIPPER_PRESETS.find(d => d.id === id);
    if (p && p.A !== null) { setAbsorbCoef(p.A); setTempCoef(p.K); }
  }

  function handleFlavorMode(id) {
    setFlavorMode(id);
    const m = FLAVOR_MODES.find(f => f.id === id);
    if (m && m.tt !== null) setTempTarget(m.tt);
  }

  // ── 核心计算 ──────────────────────────────────────────────────────────────
  const W  = dose * ratio;                              // 总用水量 g
  const L  = W - dose * absorbCoef;                    // 预计咖啡液重 g（扣除粉层吸水）
  const Tb = tempHot * tempCoef;                        // 萃取液平均温度 ℃
  const Tt = tempTarget;

  // I = W·Cp·(Tb−Tt) / (Lf + Cp·Tb)
  const rawI = W * Cp * (Tb - Tt) / (Lf + Cp * Tb);
  const I  = Math.max(0, Math.round(rawI));             // 建议冰量 g
  const H  = Math.round(W - I);                        // 建议热水量 g
  const Final = Math.round(L);                          // 最终饮品重量 ≈ L

  const hotPct = Math.round((H / W) * 100);
  const icePct = 100 - hotPct;
  const activeMode = FLAVOR_MODES.find(m => m.id === flavorMode);

  return (
    <div style={{ padding: '0 16px 124px' }}>

      {/* ── 标题 ── */}
      <div style={{ padding: '8px 2px 18px' }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--ink)', letterSpacing: 0.4, lineHeight: 1.15 }}>
          冰<span style={{ color: 'var(--blue)' }}>手冲</span>配方
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--ink2)', marginTop: 5 }}>
          热平衡物理模型 · 精准算出冰水比例
        </div>
      </div>

      {/* ── Hero 结果卡 ── */}
      <Card pad={20} style={{ marginBottom: 16, background: 'linear-gradient(160deg, var(--card), var(--blueSoft))' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <IcedGlassViz hotPct={hotPct} icePct={icePct} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink2)', fontWeight: 600 }}>
              {dose}g · 1:{ratio} · {tempHot}℃ → {Tt}℃
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginTop: 2 }}>
              <span style={{ fontFamily: 'var(--num)', fontWeight: 'var(--numW)', fontSize: 44, lineHeight: 1, color: 'var(--blue)' }}>
                {fmt(H, 0)}
              </span>
              <span style={{ fontSize: 15, color: 'var(--ink2)', fontWeight: 600, paddingBottom: 5, whiteSpace: 'nowrap' }}>
                g 热水
              </span>
            </div>
            <div style={{ height: 1, background: 'var(--card-border)', margin: '12px 0' }} />
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
              <span style={{ fontFamily: 'var(--num)', fontWeight: 'var(--numW)', fontSize: 30, lineHeight: 1, color: 'var(--ink)' }}>
                {fmt(I, 0)}
              </span>
              <span style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 600, paddingBottom: 3 }}>
                g 冰块
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 0, marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--card-border)' }}>
          <MiniStat label="总用水量" value={fmt(W, 0)} unit="g" />
          <MiniStat label="咖啡液重" value={fmt(L, 0)} unit="g" />
          <MiniStat label="目标饮品" value={fmt(Final, 0)} unit="ml" last />
        </div>
      </Card>

      {/* ── 1. 粉量 ── */}
      <Card style={{ marginBottom: 14 }}>
        <SectionLabel index="1">粉量</SectionLabel>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Stepper value={dose} min={10} max={40} step={1} onChange={setDose} unit="g" />
        </div>
      </Card>

      {/* ── 2. 粉水比 ── */}
      <Card style={{ marginBottom: 14 }}>
        <SectionLabel index="2" right={
          <span style={{ fontFamily: 'var(--num)', fontWeight: 700, fontSize: 18, color: 'var(--blue)', whiteSpace: 'nowrap' }}>
            1 : {ratio}
          </span>
        }>粉水比</SectionLabel>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {RATIOS.map(r => (
            <Chip key={r} active={r === ratio} onClick={() => setRatio(r)}>{`1:${r}`}</Chip>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 10 }}>
          越大越淡 · 浅烘推荐 1:15~1:16
        </div>
      </Card>

      {/* ── 3. 注水温度 ── */}
      <Card style={{ marginBottom: 14 }}>
        <SectionLabel index="3" right={
          <span style={{ fontFamily: 'var(--num)', fontWeight: 700, fontSize: 18, color: 'var(--blue)', whiteSpace: 'nowrap' }}>
            {tempHot}℃
          </span>
        }>注水温度</SectionLabel>
        <Slider value={tempHot} min={80} max={100} step={1} onChange={setTempHot} format={x => `${x}℃`} />
        <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 6 }}>
          浅烘 90~94℃ · 中深烘 85~90℃
        </div>
      </Card>

      {/* ── 4. 目标饮品温度 / 风味模式 ── */}
      <Card style={{ marginBottom: 14 }}>
        <SectionLabel index="4" right={
          <span style={{ fontFamily: 'var(--num)', fontWeight: 700, fontSize: 18, color: 'var(--blue)', whiteSpace: 'nowrap' }}>
            {Tt}℃
          </span>
        }>目标饮品温度</SectionLabel>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {FLAVOR_MODES.map(m => (
            <Chip
              key={m.id}
              active={flavorMode === m.id}
              onClick={() => handleFlavorMode(m.id)}
              sub={m.range || undefined}
            >
              {m.label}
            </Chip>
          ))}
        </div>
        {flavorMode === 'custom' ? (
          <div style={{ marginTop: 12 }}>
            <Slider value={Tt} min={0} max={20} step={1} onChange={setTempTarget} format={x => `${x}℃`} />
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 10 }}>
            {activeMode && activeMode.hint}
          </div>
        )}
      </Card>

      {/* ── 5. 滤杯预设 + 进阶参数 ── */}
      <Card style={{ marginBottom: 14 }}>
        <SectionLabel index="5">滤杯预设</SectionLabel>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {DRIPPER_PRESETS.map(d => (
            <Chip
              key={d.id}
              active={dripper === d.id}
              onClick={() => handleDripperChange(d.id)}
              sub={d.K != null ? `K=${d.K}` : undefined}
            >
              {d.label}
            </Chip>
          ))}
        </div>

        {/* 进阶参数 */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--card-border)', display: 'grid', gap: 18 }}>
          <AdvRow
            label="吸水系数 A"
            badge={absorbCoef.toFixed(1)}
            hint={`粉层截留 = ${dose}g × ${absorbCoef.toFixed(1)} = ${fmt(dose * absorbCoef, 0)}g`}
            value={absorbCoef} min={1.5} max={3.0} step={0.1}
            onChange={v => { setAbsorbCoef(v); setDripper('custom'); }}
            format={v => v.toFixed(1)}
          />
          <AdvRow
            label="温度折减系数 K"
            badge={tempCoef.toFixed(2)}
            hint={`萃取液温度 Tb = ${tempHot}℃ × ${tempCoef.toFixed(2)} = ${fmt(Tb, 1)}℃`}
            value={tempCoef} min={0.75} max={0.95} step={0.01}
            onChange={v => { setTempCoef(parseFloat(v.toFixed(2))); setDripper('custom'); }}
            format={v => v.toFixed(2)}
          />
        </div>
      </Card>

      {/* ── 冲煮步骤 ── */}
      <Card>
        <SectionLabel>冲煮步骤</SectionLabel>
        <div style={{ display: 'grid', gap: 13 }}>
          <Step n="1" title="下壶落冰"
            text={`称 ${fmt(I, 0)} g 冰块，放入分享壶底部`} />
          <Step n="2" title="布粉闷蒸"
            text={`${dose} g 粉，${tempHot}℃ 热水注 ${fmt(dose * 2, 0)} g 闷蒸 30s`} />
          <Step n="3" title="分段注水"
            text={`余下缓慢注入，总热水共 ${fmt(H, 0)} g，约 2:00~2:30 完成`} />
          <Step n="4" title="摇匀享用"
            text={`冰融后约 ${fmt(Final, 0)} ml，摇匀立即享用，目标温度 ${Tt}℃`} />
        </div>

        {/* 公式明细 */}
        <div style={{
          marginTop: 16, padding: '13px 14px', borderRadius: 14,
          background: 'var(--goldTint)', display: 'grid', gap: 7,
        }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink2)', marginBottom: 2 }}>
            计算明细
          </div>
          <FormulaLine label="总用水量 W"
            formula={`${dose} × ${ratio}`}
            result={`${fmt(W, 0)} g`} />
          <FormulaLine label="咖啡液重 L"
            formula={`${fmt(W, 0)} − ${dose} × ${absorbCoef.toFixed(1)}`}
            result={`${fmt(L, 0)} g`} />
          <FormulaLine label="萃取液温度 Tb"
            formula={`${tempHot} × ${tempCoef.toFixed(2)}`}
            result={`${fmt(Tb, 1)} ℃`} />
          <FormulaLine label="冰量 I（热平衡）"
            formula={`W·Cp·(Tb−Tt) / (Lf+Cp·Tb)`}
            result={`${fmt(I, 0)} g`} />
        </div>
      </Card>
    </div>
  );
}

// ── 辅助组件 ────────────────────────────────────────────────────────────────

function AdvRow({ label, badge, hint, value, min, max, step, onChange, format }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink3)', marginTop: 2 }}>{hint}</div>
        </div>
        <span style={{
          fontFamily: 'var(--num)', fontWeight: 700, fontSize: 16,
          color: 'var(--blue)', marginLeft: 12, flexShrink: 0,
        }}>{badge}</span>
      </div>
      <Slider value={value} min={min} max={max} step={step} onChange={onChange} format={format} />
    </div>
  );
}

function FormulaLine({ label, formula, result }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
      <span style={{ color: 'var(--ink2)', flex: '0 0 auto', minWidth: 100 }}>{label}</span>
      <span style={{ color: 'var(--ink3)', fontFamily: 'var(--num)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formula}</span>
      <span style={{ fontFamily: 'var(--num)', fontWeight: 700, color: 'var(--ink)', flexShrink: 0, minWidth: 52, textAlign: 'right' }}>{result}</span>
    </div>
  );
}

function MiniStat({ label, value, unit, last }) {
  return (
    <div style={{ flex: 1, textAlign: 'center', borderRight: last ? 'none' : '1px solid var(--card-border)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--num)', fontWeight: 700, fontSize: 19, color: 'var(--ink)' }}>{value}</span>
        <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{unit}</span>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--ink2)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{
        width: 26, height: 26, borderRadius: 999,
        background: 'var(--blueSoft)', color: 'var(--blue)',
        fontFamily: 'var(--num)', fontWeight: 700, fontSize: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{n}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14.5, color: 'var(--ink)', fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--ink2)', marginTop: 1 }}>{text}</div>
      </div>
    </div>
  );
}

Object.assign(window, { IcedPourOver });
