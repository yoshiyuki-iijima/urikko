'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Power, Plus, Minus, Settings, Clock, MapPin, Zap, Check, ChevronLeft, ChevronRight, CheckCircle2, Package, X, Bell, TrendingUp, Eye, EyeOff, LogIn, Calendar, BarChart2, User, Instagram, Link, MessageSquare, Camera } from 'lucide-react';

// ===== マスタデータ（顧客アプリと共通の定義） =====
const BEERS = [
  { id: 'beer-premol',   name: 'サントリープレモル',         price: 800, emoji: '🍺' },
  { id: 'beer-superdry', name: 'アサヒスーパードライ',       price: 800, emoji: '🍺' },
  { id: 'beer-ichiban',  name: 'キリン一番搾り',             price: 800, emoji: '🍺' },
  { id: 'beer-yebisu',   name: 'エビスビール',               price: 800, emoji: '🍺' },
  { id: 'beer-premium',  name: 'サントリープレミアムモルツ', price: 800, emoji: '🍺' },
  { id: 'beer-highball', name: '角ハイボール',               price: 800, emoji: '🥃' },
];
const SNACKS = [
  { id: 'snack-kakipi',  name: '柿ピー',   price: 300, emoji: '🥜' },
  { id: 'snack-cheese',  name: 'チーズ',   price: 300, emoji: '🧀' },
  { id: 'snack-sakiika', name: 'さきいか', price: 300, emoji: '🦑' },
];
const ALL_PRODUCTS = [...BEERS, ...SNACKS];
const getProduct = (id) => ALL_PRODUCTS.find(p => p.id === id) || ALL_PRODUCTS[0];
const isBeerId = (id) => id.startsWith('beer-');

// ===== デモアカウントマスタ =====
// stadia: 'jingu' | 'ig-arena'
const DEMO_ACCOUNTS = {
  'atsuko': {
    pass: '0000',
    seller: {
      id: 's-atsuko',
      name: 'あつこ',
      avatar: '👩',
      products: ['beer-premol', 'snack-kakipi', 'snack-cheese'],
    },
    stadium: 'jingu',
    stadiumName: '神宮球場',
  },
  'rena': {
    pass: '0000',
    seller: {
      id: 'ig-rena',
      name: 'れな',
      avatar: '👩',
      products: ['beer-premol', 'snack-kakipi', 'snack-cheese'],
    },
    stadium: 'ig-arena',
    stadiumName: 'IGアリーナ',
  },
};

const AREAS = ['バックネット裏', '1塁側内野', '1塁側外野', '3塁側内野', '3塁側外野'];

// IGアリーナのエリア名リスト（ホットエリア表示で使用）
const IG_AREAS = [
  '1Fアリーナ A（上手）',
  '1Fアリーナ B/C（センター）',
  '1Fアリーナ D（下手）',
  '1F スタンド 100レベル',
  '2F スタンド 200レベル',
  '4F スタンド 400レベル',
  '3F VIPバルコニー',
  'プレミアムラウンジ',
];

// ===== エリア表示用メタデータ =====
const AREA_META = {
  // 神宮球場
  'バックネット裏': { icon: '🎯', short: 'バック\nネット裏', capacity: 800 },
  '1塁側内野':      { icon: '🏟️', short: '1塁側\n内野',     capacity: 2200 },
  '1塁側外野':      { icon: '🌿', short: '1塁側\n外野',     capacity: 1400 },
  '3塁側内野':      { icon: '🏟️', short: '3塁側\n内野',     capacity: 2200 },
  '3塁側外野':      { icon: '🌿', short: '3塁側\n外野',     capacity: 1400 },
  // IGアリーナ
  '1Fアリーナ A（上手）':       { icon: '🎵', short: 'アリーナ\nA上手', capacity: 1200 },
  '1Fアリーナ B/C（センター）': { icon: '🎤', short: 'アリーナ\nB/C',   capacity: 1440 },
  '1Fアリーナ D（下手）':       { icon: '🎶', short: 'アリーナ\nD下手', capacity: 1200 },
  '1F スタンド 100レベル':      { icon: '🪑', short: '1F\nスタンド', capacity: 1188 },
  '2F スタンド 200レベル':      { icon: '🏛️', short: '2F\nスタンド', capacity: 7290 },
  '4F スタンド 400レベル':      { icon: '🔭', short: '4F\nスタンド', capacity: 4480 },
  '3F VIPバルコニー':           { icon: '⭐', short: 'VIP\nバルコニー', capacity: 800 },
  'プレミアムラウンジ':         { icon: '💎', short: 'プレミアム\nラウンジ', capacity: 1254 },
};

// ダミー: 全販売員のエリア別在籍人数（本実装ではGPS連携）
const DUMMY_SELLER_COUNTS = {
  // 神宮球場
  'バックネット裏': 1,
  '1塁側内野':      3,
  '1塁側外野':      2,
  '3塁側内野':      2,
  '3塁側外野':      1,
  // IGアリーナ
  '1Fアリーナ A（上手）':       2,
  '1Fアリーナ B/C（センター）': 4,
  '1Fアリーナ D（下手）':       2,
  '1F スタンド 100レベル':      2,
  '2F スタンド 200レベル':      3,
  '4F スタンド 400レベル':      2,
  '3F VIPバルコニー':           1,
  'プレミアムラウンジ':         1,
};

// ===== 過去実績ダミーデータ生成（当月〜過去3ヶ月分） =====
const CUSTOMER_POOL = ['田中様','佐藤様','山田様','鈴木様','高橋様','伊藤様','中村様','小林様','加藤様','吉田様','松本様','渡辺様'];
const generateHistoryData = (sellerProducts) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const records = {}; // key: 'YYYY-MM-DD' → [order, ...]
  // 過去3ヶ月 + 当月（昨日まで）のデータを生成
  for (let d = 0; d < 90; d++) {
    const dt = new Date(today);
    dt.setDate(dt.getDate() - d - 1); // 昨日以前のみ
    const key = dt.toISOString().slice(0, 10);
    // 試合がある日（週末中心）は多め
    const isWeekend = dt.getDay() === 0 || dt.getDay() === 6;
    if (!isWeekend && Math.random() < 0.3) continue; // 平日は70%でスキップ（休み）
    const orderCount = isWeekend
      ? 8 + Math.floor(Math.random() * 12)
      : 4 + Math.floor(Math.random() * 6);
    const dayOrders = [];
    for (let o = 0; o < orderCount; o++) {
      const beerQty = 1 + Math.floor(Math.random() * 3);
      const beer = sellerProducts.find(p => p.startsWith('beer-'));
      const items = [{ id: beer, name: getProduct(beer).name, emoji: getProduct(beer).emoji, price: 800, qty: beerQty, subtotal: 800 * beerQty }];
      const snacks = sellerProducts.filter(p => !p.startsWith('beer-'));
      if (Math.random() < 0.5 && snacks.length > 0) {
        const sn = snacks[Math.floor(Math.random() * snacks.length)];
        items.push({ id: sn, name: getProduct(sn).name, emoji: getProduct(sn).emoji, price: 300, qty: 1, subtotal: 300 });
      }
      const subtotal = items.reduce((s, it) => s + it.subtotal, 0);
      const isPriority = Math.random() < 0.25;
      const priorityFee = isPriority ? 2000 : 0;
      const hr = 16 + Math.floor(Math.random() * 6);
      const mn = Math.floor(Math.random() * 60);
      const placedAt = new Date(dt);
      placedAt.setHours(hr, mn, 0, 0);
      const area = AREAS[Math.floor(Math.random() * AREAS.length)];
      const seatRow = 1 + Math.floor(Math.random() * 30);
      const seatBlock = String.fromCharCode(65 + Math.floor(Math.random() * 6));
      const seatNum = 1 + Math.floor(Math.random() * 40);
      dayOrders.push({
        id: `h-${key}-${o}`,
        customerName: CUSTOMER_POOL[Math.floor(Math.random() * CUSTOMER_POOL.length)],
        items,
        subtotal,
        priorityFee,
        total: subtotal + priorityFee,
        isPriority,
        area,
        seatNumber: `${seatRow}-${seatBlock}-${seatNum}`,
        placedAt: placedAt.toISOString(),
        status: 'completed',
        completedAt: placedAt.toISOString(),
      });
    }
    if (dayOrders.length > 0) records[key] = dayOrders;
  }
  return records;
};
// HISTORY_DATAはログイン後にcurrentSellerのproductsを渡して生成する
// （グローバル定数としては廃止）

// ===== デモ用: 擬似的なオーダーを生成 =====
const CUSTOMER_NAMES = ['田中様', '佐藤様', '山田様', '鈴木様', '高橋様', '伊藤様', '中村様'];
const generateMockOrder = (sellerProducts, stadium = 'jingu') => {
  const items = [];
  const beerProducts = sellerProducts.filter(isBeerId);
  // 必ずビールを1〜3杯
  const beerQty = 1 + Math.floor(Math.random() * 3);
  items.push({ id: beerProducts[0], qty: beerQty });
  // 30%でおつまみも追加
  const snackProducts = sellerProducts.filter(p => !isBeerId(p));
  if (Math.random() < 0.6 && snackProducts.length > 0) {
    const snack = snackProducts[Math.floor(Math.random() * snackProducts.length)];
    items.push({ id: snack, qty: 1 });
  }
  const fullItems = items.map(it => {
    const p = getProduct(it.id);
    return { id: it.id, name: p.name, emoji: p.emoji, price: p.price, qty: it.qty, subtotal: p.price * it.qty };
  });
  const subtotal = fullItems.reduce((s, it) => s + it.subtotal, 0);
  const isPriority = Math.random() < 0.35;
  const priorityFee = isPriority ? 2000 : 0;
  // スタジアムに応じてエリアリストを切り替え
  const areaList = stadium === 'ig-arena' ? IG_AREAS : AREAS;
  const area = areaList[Math.floor(Math.random() * areaList.length)];
  const seatBlock = stadium === 'ig-arena'
    ? `${Math.floor(Math.random() * 30) + 1}列`
    : String.fromCharCode(65 + Math.floor(Math.random() * 6));
  const seatRow = 1 + Math.floor(Math.random() * 30);
  const seatNum = 1 + Math.floor(Math.random() * 40);
  return {
    id: `o-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
    items: fullItems,
    subtotal,
    priorityFee,
    total: subtotal + priorityFee,
    isPriority,
    area,
    seatNumber: `${seatRow}-${seatBlock}-${seatNum}`,
    placedAt: new Date().toISOString(),
    status: 'active',
    completedAt: null,
  };
};

// ===== ログイン画面（親の外に定義 → 再レンダリングでアンマウントされない） =====
function LoginScreen({ onLogin }) {
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    const account = DEMO_ACCOUNTS[loginId.trim()];
    if (account && loginPass === account.pass) {
      onLogin(account); // アカウント情報全体を渡す
    } else {
      setLoginError('IDまたはパスワードが正しくありません');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-hero">
        <div className="login-logo-mark">🍻</div>
        <h1 className="login-logo-text">Urikko</h1>
        <p className="login-logo-sub">販売員ログイン</p>
      </div>
      <div className="login-card">
        <div className="login-field">
          <label className="login-label">販売員ID</label>
          <input
            className="login-input"
            type="text"
            placeholder="例: atsuko"
            value={loginId}
            onChange={e => setLoginId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            autoComplete="username"
          />
        </div>
        <div className="login-field">
          <label className="login-label">パスワード</label>
          <div className="login-pass-wrap">
            <input
              className="login-input login-input-pass"
              type={showPass ? 'text' : 'password'}
              placeholder="••••"
              value={loginPass}
              onChange={e => setLoginPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoComplete="current-password"
            />
            <button className="pass-toggle" onClick={() => setShowPass(v => !v)}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {loginError && <div className="login-error">⚠️ {loginError}</div>}
        <button className="login-btn" onClick={handleLogin}>
          <LogIn size={18} />
          <span>ログイン</span>
        </button>
        <div className="login-hint">
          <div>神宮球場: ID <code>atsuko</code> / PASS <code>0000</code></div>
          <div style={{marginTop:'4px'}}>IGアリーナ: ID <code>rena</code> / PASS <code>0000</code></div>
        </div>
      </div>
    </div>
  );
}

export default function UrikkoSellerApp() {
  // ===== ログイン =====
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentSeller, setCurrentSeller] = useState(null);   // ログイン後の売り子情報
  const [currentStadium, setCurrentStadium] = useState(null); // 'jingu' | 'ig-arena'
  const [historyData, setHistoryData] = useState({});          // 過去実績データ

  const handleLogin = (account) => {
    setCurrentSeller(account.seller);
    setCurrentStadium(account.stadium);
    setHistoryData(generateHistoryData(account.seller.products));
    // 販売商品の初期値をログイン売り子に合わせる
    setSellerBeers(new Set(account.seller.products.filter(p => p.startsWith('beer-'))));
    setSellerSnacks(new Set(account.seller.products.filter(p => !p.startsWith('beer-'))));
    setLoggedIn(true);
  };

  // ===== メイン画面 =====
  const [isOnline, setIsOnline] = useState(true);
  const [stock, setStock] = useState(30);
  const [showStockSettings, setShowStockSettings] = useState(false);
  const [orders, setOrders] = useState([]);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [screen, setScreen] = useState('home');
  const [, forceTick] = useState(0);
  const [toast, setToast] = useState(null);

  // ===== 実績画面 =====
  const nowDate = new Date();
  const [historyYear, setHistoryYear] = useState(nowDate.getFullYear());
  const [historyMonth, setHistoryMonth] = useState(nowDate.getMonth() + 1);
  const [historyDayKey, setHistoryDayKey] = useState(null);

  // ===== 販売商品・残数管理 =====
  const defaultSeller = DEMO_ACCOUNTS['atsuko'].seller;
  const [sellerBeers, setSellerBeers] = useState(
    new Set(defaultSeller.products.filter(p => p.startsWith('beer-')))
  );
  const [sellerSnacks, setSellerSnacks] = useState(
    new Set(defaultSeller.products.filter(p => !p.startsWith('beer-')))
  );
  // 商品ごとの残数（デフォルト30杯/個）
  const [productStock, setProductStock] = useState(() => {
    const init = {};
    ALL_PRODUCTS.forEach(p => { init[p.id] = 30; });
    return init;
  });

  const toggleBeer = (id) => setSellerBeers(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const toggleSnack = (id) => setSellerSnacks(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const changeProductStock = (id, delta) => setProductStock(prev => ({
    ...prev,
    [id]: Math.max(0, (prev[id] ?? 30) + delta),
  }));
  const setProductStockDirect = (id, val) => setProductStock(prev => ({
    ...prev,
    [id]: Math.max(0, val),
  }));

  // ===== プロフィール =====
  const [profile, setProfile] = useState({
    instagram: '',
    tiktok: '',
    bio: '',
    iconUrl: '',
    iconEmoji: '👩', // ログイン後にcurrentSellerで上書き
  });
  const [profilePopupSeller, setProfilePopupSeller] = useState(null);
  const [totalTips, setTotalTips] = useState(0); // チップ累計

  // 経過時間更新（10秒ごとに再描画）
  useEffect(() => {
    const t = setInterval(() => forceTick(v => v + 1), 10000);
    return () => clearInterval(t);
  }, []);

  // 擬似的なオーダー受信（ON時のみ、ランダム間隔で）
  useEffect(() => {
    if (!isOnline) return;
    // 初回はやや早めに、その後はランダム間隔（15〜35秒）
    const scheduleNext = () => {
      const delay = 12000 + Math.random() * 20000;
      return setTimeout(() => {
        const newOrder = generateMockOrder(currentSeller.products, currentStadium);
        const totalBeerQty = newOrder.items.filter(it => isBeerId(it.id)).reduce((s, it) => s + it.qty, 0);
        setStock(s => {
          if (s < totalBeerQty) return s; // 在庫不足は受注しない
          setOrders(prev => [newOrder, ...prev]);
          showToast('priority' in newOrder && newOrder.isPriority ? 'priority' : 'normal',
            `${newOrder.customerName}から新規オーダー`);
          return s; // 受注確定時に減らすかは仕様次第。今回は提供完了時に減らす方針
        });
        timeoutRef.current = scheduleNext();
      }, delay);
    };
    const timeoutRef = { current: null };
    timeoutRef.current = scheduleNext();
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [isOnline]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const activeOrders = orders.filter(o => o.status === 'active');
  const completedOrders = orders.filter(o => o.status === 'completed');

  // 優先オーダーを上位に + 古い順
  const sortedActive = [...activeOrders].sort((a, b) => {
    if (a.isPriority !== b.isPriority) return a.isPriority ? -1 : 1;
    return new Date(a.placedAt) - new Date(b.placedAt);
  });

  const completeOrder = (orderId) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const beerQty = o.items.filter(it => isBeerId(it.id)).reduce((s, it) => s + it.qty, 0);
      setStock(s => Math.max(0, s - beerQty));
      // チップ累計に加算
      if (o.tip && o.tip > 0) {
        setTotalTips(t => t + o.tip);
        showToast('tip', `提供完了 🎁 チップ ¥${o.tip.toLocaleString()} いただきました！`);
      } else {
        showToast('completed', '提供完了しました');
      }
      return { ...o, status: 'completed', completedAt: new Date().toISOString() };
    }));
    setViewingOrder(null);
  };

  // 経過時間（分）
  const minutesSince = (iso) => Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  // 時刻フォーマット
  const fmtTime = (iso) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // 在庫メーターの状態
  const stockState = stock <= 5 ? 'critical' : stock <= 10 ? 'low' : 'ok';
  const stockPercent = Math.min(100, (stock / 30) * 100);

  // ===== ヘッダー =====
  const Header = () => (
    <div className="seller-header">
      <div className="header-row">
        <div className="seller-info">
          <button
            className="seller-avatar-mini seller-avatar-clickable"
            onClick={() => setProfilePopupSeller(currentSeller)}
            title="プロフィールを見る"
          >
            {profile.iconUrl
              ? <img src={profile.iconUrl} alt={currentSeller.name} className="seller-avatar-mini-img" />
              : <span>{currentSeller.avatar}</span>}
          </button>
          <div>
            <div className="seller-label">
              {currentStadium === 'ig-arena' ? '🏟️ IGアリーナ' : '⚾ 神宮球場'}
            </div>
            <div className="seller-name">{currentSeller.name}</div>
          </div>
        </div>
        <button
          className={`status-toggle ${isOnline ? 'status-on' : 'status-off'}`}
          onClick={() => setIsOnline(v => !v)}
        >
          <Power size={16} strokeWidth={2.5} />
          <span>{isOnline ? 'ON' : 'OFF'}</span>
          <div className={`status-dot ${isOnline ? 'on' : 'off'}`} />
        </button>
      </div>
      {!isOnline && (
        <div className="offline-warning">
          <span>⏸️</span>
          <span>オフライン中 — 顧客アプリに表示されません</span>
        </div>
      )}
    </div>
  );

  // ===== 在庫メーター =====
  const StockMeter = () => (
    <div className={`stock-card stock-${stockState}`}>
      <div className="stock-head">
        <div className="stock-label">
          <span className="stock-icon">🍺</span>
          <span>本日の販売残数</span>
        </div>
        <button className="stock-settings-btn" onClick={() => setShowStockSettings(true)}>
          <Settings size={16} />
        </button>
      </div>
      <div className="stock-main">
        <span className="stock-num">{stock}</span>
        <span className="stock-unit">杯</span>
      </div>
      <div className="stock-progress">
        <div
          className="stock-progress-fill"
          style={{ width: `${stockPercent}%` }}
        />
      </div>
      {stockState === 'critical' && (
        <div className="stock-alert">⚠️ 残りわずか — 補充をご検討ください</div>
      )}
      {stockState === 'low' && (
        <div className="stock-warn">残数が少なくなっています</div>
      )}
    </div>
  );

  // ===== 在庫設定モーダル =====
  const StockSettingsModal = () => {
    const [tempStock, setTempStock] = useState(stock);
    if (!showStockSettings) return null;
    return (
      <div className="modal-overlay" onClick={() => setShowStockSettings(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-head">
            <h3>販売残数の設定</h3>
            <button className="modal-close" onClick={() => setShowStockSettings(false)}>
              <X size={18} />
            </button>
          </div>
          <p className="modal-sub">残りの販売可能杯数を設定してください</p>
          <div className="stepper">
            <button
              className="stepper-btn stepper-minus"
              onClick={() => setTempStock(v => Math.max(0, v - 1))}
            >
              <Minus size={20} />
            </button>
            <div className="stepper-num">
              <span>{tempStock}</span>
              <small>杯</small>
            </div>
            <button
              className="stepper-btn stepper-plus"
              onClick={() => setTempStock(v => v + 1)}
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="quick-set">
            {[10, 20, 30, 50].map(n => (
              <button key={n} className="quick-set-btn" onClick={() => setTempStock(n)}>
                {n}杯
              </button>
            ))}
          </div>
          <button
            className="modal-confirm"
            onClick={() => { setStock(tempStock); setShowStockSettings(false); }}
          >
            設定する
          </button>
        </div>
      </div>
    );
  };

  // ===== オーダーカード =====
  const OrderCard = ({ order, compact }) => {
    const elapsed = minutesSince(order.placedAt);
    const isOld = elapsed >= 5;
    const totalQty = order.items.reduce((s, it) => s + it.qty, 0);
    return (
      <button
        className={`order-card ${order.isPriority ? 'order-card-priority' : ''} ${isOld ? 'order-card-old' : ''}`}
        onClick={() => setViewingOrder(order)}
      >
        <div className="order-card-head">
          {order.isPriority ? (
            <span className="order-tag tag-priority">
              <Zap size={11} fill="#1A4D2E" stroke="#1A4D2E" /> 最優先
            </span>
          ) : (
            <span className="order-tag tag-normal">通常</span>
          )}
          <span className={`order-elapsed ${isOld ? 'elapsed-old' : ''}`}>
            <Clock size={12} />
            <strong>{elapsed}</strong>分経過
          </span>
          <span className="order-time">{fmtTime(order.placedAt)}受注</span>
        </div>
        <div className="order-card-body">
          <div className="order-customer">{order.customerName}</div>
          <div className="order-items-summary">
            {order.items.map((it, i) => (
              <span key={i} className="order-item-chip">
                {it.emoji} {it.name} ×{it.qty}
              </span>
            ))}
          </div>
          <div className="order-card-foot">
            <span className="order-seat">
              <MapPin size={12} /> {order.area} {order.seatNumber}
            </span>
            <span className="order-price">¥{order.total.toLocaleString()}</span>
          </div>
        </div>
        <div className="order-card-chevron"><ChevronRight size={18} /></div>
      </button>
    );
  };

  // ===== オーダー詳細モーダル =====
  const OrderDetailModal = () => {
    if (!viewingOrder) return null;
    const o = viewingOrder;
    const elapsed = minutesSince(o.placedAt);
    const isCompleted = o.status === 'completed';
    const totalQty = o.items.reduce((s, it) => s + it.qty, 0);
    return (
      <div className="modal-overlay" onClick={() => setViewingOrder(null)}>
        <div className="modal modal-detail" onClick={e => e.stopPropagation()}>
          <div className="modal-head">
            <h3>オーダー詳細</h3>
            <button className="modal-close" onClick={() => setViewingOrder(null)}>
              <X size={18} />
            </button>
          </div>
          <div className="detail-tags">
            {o.isPriority ? (
              <span className="order-tag tag-priority">
                <Zap size={11} fill="#1A4D2E" stroke="#1A4D2E" /> 最優先オーダー
              </span>
            ) : (
              <span className="order-tag tag-normal">通常オーダー</span>
            )}
            {isCompleted ? (
              <span className="order-tag tag-completed">
                <Check size={11} /> 提供完了
              </span>
            ) : (
              <span className="order-tag tag-pending">
                <Clock size={11} /> {elapsed}分経過
              </span>
            )}
          </div>
          <div className="detail-customer-block">
            <div className="detail-customer-name">{o.customerName}</div>
            <div className="detail-seat">
              <MapPin size={14} /> {o.area} ／ 席番号 {o.seatNumber}
            </div>
          </div>
          <div className="detail-section-label">注文内容（{totalQty}点）</div>
          <div className="detail-items">
            {o.items.map((it, i) => (
              <div key={i} className="detail-item">
                <span className="detail-item-emoji">{it.emoji}</span>
                <div className="detail-item-info">
                  <div className="detail-item-name">{it.name}</div>
                  <div className="detail-item-price">¥{it.price.toLocaleString()} × {it.qty}</div>
                </div>
                <div className="detail-item-sub">¥{it.subtotal.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="detail-totals">
            <div className="detail-total-row"><span>小計</span><span>¥{o.subtotal.toLocaleString()}</span></div>
            {o.priorityFee > 0 && (
              <div className="detail-total-row detail-total-priority">
                <span><Zap size={12} fill="#FFD93D" stroke="#FFD93D" /> 優先デリバリー料金</span>
                <span>+¥{o.priorityFee.toLocaleString()}</span>
              </div>
            )}
            {o.tip > 0 && (
              <div className="detail-total-row detail-total-tip">
                <span>🎁 チップ</span>
                <span>+¥{o.tip.toLocaleString()}</span>
              </div>
            )}
            <div className="detail-total-row detail-grand">
              <span>合計</span>
              <span>¥{o.total.toLocaleString()}</span>
            </div>
          </div>
          <div className="detail-meta">
            <div className="meta-row"><span>受注時刻</span><span>{fmtTime(o.placedAt)}</span></div>
            {isCompleted && (
              <div className="meta-row"><span>完了時刻</span><span>{fmtTime(o.completedAt)}</span></div>
            )}
          </div>
          {!isCompleted && (
            <button className="complete-btn" onClick={() => completeOrder(o.id)}>
              <CheckCircle2 size={22} strokeWidth={2.5} />
              <span>提供完了</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  // ===== トースト通知 =====
  const Toast = () => {
    if (!toast) return null;
    return (
      <div className={`toast toast-${toast.type}`}>
        {toast.type === 'priority' && <Zap size={16} fill="#FFD93D" stroke="#FFD93D" />}
        {toast.type === 'normal' && <Bell size={16} />}
        {toast.type === 'completed' && <Check size={16} />}
        {toast.type === 'tip' && <span style={{fontSize:'16px'}}>🎁</span>}
        <span>{toast.message}</span>
      </div>
    );
  };

  // ===== 今日のホットエリア =====
  const HotAreaSection = () => {
    // スタジアムに応じて表示エリアを決定（受注数ではなくログイン情報を基準にする）
    const displayAreas = currentStadium === 'ig-arena' ? IG_AREAS : AREAS;

    // 本日の全オーダーからエリア別注文数を集計
    const areaCounts = {};
    displayAreas.forEach(a => { areaCounts[a] = 0; });
    orders.forEach(o => {
      if (o.area && areaCounts[o.area] !== undefined) {
        areaCounts[o.area] += o.items.reduce((s, it) => s + it.qty, 0);
      }
    });

    const demoBase = {
      // 神宮球場
      'バックネット裏': 8, '1塁側内野': 24, '1塁側外野': 14, '3塁側内野': 19, '3塁側外野': 6,
      // IGアリーナ
      '1Fアリーナ A（上手）': 18, '1Fアリーナ B/C（センター）': 38, '1Fアリーナ D（下手）': 22,
      '1F スタンド 100レベル': 15, '2F スタンド 200レベル': 42,
      '4F スタンド 400レベル': 28, '3F VIPバルコニー': 8, 'プレミアムラウンジ': 12,
    };
    const effectiveCounts = {};
    const effectiveMax = Math.max(...displayAreas.map(a => (areaCounts[a] || 0) + (demoBase[a] || 0)));
    displayAreas.forEach(a => { effectiveCounts[a] = (areaCounts[a] || 0) + (demoBase[a] || 0); });

    const hotArea = displayAreas.reduce((best, a) => effectiveCounts[a] > effectiveCounts[best] ? a : best, displayAreas[0]);

    return (
      <div className="hot-area-section">
        <div className="hot-area-header">
          <span className="hot-area-header-icon">🔥</span>
          <h2 className="hot-area-title">今日のホットエリア</h2>
          <span className="hot-area-update">リアルタイム</span>
        </div>
        <p className="hot-area-sub">全販売員への注文数 ／ 売り子の在籍人数</p>
        <div className="hot-area-grid">
          {displayAreas.map(area => {
            const count = effectiveCounts[area];
            const ratio = count / effectiveMax; // 0〜1
            const meta = AREA_META[area];
            const sellerCount = DUMMY_SELLER_COUNTS[area] || 0;
            const isHot = area === hotArea;
            // 熱度に応じた色 (緑〜オレンジ〜赤)
            const hue = Math.round(120 - ratio * 120); // 120(緑) → 0(赤)
            const sat = Math.round(55 + ratio * 35);
            const lit = Math.round(38 - ratio * 12);
            const bgColor = `hsl(${hue}, ${sat}%, ${lit}%)`;
            const textAlpha = 0.75 + ratio * 0.25;
            const intensity = ratio; // 0〜1

            return (
              <div
                key={area}
                className={`hot-area-card ${isHot ? 'hot-area-card-hot' : ''}`}
                style={{ '--area-bg': bgColor, '--area-ratio': intensity }}
              >
                {isHot && <div className="hot-area-fire">🔥</div>}
                <div className="hot-area-icon">{meta.icon}</div>
                <div className="hot-area-name">{area}</div>
                <div className="hot-area-bar-wrap">
                  <div
                    className="hot-area-bar"
                    style={{ width: `${Math.round(ratio * 100)}%` }}
                  />
                </div>
                <div className="hot-area-count">
                  <span className="hot-area-count-num">{count}</span>
                  <span className="hot-area-count-unit">件</span>
                </div>
                <div className="hot-area-sellers">
                  <span className="hot-area-sellers-icon">🧑</span>
                  <span className="hot-area-sellers-num">{sellerCount}</span>
                  <span className="hot-area-sellers-label">人</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="hot-area-note">
          ※ 在籍人数はGPS位置情報をもとに表示（現在はデモデータ）
        </div>
      </div>
    );
  };

  // ===== ホーム画面 =====
  const HomeScreen = () => {
    const visibleOrders = sortedActive.slice(0, 3);
    const remaining = sortedActive.length - 3;
    return (
      <>
        <Header />
        <div className="content">
          <StockMeter />
          {/* チップ累計バナー */}
          {totalTips > 0 && (
            <div className="tip-banner">
              <div className="tip-banner-icon">🎁</div>
              <div className="tip-banner-body">
                <div className="tip-banner-label">本日のチップ累計</div>
                <div className="tip-banner-val">¥{totalTips.toLocaleString()}</div>
              </div>
              <div className="tip-banner-sub">ありがとう🍺</div>
            </div>
          )}
          <button className="product-setup-btn" onClick={() => setScreen('productSetup')}>
            <span className="product-setup-btn-icon">🛒</span>
            <span>販売可能商品登録・残数変更</span>
            <ChevronRight size={18} className="product-setup-chevron" />
          </button>
          <div className="section">
            <div className="section-head">
              <h2 className="section-title">
                受注状況
                {sortedActive.length > 0 && (
                  <span className="section-count">{sortedActive.length}件</span>
                )}
              </h2>
              {completedOrders.length > 0 && (
                <button className="completed-link" onClick={() => setScreen('completedOrders')}>
                  <Check size={14} /> 完了済み（{completedOrders.length}）
                </button>
              )}
            </div>
            {sortedActive.length === 0 ? (
              <div className="empty-orders">
                <div className="empty-orders-icon">📭</div>
                <div className="empty-orders-title">受注待ち</div>
                <div className="empty-orders-sub">
                  {isOnline ? 'オーダーが入るとここに表示されます' : 'ONにすると受注を開始します'}
                </div>
              </div>
            ) : (
              <>
                {visibleOrders.map(o => <OrderCard key={o.id} order={o} />)}
                {remaining > 0 && (
                  <button className="open-all-btn" onClick={() => setScreen('allOrders')}>
                    <span>画面を開く</span>
                    <span className="open-all-badge">他 {remaining} 件</span>
                  </button>
                )}
              </>
            )}
          </div>
          {/* 今日のホットエリア */}
          <HotAreaSection />
        </div>
        {/* 下部固定: 2ボタンFAB */}
        <div className="fab-row">
          <button className="fab-btn fab-perf" onClick={() => setScreen('history')}>
            <BarChart2 size={16} />
            <span>実績確認</span>
          </button>
          <button className="fab-btn fab-profile" onClick={() => setScreen('profileSetup')}>
            <User size={16} />
            <span>プロフィール</span>
          </button>
        </div>
      </>
    );
  };

  // ===== 全オーダー一覧画面 =====
  const AllOrdersScreen = () => (
    <>
      <div className="sub-header">
        <button className="back-btn" onClick={() => setScreen('home')}>
          <ChevronLeft size={20} />
        </button>
        <h2>全ての受注（{sortedActive.length}件）</h2>
      </div>
      <div className="content">
        {sortedActive.map(o => <OrderCard key={o.id} order={o} />)}
      </div>
    </>
  );

  // ===== 完了済み一覧画面 =====
  const CompletedOrdersScreen = () => {
    const sortedCompleted = [...completedOrders].sort((a, b) =>
      new Date(b.completedAt) - new Date(a.completedAt)
    );
    const totalSales = sortedCompleted.reduce((s, o) => s + o.total, 0);
    const totalQty = sortedCompleted.reduce((s, o) =>
      s + o.items.filter(it => isBeerId(it.id)).reduce((q, it) => q + it.qty, 0), 0
    );
    const completedTips = sortedCompleted.reduce((s, o) => s + (o.tip || 0), 0);
    return (
      <>
        <div className="sub-header">
          <button className="back-btn" onClick={() => setScreen('home')}>
            <ChevronLeft size={20} />
          </button>
          <h2>完了済みオーダー</h2>
        </div>
        <div className="content">
          <div className="completed-summary">
            <div className="summary-cell">
              <div className="summary-label">完了件数</div>
              <div className="summary-value">{sortedCompleted.length}<small>件</small></div>
            </div>
            <div className="summary-divider" />
            <div className="summary-cell">
              <div className="summary-label">販売杯数</div>
              <div className="summary-value">{totalQty}<small>杯</small></div>
            </div>
            <div className="summary-divider" />
            <div className="summary-cell">
              <div className="summary-label">売上</div>
              <div className="summary-value summary-sales">¥{totalSales.toLocaleString()}</div>
            </div>
            {completedTips > 0 && (
              <>
                <div className="summary-divider" />
                <div className="summary-cell">
                  <div className="summary-label">🎁 チップ</div>
                  <div className="summary-value summary-tips">¥{completedTips.toLocaleString()}</div>
                </div>
              </>
            )}
          </div>
          {sortedCompleted.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-orders-icon">📦</div>
              <div className="empty-orders-title">まだありません</div>
            </div>
          ) : (
            sortedCompleted.map(o => (
              <button
                key={o.id}
                className="completed-card"
                onClick={() => setViewingOrder(o)}
              >
                <div className="completed-card-head">
                  <span className="completed-time">{fmtTime(o.completedAt)} 完了</span>
                  {o.isPriority && (
                    <span className="order-tag tag-priority">
                      <Zap size={10} fill="#1A4D2E" stroke="#1A4D2E" /> 最優先
                    </span>
                  )}
                </div>
                <div className="completed-card-body">
                  <div className="completed-customer">{o.customerName}</div>
                  <div className="order-items-summary">
                    {o.items.map((it, i) => (
                      <span key={i} className="order-item-chip">
                        {it.emoji} {it.name}×{it.qty}
                      </span>
                    ))}
                  </div>
                  <div className="completed-card-foot">
                    <span className="order-seat"><MapPin size={11} /> {o.area} {o.seatNumber}</span>
                    <span className="order-price">¥{o.total.toLocaleString()}</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </>
    );
  };

  // ===== プロフィール登録画面 =====
  const ProfileSetupScreen = () => {
    const [draft, setDraft] = useState({ ...profile });
    const fileInputRef = useRef(null);
    const bioLen = draft.bio.length;
    const BIO_MAX = 100;

    const handleIconFile = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setDraft(d => ({ ...d, iconUrl: ev.target.result }));
      reader.readAsDataURL(file);
    };

    const removeIcon = () => setDraft(d => ({ ...d, iconUrl: '' }));

    const handleSave = () => {
      setProfile(draft);
      showToast('completed', 'プロフィールを保存しました');
      setScreen('home');
    };

    // TikTokはlucideに無いためSVGで代替
    const TikTokIcon = () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.83 1.54V6.78a4.85 4.85 0 01-1.06-.09z"/>
      </svg>
    );

    return (
      <>
        <div className="sub-header">
          <button className="back-btn" onClick={() => setScreen('home')}>
            <ChevronLeft size={20} />
          </button>
          <h2>プロフィール登録</h2>
        </div>
        <div className="content">

          {/* アイコン設定 */}
          <div className="profile-section">
            <div className="profile-section-title">
              <Camera size={16} /> アイコン画像
            </div>
            <div className="profile-icon-wrap">
              <div className="profile-icon-preview">
                {draft.iconUrl
                  ? <img src={draft.iconUrl} alt="アイコン" className="profile-icon-img" />
                  : <span className="profile-icon-emoji">{draft.iconEmoji}</span>}
              </div>
              <div className="profile-icon-actions">
                <button className="profile-icon-btn" onClick={() => fileInputRef.current?.click()}>
                  <Camera size={15} /> 画像を選択
                </button>
                {draft.iconUrl && (
                  <button className="profile-icon-btn profile-icon-remove" onClick={removeIcon}>
                    <X size={15} /> 削除
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleIconFile}
                />
              </div>
              <p className="profile-icon-note">※ JPG・PNG・GIF に対応。未設定時は絵文字アイコンが表示されます。</p>
            </div>
          </div>

          {/* 自己紹介 */}
          <div className="profile-section">
            <div className="profile-section-title">
              <MessageSquare size={16} /> 自己紹介コメント
            </div>
            <textarea
              className={`profile-textarea ${bioLen > BIO_MAX ? 'profile-textarea-over' : ''}`}
              placeholder="例：笑顔でお届けします！お気軽にどうぞ😊&#10;神宮球場担当5年目です！"
              value={draft.bio}
              onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
              rows={4}
              maxLength={BIO_MAX + 20}
            />
            <div className={`profile-bio-counter ${bioLen > BIO_MAX ? 'over' : ''}`}>
              {bioLen} / {BIO_MAX}
            </div>
          </div>

          {/* SNS リンク */}
          <div className="profile-section">
            <div className="profile-section-title">
              <Link size={16} /> SNSリンク
            </div>
            <div className="profile-field">
              <label className="profile-field-label">
                <Instagram size={16} className="profile-field-icon profile-field-instagram" />
                Instagram
              </label>
              <div className="profile-input-wrap">
                <span className="profile-input-prefix">instagram.com/</span>
                <input
                  className="profile-input"
                  type="text"
                  placeholder="username"
                  value={draft.instagram}
                  onChange={e => setDraft(d => ({ ...d, instagram: e.target.value.replace(/^@/, '') }))}
                />
              </div>
            </div>
            <div className="profile-field">
              <label className="profile-field-label">
                <TikTokIcon /> TikTok
              </label>
              <div className="profile-input-wrap">
                <span className="profile-input-prefix">tiktok.com/@</span>
                <input
                  className="profile-input"
                  type="text"
                  placeholder="username"
                  value={draft.tiktok}
                  onChange={e => setDraft(d => ({ ...d, tiktok: e.target.value.replace(/^@/, '') }))}
                />
              </div>
            </div>
          </div>

          {/* プレビュー */}
          <div className="profile-section">
            <div className="profile-section-title">
              <User size={16} /> 顧客への表示プレビュー
            </div>
            <SellerProfileCard seller={currentSeller} prof={draft} preview />
          </div>

          {/* 保存ボタン */}
          <button className="product-save-btn" onClick={handleSave}
            style={{ opacity: bioLen > BIO_MAX ? 0.5 : 1, pointerEvents: bioLen > BIO_MAX ? 'none' : 'auto' }}>
            <Check size={20} strokeWidth={3} />
            <span>プロフィールを保存する</span>
          </button>
          <div className="product-save-note">※ 保存すると顧客アプリのプロフィールPOPUPに反映されます</div>
        </div>
      </>
    );
  };

  // ===== 売り子プロフィールカード（共通: 売り子アプリ内プレビュー ＆ 顧客アプリPOPUP） =====
  const SellerProfileCard = ({ seller, prof, preview, onClose }) => {
    const TikTokIcon = () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.83 1.54V6.78a4.85 4.85 0 01-1.06-.09z"/>
      </svg>
    );
    return (
      <div className={`seller-profile-card ${preview ? 'seller-profile-preview' : ''}`}>
        {!preview && onClose && (
          <button className="profile-popup-close" onClick={onClose}><X size={18} /></button>
        )}
        <div className="profile-popup-hero">
          <div className="profile-popup-avatar">
            {prof?.iconUrl
              ? <img src={prof.iconUrl} alt={seller.name} className="profile-popup-avatar-img" />
              : <span>{seller.avatar}</span>}
          </div>
          <div className="profile-popup-name">{seller.name}</div>
          <div className="profile-popup-badge">販売員</div>
        </div>
        {prof?.bio && (
          <p className="profile-popup-bio">"{prof.bio}"</p>
        )}
        {!prof?.bio && preview && (
          <p className="profile-popup-bio profile-popup-bio-empty">自己紹介コメントがここに表示されます</p>
        )}
        <div className="profile-popup-sns">
          {prof?.instagram && (
            <a
              href={`https://instagram.com/${prof.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-sns-btn profile-sns-instagram"
              onClick={e => preview && e.preventDefault()}
            >
              <Instagram size={15} />
              <span>@{prof.instagram}</span>
            </a>
          )}
          {prof?.tiktok && (
            <a
              href={`https://tiktok.com/@${prof.tiktok}`}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-sns-btn profile-sns-tiktok"
              onClick={e => preview && e.preventDefault()}
            >
              <TikTokIcon />
              <span>@{prof.tiktok}</span>
            </a>
          )}
          {!prof?.instagram && !prof?.tiktok && preview && (
            <div className="profile-sns-empty">SNSリンクがここに表示されます</div>
          )}
        </div>
      </div>
    );
  };

  // ===== プロフィールPOPUP（顧客デモ用） =====
  const ProfilePopup = () => {
    if (!profilePopupSeller) return null;
    return (
      <div className="modal-overlay" onClick={() => setProfilePopupSeller(null)}>
        <div className="modal profile-popup-modal" onClick={e => e.stopPropagation()}>
          <SellerProfileCard
            seller={profilePopupSeller}
            prof={profilePopupSeller.id === currentSeller.id ? profile : {
              instagram: 'urikko_demo',
              tiktok: '',
              bio: 'いつも元気いっぱいお届けします！🍺 お気軽にどうぞ！',
              iconUrl: '',
              iconEmoji: profilePopupSeller.avatar,
            }}
            preview={false}
            onClose={() => setProfilePopupSeller(null)}
          />
        </div>
      </div>
    );
  };

  // ===== 販売可能商品登録・残数変更画面 =====
  const ProductSetupScreen = () => {
    const selectedBeerCount = sellerBeers.size;
    const selectedSnackCount = sellerSnacks.size;

    const ProductRow = ({ product, isSelected, onToggle, stockVal, onDelta, isSnack }) => (
      <div className={`product-row ${isSelected ? 'product-row-on' : 'product-row-off'}`}>
        {/* 選択トグル */}
        <button
          className={`product-check ${isSelected ? 'product-check-on' : ''}`}
          onClick={onToggle}
          aria-label={isSelected ? '選択解除' : '選択'}
        >
          {isSelected ? <Check size={16} strokeWidth={3} /> : null}
        </button>
        {/* 商品情報 */}
        <div className="product-emoji">{product.emoji}</div>
        <div className="product-info">
          <div className="product-name">{product.name}</div>
          <div className="product-price">¥{product.price.toLocaleString()}</div>
        </div>
        {/* 残数ステッパー（選択時のみ） */}
        {isSelected ? (
          <div className="product-stepper">
            <button
              className="product-stepper-btn"
              onClick={() => onDelta(-1)}
              disabled={stockVal <= 0}
            >
              <Minus size={14} />
            </button>
            <span className="product-stepper-num">
              {stockVal}
              <small>{isSnack ? '個' : '杯'}</small>
            </span>
            <button
              className="product-stepper-btn"
              onClick={() => onDelta(1)}
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <div className="product-stepper-placeholder">未販売</div>
        )}
      </div>
    );

    return (
      <>
        <div className="sub-header">
          <button className="back-btn" onClick={() => setScreen('home')}>
            <ChevronLeft size={20} />
          </button>
          <h2>販売商品登録・残数変更</h2>
        </div>
        <div className="content">
          {/* 選択サマリー */}
          <div className="product-summary">
            <div className="product-summary-cell">
              <div className="product-summary-label">ドリンク</div>
              <div className="product-summary-val">{selectedBeerCount}<small>銘柄</small></div>
            </div>
            <div className="summary-divider" />
            <div className="product-summary-cell">
              <div className="product-summary-label">おつまみ</div>
              <div className="product-summary-val">{selectedSnackCount}<small>種</small></div>
            </div>
            <div className="summary-divider" />
            <div className="product-summary-cell">
              <div className="product-summary-label">合計品目</div>
              <div className="product-summary-val">{selectedBeerCount + selectedSnackCount}<small>品</small></div>
            </div>
          </div>

          {/* ドリンクセクション */}
          <div className="product-section">
            <div className="product-section-head">
              <span className="product-section-icon">🍺</span>
              <h3 className="product-section-title">ドリンク銘柄</h3>
              <span className="product-section-count">{selectedBeerCount}/{BEERS.length}</span>
            </div>
            <div className="product-list">
              {BEERS.map(beer => (
                <ProductRow
                  key={beer.id}
                  product={beer}
                  isSelected={sellerBeers.has(beer.id)}
                  onToggle={() => toggleBeer(beer.id)}
                  stockVal={productStock[beer.id] ?? 30}
                  onDelta={(d) => changeProductStock(beer.id, d)}
                  isSnack={false}
                />
              ))}
            </div>
            {/* 一括クイック設定 */}
            <div className="product-bulk-set">
              <span className="product-bulk-label">選択した銘柄の残数を一括設定：</span>
              <div className="product-bulk-btns">
                {[10, 20, 30, 50].map(n => (
                  <button
                    key={n}
                    className="product-bulk-btn"
                    onClick={() => {
                      sellerBeers.forEach(id => setProductStockDirect(id, n));
                    }}
                  >
                    {n}杯
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* おつまみセクション */}
          <div className="product-section">
            <div className="product-section-head">
              <span className="product-section-icon">🥜</span>
              <h3 className="product-section-title">おつまみ</h3>
              <span className="product-section-count">{selectedSnackCount}/{SNACKS.length}</span>
            </div>
            <div className="product-list">
              {SNACKS.map(snack => (
                <ProductRow
                  key={snack.id}
                  product={snack}
                  isSelected={sellerSnacks.has(snack.id)}
                  onToggle={() => toggleSnack(snack.id)}
                  stockVal={productStock[snack.id] ?? 30}
                  onDelta={(d) => changeProductStock(snack.id, d)}
                  isSnack={true}
                />
              ))}
            </div>
            <div className="product-bulk-set">
              <span className="product-bulk-label">選択したおつまみの残数を一括設定：</span>
              <div className="product-bulk-btns">
                {[5, 10, 20, 30].map(n => (
                  <button
                    key={n}
                    className="product-bulk-btn"
                    onClick={() => {
                      sellerSnacks.forEach(id => setProductStockDirect(id, n));
                    }}
                  >
                    {n}個
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 登録ボタン */}
          <button
            className="product-save-btn"
            onClick={() => {
              setScreen('home');
            }}
          >
            <Check size={20} strokeWidth={3} />
            <span>設定を保存してホームへ</span>
          </button>
          <div className="product-save-note">
            ※ 設定した内容は顧客アプリの銘柄一覧に反映されます
          </div>
        </div>
      </>
    );
  };

  // ===== 実績確認画面 =====
  const HistoryScreen = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const prevMonth = () => {
      if (historyMonth === 1) { setHistoryYear(y => y - 1); setHistoryMonth(12); }
      else setHistoryMonth(m => m - 1);
      setHistoryDayKey(null);
    };
    const nextMonth = () => {
      const isCurrentMonth = historyYear === currentYear && historyMonth === currentMonth;
      if (isCurrentMonth) return; // 未来には進めない
      if (historyMonth === 12) { setHistoryYear(y => y + 1); setHistoryMonth(1); }
      else setHistoryMonth(m => m + 1);
      setHistoryDayKey(null);
    };
    const isCurrentMonth = historyYear === currentYear && historyMonth === currentMonth;

    // 当月の日付リストを生成（昨日まで）
    const daysInMonth = new Date(historyYear, historyMonth, 0).getDate();
    const todayStr = now.toISOString().slice(0, 10);
    const dayList = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(historyYear, historyMonth - 1, d);
      const key = dt.toISOString().slice(0, 10);
      if (key >= todayStr) break; // 今日以降は表示しない
      const orders = historyData[key] || [];
      const sales = orders.reduce((s, o) => s + o.total, 0);
      const qty = orders.reduce((s, o) => s + o.items.filter(it => isBeerId(it.id)).reduce((q, it) => q + it.qty, 0), 0);
      dayList.push({ key, day: d, dt, orders, sales, qty, dow: dt.getDay() });
    }
    const monthTotal = dayList.reduce((s, d) => s + d.sales, 0);
    const monthQty = dayList.reduce((s, d) => s + d.qty, 0);
    const DOW = ['日', '月', '火', '水', '木', '金', '土'];

    // 日別詳細ビュー
    if (historyDayKey) {
      const dayInfo = dayList.find(d => d.key === historyDayKey);
      if (!dayInfo) return null;
      const dayOrders = dayInfo.orders;
      const fmtT = (iso) => { const d = new Date(iso); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; };
      return (
        <>
          <div className="sub-header">
            <button className="back-btn" onClick={() => setHistoryDayKey(null)}><ChevronLeft size={20} /></button>
            <h2>{historyMonth}/{dayInfo.day}（{DOW[dayInfo.dow]}）の実績</h2>
          </div>
          <div className="content">
            <div className="hist-day-summary">
              <div className="summary-cell">
                <div className="summary-label">件数</div>
                <div className="summary-value">{dayOrders.length}<small>件</small></div>
              </div>
              <div className="summary-divider" />
              <div className="summary-cell">
                <div className="summary-label">販売杯数</div>
                <div className="summary-value">{dayInfo.qty}<small>杯</small></div>
              </div>
              <div className="summary-divider" />
              <div className="summary-cell">
                <div className="summary-label">売上</div>
                <div className="summary-value summary-sales">¥{dayInfo.sales.toLocaleString()}</div>
              </div>
            </div>
            {dayOrders.length === 0 ? (
              <div className="empty-orders">
                <div className="empty-orders-icon">📭</div>
                <div className="empty-orders-title">この日の実績はありません</div>
              </div>
            ) : (
              dayOrders.sort((a,b) => new Date(a.placedAt)-new Date(b.placedAt)).map((o, i) => (
                <div key={o.id} className="hist-order-card">
                  <div className="hist-order-head">
                    <span className="hist-order-time">{fmtT(o.placedAt)}</span>
                    {o.isPriority && <span className="order-tag tag-priority"><Zap size={10} fill="#1A4D2E" stroke="#1A4D2E" /> 最優先</span>}
                    <span className="hist-order-num">#{i+1}</span>
                  </div>
                  <div className="hist-order-customer">{o.customerName}</div>
                  <div className="order-items-summary">
                    {o.items.map((it, j) => (
                      <span key={j} className="order-item-chip">{it.emoji} {it.name} ×{it.qty}</span>
                    ))}
                  </div>
                  <div className="hist-order-foot">
                    <span className="order-seat"><MapPin size={11} /> {o.area} {o.seatNumber}</span>
                    <span className="order-price">¥{o.total.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      );
    }

    // 月別リストビュー
    return (
      <>
        <div className="sub-header">
          <button className="back-btn" onClick={() => setScreen('home')}><ChevronLeft size={20} /></button>
          <h2>実績確認</h2>
        </div>
        <div className="content">
          {/* 月スライダー */}
          <div className="month-slider">
            <button className="month-arrow" onClick={prevMonth}><ChevronLeft size={22} /></button>
            <div className="month-label">
              <Calendar size={16} />
              <span>{historyYear}年 {historyMonth}月</span>
            </div>
            <button
              className={`month-arrow ${isCurrentMonth ? 'month-arrow-disabled' : ''}`}
              onClick={nextMonth}
              disabled={isCurrentMonth}
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* 月サマリー */}
          <div className="hist-month-summary">
            <div className="summary-cell">
              <div className="summary-label">稼働日数</div>
              <div className="summary-value">{dayList.filter(d => d.orders.length > 0).length}<small>日</small></div>
            </div>
            <div className="summary-divider" />
            <div className="summary-cell">
              <div className="summary-label">累計杯数</div>
              <div className="summary-value">{monthQty}<small>杯</small></div>
            </div>
            <div className="summary-divider" />
            <div className="summary-cell">
              <div className="summary-label">月間売上</div>
              <div className="summary-value summary-sales">¥{monthTotal.toLocaleString()}</div>
            </div>
          </div>

          {/* 日別リスト */}
          {dayList.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-orders-icon">📅</div>
              <div className="empty-orders-title">表示できる実績がありません</div>
              <div className="empty-orders-sub">前の月を選択してください</div>
            </div>
          ) : (
            <div className="hist-day-list">
              {[...dayList].reverse().map(day => (
                <button
                  key={day.key}
                  className={`hist-day-row ${day.orders.length === 0 ? 'hist-day-row-off' : ''} ${day.dow === 0 ? 'dow-sun' : day.dow === 6 ? 'dow-sat' : ''}`}
                  onClick={() => day.orders.length > 0 && setHistoryDayKey(day.key)}
                  disabled={day.orders.length === 0}
                >
                  <div className="hist-day-date">
                    <span className="hist-day-num">{day.day}</span>
                    <span className="hist-day-dow">{DOW[day.dow]}</span>
                  </div>
                  {day.orders.length === 0 ? (
                    <div className="hist-day-off">－ 休業</div>
                  ) : (
                    <>
                      <div className="hist-day-metrics">
                        <span className="hist-day-qty">🍺 {day.qty}杯</span>
                        <span className="hist-day-orders">{day.orders.length}件</span>
                      </div>
                      <div className="hist-day-sales">¥{day.sales.toLocaleString()}</div>
                      <ChevronRight size={16} className="hist-day-chevron" />
                    </>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* 月合計 */}
          <div className="hist-month-total">
            <span className="hist-month-total-label">{historyYear}年{historyMonth}月 累計売上</span>
            <span className="hist-month-total-val">¥{monthTotal.toLocaleString()}</span>
          </div>
        </div>
      </>
    );
  };

  // ===== ログインしていない場合はログイン画面を返す =====
  if (!loggedIn) {
    return (
      <div className="seller-app">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Bebas+Neue&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          .seller-app { font-family: 'Zen Kaku Gothic New', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; min-height: 100vh; }
          .login-screen { min-height: 100vh; background: linear-gradient(160deg, #1A4D2E 0%, #2D6B47 50%, #1A4D2E 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; position: relative; overflow: hidden; }
          .login-screen::before { content: '⚾ ⚽ ⚾ ⚽ ⚾'; position: absolute; bottom: -30px; left: -20px; font-size: 80px; opacity: 0.05; letter-spacing: 14px; white-space: nowrap; }
          .login-hero { text-align: center; margin-bottom: 32px; color: #FFF8E7; }
          .login-logo-mark { font-size: 48px; margin-bottom: 4px; }
          .login-logo-text { font-family: 'Bebas Neue', sans-serif; font-size: 56px; color: #FFD93D; letter-spacing: 4px; line-height: 1; text-shadow: 3px 3px 0 rgba(0,0,0,0.3); }
          .login-logo-sub { font-size: 13px; font-weight: 700; opacity: 0.85; letter-spacing: 0.15em; margin-top: 6px; }
          .login-card { background: #FFFCF7; border-radius: 20px; padding: 28px 24px; width: 100%; max-width: 380px; box-shadow: 0 16px 40px rgba(0,0,0,0.25); }
          .login-field { margin-bottom: 18px; }
          .login-label { display: block; font-size: 12px; font-weight: 900; color: #6B5D4F; letter-spacing: 0.1em; margin-bottom: 8px; }
          .login-input { width: 100%; padding: 14px 16px; font-size: 16px; font-family: 'Zen Kaku Gothic New', sans-serif; font-weight: 700; border: 2px solid #E5DDD0; border-radius: 12px; background: #FFF; outline: none; transition: border-color 0.15s; letter-spacing: 0.05em; }
          .login-input:focus { border-color: #1A4D2E; }
          .login-pass-wrap { position: relative; }
          .login-input-pass { padding-right: 48px; }
          .pass-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #C7BDB0; cursor: pointer; padding: 4px; display: flex; align-items: center; }
          .pass-toggle:hover { color: #1A4D2E; }
          .login-error { background: #FFF0F0; border: 1px solid #FFCDD0; color: #C0392B; padding: 10px 14px; border-radius: 10px; font-size: 13px; font-weight: 700; margin-bottom: 14px; }
          .login-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%); color: #FFD93D; border: none; border-radius: 12px; font-family: 'Zen Kaku Gothic New', sans-serif; font-size: 16px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 12px rgba(26,77,46,0.35); transition: all 0.15s; letter-spacing: 0.05em; margin-bottom: 16px; }
          .login-btn:hover { transform: translateY(-2px); }
          .login-hint { text-align: center; font-size: 11px; color: #C7BDB0; }
          .login-hint code { background: #F5F2EC; padding: 1px 6px; border-radius: 4px; font-family: monospace; color: #1A4D2E; font-weight: 900; }
        `}</style>
        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="seller-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Bebas+Neue&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        .seller-app {
          font-family: 'Zen Kaku Gothic New', -apple-system, sans-serif;
          background: #F5F2EC;
          min-height: 100vh;
          color: #1A1A1A;
          max-width: 480px;
          margin: 0 auto;
          position: relative;
          padding-bottom: 40px;
        }

        /* === ヘッダー === */
        .seller-header {
          background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%);
          padding: 20px 18px 16px;
          color: #FFF8E7;
        }
        .header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .seller-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .seller-avatar-mini {
          width: 44px; height: 44px;
          background: #FFF;
          border: 2px solid #FFD93D;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
        }
        .seller-label {
          font-size: 10px;
          color: #FFD93D;
          font-weight: 900;
          letter-spacing: 0.15em;
        }
        .seller-name {
          font-size: 18px;
          font-weight: 900;
          margin-top: 2px;
        }

        .status-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 100px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 0.1em;
          cursor: pointer;
          border: 2px solid;
          transition: all 0.15s;
          font-weight: 400;
        }
        .status-on {
          background: #FFD93D;
          color: #1A4D2E;
          border-color: #FFD93D;
          box-shadow: 0 4px 12px rgba(255, 217, 61, 0.4);
        }
        .status-off {
          background: rgba(0,0,0,0.3);
          color: #FFF8E7;
          border-color: rgba(255, 248, 231, 0.4);
        }
        .status-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
        }
        .status-dot.on {
          background: #1A4D2E;
          animation: pulse-on 1.5s ease-in-out infinite;
        }
        .status-dot.off {
          background: #FF6B6B;
        }
        @keyframes pulse-on {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .offline-warning {
          margin-top: 12px;
          padding: 10px 14px;
          background: rgba(255, 107, 107, 0.2);
          border: 1px solid rgba(255, 107, 107, 0.5);
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* === コンテンツ === */
        .content {
          padding: 16px;
        }

        /* === 在庫メーター === */
        .stock-card {
          background: #FFF;
          border-radius: 16px;
          padding: 18px;
          border: 2px solid;
          margin-bottom: 18px;
          transition: all 0.3s;
        }
        .stock-ok { border-color: #1A4D2E; }
        .stock-low { border-color: #F39C12; background: #FFFBEF; }
        .stock-critical { border-color: #E63946; background: #FFF5F5; animation: critical-pulse 2s ease-in-out infinite; }
        @keyframes critical-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(230, 57, 70, 0); }
          50% { box-shadow: 0 0 0 4px rgba(230, 57, 70, 0.15); }
        }

        .stock-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .stock-label {
          font-size: 13px;
          font-weight: 700;
          color: #6B5D4F;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .stock-icon { font-size: 18px; }
        .stock-settings-btn {
          width: 32px; height: 32px;
          background: #F5F2EC;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: #1A4D2E;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .stock-settings-btn:hover { background: #1A4D2E; color: #FFD93D; }

        .stock-main {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin: 4px 0 14px;
        }
        .stock-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 72px;
          color: #1A4D2E;
          line-height: 1;
          letter-spacing: 0.02em;
        }
        .stock-low .stock-num { color: #F39C12; }
        .stock-critical .stock-num { color: #E63946; }
        .stock-unit {
          font-size: 18px;
          font-weight: 900;
          color: #6B5D4F;
        }

        .stock-progress {
          height: 8px;
          background: #F0EAE0;
          border-radius: 100px;
          overflow: hidden;
        }
        .stock-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #1A4D2E, #4A8B5C);
          border-radius: 100px;
          transition: width 0.5s ease;
        }
        .stock-low .stock-progress-fill { background: linear-gradient(90deg, #F39C12, #E67E22); }
        .stock-critical .stock-progress-fill { background: linear-gradient(90deg, #E63946, #FF6B6B); }

        .stock-alert {
          margin-top: 10px;
          padding: 8px 12px;
          background: #E63946;
          color: #FFF;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 900;
          text-align: center;
        }
        .stock-warn {
          margin-top: 10px;
          padding: 6px 12px;
          background: #FFEFD0;
          color: #B7710B;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
        }

        /* === セクション === */
        .section { margin-top: 4px; }
        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-count {
          font-size: 11px;
          background: #1A4D2E;
          color: #FFD93D;
          padding: 2px 8px;
          border-radius: 100px;
          font-weight: 900;
        }
        .completed-link {
          font-size: 12px;
          color: #1A4D2E;
          background: none;
          border: 1px solid #1A4D2E;
          padding: 5px 10px;
          border-radius: 100px;
          cursor: pointer;
          font-family: inherit;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .completed-link:hover { background: #1A4D2E; color: #FFD93D; }

        /* === オーダーカード === */
        .order-card {
          width: 100%;
          background: #FFF;
          border: 2px solid #E5DDD0;
          border-radius: 14px;
          padding: 14px 36px 14px 14px;
          margin-bottom: 10px;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          position: relative;
          transition: all 0.15s;
        }
        .order-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.08); }
        .order-card-priority {
          border-color: #FFD93D;
          background: linear-gradient(135deg, #FFF 0%, #FFFBEF 100%);
          box-shadow: 0 2px 8px rgba(255, 184, 0, 0.18);
        }
        .order-card-priority::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #FFD93D, #FFB800);
          border-radius: 14px 0 0 14px;
        }
        .order-card-old { border-color: #E63946; }
        .order-card-old::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 14px;
          border: 2px solid #E63946;
          opacity: 0.3;
          animation: old-pulse 1.8s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes old-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        .order-card-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .order-tag {
          font-size: 10px;
          font-weight: 900;
          padding: 3px 8px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          letter-spacing: 0.03em;
        }
        .tag-priority {
          background: #FFD93D;
          color: #1A4D2E;
        }
        .tag-normal {
          background: #F0EAE0;
          color: #6B5D4F;
        }
        .tag-completed {
          background: #1A4D2E;
          color: #FFD93D;
        }
        .tag-pending {
          background: #FFF8E7;
          color: #B7710B;
          border: 1px solid #FFD93D;
        }

        .order-elapsed {
          font-size: 11px;
          font-weight: 700;
          color: #6B5D4F;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          flex: 1;
        }
        .order-elapsed strong {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          margin: 0 1px;
          color: #1A4D2E;
          letter-spacing: 0.05em;
        }
        .order-elapsed.elapsed-old strong { color: #E63946; }
        .order-time {
          font-size: 10px;
          color: #C7BDB0;
          font-weight: 500;
        }

        .order-customer {
          font-size: 15px;
          font-weight: 900;
          margin-bottom: 8px;
        }
        .order-items-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 10px;
        }
        .order-item-chip {
          font-size: 11px;
          background: #F5F2EC;
          color: #1A1A1A;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 700;
        }
        .order-card-priority .order-item-chip {
          background: #FFF8E7;
        }

        .order-card-foot {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-top: 8px;
          border-top: 1px dashed #E5DDD0;
        }
        .order-seat {
          font-size: 11px;
          color: #6B5D4F;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-weight: 700;
        }
        .order-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          color: #1A4D2E;
          letter-spacing: 0.05em;
        }
        .order-card-chevron {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #C7BDB0;
        }

        /* === 「画面を開く」ボタン === */
        .open-all-btn {
          width: 100%;
          padding: 14px;
          background: #1A4D2E;
          color: #FFD93D;
          border: none;
          border-radius: 12px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 6px;
        }
        .open-all-btn:hover { background: #0F3D22; }
        .open-all-badge {
          background: #FFD93D;
          color: #1A4D2E;
          padding: 2px 10px;
          border-radius: 100px;
          font-size: 12px;
        }

        /* === 空状態 === */
        .empty-orders {
          text-align: center;
          padding: 40px 20px;
          background: #FFF;
          border-radius: 14px;
          border: 1px dashed #E5DDD0;
        }
        .empty-orders-icon { font-size: 40px; margin-bottom: 10px; }
        .empty-orders-title {
          font-size: 14px;
          font-weight: 900;
          margin-bottom: 4px;
          color: #6B5D4F;
        }
        .empty-orders-sub {
          font-size: 11px;
          color: #C7BDB0;
        }

        /* === サブ画面ヘッダー === */
        .sub-header {
          background: #1A4D2E;
          color: #FFF8E7;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .sub-header h2 {
          font-size: 16px;
          font-weight: 900;
        }
        .back-btn {
          width: 36px; height: 36px;
          background: rgba(255, 217, 61, 0.2);
          color: #FFD93D;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* === 完了サマリー === */
        .completed-summary {
          background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%);
          color: #FFF8E7;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .summary-cell {
          flex: 1;
          text-align: center;
        }
        .summary-divider {
          width: 1px;
          height: 36px;
          background: rgba(255, 217, 61, 0.3);
        }
        .summary-label {
          font-size: 10px;
          font-weight: 700;
          opacity: 0.85;
          margin-bottom: 4px;
        }
        .summary-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 0.05em;
          color: #FFD93D;
          line-height: 1;
        }
        .summary-value small {
          font-size: 12px;
          margin-left: 2px;
          font-family: 'Zen Kaku Gothic New', sans-serif;
          font-weight: 700;
        }
        .summary-sales { font-size: 22px; }

        /* === 完了カード === */
        .completed-card {
          width: 100%;
          background: #FFF;
          border: 1px solid #E5DDD0;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 8px;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
          transition: transform 0.15s;
          opacity: 0.88;
        }
        .completed-card:hover { transform: translateX(2px); opacity: 1; }
        .completed-card-head {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .completed-time {
          font-size: 11px;
          color: #6B5D4F;
          font-weight: 700;
          flex: 1;
        }
        .completed-customer {
          font-size: 13px;
          font-weight: 900;
          margin-bottom: 6px;
        }
        .completed-card-foot {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: 4px;
        }

        /* === モーダル === */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 100;
          padding: 0;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal {
          background: #FFFCF7;
          width: 100%;
          max-width: 480px;
          border-radius: 20px 20px 0 0;
          padding: 20px;
          animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          max-height: 90vh;
          overflow-y: auto;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .modal-head h3 {
          font-size: 16px;
          font-weight: 900;
        }
        .modal-close {
          width: 32px; height: 32px;
          border: none;
          background: #F0EAE0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .modal-sub {
          font-size: 12px;
          color: #6B5D4F;
          margin-bottom: 18px;
        }

        /* === ステッパー === */
        .stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          padding: 14px 0 18px;
        }
        .stepper-btn {
          width: 56px; height: 56px;
          border-radius: 50%;
          border: 2px solid #1A4D2E;
          background: #FFF;
          color: #1A4D2E;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }
        .stepper-btn:hover { background: #1A4D2E; color: #FFD93D; transform: scale(1.05); }
        .stepper-btn:active { transform: scale(0.95); }
        .stepper-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 56px;
          color: #1A4D2E;
          letter-spacing: 0.05em;
          min-width: 100px;
          text-align: center;
          line-height: 1;
        }
        .stepper-num small {
          font-size: 18px;
          margin-left: 4px;
          font-family: 'Zen Kaku Gothic New', sans-serif;
          font-weight: 900;
          color: #6B5D4F;
        }
        .quick-set {
          display: flex;
          gap: 8px;
          margin-bottom: 18px;
        }
        .quick-set-btn {
          flex: 1;
          padding: 10px;
          background: #F5F2EC;
          border: 1px solid #E5DDD0;
          border-radius: 10px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          color: #1A4D2E;
        }
        .quick-set-btn:hover { background: #1A4D2E; color: #FFD93D; }
        .modal-confirm {
          width: 100%;
          padding: 16px;
          background: #1A4D2E;
          color: #FFD93D;
          border: none;
          border-radius: 12px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
        }
        .modal-confirm:hover { background: #0F3D22; }

        /* === 詳細モーダル === */
        .modal-detail {
          padding-bottom: 12px;
        }
        .detail-tags {
          display: flex;
          gap: 6px;
          margin: 8px 0 16px;
          flex-wrap: wrap;
        }
        .detail-customer-block {
          background: #FFF;
          border: 1px solid #E5DDD0;
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 16px;
        }
        .detail-customer-name {
          font-size: 18px;
          font-weight: 900;
          margin-bottom: 6px;
        }
        .detail-seat {
          font-size: 13px;
          color: #1A4D2E;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .detail-section-label {
          font-size: 12px;
          font-weight: 900;
          color: #6B5D4F;
          margin-bottom: 8px;
          letter-spacing: 0.05em;
        }
        .detail-items {
          background: #FFF;
          border: 1px solid #E5DDD0;
          border-radius: 12px;
          padding: 4px 14px;
          margin-bottom: 14px;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #F0EAE0;
        }
        .detail-item:last-child { border-bottom: none; }
        .detail-item-emoji { font-size: 28px; }
        .detail-item-info { flex: 1; }
        .detail-item-name {
          font-size: 14px;
          font-weight: 900;
          margin-bottom: 2px;
        }
        .detail-item-price {
          font-size: 11px;
          color: #6B5D4F;
        }
        .detail-item-sub {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          color: #1A4D2E;
          letter-spacing: 0.05em;
        }

        .detail-totals {
          background: #1A4D2E;
          color: #FFF8E7;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 14px;
        }
        .detail-total-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 13px;
        }
        .detail-total-row span:first-child { opacity: 0.85; }
        .detail-total-priority {
          color: #FFD93D;
          font-weight: 700;
        }
        .detail-total-priority span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .detail-total-tip {
          color: #FFC864;
          font-weight: 900;
          font-size: 14px !important;
        }

        /* === チップ累計バナー（ホーム） === */
        .tip-banner {
          background: linear-gradient(135deg, #7B3F00, #C06000);
          border-radius: 14px;
          padding: 14px 16px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 12px rgba(123, 63, 0, 0.3);
          animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .tip-banner-icon { font-size: 32px; flex-shrink: 0; }
        .tip-banner-body { flex: 1; }
        .tip-banner-label { font-size: 11px; font-weight: 700; color: rgba(255,248,231,0.8); margin-bottom: 2px; letter-spacing: 0.05em; }
        .tip-banner-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          color: #FFD93D;
          letter-spacing: 0.05em;
          line-height: 1;
        }
        .tip-banner-sub { font-size: 20px; flex-shrink: 0; }

        /* チップ入りオーダーカードの差分表示 */
        .summary-tips {
          color: #FFC864 !important;
        }

        /* チップトースト */
        .toast-tip {
          background: linear-gradient(135deg, #7B3F00 0%, #C06000 100%);
          border: 1.5px solid #FFD93D;
        }
        .detail-grand {
          border-top: 1px dashed rgba(255, 217, 61, 0.4);
          margin-top: 4px;
          padding-top: 8px !important;
          font-size: 14px !important;
        }
        .detail-grand span:last-child {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          color: #FFD93D;
          letter-spacing: 0.05em;
        }

        .detail-meta {
          background: #F5F2EC;
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 16px;
        }
        .meta-row {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
          font-size: 12px;
        }
        .meta-row span:first-child { color: #6B5D4F; }
        .meta-row span:last-child { font-weight: 900; }

        /* === 提供完了ボタン === */
        .complete-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%);
          color: #FFD93D;
          border: none;
          border-radius: 14px;
          font-family: inherit;
          font-size: 17px;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          letter-spacing: 0.05em;
          box-shadow: 0 6px 16px rgba(26, 77, 46, 0.3);
          transition: all 0.15s;
        }
        .complete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(26, 77, 46, 0.4);
        }
        .complete-btn:active { transform: translateY(0); }

        /* === トースト === */
        .toast {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #1A1A1A;
          color: #FFF8E7;
          padding: 12px 18px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 200;
          box-shadow: 0 6px 16px rgba(0,0,0,0.25);
          animation: toast-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          max-width: calc(100% - 40px);
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .toast-priority {
          background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%);
          border: 1.5px solid #FFD93D;
        }
        .toast-normal { background: #1A4D2E; }
        .toast-completed { background: #2D6B47; }

        /* === 実績確認FAB === */
        /* === 下部FAB（2ボタン） === */
        .fab-row {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 50;
          filter: drop-shadow(0 6px 18px rgba(0,0,0,0.22));
          white-space: nowrap;
        }
        .fab-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 12px 20px;
          border-radius: 100px;
          font-family: 'Zen Kaku Gothic New', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: 2px solid;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .fab-btn:hover { transform: translateY(-2px); }
        .fab-perf {
          background: #1A1A1A;
          color: #FFF8E7;
          border-color: #FFD93D;
        }
        .fab-profile {
          background: #FFD93D;
          color: #1A4D2E;
          border-color: #FFD93D;
        }

        /* === 月スライダー === */
        .month-slider {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFF;
          border: 1.5px solid #E5DDD0;
          border-radius: 14px;
          padding: 10px 14px;
          margin-bottom: 14px;
        }
        .month-arrow {
          width: 38px; height: 38px;
          background: #F5F2EC;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          color: #1A4D2E;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          font-size: 0;
        }
        .month-arrow:hover:not(.month-arrow-disabled) { background: #1A4D2E; color: #FFD93D; }
        .month-arrow-disabled { opacity: 0.3; cursor: not-allowed; }
        .month-label {
          font-size: 17px;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1A4D2E;
        }

        /* === 月サマリー === */
        .hist-month-summary {
          background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%);
          color: #FFF8E7;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* === 日別リスト === */
        .hist-day-list { display: flex; flex-direction: column; gap: 6px; }
        .hist-day-row {
          width: 100%;
          background: #FFF;
          border: 1.5px solid #E5DDD0;
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-family: 'Zen Kaku Gothic New', sans-serif;
          text-align: left;
          transition: all 0.15s;
        }
        .hist-day-row:hover:not([disabled]) {
          border-color: #1A4D2E;
          transform: translateX(2px);
          box-shadow: 0 3px 10px rgba(26,77,46,0.1);
        }
        .hist-day-row-off {
          background: #F5F2EC;
          cursor: not-allowed;
          opacity: 0.7;
        }
        .dow-sun .hist-day-num { color: #E63946; }
        .dow-sat .hist-day-num { color: #2980B9; }
        .hist-day-date {
          width: 44px;
          text-align: center;
          flex-shrink: 0;
        }
        .hist-day-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          line-height: 1;
          display: block;
          color: #1A1A1A;
          letter-spacing: 0.03em;
        }
        .hist-day-dow {
          font-size: 10px;
          font-weight: 900;
          color: #6B5D4F;
          display: block;
        }
        .hist-day-off {
          flex: 1;
          font-size: 12px;
          color: #C7BDB0;
          font-weight: 700;
        }
        .hist-day-metrics {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .hist-day-qty {
          font-size: 13px;
          font-weight: 900;
          color: #1A4D2E;
        }
        .hist-day-orders {
          font-size: 11px;
          color: #6B5D4F;
        }
        .hist-day-sales {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          color: #1A4D2E;
          letter-spacing: 0.05em;
        }
        .hist-day-chevron { color: #C7BDB0; flex-shrink: 0; }

        /* === 月合計 === */
        .hist-month-total {
          margin-top: 16px;
          background: #1A4D2E;
          color: #FFF8E7;
          border-radius: 14px;
          padding: 18px 20px;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .hist-month-total-label {
          font-size: 13px;
          font-weight: 700;
          opacity: 0.9;
        }
        .hist-month-total-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          color: #FFD93D;
          letter-spacing: 0.05em;
        }

        /* === 日別詳細 === */
        .hist-day-summary {
          background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%);
          color: #FFF8E7;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hist-order-card {
          background: #FFF;
          border: 1px solid #E5DDD0;
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 8px;
        }
        .hist-order-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .hist-order-time {
          font-size: 12px;
          font-weight: 900;
          color: #1A4D2E;
        }
        .hist-order-num {
          margin-left: auto;
          font-size: 11px;
          color: #C7BDB0;
        }
        .hist-order-customer {
          font-size: 14px;
          font-weight: 900;
          margin-bottom: 6px;
        }
        .hist-order-foot {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed #E5DDD0;
        }

        /* === 販売商品登録ボタン（ホーム） === */
        .product-setup-btn {
          width: 100%;
          background: #FFF;
          border: 2px dashed #1A4D2E;
          border-radius: 14px;
          padding: 14px 16px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-family: 'Zen Kaku Gothic New', sans-serif;
          font-size: 14px;
          font-weight: 900;
          color: #1A4D2E;
          text-align: left;
          transition: all 0.15s;
        }
        .product-setup-btn:hover { background: #1A4D2E; color: #FFD93D; border-style: solid; }
        .product-setup-btn:hover .product-setup-chevron { color: #FFD93D; }
        .product-setup-btn-icon { font-size: 22px; flex-shrink: 0; }
        .product-setup-btn > span:nth-child(2) { flex: 1; }
        .product-setup-chevron { color: #C7BDB0; flex-shrink: 0; }

        /* === 商品登録画面 === */
        .product-summary {
          background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%);
          color: #FFF8E7; border-radius: 14px; padding: 16px; margin-bottom: 18px;
          display: flex; align-items: center; gap: 8px;
        }
        .product-summary-cell { flex: 1; text-align: center; }
        .product-summary-label { font-size: 10px; font-weight: 700; opacity: 0.85; margin-bottom: 4px; }
        .product-summary-val { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #FFD93D; line-height: 1; letter-spacing: 0.05em; }
        .product-summary-val small { font-size: 12px; font-family: 'Zen Kaku Gothic New', sans-serif; font-weight: 700; margin-left: 2px; }

        .product-section { background: #FFF; border-radius: 16px; border: 1.5px solid #E5DDD0; padding: 16px; margin-bottom: 14px; }
        .product-section-head { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1.5px solid #F0EAE0; }
        .product-section-icon { font-size: 22px; }
        .product-section-title { font-size: 15px; font-weight: 900; flex: 1; }
        .product-section-count { font-size: 11px; background: #1A4D2E; color: #FFD93D; padding: 2px 8px; border-radius: 100px; font-weight: 900; }

        .product-list { display: flex; flex-direction: column; gap: 8px; }
        .product-row { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 12px; border: 1.5px solid transparent; transition: all 0.15s; }
        .product-row-on { background: linear-gradient(135deg, #F8FFF8, #F0FFF4); border-color: #1A4D2E; }
        .product-row-off { background: #FAFAFA; border-color: #E5DDD0; opacity: 0.65; }
        .product-check { width: 26px; height: 26px; border-radius: 8px; border: 2px solid #C7BDB0; background: #FFF; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; color: #FFF; transition: all 0.15s; }
        .product-check-on { background: #1A4D2E; border-color: #1A4D2E; }
        .product-emoji { font-size: 28px; flex-shrink: 0; width: 36px; text-align: center; }
        .product-info { flex: 1; min-width: 0; }
        .product-name { font-size: 13px; font-weight: 900; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-price { font-size: 11px; color: #6B5D4F; margin-top: 1px; }

        .product-stepper { display: flex; align-items: center; gap: 6px; background: #1A4D2E; border-radius: 100px; padding: 4px 6px; flex-shrink: 0; }
        .product-stepper-btn { width: 26px; height: 26px; border-radius: 50%; border: none; background: rgba(255,217,61,0.25); color: #FFD93D; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.1s; flex-shrink: 0; }
        .product-stepper-btn:hover:not(:disabled) { background: #FFD93D; color: #1A4D2E; }
        .product-stepper-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .product-stepper-num { font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #FFD93D; min-width: 28px; text-align: center; letter-spacing: 0.05em; line-height: 1; }
        .product-stepper-num small { font-size: 10px; font-family: 'Zen Kaku Gothic New', sans-serif; font-weight: 700; margin-left: 1px; }
        .product-stepper-placeholder { font-size: 11px; color: #C7BDB0; font-weight: 700; padding: 0 6px; white-space: nowrap; flex-shrink: 0; }

        .product-bulk-set { margin-top: 14px; padding-top: 12px; border-top: 1px dashed #E5DDD0; }
        .product-bulk-label { font-size: 11px; color: #6B5D4F; font-weight: 700; display: block; margin-bottom: 8px; }
        .product-bulk-btns { display: flex; gap: 6px; }
        .product-bulk-btn { flex: 1; padding: 8px 4px; background: #F5F2EC; border: 1.5px solid #E5DDD0; border-radius: 8px; font-family: 'Zen Kaku Gothic New', sans-serif; font-size: 12px; font-weight: 900; cursor: pointer; color: #1A4D2E; transition: all 0.15s; }
        .product-bulk-btn:hover { background: #1A4D2E; color: #FFD93D; border-color: #1A4D2E; }

        .product-save-btn { width: 100%; padding: 18px; background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%); color: #FFD93D; border: none; border-radius: 14px; font-family: 'Zen Kaku Gothic New', sans-serif; font-size: 16px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 8px; box-shadow: 0 6px 16px rgba(26,77,46,0.3); transition: all 0.15s; letter-spacing: 0.03em; }
        .product-save-btn:hover { transform: translateY(-2px); }
        .product-save-note { text-align: center; font-size: 11px; color: #C7BDB0; margin-top: 10px; margin-bottom: 20px; font-weight: 500; }

        /* ============================================================
           今日のホットエリア
        ============================================================ */
        .hot-area-section {
          margin-top: 8px;
          padding-bottom: 100px; /* FABと被らないよう余白 */
        }
        .hot-area-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .hot-area-header-icon { font-size: 20px; }
        .hot-area-title {
          font-size: 16px;
          font-weight: 900;
          flex: 1;
        }
        .hot-area-update {
          font-size: 10px;
          font-weight: 700;
          color: #FFD93D;
          background: #1A4D2E;
          padding: 2px 9px;
          border-radius: 100px;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .hot-area-update::before {
          content: '';
          width: 6px; height: 6px;
          background: #4ADE80;
          border-radius: 50%;
          display: inline-block;
          animation: pulse-on 1.5s ease-in-out infinite;
        }
        .hot-area-sub {
          font-size: 11px;
          color: #6B5D4F;
          margin-bottom: 14px;
          font-weight: 500;
        }

        /* グリッド: 2列 */
        .hot-area-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        /* エリアカード */
        .hot-area-card {
          background: var(--area-bg, #2D6B47);
          border-radius: 14px;
          padding: 14px 12px 12px;
          position: relative;
          overflow: hidden;
          min-height: 140px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: transform 0.2s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .hot-area-card:hover { transform: translateY(-2px); }

        /* 光沢オーバーレイ */
        .hot-area-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(255,255,255,calc(0.12 - var(--area-ratio, 0) * 0.08)) 0%,
            transparent 60%
          );
          pointer-events: none;
          border-radius: 14px;
        }

        /* ホットエリア: 脈打つボーダー */
        .hot-area-card-hot {
          box-shadow:
            0 0 0 2.5px #FFD93D,
            0 6px 18px rgba(230, 57, 70, 0.35);
          animation: hot-pulse 2s ease-in-out infinite;
        }
        @keyframes hot-pulse {
          0%, 100% { box-shadow: 0 0 0 2px #FFD93D, 0 6px 18px rgba(230,57,70,0.3); }
          50%       { box-shadow: 0 0 0 4px #FFD93D, 0 8px 22px rgba(230,57,70,0.5); }
        }

        /* 🔥バッジ */
        .hot-area-fire {
          position: absolute;
          top: 8px; right: 8px;
          font-size: 18px;
          line-height: 1;
          animation: fire-bounce 1.2s ease-in-out infinite;
        }
        @keyframes fire-bounce {
          0%, 100% { transform: scale(1) rotate(-8deg); }
          50%       { transform: scale(1.18) rotate(8deg); }
        }

        .hot-area-icon {
          font-size: 22px;
          line-height: 1;
          margin-bottom: 2px;
        }
        .hot-area-name {
          font-size: 11px;
          font-weight: 900;
          color: rgba(255,248,231,0.92);
          line-height: 1.3;
          letter-spacing: 0.02em;
        }

        /* 横バー */
        .hot-area-bar-wrap {
          height: 4px;
          background: rgba(255,255,255,0.2);
          border-radius: 100px;
          margin: 6px 0 4px;
          overflow: hidden;
        }
        .hot-area-bar {
          height: 100%;
          background: linear-gradient(90deg, rgba(255,217,61,0.7), rgba(255,217,61,1));
          border-radius: 100px;
          transition: width 0.8s cubic-bezier(0.34,1.2,0.64,1);
          min-width: 6%;
        }

        /* 注文数 */
        .hot-area-count {
          display: flex;
          align-items: baseline;
          gap: 2px;
          margin-top: 2px;
        }
        .hot-area-count-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 34px;
          color: #FFD93D;
          line-height: 1;
          letter-spacing: 0.03em;
          text-shadow: 0 2px 6px rgba(0,0,0,0.25);
        }
        .hot-area-count-unit {
          font-size: 12px;
          font-weight: 900;
          color: rgba(255,217,61,0.85);
          margin-bottom: 2px;
        }

        /* 在籍売り子数 */
        .hot-area-sellers {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: rgba(0,0,0,0.25);
          padding: 3px 8px;
          border-radius: 100px;
          margin-top: 4px;
          width: fit-content;
        }
        .hot-area-sellers-icon { font-size: 11px; }
        .hot-area-sellers-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          color: #FFF8E7;
          letter-spacing: 0.05em;
          line-height: 1;
        }
        .hot-area-sellers-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,248,231,0.8);
        }

        .hot-area-note {
          margin-top: 10px;
          font-size: 10px;
          color: #C7BDB0;
          text-align: center;
          font-weight: 500;
        }

        /* === アバタークリック === */
        .seller-avatar-clickable {
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
          transition: transform 0.15s;
          position: relative;
        }
        .seller-avatar-clickable:hover { transform: scale(1.1); }
        .seller-avatar-clickable::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 2px solid rgba(255,217,61,0.7);
          animation: avatar-ring 2s ease-in-out infinite;
        }
        @keyframes avatar-ring {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        .seller-avatar-mini-img {
          width: 100%; height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        /* === プロフィール登録画面 === */
        .profile-section {
          background: #FFF;
          border: 1.5px solid #E5DDD0;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 14px;
        }
        .profile-section-title {
          font-size: 13px;
          font-weight: 900;
          color: #1A4D2E;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1.5px solid #F0EAE0;
        }
        .profile-icon-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .profile-icon-preview {
          width: 88px; height: 88px;
          border-radius: 50%;
          background: #FFF8E7;
          border: 3px solid #FFD93D;
          display: flex; align-items: center; justify-content: center;
          font-size: 52px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .profile-icon-img {
          width: 100%; height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .profile-icon-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .profile-icon-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 8px 14px;
          background: #1A4D2E;
          color: #FFD93D;
          border: none;
          border-radius: 100px;
          font-family: 'Zen Kaku Gothic New', sans-serif;
          font-size: 12px; font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
        }
        .profile-icon-btn:hover { background: #0F3D22; }
        .profile-icon-remove { background: #E63946; color: #FFF; }
        .profile-icon-remove:hover { background: #C0392B; }
        .profile-icon-note {
          font-size: 10px; color: #C7BDB0; text-align: center; line-height: 1.4;
        }

        .profile-textarea {
          width: 100%;
          padding: 12px 14px;
          font-family: 'Zen Kaku Gothic New', sans-serif;
          font-size: 14px;
          font-weight: 500;
          border: 2px solid #E5DDD0;
          border-radius: 12px;
          resize: none;
          outline: none;
          transition: border-color 0.15s;
          line-height: 1.6;
          color: #1A1A1A;
        }
        .profile-textarea:focus { border-color: #1A4D2E; }
        .profile-textarea-over { border-color: #E63946; }
        .profile-bio-counter {
          text-align: right;
          font-size: 11px;
          color: #C7BDB0;
          margin-top: 4px;
          font-weight: 700;
        }
        .profile-bio-counter.over { color: #E63946; }

        .profile-field { margin-bottom: 12px; }
        .profile-field:last-child { margin-bottom: 0; }
        .profile-field-label {
          font-size: 12px; font-weight: 900; color: #6B5D4F;
          display: flex; align-items: center; gap: 6px;
          margin-bottom: 8px;
        }
        .profile-field-icon { flex-shrink: 0; }
        .profile-field-instagram { color: #E1306C; }
        .profile-input-wrap {
          display: flex;
          align-items: center;
          border: 2px solid #E5DDD0;
          border-radius: 12px;
          overflow: hidden;
          background: #FFF;
          transition: border-color 0.15s;
        }
        .profile-input-wrap:focus-within { border-color: #1A4D2E; }
        .profile-input-prefix {
          padding: 12px 10px 12px 14px;
          font-size: 12px;
          color: #C7BDB0;
          background: #F5F2EC;
          border-right: 1.5px solid #E5DDD0;
          white-space: nowrap;
          font-weight: 700;
          flex-shrink: 0;
        }
        .profile-input {
          flex: 1;
          padding: 12px 14px;
          font-family: 'Zen Kaku Gothic New', sans-serif;
          font-size: 14px;
          font-weight: 700;
          border: none;
          outline: none;
          background: #FFF;
          min-width: 0;
        }

        /* === 売り子プロフィールカード（POPUPとプレビュー共用） === */
        .seller-profile-card {
          position: relative;
        }
        .seller-profile-preview {
          background: #F5F2EC;
          border: 2px dashed #E5DDD0;
          border-radius: 16px;
          overflow: hidden;
        }
        .profile-popup-close {
          position: absolute;
          top: 12px; right: 12px;
          width: 32px; height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(0,0,0,0.12);
          color: #1A1A1A;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          z-index: 1;
        }
        .profile-popup-modal {
          padding: 0;
          overflow: hidden;
          border-radius: 20px 20px 0 0;
        }
        .profile-popup-hero {
          background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%);
          padding: 32px 20px 24px;
          text-align: center;
          position: relative;
        }
        .profile-popup-avatar {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: #FFF;
          border: 3px solid #FFD93D;
          display: flex; align-items: center; justify-content: center;
          font-size: 48px;
          margin: 0 auto 12px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .profile-popup-avatar-img {
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .profile-popup-name {
          font-size: 22px;
          font-weight: 900;
          color: #FFF8E7;
          margin-bottom: 6px;
        }
        .profile-popup-badge {
          display: inline-block;
          background: rgba(255,217,61,0.2);
          color: #FFD93D;
          border: 1px solid rgba(255,217,61,0.4);
          border-radius: 100px;
          font-size: 10px;
          font-weight: 900;
          padding: 3px 12px;
          letter-spacing: 0.1em;
        }
        .profile-popup-bio {
          font-size: 14px;
          line-height: 1.7;
          color: #3A3A3A;
          padding: 20px 20px 0;
          font-weight: 500;
          text-align: center;
        }
        .profile-popup-bio-empty {
          color: #C7BDB0;
          font-style: italic;
        }
        .profile-popup-sns {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px 20px 24px;
        }
        .profile-sns-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 12px;
          font-family: 'Zen Kaku Gothic New', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: opacity 0.15s, transform 0.15s;
        }
        .profile-sns-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .profile-sns-instagram {
          background: linear-gradient(135deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D);
          color: #FFF;
        }
        .profile-sns-tiktok {
          background: #010101;
          color: #FFF;
        }
        .profile-sns-empty {
          text-align: center;
          font-size: 12px;
          color: #C7BDB0;
          padding: 8px;
          font-style: italic;
        }
      `}</style>
      {screen === 'home' && <HomeScreen />}
      {screen === 'allOrders' && <AllOrdersScreen />}
      {screen === 'completedOrders' && <CompletedOrdersScreen />}
      {screen === 'productSetup' && <ProductSetupScreen />}
      {screen === 'profileSetup' && <ProfileSetupScreen />}
      {screen === 'history' && <HistoryScreen />}
      <StockSettingsModal />
      <OrderDetailModal />
      <ProfilePopup />
      <Toast />
    </div>
  );
}
