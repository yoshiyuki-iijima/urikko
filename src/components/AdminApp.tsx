'use client';
import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard, Users, BarChart2, Settings2,
  TrendingUp, ShoppingBag, Zap, Gift, Bell,
  Search, ChevronUp, ChevronDown, Plus, Minus,
  CheckCircle, Circle, Edit2, Save, X, Star,
  MapPin, Package, AlertCircle, Trash2, RefreshCw
} from 'lucide-react';

// ─────────────────────────────────────────
// マスタデータ
// ─────────────────────────────────────────
// ─────────────────────────────────────────
// スタジアムマスタ
// ─────────────────────────────────────────
const STADIUMS = [
  { id: 'jingu',     name: '神宮球場',       sport: '野球 ⚾', team: '東京ヤクルトスワローズ', capacity: 30000 },
  { id: 'ig-arena',  name: 'IGアリーナ',     sport: 'アリーナ 🏟️', team: 'ドルフィンズアリーナ（愛知）', capacity: 14000 },
  { id: 'tokyo-d',   name: '東京ドーム',     sport: '野球 ⚾', team: '読売ジャイアンツ',         capacity: 46000 },
  { id: 'mazda',     name: 'マツダスタジアム', sport: '野球 ⚾', team: '広島東洋カープ',           capacity: 33000 },
  { id: 'pana',      name: 'パナソニックスタジアム吹田', sport: 'サッカー ⚽', team: 'ガンバ大阪',  capacity: 40000 },
  { id: 'nissan',    name: '日産スタジアム',   sport: 'サッカー ⚽', team: '横浜F・マリノス',       capacity: 72327 },
  { id: 'saitama',   name: '埼玉スタジアム',   sport: 'サッカー ⚽', team: '浦和レッズ',             capacity: 63700 },
];

const AREAS_JINGU = ['バックネット裏', '1塁側内野', '1塁側外野', '3塁側内野', '3塁側外野'];
const AREAS_IG = [
  '1Fアリーナ A（上手）', '1Fアリーナ B/C（センター）', '1Fアリーナ D（下手）',
  '1F スタンド 100レベル', '2F スタンド 200レベル',
  '4F スタンド 400レベル', '3F VIPバルコニー', 'プレミアムラウンジ',
];
// 後方互換
const AREAS = AREAS_JINGU;

const INIT_PRODUCTS = [
  { id: 'beer-premol',   name: 'サントリープレモル',         category: 'beer',  price: 800,  emoji: '🍺', active: true },
  { id: 'beer-superdry', name: 'アサヒスーパードライ',       category: 'beer',  price: 800,  emoji: '🍺', active: true },
  { id: 'beer-ichiban',  name: 'キリン一番搾り',             category: 'beer',  price: 800,  emoji: '🍺', active: true },
  { id: 'beer-yebisu',   name: 'エビスビール',               category: 'beer',  price: 800,  emoji: '🍺', active: true },
  { id: 'beer-premium',  name: 'サントリープレミアムモルツ', category: 'beer',  price: 800,  emoji: '🍺', active: true },
  { id: 'beer-highball', name: '角ハイボール',               category: 'beer',  price: 800,  emoji: '🥃', active: true },
  { id: 'snack-kakipi',  name: '柿ピー',                     category: 'snack', price: 300,  emoji: '🥜', active: true },
  { id: 'snack-cheese',  name: 'チーズ',                     category: 'snack', price: 300,  emoji: '🧀', active: true },
  { id: 'snack-sakiika', name: 'さきいか',                   category: 'snack', price: 300,  emoji: '🦑', active: true },
];

// ─────────────────────────────────────────
// ダミーデータ生成
// ─────────────────────────────────────────
const RNG = (seed) => { let s = seed; return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0xFFFFFFFF; }; };
const rng = RNG(20250523);

// ══════════════ 神宮球場データ ══════════════
const SELLERS_JINGU = [
  { id: 's1',  name: 'あつこ', avatar: '👩',     isOn: true,  area: '1塁側内野',      products: ['beer-premol',   'snack-kakipi'],   stock: 18 },
  { id: 's2',  name: 'ゆうこ', avatar: '👩‍🦰', isOn: true,  area: '3塁側内野',      products: ['beer-yebisu',   'snack-sakiika'],  stock: 22 },
  { id: 's3',  name: 'はるな', avatar: '👩‍🦱', isOn: true,  area: '1塁側外野',      products: ['beer-superdry', 'snack-cheese'],   stock: 9  },
  { id: 's4',  name: 'りの',   avatar: '👱‍♀️', isOn: true,  area: 'バックネット裏', products: ['beer-ichiban',  'snack-kakipi'],   stock: 25 },
  { id: 's5',  name: 'やすし', avatar: '🧑',     isOn: false, area: '─',              products: ['beer-premium',  'snack-sakiika'],  stock: 30 },
  { id: 's6',  name: 'ともみ', avatar: '👧',     isOn: true,  area: '3塁側外野',      products: ['beer-yebisu',   'snack-cheese'],   stock: 14 },
  { id: 's7',  name: 'まりこ', avatar: '👩‍🦳', isOn: false, area: '─',              products: ['beer-superdry', 'snack-kakipi'],   stock: 30 },
  { id: 's8',  name: 'まゆ',   avatar: '👩',     isOn: true,  area: '1塁側内野',      products: ['beer-highball', 'snack-cheese'],   stock: 7  },
  { id: 's9',  name: 'りえ',   avatar: '👧',     isOn: false, area: '─',              products: ['beer-yebisu',   'snack-sakiika'],  stock: 30 },
  { id: 's10', name: 'ゆき',   avatar: '👩‍🦰', isOn: true,  area: '3塁側内野',      products: ['beer-ichiban',  'snack-kakipi'],   stock: 21 },
  { id: 's11', name: 'さやか', avatar: '👱‍♀️', isOn: true,  area: '1塁側外野',      products: ['beer-superdry', 'snack-cheese'],   stock: 16 },
];
const HOURLY_JINGU = [
  { hour: '16:00', sales:  42000, orders:  52 },
  { hour: '17:00', sales:  68000, orders:  84 },
  { hour: '18:00', sales:  95000, orders: 118 },
  { hour: '19:00', sales: 124000, orders: 154 },
  { hour: '20:00', sales:  87000, orders: 108 },
  { hour: '21:00', sales:  31000, orders:  38 },
];
const PRODUCT_SALES_JINGU = [
  { id: 'beer-superdry', name: 'アサヒスーパードライ',       qty: 148, revenue: 118400 },
  { id: 'beer-premol',   name: 'サントリープレモル',         qty: 132, revenue: 105600 },
  { id: 'beer-ichiban',  name: 'キリン一番搾り',             qty: 104, revenue:  83200 },
  { id: 'beer-yebisu',   name: 'エビスビール',               qty:  89, revenue:  71200 },
  { id: 'beer-premium',  name: 'サントリープレミアムモルツ', qty:  76, revenue:  60800 },
  { id: 'beer-highball', name: '角ハイボール',               qty:  63, revenue:  50400 },
  { id: 'snack-kakipi',  name: '柿ピー',                     qty:  98, revenue:  29400 },
  { id: 'snack-cheese',  name: 'チーズ',                     qty:  72, revenue:  21600 },
  { id: 'snack-sakiika', name: 'さきいか',                   qty:  54, revenue:  16200 },
];
const AREA_SALES_JINGU = [
  { area: '1塁側内野',      sales: 164200, orders: 201, qty: 248 },
  { area: '3塁側内野',      sales: 142800, orders: 175, qty: 216 },
  { area: '1塁側外野',      sales:  98600, orders: 121, qty: 149 },
  { area: '3塁側外野',      sales:  84200, orders: 103, qty: 127 },
  { area: 'バックネット裏', sales:  57200, orders:  70, qty:  86 },
];
const SELLER_SALES_JINGU = SELLERS_JINGU.map((s, i) => ({
  ...s,
  todaySales:  [38400, 32800, 28600, 44200, 0, 22400, 0, 18800, 0, 34600, 26800][i] || 0,
  todayOrders: [48, 41, 36, 55, 0, 28, 0, 24, 0, 43, 34][i] || 0,
  todayTips:   [1500, 500, 0, 2000, 0, 500, 0, 1000, 0, 500, 0][i] || 0,
}));
const TODAY_JINGU = {
  productSales:  PRODUCT_SALES_JINGU.reduce((s, p) => s + p.revenue, 0),
  prioritySales: 54000, priorityOrders: 27,
  tips: 6000, tipOrders: 11,
  totalOrders: HOURLY_JINGU.reduce((s, h) => s + h.orders, 0),
  get totalSales() { return this.productSales + this.prioritySales + this.tips; },
};
const MONTH_JINGU  = { productSales: 4280000,  prioritySales: 820000,  tips: 142000,  totalOrders: 5240  };
const ALLTIME_JINGU = { productSales: 28400000, prioritySales: 5200000, tips: 980000,  totalOrders: 34800 };

// ══════════════ IGアリーナデータ ══════════════
// 顧客アプリのIG_SELLERSに準拠した販売員データ（16名）
const SELLERS_IG = [
  { id: 'ig1',  name: 'れな',    avatar: '👩',     isOn: true,  area: '1Fアリーナ B/C（センター）', products: ['beer-premol',   'snack-kakipi'],  stock: 22 },
  { id: 'ig2',  name: 'あかね',  avatar: '👩‍🦰', isOn: true,  area: '2F スタンド 200レベル',      products: ['beer-superdry', 'snack-sakiika'], stock: 17 },
  { id: 'ig3',  name: 'じゅりな',avatar: '👱‍♀️', isOn: true,  area: '1Fアリーナ A（上手）',       products: ['beer-ichiban',  'snack-cheese'],  stock: 28 },
  { id: 'ig4',  name: 'みずき',  avatar: '👧',     isOn: true,  area: '4F スタンド 400レベル',      products: ['beer-yebisu',   'snack-kakipi'],  stock: 11 },
  { id: 'ig5',  name: 'しおり',  avatar: '👩‍🦱', isOn: true,  area: '1Fアリーナ D（下手）',       products: ['beer-premium',  'snack-cheese'],  stock: 24 },
  { id: 'ig6',  name: 'さわこ',  avatar: '👩',     isOn: true,  area: '2F スタンド 200レベル',      products: ['beer-highball', 'snack-sakiika'], stock: 9  },
  { id: 'ig7',  name: 'くみ',    avatar: '👩‍🦳', isOn: false, area: '─',                          products: ['beer-premol',   'snack-kakipi'],  stock: 30 },
  { id: 'ig8',  name: 'ゆりあ',  avatar: '👩‍🦰', isOn: true,  area: '1F スタンド 100レベル',      products: ['beer-superdry', 'snack-cheese'],  stock: 19 },
  { id: 'ig9',  name: 'ももな',  avatar: '👱‍♀️', isOn: false, area: '─',                          products: ['beer-yebisu',   'snack-kakipi'],  stock: 30 },
  { id: 'ig10', name: 'ゆきこ',  avatar: '👧',     isOn: true,  area: '4F スタンド 400レベル',      products: ['beer-ichiban',  'snack-sakiika'], stock: 14 },
  { id: 'ig11', name: 'あいり',  avatar: '👩‍🦱', isOn: true,  area: '2F スタンド 200レベル',      products: ['beer-premium',  'snack-cheese'],  stock: 21 },
  { id: 'ig12', name: 'りほ',    avatar: '👩',     isOn: true,  area: '1Fアリーナ B/C（センター）', products: ['beer-highball', 'snack-kakipi'],  stock: 6  },
  { id: 'ig13', name: 'あや',    avatar: '👩‍🦰', isOn: false, area: '─',                          products: ['beer-premol',   'snack-sakiika'], stock: 30 },
  { id: 'ig14', name: 'りおん',  avatar: '👩‍🦳', isOn: true,  area: '3F VIPバルコニー',           products: ['beer-superdry', 'snack-cheese'],  stock: 16 },
  { id: 'ig15', name: 'あんな',  avatar: '👱‍♀️', isOn: true,  area: 'プレミアムラウンジ',         products: ['beer-ichiban',  'snack-kakipi'],  stock: 12 },
  { id: 'ig16', name: 'かおり',  avatar: '👧',     isOn: true,  area: '1Fアリーナ D（下手）',       products: ['beer-yebisu',   'snack-sakiika'], stock: 20 },
];
// IGアリーナはコンサート開演に合わせた時間帯（18〜22時）
const HOURLY_IG = [
  { hour: '17:00', sales:  18000, orders:  22 },
  { hour: '18:00', sales:  54000, orders:  67 },
  { hour: '19:00', sales:  98000, orders: 122 },
  { hour: '20:00', sales: 126000, orders: 157 },
  { hour: '21:00', sales:  72000, orders:  90 },
  { hour: '22:00', sales:  24000, orders:  30 },
];
const PRODUCT_SALES_IG = [
  { id: 'beer-premol',   name: 'サントリープレモル',         qty: 162, revenue: 129600 },
  { id: 'beer-highball', name: '角ハイボール',               qty: 138, revenue: 110400 },
  { id: 'beer-superdry', name: 'アサヒスーパードライ',       qty: 118, revenue:  94400 },
  { id: 'beer-ichiban',  name: 'キリン一番搾り',             qty:  96, revenue:  76800 },
  { id: 'beer-premium',  name: 'サントリープレミアムモルツ', qty:  84, revenue:  67200 },
  { id: 'beer-yebisu',   name: 'エビスビール',               qty:  72, revenue:  57600 },
  { id: 'snack-kakipi',  name: '柿ピー',                     qty: 112, revenue:  33600 },
  { id: 'snack-cheese',  name: 'チーズ',                     qty:  88, revenue:  26400 },
  { id: 'snack-sakiika', name: 'さきいか',                   qty:  64, revenue:  19200 },
];
const AREA_SALES_IG = [
  { area: '2F スタンド 200レベル',      sales: 186400, orders: 228, qty: 294 },
  { area: '1Fアリーナ B/C（センター）', sales: 142800, orders: 174, qty: 224 },
  { area: '4F スタンド 400レベル',      sales: 112600, orders: 138, qty: 178 },
  { area: '1Fアリーナ A（上手）',       sales:  84200, orders: 103, qty: 133 },
  { area: '1Fアリーナ D（下手）',       sales:  78400, orders:  96, qty: 124 },
  { area: '1F スタンド 100レベル',      sales:  52800, orders:  65, qty:  84 },
  { area: 'プレミアムラウンジ',         sales:  44000, orders:  54, qty:  70 },
  { area: '3F VIPバルコニー',           sales:  28800, orders:  35, qty:  45 },
];
const SELLER_SALES_IG = SELLERS_IG.map((s, i) => ({
  ...s,
  todaySales:  [44800, 36400, 52000, 28800, 40000, 32000, 0, 24000, 0, 30400, 38400, 26400, 0, 18000, 14400, 22400][i] || 0,
  todayOrders: [56, 46, 65, 36, 50, 40, 0, 30, 0, 38, 48, 33, 0, 22, 18, 28][i] || 0,
  todayTips:   [2000, 1000, 2500, 500, 1500, 0, 0, 500, 0, 1000, 500, 1000, 0, 3000, 2000, 0][i] || 0,
}));
const TODAY_IG = {
  productSales:  PRODUCT_SALES_IG.reduce((s, p) => s + p.revenue, 0),
  prioritySales: 72000, priorityOrders: 36,
  tips: 15500, tipOrders: 18,
  totalOrders: HOURLY_IG.reduce((s, h) => s + h.orders, 0),
  get totalSales() { return this.productSales + this.prioritySales + this.tips; },
};
const MONTH_IG   = { productSales: 2840000,  prioritySales: 480000,  tips: 98000,   totalOrders: 3480  };
const ALLTIME_IG = { productSales: 12600000, prioritySales: 2100000, tips: 420000,  totalOrders: 15400 };

// ─────────────────────────────────────────
// スタジアムIDでデータを引き当てるルックアップ
// ─────────────────────────────────────────
const STADIUM_DATA = {
  'jingu': {
    sellers: SELLERS_JINGU, sellerSales: SELLER_SALES_JINGU,
    hourly: HOURLY_JINGU, productSales: PRODUCT_SALES_JINGU,
    areaSales: AREA_SALES_JINGU, today: TODAY_JINGU,
    month: MONTH_JINGU, allTime: ALLTIME_JINGU,
    areas: AREAS_JINGU,
  },
  'ig-arena': {
    sellers: SELLERS_IG, sellerSales: SELLER_SALES_IG,
    hourly: HOURLY_IG, productSales: PRODUCT_SALES_IG,
    areaSales: AREA_SALES_IG, today: TODAY_IG,
    month: MONTH_IG, allTime: ALLTIME_IG,
    areas: AREAS_IG,
  },
};
// それ以外のスタジアムは神宮のデータをフォールバックとして使用
const getStadiumData = (id) => STADIUM_DATA[id] || STADIUM_DATA['jingu'];

// 後方互換（グローバル参照を残しておく）
const SELLERS_DATA   = SELLERS_JINGU;
const HOURLY         = HOURLY_JINGU;
const PRODUCT_SALES  = PRODUCT_SALES_JINGU;
const AREA_SALES     = AREA_SALES_JINGU;
const SELLER_SALES   = SELLER_SALES_JINGU;
const TODAY          = TODAY_JINGU;
const MONTH          = MONTH_JINGU;
const ALL_TIME       = ALLTIME_JINGU;

// ─────────────────────────────────────────
// ユーティリティ
// ─────────────────────────────────────────
const fmt = (n) => n.toLocaleString();
const fmtY = (n) => '¥' + n.toLocaleString();
const pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;

// ─────────────────────────────────────────
// メインコンポーネント
// ─────────────────────────────────────────
export default function UrikkoAdminApp() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [priorityFee, setPriorityFee] = useState(2000);
  const [calledSellers, setCalledSellers] = useState(new Set());
  const [stadium, setStadium] = useState(STADIUMS[0]);
  const [showStadiumModal, setShowStadiumModal] = useState(false);

  const callSeller = (id) => {
    setCalledSellers(prev => { const n = new Set(prev); n.add(id); return n; });
    setTimeout(() => setCalledSellers(prev => { const n = new Set(prev); n.delete(id); return n; }), 3000);
  };

  const menus = [
    { id: 'dashboard', label: 'ダッシュボード', icon: <LayoutDashboard size={20} /> },
    { id: 'sellers',   label: '売り子管理',     icon: <Users size={20} /> },
    { id: 'analysis',  label: '売上分析',        icon: <BarChart2 size={20} /> },
    { id: 'pricing',   label: '料金設定',        icon: <Settings2 size={20} /> },
  ];

  return (
    <div className="admin-root">
      <style>{ADMIN_CSS}</style>

      {/* ── サイドバー ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-mark">🍻</span>
          <div>
            <div className="sidebar-logo-text">Urikko</div>
            <div className="sidebar-logo-sub">管理コンソール</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {menus.map(m => (
            <button
              key={m.id}
              className={`sidebar-item ${activeMenu === m.id ? 'sidebar-item-active' : ''}`}
              onClick={() => setActiveMenu(m.id)}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button
            className="sidebar-stadium-btn"
            onClick={() => setShowStadiumModal(true)}
            title="スタジアムを切り替える"
          >
            <div className="sidebar-stadium-top">
              <span className="sidebar-stadium-sport">{stadium.sport}</span>
              <span className="sidebar-stadium-change">切替 ›</span>
            </div>
            <div className="sidebar-stadium-name">{stadium.name}</div>
            <div className="sidebar-stadium-capacity">収容 {stadium.capacity.toLocaleString()}人</div>
          </button>
          <div className="sidebar-date">
            {new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
          </div>
        </div>
      </aside>

      {/* ── メインコンテンツ ── */}
      <main className="main-content">
        {activeMenu === 'dashboard' && <DashboardView stadium={stadium} />}
        {activeMenu === 'sellers'   && <SellersView stadium={stadium} callSeller={callSeller} calledSellers={calledSellers} />}
        {activeMenu === 'analysis'  && <AnalysisView stadium={stadium} />}
        {activeMenu === 'pricing'   && <PricingView products={products} setProducts={setProducts} priorityFee={priorityFee} setPriorityFee={setPriorityFee} />}
      </main>

      {/* ── スタジアム切替モーダル ── */}
      {showStadiumModal && (
        <div className="stadium-modal-bg" onClick={() => setShowStadiumModal(false)}>
          <div className="stadium-modal" onClick={e => e.stopPropagation()}>
            <div className="stadium-modal-head">
              <div className="stadium-modal-title">⚾ スタジアムを選択</div>
              <button className="stadium-modal-close" onClick={() => setShowStadiumModal(false)}>
                <X size={18} />
              </button>
            </div>
            <p className="stadium-modal-sub">管理する会場を切り替えます</p>
            <div className="stadium-list">
              {STADIUMS.map(s => {
                const isSelected = s.id === stadium.id;
                return (
                  <button
                    key={s.id}
                    className={`stadium-item ${isSelected ? 'stadium-item-active' : ''}`}
                    onClick={() => { setStadium(s); setShowStadiumModal(false); }}
                  >
                    <div className="stadium-item-left">
                      <div className="stadium-item-sport">{s.sport}</div>
                      <div className="stadium-item-name">{s.name}</div>
                      <div className="stadium-item-team">{s.team}</div>
                    </div>
                    <div className="stadium-item-right">
                      <div className="stadium-item-cap">{s.capacity.toLocaleString()}<small>人</small></div>
                      {isSelected && (
                        <div className="stadium-item-check">✓ 選択中</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// ① ダッシュボード
// ═══════════════════════════════════════════
function DashboardView({ stadium }) {
  const d = getStadiumData(stadium.id);
  const activeSellers = d.sellers.filter(s => s.isOn).length;
  const priorityRate = pct(d.today.priorityOrders, d.today.totalOrders);
  const hourlyMax = Math.max(...d.hourly.map(h => h.sales));
  const productMax = Math.max(...d.productSales.map(p => p.revenue));
  const areaMax = Math.max(...d.areaSales.map(a => a.sales));
  const totalRevenue = d.productSales.reduce((s, p) => s + p.revenue, 0);

  return (
    <div className="view-scroll">
      <div className="view-header">
        <div className="dashboard-header-row">
          <div>
            <h1 className="view-title">ダッシュボード</h1>
            <div className="view-subtitle">本日のリアルタイム状況</div>
          </div>
          <div className="dashboard-stadium-badge">
            <span className="dashboard-stadium-sport">{stadium.sport}</span>
            <span className="dashboard-stadium-name">{stadium.name}</span>
          </div>
        </div>
      </div>

      {/* ── 上段: KPI 4枚 ── */}
      <div className="kpi-row">
        <div className="kpi-card kpi-sales">
          <div className="kpi-icon-wrap"><TrendingUp size={22} /></div>
          <div className="kpi-body">
            <div className="kpi-label">本日の売上合計</div>
            <div className="kpi-value">{fmtY(d.today.totalSales)}</div>
            <div className="kpi-sub">商品 {fmtY(d.today.productSales)} ＋ 優先 {fmtY(d.today.prioritySales)} ＋ チップ {fmtY(d.today.tips)}</div>
          </div>
        </div>
        <div className="kpi-card kpi-orders">
          <div className="kpi-icon-wrap"><ShoppingBag size={22} /></div>
          <div className="kpi-body">
            <div className="kpi-label">注文数合計</div>
            <div className="kpi-value">{fmt(d.today.totalOrders)}<span className="kpi-unit">件</span></div>
            <div className="kpi-sub">1件平均 {fmtY(Math.round(d.today.totalSales / d.today.totalOrders))}</div>
          </div>
        </div>
        <div className="kpi-card kpi-priority">
          <div className="kpi-icon-wrap"><Zap size={22} /></div>
          <div className="kpi-body">
            <div className="kpi-label">優先オーダー率</div>
            <div className="kpi-value">{priorityRate}<span className="kpi-unit">%</span></div>
            <div className="kpi-sub">{fmt(d.today.priorityOrders)} 件 / {fmt(d.today.totalOrders)} 件</div>
          </div>
        </div>
        <div className="kpi-card kpi-sellers">
          <div className="kpi-icon-wrap"><Users size={22} /></div>
          <div className="kpi-body">
            <div className="kpi-label">稼働中販売員</div>
            <div className="kpi-value">{activeSellers}<span className="kpi-unit">人</span></div>
            <div className="kpi-sub">登録 {d.sellers.length} 人中</div>
          </div>
        </div>
      </div>

      {/* ── 中段: 売上内訳 3枚 ── */}
      <div className="mid-row">
        <div className="mid-card">
          <div className="mid-card-head"><ShoppingBag size={16} className="mid-icon" /><span>商品売上</span></div>
          <div className="mid-main">{fmtY(d.today.productSales)}</div>
          <div className="mid-detail">{fmt(d.today.totalOrders)} 件</div>
          <div className="mid-bar-wrap"><div className="mid-bar mid-bar-product" style={{ width: `${pct(d.today.productSales, d.today.totalSales)}%` }} /></div>
          <div className="mid-pct">{pct(d.today.productSales, d.today.totalSales)}%</div>
        </div>
        <div className="mid-card">
          <div className="mid-card-head"><Zap size={16} className="mid-icon mid-icon-priority" /><span>優先デリバリー</span></div>
          <div className="mid-main">{fmtY(d.today.prioritySales)}</div>
          <div className="mid-detail">{fmt(d.today.priorityOrders)} 件</div>
          <div className="mid-bar-wrap"><div className="mid-bar mid-bar-priority" style={{ width: `${pct(d.today.prioritySales, d.today.totalSales)}%` }} /></div>
          <div className="mid-pct">{pct(d.today.prioritySales, d.today.totalSales)}%</div>
        </div>
        <div className="mid-card">
          <div className="mid-card-head"><Gift size={16} className="mid-icon mid-icon-tip" /><span>チップ</span></div>
          <div className="mid-main">{fmtY(d.today.tips)}</div>
          <div className="mid-detail">{fmt(d.today.tipOrders)} 件</div>
          <div className="mid-bar-wrap"><div className="mid-bar mid-bar-tip" style={{ width: `${pct(d.today.tips, d.today.totalSales)}%` }} /></div>
          <div className="mid-pct">{pct(d.today.tips, d.today.totalSales)}%</div>
        </div>
      </div>

      {/* ── 下段: 3カラム ── */}
      <div className="bottom-row">

        {/* 時間帯別売上 */}
        <div className="chart-card">
          <div className="chart-title">時間帯別売上</div>
          <div className="hourly-chart">
            {d.hourly.map(h => (
              <div key={h.hour} className="hourly-col">
                <div className="hourly-val">{fmtY(h.sales / 1000)}k</div>
                <div className="hourly-bar-wrap">
                  <div className="hourly-bar" style={{ height: `${Math.round(h.sales / hourlyMax * 100)}%` }} />
                </div>
                <div className="hourly-label">{h.hour.replace(':00','')}</div>
                <div className="hourly-orders">{h.orders}件</div>
              </div>
            ))}
          </div>
        </div>

        {/* 銘柄別ランキング */}
        <div className="chart-card">
          <div className="chart-title">銘柄別売上ランキング</div>
          <div className="rank-list">
            {[...d.productSales].sort((a, b) => b.revenue - a.revenue).slice(0, 7).map((p, i) => (
              <div key={p.id} className="rank-row">
                <div className={`rank-num ${i < 3 ? 'rank-top' : ''}`}>{i + 1}</div>
                <div className="rank-name">{p.name}</div>
                <div className="rank-bar-wrap">
                  <div className="rank-bar" style={{ width: `${Math.round(p.revenue / productMax * 100)}%` }} />
                </div>
                <div className="rank-right">
                  <div className="rank-sales">{fmtY(p.revenue)}</div>
                  <div className="rank-sub">{p.qty}本 / {pct(p.revenue, totalRevenue)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* エリア別ランキング */}
        <div className="chart-card">
          <div className="chart-title">エリア別売上ランキング</div>
          <div className="rank-list">
            {[...d.areaSales].sort((a, b) => b.sales - a.sales).map((a, i) => {
              const totalAreaSales = d.areaSales.reduce((s, x) => s + x.sales, 0);
              return (
                <div key={a.area} className="rank-row area-rank-row">
                  <div className={`rank-num ${i < 3 ? 'rank-top' : ''}`}>{i + 1}</div>
                  <div className="rank-name">{a.area}</div>
                  <div className="rank-bar-wrap">
                    <div className="rank-bar rank-bar-area" style={{ width: `${Math.round(a.sales / areaMax * 100)}%` }} />
                  </div>
                  <div className="rank-right">
                    <div className="rank-sales">{fmtY(a.sales)}</div>
                    <div className="rank-sub">{a.qty}本 / {a.orders}件 / {pct(a.sales, totalAreaSales)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ② 売り子管理
// ═══════════════════════════════════════════
function SellersView({ stadium, callSeller, calledSellers }) {
  const d = getStadiumData(stadium.id);
  const [query, setQuery] = useState('');
  const activeCount = d.sellers.filter(s => s.isOn).length;
  const filtered = d.sellerSales.filter(s => s.name.includes(query) || query === '');

  return (
    <div className="view-scroll">
      <div className="view-header">
        <h1 className="view-title">売り子管理</h1>
        <div className="view-subtitle">販売員のリアルタイム状況</div>
      </div>

      {/* 検索バー */}
      <div className="seller-search-row">
        <div className="seller-search-wrap">
          <Search size={16} className="seller-search-icon" />
          <input
            className="seller-search-input"
            placeholder="名前で検索..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className="seller-search-clear" onClick={() => setQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>
        <div className="seller-count-badges">
          <span className="seller-badge seller-badge-total">
            <Users size={13} /> 登録 {d.sellers.length}人
          </span>
          <span className="seller-badge seller-badge-active">
            <CheckCircle size={13} /> 稼働中 {activeCount}人
          </span>
        </div>
      </div>

      {/* 一覧テーブル */}
      <div className="seller-table-wrap">
        <table className="seller-table">
          <thead>
            <tr>
              <th className="col-name">販売員</th>
              <th className="col-product">担当商品</th>
              <th className="col-area">エリア</th>
              <th className="col-status">状態</th>
              <th className="col-stock">残量</th>
              <th className="col-sales">本日売上</th>
              <th className="col-action">アクション</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(seller => {
              const called = calledSellers.has(seller.id);
              const stockState = seller.stock <= 5 ? 'critical' : seller.stock <= 10 ? 'low' : 'ok';
              return (
                <tr key={seller.id} className={`seller-row ${seller.isOn ? '' : 'seller-row-off'}`}>
                  <td className="col-name">
                    <div className="seller-name-cell">
                      <div className="seller-avatar-sm">{seller.avatar}</div>
                      <span className="seller-name-text">{seller.name}</span>
                    </div>
                  </td>
                  <td className="col-product">
                    <div className="product-pills">
                      {seller.products.map(pid => {
                        const emoji = pid.startsWith('beer-') ? '🍺' : '🥜';
                        const short = INIT_PRODUCTS.find(p => p.id === pid)?.name.slice(0, 6) || pid;
                        return (
                          <span key={pid} className="product-pill-sm">{emoji} {short}</span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="col-area">
                    {seller.isOn
                      ? <span className="area-tag">{seller.area}</span>
                      : <span className="area-tag area-tag-off">─</span>}
                  </td>
                  <td className="col-status">
                    <span className={`status-pill ${seller.isOn ? 'status-on' : 'status-off'}`}>
                      {seller.isOn
                        ? <><span className="status-dot-anim" /> ON</>
                        : <>OFF</>}
                    </span>
                  </td>
                  <td className="col-stock">
                    {seller.isOn ? (
                      <div className={`stock-indicator stock-${stockState}`}>
                        <div className="stock-bar-mini">
                          <div
                            className="stock-fill-mini"
                            style={{ width: `${Math.round(seller.stock / 30 * 100)}%` }}
                          />
                        </div>
                        <span className="stock-num-mini">{seller.stock}杯</span>
                      </div>
                    ) : <span className="text-muted">─</span>}
                  </td>
                  <td className="col-sales">
                    <div className="sales-cell">
                      <div className="sales-amount">{seller.todaySales > 0 ? fmtY(seller.todaySales) : '─'}</div>
                      {seller.todayTips > 0 && (
                        <div className="sales-tip">🎁 {fmtY(seller.todayTips)}</div>
                      )}
                      {seller.todayOrders > 0 && (
                        <div className="sales-orders">{seller.todayOrders}件</div>
                      )}
                    </div>
                  </td>
                  <td className="col-action">
                    <button
                      className={`call-btn ${called ? 'call-btn-sent' : ''}`}
                      onClick={() => callSeller(seller.id)}
                      disabled={!seller.isOn || called}
                    >
                      {called
                        ? <><CheckCircle size={13} /> 送信済</>
                        : <><Bell size={13} /> 呼び出す</>}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ③ 売上分析
// ═══════════════════════════════════════════
function AnalysisView({ stadium }) {
  const [period, setPeriod] = useState('today');
  const d = getStadiumData(stadium.id);

  const totalProductSales = d.productSales.reduce((s, p) => s + p.revenue, 0);
  const totalQty = d.productSales.reduce((s, p) => s + p.qty, 0);
  const productMax = Math.max(...d.productSales.map(p => p.revenue));
  const areaMax = Math.max(...d.areaSales.map(a => a.sales));

  const periodData = period === 'today' ? d.today : period === 'month' ? d.month : d.allTime;
  const multiplier = period === 'today' ? 1 : period === 'month' ? 26 : 182;

  const pieData = d.productSales.map(p => ({ ...p, share: p.revenue / totalProductSales }));
  const PIE_COLORS = ['#1A4D2E','#2D6B47','#4A8B5C','#FFD93D','#FFB800','#E67E22','#C0392B','#8B4513','#6B5D4F'];
  const buildPie = (items, cx, cy, r) => {
    let angle = -Math.PI / 2;
    return items.map((item, i) => {
      const start = angle;
      const sweep = item.share * 2 * Math.PI;
      angle += sweep;
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      const large = sweep > Math.PI ? 1 : 0;
      return (
        <path
          key={item.id}
          d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
          fill={PIE_COLORS[i % PIE_COLORS.length]}
        />
      );
    });
  };

  const multiplier = period === 'today' ? 1 : period === 'month' ? 26 : 182;

  return (
    <div className="view-scroll">
      <div className="view-header-row">
        <div>
          <h1 className="view-title">売上分析</h1>
          <div className="view-subtitle">詳細データ分析</div>
        </div>
        <div className="period-tabs">
          {[['today','本日'],['month','当月'],['all','累計']].map(([v,l]) => (
            <button
              key={v}
              className={`period-tab ${period === v ? 'period-tab-active' : ''}`}
              onClick={() => setPeriod(v)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="analysis-grid">

        {/* 銘柄別売上棒グラフ */}
        <div className="analysis-card analysis-card-wide">
          <div className="analysis-card-title">銘柄別売上（棒グラフ）</div>
          <div className="bar-chart-h">
            {[...d.productSales].sort((a, b) => b.revenue - a.revenue).map((p, i) => (
              <div key={p.id} className="bar-h-row">
                <div className="bar-h-label">{p.name}</div>
                <div className="bar-h-track">
                  <div className="bar-h-fill" style={{ width: `${Math.round(p.revenue / productMax * 100)}%`, background: PIE_COLORS[i % PIE_COLORS.length], opacity: 0.85 + i * -0.05 }} />
                  <span className="bar-h-val">{fmtY(Math.round(p.revenue * multiplier / 1000))}k</span>
                </div>
                <div className="bar-h-sub">{Math.round(p.qty * multiplier)}本 / {pct(p.revenue, totalProductSales)}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* 銘柄別シェア円グラフ */}
        <div className="analysis-card">
          <div className="analysis-card-title">銘柄別シェア</div>
          <div className="pie-wrap">
            <svg viewBox="0 0 200 200" width="160" height="160">
              {buildPie(pieData, 100, 100, 90)}
              <circle cx="100" cy="100" r="45" fill="#FFFCF7" />
              <text x="100" y="96" textAnchor="middle" fontSize="10" fill="#6B5D4F" fontWeight="700">合計</text>
              <text x="100" y="112" textAnchor="middle" fontSize="13" fill="#1A4D2E" fontWeight="900">{Math.round(totalQty * multiplier)}本</text>
            </svg>
            <div className="pie-legend">
              {d.productSales.map((p, i) => (
                <div key={p.id} className="pie-legend-row">
                  <span className="pie-legend-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="pie-legend-name">{p.name}</span>
                  <span className="pie-legend-pct">{pct(p.revenue, totalProductSales)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 販売員売上ランキング */}
        <div className="analysis-card">
          <div className="analysis-card-title">販売員売上ランキング</div>
          <div className="rank-list">
            {[...d.sellerSales]
              .filter(s => s.todaySales > 0)
              .sort((a, b) => b.todaySales - a.todaySales)
              .map((s, i, arr) => {
                const maxSales = arr[0]?.todaySales || 1;
                return (
                  <div key={s.id} className="rank-row">
                    <div className={`rank-num ${i < 3 ? 'rank-top' : ''}`}>{i + 1}</div>
                    <div className="seller-avatar-xs">{s.avatar}</div>
                    <div className="rank-name">{s.name}</div>
                    <div className="rank-bar-wrap">
                      <div className="rank-bar" style={{ width: `${Math.round(s.todaySales / maxSales * 100)}%` }} />
                    </div>
                    <div className="rank-right">
                      <div className="rank-sales">{fmtY(Math.round(s.todaySales * multiplier / 1000))}k</div>
                      <div className="rank-sub">{Math.round(s.todayOrders * multiplier)}件{s.todayTips > 0 ? ` / 🎁${fmtY(s.todayTips * multiplier)}` : ''}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* エリア別売上棒グラフ */}
        <div className="analysis-card analysis-card-wide">
          <div className="analysis-card-title">エリア別売上</div>
          <div className="area-bar-chart">
            {[...d.areaSales].sort((a, b) => b.sales - a.sales).map((a, i) => (
              <div key={a.area} className="area-bar-col">
                <div className="area-bar-val">{fmtY(Math.round(a.sales * multiplier / 10000))}万</div>
                <div className="area-bar-wrap-v">
                  <div className="area-bar-fill" style={{ height: `${Math.round(a.sales / areaMax * 100)}%` }} />
                </div>
                <div className="area-bar-name">{a.area.replace('バックネット裏','BN裏').replace('1Fアリーナ ','').replace('スタンド ','')}</div>
                <div className="area-bar-sub">{Math.round(a.qty * multiplier)}本 / {Math.round(a.orders * multiplier)}件</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ④ 料金設定
// ═══════════════════════════════════════════
function PricingView({ products, setProducts, priorityFee, setPriorityFee }) {
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', category: 'beer', price: '', emoji: '🍺' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPriority, setEditingPriority] = useState(false);
  const [tempPriority, setTempPriority] = useState(priorityFee);

  const startEdit = (p) => { setEditingId(p.id); setEditPrice(String(p.price)); };
  const saveEdit = () => {
    const price = parseInt(editPrice);
    if (isNaN(price) || price < 0) return;
    setProducts(prev => prev.map(p => p.id === editingId ? { ...p, price } : p));
    setEditingId(null);
  };
  const toggleActive = (id) => setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));
  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const id = `custom-${Date.now()}`;
    setProducts(prev => [...prev, { ...newProduct, id, price: parseInt(newProduct.price), active: true }]);
    setNewProduct({ name: '', category: 'beer', price: '', emoji: '🍺' });
    setShowAddForm(false);
  };

  const beers = products.filter(p => p.category === 'beer');
  const snacks = products.filter(p => p.category === 'snack');

  return (
    <div className="view-scroll">
      <div className="view-header">
        <h1 className="view-title">料金設定</h1>
        <div className="view-subtitle">商品マスタと料金の管理</div>
      </div>

      {/* 優先オーダー料金 */}
      <div className="pricing-special-card">
        <div className="pricing-special-head">
          <Zap size={18} className="pricing-special-icon" />
          <span className="pricing-special-title">優先デリバリー料金</span>
          <span className="pricing-special-sub">顧客アプリの優先オーダーに加算される追加料金</span>
        </div>
        <div className="pricing-special-body">
          {editingPriority ? (
            <div className="priority-edit-row">
              <span className="priority-edit-prefix">¥</span>
              <input
                className="priority-edit-input"
                type="number"
                value={tempPriority}
                onChange={e => setTempPriority(Number(e.target.value))}
                min={0}
                step={100}
              />
              <div className="priority-edit-stepper">
                <button onClick={() => setTempPriority(v => v + 100)}><ChevronUp size={14} /></button>
                <button onClick={() => setTempPriority(v => Math.max(0, v - 100))}><ChevronDown size={14} /></button>
              </div>
              <button className="priority-save-btn" onClick={() => { setPriorityFee(tempPriority); setEditingPriority(false); }}>
                <Save size={14} /> 保存
              </button>
              <button className="priority-cancel-btn" onClick={() => { setTempPriority(priorityFee); setEditingPriority(false); }}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="priority-view-row">
              <span className="priority-price">{fmtY(priorityFee)}</span>
              <button className="priority-edit-btn" onClick={() => setEditingPriority(true)}>
                <Edit2 size={14} /> 変更
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 商品一覧 */}
      <div className="pricing-products-wrap">
        <div className="pricing-section-header">
          <h2 className="pricing-section-title">🍺 ドリンク</h2>
          <button className="add-product-btn" onClick={() => { setShowAddForm(true); setNewProduct(p => ({ ...p, category: 'beer', emoji: '🍺' })); }}>
            <Plus size={14} /> 追加
          </button>
        </div>
        <table className="pricing-table">
          <thead>
            <tr>
              <th>商品名</th>
              <th>単価</th>
              <th>状態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {beers.map(p => (
              <PricingRow
                key={p.id} p={p}
                isEditing={editingId === p.id} editPrice={editPrice}
                setEditPrice={setEditPrice} startEdit={startEdit}
                saveEdit={saveEdit} cancelEdit={() => setEditingId(null)}
                toggleActive={toggleActive} deleteProduct={deleteProduct}
              />
            ))}
          </tbody>
        </table>

        <div className="pricing-section-header" style={{ marginTop: '20px' }}>
          <h2 className="pricing-section-title">🥜 おつまみ</h2>
          <button className="add-product-btn" onClick={() => { setShowAddForm(true); setNewProduct(p => ({ ...p, category: 'snack', emoji: '🥜' })); }}>
            <Plus size={14} /> 追加
          </button>
        </div>
        <table className="pricing-table">
          <thead>
            <tr>
              <th>商品名</th>
              <th>単価</th>
              <th>状態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {snacks.map(p => (
              <PricingRow
                key={p.id} p={p}
                isEditing={editingId === p.id} editPrice={editPrice}
                setEditPrice={setEditPrice} startEdit={startEdit}
                saveEdit={saveEdit} cancelEdit={() => setEditingId(null)}
                toggleActive={toggleActive} deleteProduct={deleteProduct}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 商品追加フォーム */}
      {showAddForm && (
        <div className="modal-bg" onClick={() => setShowAddForm(false)}>
          <div className="add-form-modal" onClick={e => e.stopPropagation()}>
            <div className="add-form-title">
              <Plus size={16} /> 商品を追加
            </div>
            <label className="add-form-label">カテゴリ</label>
            <div className="add-category-row">
              {[['beer','🍺 ドリンク'],['snack','🥜 おつまみ']].map(([v, l]) => (
                <button
                  key={v}
                  className={`add-category-btn ${newProduct.category === v ? 'add-category-btn-on' : ''}`}
                  onClick={() => setNewProduct(p => ({ ...p, category: v, emoji: v === 'beer' ? '🍺' : '🥜' }))}
                >
                  {l}
                </button>
              ))}
            </div>
            <label className="add-form-label">商品名</label>
            <input
              className="add-form-input"
              placeholder="例: キリン のどごし"
              value={newProduct.name}
              onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
            />
            <label className="add-form-label">絵文字アイコン</label>
            <input
              className="add-form-input add-form-emoji"
              value={newProduct.emoji}
              onChange={e => setNewProduct(p => ({ ...p, emoji: e.target.value }))}
              maxLength={2}
            />
            <label className="add-form-label">単価（円）</label>
            <div className="add-price-row">
              <input
                className="add-form-input"
                type="number"
                placeholder="800"
                value={newProduct.price}
                onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                min={0}
                step={50}
              />
              <div className="add-price-stepper">
                <button onClick={() => setNewProduct(p => ({ ...p, price: String(Number(p.price || 0) + 50) }))}>
                  <ChevronUp size={14} />
                </button>
                <button onClick={() => setNewProduct(p => ({ ...p, price: String(Math.max(0, Number(p.price || 0) - 50)) }))}>
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
            <div className="add-form-actions">
              <button className="add-form-cancel" onClick={() => setShowAddForm(false)}>キャンセル</button>
              <button
                className="add-form-save"
                onClick={addProduct}
                disabled={!newProduct.name || !newProduct.price}
              >
                <Save size={14} /> 登録する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PricingRow({ p, isEditing, editPrice, setEditPrice, startEdit, saveEdit, cancelEdit, toggleActive, deleteProduct }) {
  return (
    <tr className={`pricing-row ${!p.active ? 'pricing-row-inactive' : ''}`}>
      <td>
        <div className="pricing-name-cell">
          <span className="pricing-emoji">{p.emoji}</span>
          <span>{p.name}</span>
        </div>
      </td>
      <td>
        {isEditing ? (
          <div className="price-edit-wrap">
            <span className="price-edit-yen">¥</span>
            <input
              className="price-edit-input"
              type="number"
              value={editPrice}
              onChange={e => setEditPrice(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveEdit()}
              autoFocus
              min={0}
              step={50}
            />
          </div>
        ) : (
          <span className="pricing-price">{fmtY(p.price)}</span>
        )}
      </td>
      <td>
        <button
          className={`active-toggle ${p.active ? 'active-toggle-on' : 'active-toggle-off'}`}
          onClick={() => toggleActive(p.id)}
        >
          {p.active ? '販売中' : '停止中'}
        </button>
      </td>
      <td>
        <div className="pricing-actions">
          {isEditing ? (
            <>
              <button className="action-btn action-save" onClick={saveEdit}><Save size={13} /></button>
              <button className="action-btn action-cancel" onClick={cancelEdit}><X size={13} /></button>
            </>
          ) : (
            <>
              <button className="action-btn action-edit" onClick={() => startEdit(p)}><Edit2 size={13} /></button>
              <button className="action-btn action-delete" onClick={() => deleteProduct(p.id)}><Trash2 size={13} /></button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ═══════════════════════════════════════════
// CSS
// ═══════════════════════════════════════════
const ADMIN_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Bebas+Neue&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.admin-root {
  font-family: 'Zen Kaku Gothic New', -apple-system, sans-serif;
  display: flex;
  height: 100vh;
  width: 100%;
  background: #F0EDE6;
  color: #1A1A1A;
  overflow: hidden;
}

/* ────────────────── Sidebar ────────────────── */
.sidebar {
  width: 200px;
  min-width: 200px;
  background: linear-gradient(180deg, #1A4D2E 0%, #112E1B 100%);
  display: flex;
  flex-direction: column;
  padding: 0;
  flex-shrink: 0;
}
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.sidebar-logo-mark { font-size: 26px; }
.sidebar-logo-text {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  color: #FFD93D;
  letter-spacing: 2px;
}
.sidebar-logo-sub { font-size: 9px; color: rgba(255,248,231,0.6); font-weight: 700; letter-spacing: 0.1em; }

.sidebar-nav { flex: 1; padding: 14px 10px; display: flex; flex-direction: column; gap: 4px; }
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: rgba(255,248,231,0.65);
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  width: 100%;
}
.sidebar-item:hover { background: rgba(255,255,255,0.08); color: #FFF8E7; }
.sidebar-item-active { background: #FFD93D !important; color: #1A4D2E !important; }

.sidebar-footer {
  padding: 12px 10px 14px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

/* ── スタジアム切替ボタン ── */
.sidebar-stadium-btn {
  width: 100%;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,217,61,0.25);
  border-radius: 10px;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 8px;
  display: block;
}
.sidebar-stadium-btn:hover {
  background: rgba(255,217,61,0.12);
  border-color: rgba(255,217,61,0.55);
  transform: translateY(-1px);
}
.sidebar-stadium-btn:active { transform: translateY(0); }
.sidebar-stadium-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}
.sidebar-stadium-sport {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255,217,61,0.7);
  letter-spacing: 0.08em;
}
.sidebar-stadium-change {
  font-size: 9px;
  color: rgba(255,248,231,0.4);
  font-weight: 700;
  letter-spacing: 0.05em;
  transition: color 0.15s;
}
.sidebar-stadium-btn:hover .sidebar-stadium-change {
  color: #FFD93D;
}
.sidebar-stadium-name {
  font-size: 13px;
  font-weight: 900;
  color: #FFF8E7;
  line-height: 1.2;
}
.sidebar-stadium-capacity {
  font-size: 9px;
  color: rgba(255,248,231,0.45);
  margin-top: 3px;
  font-weight: 500;
}

.sidebar-date { font-size: 10px; color: rgba(255,248,231,0.4); padding-left: 2px; }

/* ── スタジアム切替モーダル ── */
.stadium-modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fade-in 0.15s ease;
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

.stadium-modal {
  background: #FFFCF7;
  border-radius: 18px;
  width: 440px;
  max-width: 90vw;
  box-shadow: 0 24px 60px rgba(0,0,0,0.28);
  overflow: hidden;
  animation: slide-up-modal 0.2s cubic-bezier(0.34,1.2,0.64,1);
}
@keyframes slide-up-modal {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.stadium-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 0;
}
.stadium-modal-title {
  font-size: 17px;
  font-weight: 900;
}
.stadium-modal-close {
  width: 32px; height: 32px;
  border-radius: 50%; border: none;
  background: #F0EAE0; color: #6B5D4F;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.12s;
}
.stadium-modal-close:hover { background: #1A4D2E; color: #FFD93D; }

.stadium-modal-sub {
  font-size: 12px;
  color: #6B5D4F;
  padding: 6px 20px 14px;
  font-weight: 500;
}

.stadium-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 12px 16px;
  max-height: 420px;
  overflow-y: auto;
}

.stadium-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 12px;
  border-radius: 12px;
  border: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  font-family: 'Zen Kaku Gothic New', sans-serif;
  text-align: left;
  width: 100%;
  transition: all 0.13s;
}
.stadium-item:hover {
  background: #F5F2EC;
  border-color: #E5DDD0;
}
.stadium-item-active {
  background: linear-gradient(135deg, #F0FFF4, #E8F4EE);
  border-color: #1A4D2E !important;
}

.stadium-item-left { flex: 1; min-width: 0; }
.stadium-item-sport {
  font-size: 10px;
  font-weight: 700;
  color: #6B5D4F;
  letter-spacing: 0.06em;
  margin-bottom: 3px;
}
.stadium-item-name {
  font-size: 15px;
  font-weight: 900;
  color: #1A1A1A;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stadium-item-active .stadium-item-name { color: #1A4D2E; }
.stadium-item-team {
  font-size: 11px;
  color: #C7BDB0;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stadium-item-right { text-align: right; flex-shrink: 0; }
.stadium-item-cap {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 20px;
  color: #6B5D4F;
  letter-spacing: 0.03em;
  line-height: 1;
}
.stadium-item-cap small {
  font-size: 10px;
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-weight: 700;
  margin-left: 2px;
}
.stadium-item-check {
  font-size: 10px;
  font-weight: 900;
  color: #1A4D2E;
  margin-top: 4px;
  background: #FFD93D;
  padding: 2px 8px;
  border-radius: 100px;
  display: inline-block;
}

/* ── ダッシュボードのスタジアムバッジ ── */
.dashboard-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.dashboard-stadium-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #1A4D2E, #2D6B47);
  border-radius: 10px;
  flex-shrink: 0;
}
.dashboard-stadium-sport {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255,217,61,0.75);
  letter-spacing: 0.1em;
}
.dashboard-stadium-name {
  font-size: 14px;
  font-weight: 900;
  color: #FFF8E7;
  white-space: nowrap;
}

/* ────────────────── Main ────────────────── */
.main-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.view-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 24px;
}

.view-header { margin-bottom: 18px; }
.view-header-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 18px; }
.view-title { font-size: 22px; font-weight: 900; letter-spacing: -0.02em; }
.view-subtitle { font-size: 12px; color: #6B5D4F; margin-top: 2px; font-weight: 500; }

/* ────────────────── KPI Row ────────────────── */
.kpi-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 14px;
}
.kpi-card {
  background: #FFF;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border-left: 4px solid;
}
.kpi-sales   { border-color: #1A4D2E; }
.kpi-orders  { border-color: #3498DB; }
.kpi-priority{ border-color: #FFD93D; }
.kpi-sellers { border-color: #2ECC71; }

.kpi-icon-wrap {
  width: 42px; height: 42px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-size: 0;
}
.kpi-sales .kpi-icon-wrap   { background: #E8F4EE; color: #1A4D2E; }
.kpi-orders .kpi-icon-wrap  { background: #EBF5FB; color: #3498DB; }
.kpi-priority .kpi-icon-wrap{ background: #FEFCE8; color: #B8860B; }
.kpi-sellers .kpi-icon-wrap { background: #E9F7EF; color: #1E8449; }

.kpi-body { flex: 1; min-width: 0; }
.kpi-label { font-size: 11px; font-weight: 700; color: #6B5D4F; margin-bottom: 3px; }
.kpi-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  letter-spacing: 0.03em;
  color: #1A1A1A;
  line-height: 1;
}
.kpi-unit { font-size: 14px; margin-left: 3px; }
.kpi-sub { font-size: 10px; color: #C7BDB0; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* ────────────────── Mid Row ────────────────── */
.mid-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 14px;
}
.mid-card {
  background: #FFF;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.mid-card-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #6B5D4F;
  margin-bottom: 8px;
}
.mid-icon { color: #3498DB; }
.mid-icon-priority { color: #B8860B; }
.mid-icon-tip { color: #C06000; }
.mid-main {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  letter-spacing: 0.03em;
  color: #1A1A1A;
  margin-bottom: 2px;
}
.mid-detail { font-size: 11px; color: #6B5D4F; margin-bottom: 8px; }
.mid-bar-wrap { height: 5px; background: #F0EAE0; border-radius: 100px; overflow: hidden; margin-bottom: 4px; }
.mid-bar { height: 100%; border-radius: 100px; }
.mid-bar-product  { background: linear-gradient(90deg, #1A4D2E, #4A8B5C); }
.mid-bar-priority { background: linear-gradient(90deg, #B8860B, #FFD93D); }
.mid-bar-tip      { background: linear-gradient(90deg, #7B3F00, #E67E22); }
.mid-pct { font-size: 11px; color: #C7BDB0; text-align: right; font-weight: 700; }

/* ────────────────── Bottom Row ────────────────── */
.bottom-row {
  display: grid;
  grid-template-columns: 1.1fr 1.2fr 1.2fr;
  gap: 12px;
}
.chart-card {
  background: #FFF;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  overflow: hidden;
}
.chart-title { font-size: 13px; font-weight: 900; margin-bottom: 14px; color: #1A1A1A; }

/* 時間帯別棒グラフ */
.hourly-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 140px;
}
.hourly-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; height: 100%; }
.hourly-val { font-size: 9px; font-weight: 700; color: #6B5D4F; white-space: nowrap; }
.hourly-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.hourly-bar {
  width: 100%;
  background: linear-gradient(0deg, #1A4D2E, #4A8B5C);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: height 0.5s;
}
.hourly-label { font-size: 9px; font-weight: 900; color: #6B5D4F; }
.hourly-orders { font-size: 9px; color: #C7BDB0; }

/* ランキングリスト */
.rank-list { display: flex; flex-direction: column; gap: 7px; }
.rank-row {
  display: flex;
  align-items: center;
  gap: 7px;
}
.area-rank-row { gap: 5px; }
.rank-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 14px;
  color: #C7BDB0;
  width: 16px;
  text-align: center;
  flex-shrink: 0;
}
.rank-top { color: #FFD93D; }
.rank-name { font-size: 11px; font-weight: 700; min-width: 52px; max-width: 70px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; }
.rank-bar-wrap { flex: 1; height: 6px; background: #F0EAE0; border-radius: 100px; overflow: hidden; }
.rank-bar { height: 100%; background: linear-gradient(90deg, #1A4D2E, #4A8B5C); border-radius: 100px; }
.rank-bar-area { background: linear-gradient(90deg, #3498DB, #5DADE2); }
.rank-right { min-width: 68px; text-align: right; flex-shrink: 0; }
.rank-sales { font-family: 'Bebas Neue', sans-serif; font-size: 14px; letter-spacing: 0.03em; }
.rank-sub { font-size: 9px; color: #6B5D4F; }

/* ────────────────── 売り子管理 ────────────────── */
.seller-search-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.seller-search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FFF;
  border: 1.5px solid #E5DDD0;
  border-radius: 10px;
  padding: 8px 12px;
  flex: 1;
  max-width: 300px;
  transition: border-color 0.15s;
}
.seller-search-wrap:focus-within { border-color: #1A4D2E; }
.seller-search-icon { color: #C7BDB0; flex-shrink: 0; }
.seller-search-input {
  flex: 1; border: none; outline: none;
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-size: 13px; font-weight: 500;
  background: transparent;
}
.seller-search-clear {
  background: none; border: none; cursor: pointer; color: #C7BDB0; display: flex; align-items: center;
}
.seller-count-badges { display: flex; gap: 8px; flex-shrink: 0; }
.seller-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: 100px;
  font-size: 12px; font-weight: 700;
}
.seller-badge-total  { background: #F0EAE0; color: #6B5D4F; }
.seller-badge-active { background: #1A4D2E; color: #FFD93D; }

.seller-table-wrap { overflow-x: auto; background: #FFF; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.seller-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.seller-table th {
  padding: 11px 14px;
  background: #F5F2EC;
  font-size: 11px;
  font-weight: 900;
  color: #6B5D4F;
  text-align: left;
  letter-spacing: 0.05em;
  border-bottom: 1.5px solid #E5DDD0;
  white-space: nowrap;
}
.seller-table td {
  padding: 11px 14px;
  border-bottom: 1px solid #F0EAE0;
  vertical-align: middle;
}
.seller-row:last-child td { border-bottom: none; }
.seller-row-off { opacity: 0.55; }

.col-name { width: 100px; }
.col-product { width: 180px; }
.col-area { width: 110px; }
.col-status { width: 72px; }
.col-stock { width: 120px; }
.col-sales { width: 110px; }
.col-action { width: 90px; }

.seller-name-cell { display: flex; align-items: center; gap: 8px; }
.seller-avatar-sm {
  width: 30px; height: 30px; border-radius: 50%;
  background: #FFF8E7; border: 1.5px solid #FFD93D;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.seller-name-text { font-weight: 900; font-size: 13px; }
.seller-avatar-xs {
  width: 22px; height: 22px; border-radius: 50%;
  background: #FFF8E7; border: 1px solid #FFD93D;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}

.product-pills { display: flex; flex-wrap: wrap; gap: 4px; }
.product-pill-sm {
  font-size: 10px; font-weight: 700;
  background: #F0EAE0; color: #1A1A1A;
  padding: 2px 6px; border-radius: 4px;
  white-space: nowrap;
}

.area-tag {
  display: inline-block;
  background: #EBF5FB; color: #1B6FA8;
  padding: 2px 8px; border-radius: 100px;
  font-size: 10px; font-weight: 900;
  white-space: nowrap;
}
.area-tag-off { background: #F0EAE0; color: #C7BDB0; }

.status-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 100px;
  font-size: 11px; font-weight: 900;
}
.status-on { background: #1A4D2E; color: #FFD93D; }
.status-off { background: #F0EAE0; color: #C7BDB0; }
.status-dot-anim {
  width: 6px; height: 6px; border-radius: 50%; background: #4ADE80;
  animation: pulse-on 1.5s ease-in-out infinite;
}
@keyframes pulse-on { 0%,100%{opacity:1} 50%{opacity:0.3} }

.stock-indicator { display: flex; align-items: center; gap: 6px; }
.stock-bar-mini { height: 5px; width: 56px; background: #F0EAE0; border-radius: 100px; overflow: hidden; }
.stock-fill-mini { height: 100%; border-radius: 100px; transition: width 0.4s; }
.stock-ok   .stock-fill-mini { background: linear-gradient(90deg, #1A4D2E, #4A8B5C); }
.stock-low  .stock-fill-mini { background: linear-gradient(90deg, #F39C12, #E67E22); }
.stock-critical .stock-fill-mini { background: linear-gradient(90deg, #E63946, #FF6B6B); }
.stock-num-mini { font-size: 11px; font-weight: 900; white-space: nowrap; }
.stock-ok   .stock-num-mini { color: #1A4D2E; }
.stock-low  .stock-num-mini { color: #E67E22; }
.stock-critical .stock-num-mini { color: #E63946; }

.sales-cell { display: flex; flex-direction: column; gap: 1px; }
.sales-amount { font-family: 'Bebas Neue', sans-serif; font-size: 15px; letter-spacing: 0.03em; color: #1A4D2E; }
.sales-tip { font-size: 10px; color: #C06000; font-weight: 700; }
.sales-orders { font-size: 10px; color: #6B5D4F; }

.call-btn {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 6px 10px; border-radius: 8px; border: none;
  background: #1A4D2E; color: #FFD93D;
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-size: 11px; font-weight: 900; cursor: pointer;
  transition: all 0.15s; white-space: nowrap;
}
.call-btn:hover:not(:disabled) { background: #0F3D22; }
.call-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.call-btn-sent { background: #2ECC71 !important; color: #FFF !important; }
.text-muted { color: #C7BDB0; font-size: 11px; }

/* ────────────────── 売上分析 ────────────────── */
.period-tabs { display: flex; gap: 4px; background: #F0EAE0; border-radius: 10px; padding: 3px; }
.period-tab {
  padding: 7px 18px; border-radius: 8px; border: none;
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-size: 13px; font-weight: 700; cursor: pointer;
  background: transparent; color: #6B5D4F; transition: all 0.15s;
}
.period-tab-active { background: #1A4D2E; color: #FFD93D; }

.analysis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.analysis-card {
  background: #FFF;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.analysis-card-wide { grid-column: 1 / -1; }
.analysis-card-title { font-size: 13px; font-weight: 900; margin-bottom: 16px; }

.bar-chart-h { display: flex; flex-direction: column; gap: 8px; }
.bar-h-row { display: flex; align-items: center; gap: 8px; }
.bar-h-label { font-size: 11px; font-weight: 700; width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; }
.bar-h-track { flex: 1; height: 18px; background: #F0EAE0; border-radius: 5px; overflow: hidden; position: relative; }
.bar-h-fill { height: 100%; border-radius: 5px; transition: width 0.6s; }
.bar-h-val { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 10px; font-weight: 900; color: #FFF; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
.bar-h-sub { font-size: 10px; color: #6B5D4F; width: 90px; text-align: right; white-space: nowrap; flex-shrink: 0; }

.pie-wrap { display: flex; align-items: center; gap: 16px; }
.pie-legend { flex: 1; display: flex; flex-direction: column; gap: 5px; }
.pie-legend-row { display: flex; align-items: center; gap: 6px; }
.pie-legend-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
.pie-legend-name { font-size: 10px; font-weight: 700; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pie-legend-pct { font-size: 10px; font-weight: 900; color: #1A4D2E; min-width: 28px; text-align: right; }

.area-bar-chart { display: flex; gap: 8px; align-items: flex-end; height: 140px; padding-top: 24px; }
.area-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; }
.area-bar-val { font-size: 10px; font-weight: 700; color: #6B5D4F; white-space: nowrap; }
.area-bar-wrap-v { flex: 1; width: 100%; display: flex; align-items: flex-end; background: #F0EAE0; border-radius: 6px 6px 0 0; overflow: hidden; }
.area-bar-fill { width: 100%; background: linear-gradient(0deg, #3498DB, #5DADE2); border-radius: 4px 4px 0 0; min-height: 4px; transition: height 0.5s; }
.area-bar-name { font-size: 9px; font-weight: 900; color: #1A1A1A; text-align: center; }
.area-bar-sub { font-size: 9px; color: #6B5D4F; text-align: center; }

/* ────────────────── 料金設定 ────────────────── */
.pricing-special-card {
  background: linear-gradient(135deg, #1A4D2E, #2D6B47);
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(26,77,46,0.2);
}
.pricing-special-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.pricing-special-icon { color: #FFD93D; flex-shrink: 0; }
.pricing-special-title { font-size: 15px; font-weight: 900; color: #FFF8E7; }
.pricing-special-sub { font-size: 11px; color: rgba(255,248,231,0.65); flex: 1; }
.pricing-special-body { }
.priority-view-row { display: flex; align-items: center; gap: 16px; }
.priority-price {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 38px;
  color: #FFD93D;
  letter-spacing: 0.05em;
}
.priority-edit-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 14px; border-radius: 8px;
  border: 1.5px solid rgba(255,217,61,0.5);
  background: rgba(255,217,61,0.1);
  color: #FFD93D;
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-size: 12px; font-weight: 700; cursor: pointer;
  transition: all 0.15s;
}
.priority-edit-btn:hover { background: rgba(255,217,61,0.2); }
.priority-edit-row { display: flex; align-items: center; gap: 8px; }
.priority-edit-prefix { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #FFD93D; }
.priority-edit-input {
  width: 90px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 32px;
  background: rgba(255,255,255,0.15);
  border: 2px solid rgba(255,217,61,0.6);
  border-radius: 8px;
  color: #FFD93D;
  text-align: center;
  outline: none;
  padding: 4px 8px;
}
.priority-edit-stepper { display: flex; flex-direction: column; gap: 2px; }
.priority-edit-stepper button {
  width: 24px; height: 20px; background: rgba(255,255,255,0.15); border: none;
  color: #FFD93D; cursor: pointer; border-radius: 4px; display: flex; align-items: center; justify-content: center;
}
.priority-save-btn, .priority-cancel-btn {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 7px 12px; border-radius: 8px; border: none;
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-size: 12px; font-weight: 700; cursor: pointer;
}
.priority-save-btn { background: #FFD93D; color: #1A4D2E; }
.priority-cancel-btn { background: rgba(255,255,255,0.15); color: #FFF8E7; }

.pricing-products-wrap { }
.pricing-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.pricing-section-title { font-size: 15px; font-weight: 900; }
.add-product-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 14px; background: #1A4D2E; color: #FFD93D;
  border: none; border-radius: 8px;
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-size: 12px; font-weight: 700; cursor: pointer;
}
.add-product-btn:hover { background: #0F3D22; }

.pricing-table {
  width: 100%; border-collapse: collapse;
  background: #FFF; border-radius: 12px; overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.pricing-table th {
  padding: 10px 16px; background: #F5F2EC;
  font-size: 11px; font-weight: 900; color: #6B5D4F;
  text-align: left; letter-spacing: 0.05em;
  border-bottom: 1.5px solid #E5DDD0;
}
.pricing-table td { padding: 11px 16px; border-bottom: 1px solid #F0EAE0; font-size: 13px; vertical-align: middle; }
.pricing-row:last-child td { border-bottom: none; }
.pricing-row-inactive { opacity: 0.5; }

.pricing-name-cell { display: flex; align-items: center; gap: 8px; }
.pricing-emoji { font-size: 20px; }
.pricing-price { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 0.03em; color: #1A4D2E; }
.price-edit-wrap { display: flex; align-items: center; gap: 4px; }
.price-edit-yen { font-family: 'Bebas Neue', sans-serif; font-size: 16px; color: #6B5D4F; }
.price-edit-input {
  width: 80px; padding: 5px 8px;
  font-family: 'Bebas Neue', sans-serif; font-size: 18px;
  border: 2px solid #1A4D2E; border-radius: 6px; outline: none; text-align: center;
}

.active-toggle {
  padding: 4px 10px; border-radius: 100px; border: none;
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-size: 11px; font-weight: 900; cursor: pointer;
}
.active-toggle-on { background: #1A4D2E; color: #FFD93D; }
.active-toggle-off { background: #F0EAE0; color: #C7BDB0; }

.pricing-actions { display: flex; gap: 6px; }
.action-btn {
  width: 28px; height: 28px; border-radius: 6px; border: none;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: all 0.12s;
}
.action-edit   { background: #EBF5FB; color: #2980B9; }
.action-edit:hover { background: #2980B9; color: #FFF; }
.action-save   { background: #E9F7EF; color: #1E8449; }
.action-save:hover { background: #1E8449; color: #FFF; }
.action-cancel { background: #F0EAE0; color: #6B5D4F; }
.action-cancel:hover { background: #6B5D4F; color: #FFF; }
.action-delete { background: #FDEDEC; color: #E63946; }
.action-delete:hover { background: #E63946; color: #FFF; }

/* 商品追加モーダル */
.modal-bg {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.add-form-modal {
  background: #FFFCF7; border-radius: 16px;
  padding: 24px; width: 340px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.2);
}
.add-form-title {
  font-size: 16px; font-weight: 900; margin-bottom: 18px;
  display: flex; align-items: center; gap: 8px;
}
.add-form-label {
  display: block; font-size: 11px; font-weight: 900;
  color: #6B5D4F; letter-spacing: 0.1em; margin-bottom: 6px; margin-top: 14px;
}
.add-form-input {
  width: 100%; padding: 11px 14px;
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-size: 14px; font-weight: 700;
  border: 2px solid #E5DDD0; border-radius: 10px;
  background: #FFF; outline: none;
  transition: border-color 0.15s;
}
.add-form-input:focus { border-color: #1A4D2E; }
.add-form-emoji { text-align: center; font-size: 24px; }
.add-category-row { display: flex; gap: 8px; }
.add-category-btn {
  flex: 1; padding: 9px; border-radius: 10px;
  border: 2px solid #E5DDD0; background: #FFF;
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-size: 13px; font-weight: 700; cursor: pointer;
  transition: all 0.15s;
}
.add-category-btn-on { background: #1A4D2E; color: #FFD93D; border-color: #1A4D2E; }
.add-price-row { display: flex; align-items: center; gap: 8px; }
.add-price-stepper { display: flex; flex-direction: column; gap: 2px; }
.add-price-stepper button {
  width: 26px; height: 20px; background: #F0EAE0; border: none;
  border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #1A4D2E;
}
.add-form-actions { display: flex; gap: 8px; margin-top: 20px; }
.add-form-cancel {
  flex: 1; padding: 12px; background: #F0EAE0; color: #6B5D4F;
  border: none; border-radius: 10px;
  font-family: 'Zen Kaku Gothic New', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer;
}
.add-form-save {
  flex: 2; padding: 12px; background: #1A4D2E; color: #FFD93D;
  border: none; border-radius: 10px;
  font-family: 'Zen Kaku Gothic New', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.add-form-save:disabled { opacity: 0.4; cursor: not-allowed; }
`;
