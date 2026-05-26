'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, Clock, Plus, Minus, Beer, Users, Star, ChevronRight, Check, Heart, Zap, Receipt, Package, History, Gift } from 'lucide-react';

// ===== 商品マスタ =====
const BEERS = [
  { id: 'beer-premol',   name: 'サントリープレモル',         price: 800, color: '#D4AF37', emoji: '🍺', category: 'beer' },
  { id: 'beer-superdry', name: 'アサヒスーパードライ',       price: 800, color: '#C0392B', emoji: '🍺', category: 'beer' },
  { id: 'beer-ichiban',  name: 'キリン一番搾り',             price: 800, color: '#E67E22', emoji: '🍺', category: 'beer' },
  { id: 'beer-yebisu',   name: 'エビスビール',               price: 800, color: '#8B4513', emoji: '🍺', category: 'beer' },
  { id: 'beer-premium',  name: 'サントリープレミアムモルツ', price: 800, color: '#B8860B', emoji: '🍺', category: 'beer' },
  { id: 'beer-highball', name: '角ハイボール',               price: 800, color: '#F39C12', emoji: '🥃', category: 'beer' },
];
const SNACKS = [
  { id: 'snack-kakipi',  name: '柿ピー',   price: 300, color: '#E74C3C', emoji: '🥜', category: 'snack' },
  { id: 'snack-cheese',  name: 'チーズ',   price: 300, color: '#F1C40F', emoji: '🧀', category: 'snack' },
  { id: 'snack-sakiika', name: 'さきいか', price: 300, color: '#E59866', emoji: '🦑', category: 'snack' },
];
const ALL_PRODUCTS = [...BEERS, ...SNACKS];
const getProduct = (id) => ALL_PRODUCTS.find(p => p.id === id);

// ===== ダミーデータ =====
const STADIUMS = [
  { id: 'jingu',    name: '神宮球場',  subtitle: '東京ヤクルトスワローズ', image: '⚾' },
  { id: 'ig-arena', name: 'IGアリーナ', subtitle: 'ドルフィンズアリーナ（愛知県体育館）', image: '🏟️' },
];

// スタジアムごとのエリア定義
const STADIUM_AREAS = {
  'jingu': [
    { id: 'backnet',   name: 'バックネット裏', icon: '🎯' },
    { id: '1st-inner', name: '1塁側内野',      icon: '🏟️' },
    { id: '1st-outer', name: '1塁側外野',      icon: '🌳' },
    { id: '3rd-inner', name: '3塁側内野',      icon: '🏟️' },
    { id: '3rd-outer', name: '3塁側外野',      icon: '🌳' },
  ],
  'ig-arena': [
    { id: 'ig-arena-a',    name: '1Fアリーナ A（上手）',    icon: '🎵', blocks: ['A1','A2','A3','A4','A5'] },
    { id: 'ig-arena-bc',   name: '1Fアリーナ B/C（センター）', icon: '🎤', blocks: ['B1','B2','B3','C1','C2','C3'] },
    { id: 'ig-arena-d',    name: '1Fアリーナ D（下手）',    icon: '🎶', blocks: ['D1','D2','D3','D4','D5'] },
    { id: 'ig-100',        name: '1F スタンド 100レベル',  icon: '🪑', blocks: ['101','102','103'] },
    { id: 'ig-200',        name: '2F スタンド 200レベル',  icon: '🏛️', blocks: ['201〜229'] },
    { id: 'ig-vip',        name: '3F VIPバルコニー',       icon: '⭐', blocks: ['301〜340'] },
    { id: 'ig-400',        name: '4F スタンド 400レベル',  icon: '🔭', blocks: ['401〜426'] },
    { id: 'ig-premium',    name: 'プレミアムラウンジ',     icon: '💎', blocks: ['212L','213L','217L','218L'] },
  ],
};

// デフォルト（後方互換用）
const AREAS = STADIUM_AREAS['jingu'];

// IGアリーナ販売員データ
const IG_SELLERS = [
  { id: 'ig-rena',    name: 'れな',   distance:  70, rating: 4.8, avatar: '👩',     isOn: true,
    products: ['beer-premol',   'snack-kakipi', 'snack-cheese'] },
  { id: 'ig-akane',   name: 'あかね', distance: 140, rating: 4.7, avatar: '👩‍🦰',   isOn: true,
    products: ['beer-superdry', 'snack-kakipi', 'snack-sakiika'] },
  { id: 'ig-jurina',  name: 'じゅりな', distance: 200, rating: 4.9, avatar: '👱‍♀️', isOn: true,
    products: ['beer-ichiban',  'snack-kakipi', 'snack-cheese'] },
  { id: 'ig-mizuki',  name: 'みずき', distance:  90, rating: 4.6, avatar: '👧',     isOn: true,
    products: ['beer-yebisu',   'snack-kakipi', 'snack-sakiika'] },
  { id: 'ig-shiori',  name: 'しおり', distance: 310, rating: 4.7, avatar: '👩‍🦱',   isOn: true,
    products: ['beer-premium',  'snack-kakipi', 'snack-cheese'] },
  { id: 'ig-sawako',  name: 'さわこ', distance: 160, rating: 4.8, avatar: '👩',     isOn: true,
    products: ['beer-highball', 'snack-kakipi', 'snack-sakiika'] },
  { id: 'ig-kumi',    name: 'くみ',   distance: 250, rating: 4.5, avatar: '👩‍🦳',   isOn: true,
    products: ['beer-premol',   'snack-kakipi', 'snack-cheese'] },
  { id: 'ig-yuria',   name: 'ゆりあ', distance: 120, rating: 4.7, avatar: '👩‍🦰',   isOn: true,
    products: ['beer-superdry', 'snack-kakipi', 'snack-sakiika'] },
  { id: 'ig-momona',  name: 'ももな', distance: 380, rating: 4.4, avatar: '👱‍♀️',   isOn: true,
    products: ['beer-yebisu',   'snack-kakipi', 'snack-cheese'] },
  { id: 'ig-yukiko',  name: 'ゆきこ', distance: 185, rating: 4.6, avatar: '👧',     isOn: true,
    products: ['beer-ichiban',  'snack-kakipi', 'snack-sakiika'] },
  { id: 'ig-airi',    name: 'あいり', distance: 270, rating: 4.8, avatar: '👩‍🦱',   isOn: true,
    products: ['beer-premium',  'snack-kakipi', 'snack-cheese'] },
  { id: 'ig-riho',    name: 'りほ',   distance:  85, rating: 4.9, avatar: '👩',     isOn: true,
    products: ['beer-highball', 'snack-kakipi', 'snack-sakiika'] },
  { id: 'ig-aya',     name: 'あや',   distance: 330, rating: 4.5, avatar: '👩‍🦰',   isOn: true,
    products: ['beer-premol',   'snack-kakipi', 'snack-cheese'] },
  { id: 'ig-rion',    name: 'りおん', distance: 155, rating: 4.7, avatar: '👩‍🦳',   isOn: true,
    products: ['beer-superdry', 'snack-kakipi', 'snack-sakiika'] },
  { id: 'ig-anna',    name: 'あんな', distance: 100, rating: 4.6, avatar: '👱‍♀️',   isOn: true,
    products: ['beer-ichiban',  'snack-kakipi', 'snack-cheese'] },
  { id: 'ig-kaori',   name: 'かおり', distance: 420, rating: 4.5, avatar: '👧',     isOn: true,
    products: ['beer-yebisu',   'snack-kakipi', 'snack-sakiika'] },
];

// 神宮球場販売員データ
const SELLERS = [
  { id: 's-atsuko',  name: 'あつこ', distance:  80, rating: 4.8, avatar: '👩',     isOn: true,
    products: ['beer-premol',   'snack-kakipi', 'snack-cheese'] },
  { id: 's-yuko',    name: 'ゆうこ', distance: 220, rating: 4.7, avatar: '👩‍🦰',   isOn: true,
    products: ['beer-yebisu',   'snack-kakipi', 'snack-sakiika'] },
  { id: 's-haruna',  name: 'はるな', distance: 175, rating: 4.8, avatar: '👩‍🦱',   isOn: true,
    products: ['beer-superdry', 'snack-kakipi', 'snack-cheese'] },
  { id: 's-rino',    name: 'りの',   distance:  95, rating: 4.6, avatar: '👱‍♀️',   isOn: true,
    products: ['beer-ichiban',  'snack-kakipi', 'snack-sakiika'] },
  { id: 's-yasushi', name: 'やすし', distance: 310, rating: 4.5, avatar: '🧑',     isOn: true,
    products: ['beer-premium',  'snack-kakipi', 'snack-sakiika'] },
  { id: 's-tomomi',  name: 'ともみ', distance: 150, rating: 4.9, avatar: '👧',     isOn: true,
    products: ['beer-yebisu',   'snack-kakipi', 'snack-cheese'] },
  { id: 's-mariko',  name: 'まりこ', distance: 260, rating: 4.6, avatar: '👩‍🦳',   isOn: true,
    products: ['beer-superdry', 'snack-kakipi', 'snack-sakiika'] },
  { id: 's-mayu',    name: 'まゆ',   distance: 110, rating: 4.7, avatar: '👩',     isOn: true,
    products: ['beer-highball', 'snack-kakipi', 'snack-cheese'] },
  { id: 's-rie',     name: 'りえ',   distance: 340, rating: 4.4, avatar: '👩‍🦰',   isOn: true,
    products: ['beer-yebisu',   'snack-kakipi', 'snack-sakiika'] },
  { id: 's-yuki',    name: 'ゆき',   distance: 195, rating: 4.5, avatar: '👧',     isOn: true,
    products: ['beer-ichiban',  'snack-kakipi', 'snack-sakiika'] },
  { id: 's-sayaka',  name: 'さやか', distance: 420, rating: 4.6, avatar: '👩‍🦱',   isOn: true,
    products: ['beer-superdry', 'snack-kakipi', 'snack-cheese'] },
];

// スタジアムIDで売り子を切り替え
const SELLERS_BY_STADIUM = {
  'jingu':    SELLERS,
  'ig-arena': IG_SELLERS,
};

// ===== アプリ設定（後で管理アプリから変更可能にする想定） =====
const APP_CONFIG = {
  priorityFee: 2000, // 優先デリバリー料金
};

// ===== メインコンポーネント =====
export default function UrikkoCustomerApp() {
  const [step, setStep] = useState('stadium');
  const [stadium, setStadium] = useState(null);
  const [area, setArea] = useState(null);
  const [seatNumber, setSeatNumber] = useState('');
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [cart, setCart] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const [favoriteFirst, setFavoriteFirst] = useState(false);
  const [isPriority, setIsPriority] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [viewingOrderId, setViewingOrderId] = useState(null);
  const [, forceTick] = useState(0);

  // スタジアムIDに連動してエリア・売り子リストを切り替え
  const currentAreas   = stadium ? (STADIUM_AREAS[stadium.id]   || AREAS)   : AREAS;
  const currentSellers = stadium ? (SELLERS_BY_STADIUM[stadium.id] || SELLERS) : SELLERS;

  // 1分ごとに再描画して残り時間表示を更新
  useEffect(() => {
    const t = setInterval(() => forceTick(v => v + 1), 30000);
    return () => clearInterval(t);
  }, []);

  // オーダーをコミット（履歴に追加）
  const placeOrder = (priority, tip = 0) => {
    const baseMinutes = Math.max(1, Math.round(selectedSeller.distance / 100));
    const minutes = priority ? Math.max(1, Math.ceil(baseMinutes / 2)) : baseMinutes;
    const now = new Date();
    const eta = new Date(now.getTime() + minutes * 60 * 1000);
    const items = Object.entries(cart).map(([pid, qty]) => {
      const p = getProduct(pid);
      return { id: pid, name: p.name, emoji: p.emoji, price: p.price, qty, subtotal: p.price * qty };
    });
    const subtotal = items.reduce((s, it) => s + it.subtotal, 0);
    const priorityFee = priority ? APP_CONFIG.priorityFee : 0;
    const newOrder = {
      id: `o-${Date.now()}`,
      sellerId: selectedSeller.id,
      sellerName: selectedSeller.name,
      sellerAvatar: selectedSeller.avatar,
      items,
      subtotal,
      priorityFee,
      tip,
      total: subtotal + priorityFee + tip,
      isPriority: priority,
      eta: eta.toISOString(),
      placedAt: now.toISOString(),
      area: area?.name,
      seatNumber,
      stadium: stadium?.name,
      status: 'active',
    };
    setOrders(prev => [newOrder, ...prev]);
    setIsPriority(priority);
    setTipAmount(tip);
    setStep('complete');
  };

  // アクティブなオーダー（到着前のもの）を抽出
  const getActiveOrders = () => {
    const now = Date.now();
    return orders.filter(o => new Date(o.eta).getTime() > now);
  };

  // 残り分数を計算（最低0）
  const getMinutesLeft = (etaIso) => {
    const ms = new Date(etaIso).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / 60000));
  };

  // 日時フォーマット (例: 8/15 19:32)
  const fmtDateTime = (iso) => {
    const d = new Date(iso);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${m}/${day} ${hh}:${mm}`;
  };

  const toggleFavorite = (sellerId, e) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(sellerId)) next.delete(sellerId);
      else next.add(sellerId);
      return next;
    });
  };
  const isFavorite = (sellerId) => favorites.has(sellerId);

  const resetCart = () => setCart({});

  const cartTotal = Object.entries(cart).reduce((sum, [pid, qty]) => {
    const p = getProduct(pid);
    return sum + (p ? p.price * qty : 0);
  }, 0);
  const cartItemCount = Object.values(cart).reduce((s, n) => s + n, 0);

  // ===== ステップ1: スタジアム選択 =====
  const StadiumScreen = () => (
    <div className="screen">
      <div className="hero-header">
        {/* 背景: 野球⚾とサッカー⚽が交互に流れる */}
        <div className="hero-balls-bg" aria-hidden="true">
          <div className="balls-track">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="ball-icon">{i % 2 === 0 ? '⚾' : '⚽'}</span>
            ))}
          </div>
          <div className="balls-track balls-track-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={`b-${i}`} className="ball-icon">{i % 2 === 0 ? '⚽' : '⚾'}</span>
            ))}
          </div>
          <div className="balls-track balls-track-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={`c-${i}`} className="ball-icon">{i % 2 === 0 ? '⚾' : '⚽'}</span>
            ))}
          </div>
        </div>

        {/* 前景: キャラクター + ロゴ */}
        <div className="hero-content">
          <div className="hero-character">
            <img src="urikko-character.png" alt="うりっこ" />
          </div>
          <div className="hero-title-block">
            <h1 className="logo-text">Urikko</h1>
            <p className="hero-subtitle">スタジアムで、席まで届く。</p>
          </div>
        </div>
      </div>
      <div className="content-padded">
        <h2 className="step-title">会場を選択</h2>
        <p className="step-sub">本日観戦するスタジアムを選んでください</p>
        {STADIUMS.map(s => (
          <button key={s.id} className="stadium-card" onClick={() => { setStadium(s); setStep('area'); }}>
            <div className="stadium-emoji">{s.image}</div>
            <div className="stadium-info">
              <div className="stadium-name">{s.name}</div>
              <div className="stadium-sub">{s.subtitle}</div>
            </div>
            <ChevronRight size={20} className="chevron" />
          </button>
        ))}
        <div className="coming-soon">
          <span>その他の会場は近日対応予定</span>
        </div>
      </div>
    </div>
  );

  // ===== ステップ2: エリア選択 =====
  const AreaScreen = () => (
    <div className="screen">
      <TopBar title="エリアを選択" onBack={() => setStep('stadium')} />
      <div className="content-padded">
        <div className="stadium-banner">
          <span className="stadium-banner-emoji">{stadium?.image || '⚾'}</span>
          <span>{stadium?.name}</span>
        </div>
        <h2 className="step-title">座席エリア</h2>
        <p className="step-sub">あなたの席のエリアを選んでください</p>
        <div className="area-grid">
          {currentAreas.map(a => (
            <button key={a.id} className="area-card" onClick={() => { setArea(a); setStep('seat'); }}>
              <div className="area-emoji">{a.icon}</div>
              <div className="area-name">{a.name}</div>
              {a.blocks && (
                <div className="area-blocks">ブロック: {Array.isArray(a.blocks) ? a.blocks.slice(0,3).join('・') + (a.blocks.length > 3 ? '…' : '') : a.blocks}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== ステップ3: 席番号入力 =====
  const SeatScreen = () => (
    <div className="screen">
      <TopBar title="席番号を入力" onBack={() => setStep('area')} />
      <div className="content-padded">
        <div className="stadium-banner">
          <span className="stadium-banner-emoji">⚾</span>
          <span>{stadium?.name} ／ {area?.name}</span>
        </div>
        <h2 className="step-title">席番号</h2>
        <p className="step-sub">チケットに記載の席番号を入力してください</p>
        <input
          className="seat-input"
          type="text"
          placeholder="例: 12-A-15"
          value={seatNumber}
          onChange={e => setSeatNumber(e.target.value)}
        />
        <div className="gps-card">
          <div className="gps-icon">📍</div>
          <div className="gps-text">
            <div className="gps-title">位置情報を取得しました</div>
            <div className="gps-sub">{area?.name} エリア内（デモ）</div>
          </div>
          <div className="gps-check"><Check size={18} /></div>
        </div>
        <button className="primary-btn" disabled={!seatNumber.trim()} onClick={() => setStep('home')}>
          注文を始める
        </button>
      </div>
    </div>
  );

  // ===== ホーム: オーダー方法選択 =====
  const HomeScreen = () => {
    const activeOrders = getActiveOrders();
    return (
      <div className="screen">
        <div className="home-header">
          <button className="back-mini" onClick={() => setStep('seat')}><ChevronLeft size={20} /></button>
          <div className="home-location">
            <div className="loc-label">配達先</div>
            <div className="loc-value">{area?.name} {seatNumber}</div>
          </div>
        </div>

        {/* 進行中のオーダーバナー */}
        {activeOrders.length > 0 && (
          <div className="active-orders-wrap">
            {activeOrders.map(o => {
              const left = getMinutesLeft(o.eta);
              return (
                <button
                  key={o.id}
                  className={`active-order-banner ${o.isPriority ? 'active-order-priority' : ''}`}
                  onClick={() => { setViewingOrderId(o.id); setStep('activeOrder'); }}
                >
                  <div className="active-order-icon">
                    <div className="active-order-avatar">{o.sellerAvatar}</div>
                    <div className="active-order-pulse" />
                  </div>
                  <div className="active-order-body">
                    <div className="active-order-head">
                      {o.isPriority && (
                        <span className="active-order-priority-tag">
                          <Zap size={9} fill="#1A4D2E" stroke="#1A4D2E" /> 最優先
                        </span>
                      )}
                      <span className="active-order-name">{o.sellerName}さんが配達中</span>
                    </div>
                    <div className="active-order-meta">
                      <Clock size={12} />
                      {left === 0
                        ? <span className="active-order-arriving">まもなく到着</span>
                        : <span>あと約 <strong>{left}</strong> 分</span>}
                      <span className="dot-sep">·</span>
                      <span>{o.items.reduce((s, it) => s + it.qty, 0)}点 ¥{o.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="chevron" />
                </button>
              );
            })}
          </div>
        )}

        <div className="content-padded">
          <h2 className="welcome-title">何にしますか？🍺</h2>
          <p className="welcome-sub">注文方法を選んで、席で待つだけ</p>
          <button className="method-card method-beer" onClick={() => setStep('beerList')}>
            <div className="method-icon-wrap method-icon-beer"><Beer size={28} /></div>
            <div className="method-text">
              <div className="method-title">銘柄から選ぶ</div>
              <div className="method-desc">飲みたいビールを選んで、近くの売り子を探す</div>
            </div>
            <ChevronRight size={20} className="chevron" />
          </button>
          <button className="method-card method-seller" onClick={() => setStep('sellerList')}>
            <div className="method-icon-wrap method-icon-seller"><Users size={28} /></div>
            <div className="method-text">
              <div className="method-title">売り子から選ぶ</div>
              <div className="method-desc">近くにいる売り子から、メニューを見て選ぶ</div>
            </div>
            <ChevronRight size={20} className="chevron" />
          </button>
          <div className="info-banner">
            <span className="info-emoji">⚡</span>
            <span className="info-text">平均到着時間 <strong>2-4分</strong></span>
          </div>
        </div>

        {/* 下部固定: オーダー履歴ボタン */}
        <button className="history-fab" onClick={() => setStep('orderHistory')}>
          <Receipt size={18} />
          <span>オーダー履歴</span>
          {orders.length > 0 && <span className="history-fab-badge">{orders.length}</span>}
        </button>
      </div>
    );
  };

  // ===== A: 銘柄一覧 =====
  const BeerListScreen = () => (
    <div className="screen">
      <TopBar title="銘柄から選ぶ" onBack={() => setStep('home')} />
      <div className="content-padded">
        <p className="step-sub">飲みたい銘柄をタップしてください</p>
        <div className="beer-grid">
          {BEERS.map(beer => (
            <button
              key={beer.id}
              className="beer-card"
              style={{ '--beer-color': beer.color }}
              onClick={() => { setSelectedBeer(beer); setStep('sellersByBeer'); }}
            >
              <div className="beer-emoji">{beer.emoji}</div>
              <div className="beer-name">{beer.name}</div>
              <div className="beer-price">¥{beer.price.toLocaleString()}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== A-2: 選択銘柄を持つ売り子（近い順 上位5人） =====
  const SellersByBeerScreen = () => {
    const candidates = currentSellers
      .filter(s => s.isOn && s.products.includes(selectedBeer.id))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
    return (
      <div className="screen">
        <TopBar title="売り子を選ぶ" onBack={() => setStep('beerList')} />
        <div className="content-padded">
          <div className="selected-beer-banner" style={{ background: selectedBeer.color + '15', borderColor: selectedBeer.color }}>
            <span className="selected-beer-emoji">{selectedBeer.emoji}</span>
            <div>
              <div className="selected-beer-name">{selectedBeer.name}</div>
              <div className="selected-beer-price">¥{selectedBeer.price.toLocaleString()}</div>
            </div>
          </div>
          <h3 className="list-heading">近くの売り子 <span className="list-count">{candidates.length}人</span></h3>
          {candidates.length === 0 ? (
            <div className="empty-msg">この銘柄を扱っている売り子は現在いません</div>
          ) : (
            candidates.map((s, i) => (
              <SellerCard key={s.id} seller={s} rank={i + 1} onClick={() => { setSelectedSeller(s); setStep('orderDetail'); }} />
            ))
          )}
        </div>
      </div>
    );
  };

  // ===== B: 売り子から選ぶ（上位5人） =====
  const SellerListScreen = () => {
    const onlineSellers = currentSellers.filter(s => s.isOn);
    const sorted = favoriteFirst
      ? [...onlineSellers].sort((a, b) => {
          const fa = isFavorite(a.id) ? 0 : 1;
          const fb = isFavorite(b.id) ? 0 : 1;
          if (fa !== fb) return fa - fb;
          return a.distance - b.distance;
        })
      : [...onlineSellers].sort((a, b) => a.distance - b.distance);
    const top5 = sorted.slice(0, 5);
    const favCount = favorites.size;
    return (
      <div className="screen">
        <TopBar title="売り子から選ぶ" onBack={() => setStep('home')} />
        <div className="content-padded">
          <p className="step-sub">近くにいる売り子の上位5人</p>
          <label className={`fav-filter ${favoriteFirst ? 'fav-filter-on' : ''}`}>
            <input
              type="checkbox"
              checked={favoriteFirst}
              onChange={(e) => setFavoriteFirst(e.target.checked)}
            />
            <span className={`fav-filter-box ${favoriteFirst ? 'on' : ''}`}>
              {favoriteFirst && <Check size={14} strokeWidth={3} />}
            </span>
            <span className="fav-filter-icon">
              <Heart size={14} fill={favoriteFirst ? '#E63946' : 'none'} stroke="#E63946" strokeWidth={2} />
            </span>
            <span className="fav-filter-label">お気に入りを優先的に表示する</span>
            <span className="fav-filter-count">{favCount}人</span>
          </label>
          {top5.map((s, i) => (
            <SellerCard
              key={s.id}
              seller={s}
              rank={i + 1}
              showFavBadge={favoriteFirst}
              onClick={() => { setSelectedSeller(s); setStep('orderDetail'); }}
            />
          ))}
          <button className="secondary-btn" onClick={() => setStep('allSellers')}>もっと表示する</button>
        </div>
      </div>
    );
  };

  // ===== B-2: 全売り子表示 =====
  const AllSellersScreen = () => {
    const onlineSellers = currentSellers.filter(s => s.isOn);
    const all = favoriteFirst
      ? [...onlineSellers].sort((a, b) => {
          const fa = isFavorite(a.id) ? 0 : 1;
          const fb = isFavorite(b.id) ? 0 : 1;
          if (fa !== fb) return fa - fb;
          return a.distance - b.distance;
        })
      : [...onlineSellers].sort((a, b) => a.distance - b.distance);
    return (
      <div className="screen">
        <TopBar title="全ての売り子" onBack={() => setStep('sellerList')} />
        <div className="content-padded">
          <p className="step-sub">現在オンラインの売り子 全{all.length}人</p>
          {all.map((s, i) => (
            <SellerCard
              key={s.id}
              seller={s}
              rank={i + 1}
              showFavBadge={favoriteFirst}
              onClick={() => { setSelectedSeller(s); setStep('orderDetail'); }}
            />
          ))}
        </div>
      </div>
    );
  };

  // ===== 売り子カード =====
  const SellerCard = ({ seller, rank, onClick, showFavBadge }) => {
    const minutes = Math.max(1, Math.round(seller.distance / 100));
    const fav = isFavorite(seller.id);
    return (
      <button className={`seller-card ${fav ? 'seller-card-fav' : ''}`} onClick={onClick}>
        <div className="seller-rank">#{rank}</div>
        {showFavBadge && fav && (
          <div className="fav-badge"><Heart size={10} fill="#FFF" stroke="#FFF" /> お気に入り</div>
        )}
        <div className="seller-avatar">{seller.avatar}</div>
        <div className="seller-info">
          <div className="seller-name-row">
            <span className="seller-name">{seller.name}</span>
            <span className="seller-rating">
              <Star size={12} fill="#FFB800" stroke="#FFB800" /> {seller.rating}
            </span>
          </div>
          <div className="seller-meta">
            <span className="seller-time"><Clock size={12} /> 約{minutes}分</span>
            <span className="seller-dist"><MapPin size={12} /> {seller.distance}m</span>
          </div>
          <div className="seller-products">
            {seller.products.map(pid => {
              const p = getProduct(pid);
              return <span key={pid} className="product-pill">{p?.name}</span>;
            })}
          </div>
        </div>
        <div
          role="button"
          tabIndex={0}
          className={`fav-heart ${fav ? 'fav-heart-on' : ''}`}
          onClick={(e) => toggleFavorite(seller.id, e)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleFavorite(seller.id, e); }}
          aria-label={fav ? 'お気に入りから外す' : 'お気に入りに追加'}
        >
          <Heart size={20} fill={fav ? '#E63946' : 'none'} stroke={fav ? '#E63946' : '#C7BDB0'} strokeWidth={2} />
        </div>
      </button>
    );
  };

  // ===== 詳細オーダー画面 =====
  const OrderDetailScreen = () => {
    const products = selectedSeller.products.map(getProduct).filter(Boolean);
    const beerItems = products.filter(p => p.id.startsWith('beer-'));
    const snackItems = products.filter(p => p.id.startsWith('snack-'));
    const minutes = Math.max(1, Math.round(selectedSeller.distance / 100));

    const updateQty = (id, delta) => {
      setCart(prev => {
        const next = { ...prev };
        const q = (next[id] || 0) + delta;
        if (q <= 0) delete next[id];
        else next[id] = q;
        return next;
      });
    };

    const MenuRow = ({ p }) => {
      const qty = cart[p.id] || 0;
      return (
        <div className="menu-item">
          <div className="menu-emoji" style={{ background: p.color + '20' }}>{p.emoji}</div>
          <div className="menu-info">
            <div className="menu-name">{p.name}</div>
            <div className="menu-price">¥{p.price.toLocaleString()}</div>
          </div>
          {qty === 0 ? (
            <button className="add-btn" onClick={() => updateQty(p.id, 1)}><Plus size={18} /></button>
          ) : (
            <div className="qty-control">
              <button className="qty-btn" onClick={() => updateQty(p.id, -1)}><Minus size={16} /></button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => updateQty(p.id, 1)}><Plus size={16} /></button>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="screen">
        <div className="detail-header">
          <button className="back-mini detail-back" onClick={() => setStep(selectedBeer ? 'sellersByBeer' : 'sellerList')}>
            <ChevronLeft size={20} />
          </button>
          <button
            className={`detail-fav ${isFavorite(selectedSeller.id) ? 'detail-fav-on' : ''}`}
            onClick={() => toggleFavorite(selectedSeller.id)}
            aria-label={isFavorite(selectedSeller.id) ? 'お気に入りから外す' : 'お気に入りに追加'}
          >
            <Heart
              size={22}
              fill={isFavorite(selectedSeller.id) ? '#E63946' : 'none'}
              stroke={isFavorite(selectedSeller.id) ? '#E63946' : '#1A1A1A'}
              strokeWidth={2}
            />
          </button>
        </div>
        <div className="detail-hero">
          <div className="detail-avatar">{selectedSeller.avatar}</div>
          <h2 className="detail-name">{selectedSeller.name}</h2>
          <div className="detail-meta">
            <span><Star size={14} fill="#FFB800" stroke="#FFB800" /> {selectedSeller.rating}</span>
            <span className="dot">·</span>
            <span><Clock size={14} /> 約{minutes}分で到着</span>
            <span className="dot">·</span>
            <span><MapPin size={14} /> {selectedSeller.distance}m</span>
          </div>
        </div>
        <div className="menu-section">
          {beerItems.length > 0 && (
            <>
              <h3 className="menu-heading"><span className="menu-heading-icon">🍺</span> ドリンク</h3>
              {beerItems.map(p => <MenuRow key={p.id} p={p} />)}
            </>
          )}
          {snackItems.length > 0 && (
            <>
              <h3 className="menu-heading menu-heading-2"><span className="menu-heading-icon">🥜</span> おつまみ</h3>
              {snackItems.map(p => <MenuRow key={p.id} p={p} />)}
            </>
          )}
          <div className="menu-spacer" />
        </div>
        {cartItemCount > 0 && (
          <button className="checkout-bar" onClick={() => setStep('confirm')}>
            <div className="checkout-badge">{cartItemCount}</div>
            <span className="checkout-label">注文する</span>
            <span className="checkout-price">¥{cartTotal.toLocaleString()}</span>
          </button>
        )}
      </div>
    );
  };

  // ===== 確認画面 =====
  const ConfirmScreen = () => {
    const minutes = Math.max(1, Math.round(selectedSeller.distance / 100));
    const priorityMinutes = Math.max(1, Math.ceil(minutes / 2));
    const [tip, setTip] = useState(0);
    const [customTip, setCustomTip] = useState(0); // 任意入力ステッパー値
    const [tipMode, setTipMode] = useState('none'); // 'none' | '500' | '1000' | 'custom'

    const activeTip = tipMode === '500' ? 500
      : tipMode === '1000' ? 1000
      : tipMode === 'custom' ? customTip
      : 0;

    const totalWithTip = (priority) =>
      cartTotal + (priority ? APP_CONFIG.priorityFee : 0) + activeTip;

    const selectPreset = (val) => {
      if (tipMode === String(val)) { setTipMode('none'); }
      else { setTipMode(String(val)); }
    };
    const changeCustom = (delta) => {
      setCustomTip(v => Math.max(0, v + delta));
      setTipMode('custom');
    };

    return (
      <div className="screen">
        <TopBar title="注文内容の確認" onBack={() => setStep('orderDetail')} />
        <div className="content-padded">
          <div className="confirm-seller">
            <div className="confirm-avatar">{selectedSeller.avatar}</div>
            <div>
              <div className="confirm-seller-name">{selectedSeller.name}</div>
              <div className="confirm-seller-eta"><Clock size={12} /> 約{minutes}分で到着</div>
            </div>
          </div>
          <h3 className="confirm-heading">ご注文</h3>
          <div className="confirm-items">
            {Object.entries(cart).map(([pid, qty]) => {
              const p = getProduct(pid);
              return (
                <div key={pid} className="confirm-item">
                  <span className="confirm-emoji">{p.emoji}</span>
                  <span className="confirm-name">{p.name}</span>
                  <span className="confirm-qty">×{qty}</span>
                  <span className="confirm-sub">¥{(p.price * qty).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          <div className="confirm-deliver">
            <div className="confirm-row"><span>お届け先</span><span>{area?.name} {seatNumber}</span></div>
            <div className="confirm-row"><span>会場</span><span>{stadium?.name}</span></div>
          </div>

          {/* ===== チップ ===== */}
          <div className="tip-section">
            <div className="tip-head">
              <Gift size={16} strokeWidth={2.5} className="tip-head-icon" />
              <span className="tip-head-title">チップをあげる</span>
              {activeTip > 0 && (
                <span className="tip-head-amount">+¥{activeTip.toLocaleString()}</span>
              )}
            </div>
            <p className="tip-head-sub">売り子さんへの感謝を金額で伝えよう🍺</p>

            {/* プリセットボタン */}
            <div className="tip-presets">
              <button
                className={`tip-preset ${tipMode === '500' ? 'tip-preset-on' : ''}`}
                onClick={() => selectPreset(500)}
              >
                {tipMode === '500' && <Check size={13} strokeWidth={3} />}
                ¥500
              </button>
              <button
                className={`tip-preset ${tipMode === '1000' ? 'tip-preset-on' : ''}`}
                onClick={() => selectPreset(1000)}
              >
                {tipMode === '1000' && <Check size={13} strokeWidth={3} />}
                ¥1,000
              </button>
              <button
                className={`tip-preset ${tipMode === 'none' ? '' : ''} tip-preset-none`}
                onClick={() => { setTipMode('none'); setCustomTip(0); }}
                style={{ opacity: tipMode === 'none' ? 0.45 : 1 }}
              >
                なし
              </button>
            </div>

            {/* 任意入力ステッパー */}
            <div className={`tip-custom ${tipMode === 'custom' ? 'tip-custom-on' : ''}`}>
              <span className="tip-custom-label">任意金額</span>
              <div className="tip-custom-stepper">
                <button
                  className="tip-stepper-btn"
                  onClick={() => changeCustom(-100)}
                  disabled={customTip <= 0}
                >
                  <Minus size={15} />
                </button>
                <div className="tip-stepper-val">
                  {tipMode === 'custom'
                    ? <><span className="tip-stepper-num">¥{customTip.toLocaleString()}</span></>
                    : <span className="tip-stepper-num tip-stepper-inactive">¥0</span>}
                </div>
                <button className="tip-stepper-btn" onClick={() => changeCustom(100)}>
                  <Plus size={15} />
                </button>
              </div>
              <span className="tip-custom-unit">100円単位</span>
            </div>
          </div>

          {/* 優先デリバリー説明 */}
          <div className="priority-info">
            <div className="priority-info-head">
              <Zap size={16} fill="#FFD93D" stroke="#FFD93D" />
              <span>優先デリバリーとは？</span>
            </div>
            <p className="priority-info-text">
              他のオーダーよりも<strong>最優先</strong>でお届けします。エリアが離れた販売員でもすぐ駆けつけます。
            </p>
          </div>

          {/* 注文確定ボタン: 通常 / 優先 */}
          <div className="order-options">
            <button className="order-option order-normal" onClick={() => placeOrder(false, activeTip)}>
              <div className="order-option-head">
                <span className="order-option-label">通常オーダー</span>
                <span className="order-option-eta"><Clock size={12} /> 約{minutes}分</span>
              </div>
              <div className="order-option-price">
                {activeTip > 0 && <span className="order-option-fee order-tip-fee">🎁 +¥{activeTip.toLocaleString()}</span>}
                <span className="order-option-price-num">¥{totalWithTip(false).toLocaleString()}</span>
              </div>
            </button>

            <button className="order-option order-priority" onClick={() => placeOrder(true, activeTip)}>
              <div className="priority-badge">
                <Zap size={11} fill="#1A4D2E" stroke="#1A4D2E" /> 最優先
              </div>
              <div className="order-option-head">
                <span className="order-option-label">
                  <Zap size={14} fill="#FFD93D" stroke="#FFD93D" /> 優先オーダー
                </span>
                <span className="order-option-eta priority-eta"><Clock size={12} /> 約{priorityMinutes}分</span>
              </div>
              <div className="order-option-price">
                <span className="order-option-fee">+¥{APP_CONFIG.priorityFee.toLocaleString()}</span>
                {activeTip > 0 && <span className="order-option-fee order-tip-fee">🎁 +¥{activeTip.toLocaleString()}</span>}
                <span className="order-option-price-num">¥{totalWithTip(true).toLocaleString()}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ===== 完了画面 =====
  const CompleteScreen = () => {
    const baseMinutes = Math.max(1, Math.round(selectedSeller.distance / 100));
    const minutes = isPriority ? Math.max(1, Math.ceil(baseMinutes / 2)) : baseMinutes;
    const grandTotal = isPriority ? cartTotal + APP_CONFIG.priorityFee + tipAmount : cartTotal + tipAmount;
    return (
      <div className={`screen complete-screen ${isPriority ? 'complete-priority' : ''}`}>
        <div className="complete-content">
          {isPriority && (
            <div className="complete-priority-badge">
              <Zap size={14} fill="#1A4D2E" stroke="#1A4D2E" /> 最優先デリバリー
            </div>
          )}
          <div className="complete-check"><Check size={48} strokeWidth={3} /></div>
          <h2 className="complete-title">注文を送信しました！</h2>
          <p className="complete-sub">{selectedSeller.name}さんに通知が届きました</p>
          {tipAmount > 0 && (
            <div className="complete-tip-badge">
              <Gift size={14} /> チップ ¥{tipAmount.toLocaleString()} を贈りました🎁
            </div>
          )}
          <div className="complete-eta">
            <Clock size={20} />
            <span>約{minutes}分</span>
            <small>で到着予定</small>
          </div>
          <div className="complete-card">
            <div className="complete-card-row"><span>お届け先</span><span>{area?.name} {seatNumber}</span></div>
            {isPriority && (
              <div className="complete-card-row complete-card-fee">
                <span><Zap size={12} fill="#FFD93D" stroke="#FFD93D" /> 優先デリバリー料金</span>
                <span>+¥{APP_CONFIG.priorityFee.toLocaleString()}</span>
              </div>
            )}
            {tipAmount > 0 && (
              <div className="complete-card-row complete-card-tip">
                <span><Gift size={12} /> チップ</span>
                <span>+¥{tipAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="complete-card-row"><span>合計</span><strong>¥{grandTotal.toLocaleString()}</strong></div>
          </div>
          <button
            className="primary-btn"
            onClick={() => {
              resetCart();
              setSelectedBeer(null);
              setSelectedSeller(null);
              setIsPriority(false);
              setTipAmount(0);
              setStep('home');
            }}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  };

  // ===== 進行中オーダー詳細 =====
  const ActiveOrderScreen = () => {
    const order = orders.find(o => o.id === viewingOrderId);
    if (!order) {
      return (
        <div className="screen">
          <TopBar title="オーダー詳細" onBack={() => setStep('home')} />
          <div className="content-padded">
            <p className="step-sub">オーダーが見つかりません</p>
          </div>
        </div>
      );
    }
    const left = getMinutesLeft(order.eta);
    const totalQty = order.items.reduce((s, it) => s + it.qty, 0);
    const eta = new Date(order.eta);
    const etaHM = `${String(eta.getHours()).padStart(2, '0')}:${String(eta.getMinutes()).padStart(2, '0')}`;
    return (
      <div className="screen">
        <TopBar title="配達中のオーダー" onBack={() => setStep('home')} />
        <div className="content-padded">
          {order.isPriority && (
            <div className="active-detail-priority">
              <Zap size={14} fill="#1A4D2E" stroke="#1A4D2E" /> 最優先デリバリー
            </div>
          )}
          <div className="active-detail-hero">
            <div className="active-detail-avatar">{order.sellerAvatar}</div>
            <div className="active-detail-name">{order.sellerName}さんが配達中</div>
            <div className="active-detail-eta-block">
              {left === 0 ? (
                <>
                  <div className="active-detail-eta-num">まもなく</div>
                  <div className="active-detail-eta-label">到着します</div>
                </>
              ) : (
                <>
                  <div className="active-detail-eta-num">{left}<small>分</small></div>
                  <div className="active-detail-eta-label">到着予定 {etaHM}</div>
                </>
              )}
            </div>
            <div className="active-detail-progress">
              <div className="active-detail-progress-track">
                <div className="active-detail-progress-fill" style={{ width: `${Math.max(8, Math.min(100, ((1 - left / Math.max(1, Math.round((new Date(order.eta) - new Date(order.placedAt)) / 60000))) * 100)))}%` }} />
              </div>
              <div className="active-detail-progress-labels">
                <span>注文受付</span>
                <span>配達中</span>
                <span>到着</span>
              </div>
            </div>
          </div>

          <h3 className="confirm-heading">注文内容</h3>
          <div className="confirm-items">
            {order.items.map(it => (
              <div key={it.id} className="confirm-item">
                <span className="confirm-emoji">{it.emoji}</span>
                <span className="confirm-name">{it.name}</span>
                <span className="confirm-qty">×{it.qty}</span>
                <span className="confirm-sub">¥{it.subtotal.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="confirm-deliver">
            <div className="confirm-row"><span>お届け先</span><span>{order.area} {order.seatNumber}</span></div>
            <div className="confirm-row"><span>会場</span><span>{order.stadium}</span></div>
            <div className="confirm-row"><span>注文日時</span><span>{fmtDateTime(order.placedAt)}</span></div>
            <div className="confirm-row"><span>商品点数</span><span>{totalQty}点</span></div>
            <div className="confirm-row"><span>小計</span><span>¥{order.subtotal.toLocaleString()}</span></div>
            {order.priorityFee > 0 && (
              <div className="confirm-row"><span>優先デリバリー料金</span><span>+¥{order.priorityFee.toLocaleString()}</span></div>
            )}
            <div className="confirm-row confirm-row-total"><span>合計</span><span>¥{order.total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    );
  };

  // ===== オーダー履歴一覧 =====
  const OrderHistoryScreen = () => {
    const sorted = [...orders].sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
    const totalSpent = sorted.reduce((s, o) => s + o.total, 0);
    return (
      <div className="screen">
        <TopBar title="オーダー履歴" onBack={() => setStep('home')} />
        <div className="content-padded">
          {sorted.length === 0 ? (
            <div className="empty-history">
              <div className="empty-history-icon"><Package size={40} strokeWidth={1.5} /></div>
              <div className="empty-history-title">オーダー履歴がありません</div>
              <div className="empty-history-sub">注文するとここに表示されます</div>
            </div>
          ) : (
            <>
              <div className="history-summary">
                <div className="history-summary-row">
                  <span>累計オーダー</span>
                  <strong>{sorted.length}件</strong>
                </div>
                <div className="history-summary-row">
                  <span>累計金額</span>
                  <strong className="history-summary-total">¥{totalSpent.toLocaleString()}</strong>
                </div>
              </div>
              {sorted.map(o => {
                const isActive = new Date(o.eta).getTime() > Date.now();
                const totalQty = o.items.reduce((s, it) => s + it.qty, 0);
                return (
                  <button
                    key={o.id}
                    className={`history-card ${isActive ? 'history-card-active' : ''}`}
                    onClick={() => {
                      if (isActive) {
                        setViewingOrderId(o.id);
                        setStep('activeOrder');
                      }
                    }}
                  >
                    <div className="history-card-head">
                      <div className="history-card-date">{fmtDateTime(o.placedAt)}</div>
                      {isActive
                        ? <span className="history-status history-status-active">
                            <span className="status-dot" /> 配達中
                          </span>
                        : <span className="history-status history-status-done">
                            <Check size={11} /> 完了
                          </span>}
                      {o.isPriority && (
                        <span className="history-priority">
                          <Zap size={10} fill="#1A4D2E" stroke="#1A4D2E" /> 最優先
                        </span>
                      )}
                    </div>
                    <div className="history-card-seller">
                      <div className="history-seller-avatar">{o.sellerAvatar}</div>
                      <div className="history-seller-info">
                        <div className="history-seller-name">{o.sellerName}</div>
                        <div className="history-seller-sub">{o.area} {o.seatNumber}</div>
                      </div>
                    </div>
                    <div className="history-card-items">
                      {o.items.map((it, idx) => (
                        <span key={idx} className="history-item-pill">
                          {it.emoji} {it.name} ×{it.qty}
                        </span>
                      ))}
                    </div>
                    <div className="history-card-foot">
                      <span className="history-qty">{totalQty}点</span>
                      <span className="history-total">¥{o.total.toLocaleString()}</span>
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    );
  };

  // ===== 共通: 上部バー =====
  const TopBar = ({ title, onBack }) => (
    <div className="topbar">
      <button className="back-mini" onClick={onBack}><ChevronLeft size={20} /></button>
      <h1 className="topbar-title">{title}</h1>
      <div style={{ width: 36 }} />
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 'stadium': return <StadiumScreen />;
      case 'area': return <AreaScreen />;
      case 'seat': return <SeatScreen />;
      case 'home': return <HomeScreen />;
      case 'beerList': return <BeerListScreen />;
      case 'sellersByBeer': return <SellersByBeerScreen />;
      case 'sellerList': return <SellerListScreen />;
      case 'allSellers': return <AllSellersScreen />;
      case 'orderDetail': return <OrderDetailScreen />;
      case 'confirm': return <ConfirmScreen />;
      case 'complete': return <CompleteScreen />;
      case 'activeOrder': return <ActiveOrderScreen />;
      case 'orderHistory': return <OrderHistoryScreen />;
      default: return <StadiumScreen />;
    }
  };

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Bebas+Neue&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        .app-root {
          font-family: 'Zen Kaku Gothic New', -apple-system, sans-serif;
          background: #F5F2EC;
          min-height: 100vh;
          color: #1A1A1A;
          max-width: 480px;
          margin: 0 auto;
          position: relative;
          overflow-x: hidden;
        }
        .screen { min-height: 100vh; background: #FFFCF7; position: relative; padding-bottom: 100px; }
        .content-padded { padding: 20px 20px 24px; }

        .hero-header {
          background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 60%, #4A8B5C 100%);
          padding: 28px 20px 24px;
          color: #FFF8E7;
          position: relative;
          overflow: hidden;
          min-height: 200px;
        }
        /* 黄色の光のアクセント */
        .hero-header::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.25), transparent 70%);
          border-radius: 50%;
          z-index: 1;
          pointer-events: none;
        }

        /* === 背景: 流れる⚾⚽ === */
        .hero-balls-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          opacity: 0.18;
          pointer-events: none;
        }
        .balls-track {
          display: flex;
          gap: 28px;
          white-space: nowrap;
          width: max-content;
          padding: 0 10px;
          font-size: 44px;
          line-height: 1;
          animation: scrollBalls 22s linear infinite;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
        }
        .balls-track-2 {
          margin-top: 18px;
          animation-duration: 28s;
          animation-direction: reverse;
          font-size: 38px;
          opacity: 0.85;
        }
        .balls-track-3 {
          margin-top: 18px;
          animation-duration: 25s;
          font-size: 42px;
          opacity: 0.7;
        }
        .ball-icon {
          display: inline-block;
          transform: translateZ(0);
        }
        @keyframes scrollBalls {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* === 前景: キャラクター + ロゴ === */
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .hero-character {
          flex-shrink: 0;
          width: 120px;
          height: 140px;
          position: relative;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          animation: charBounce 2.4s ease-in-out infinite;
        }
        .hero-character img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: bottom;
        }
        @keyframes charBounce {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-4px) rotate(2deg); }
        }
        .hero-title-block {
          flex: 1;
          min-width: 0;
        }
        .logo-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 60px;
          letter-spacing: 3px;
          color: #FFD93D;
          font-weight: 400;
          line-height: 1;
          margin-bottom: 6px;
          text-shadow:
            3px 3px 0 #1A4D2E,
            6px 6px 0 rgba(0,0,0,0.18);
          transform: rotate(-3deg);
          display: inline-block;
        }
        .hero-subtitle {
          font-size: 13px;
          font-weight: 700;
          color: #FFF8E7;
          background: rgba(26, 77, 46, 0.6);
          padding: 4px 10px;
          border-radius: 100px;
          display: inline-block;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 217, 61, 0.3);
        }

        .step-title { font-size: 22px; font-weight: 900; margin-top: 4px; margin-bottom: 6px; letter-spacing: -0.02em; }
        .step-sub { font-size: 13px; color: #6B5D4F; margin-bottom: 20px; }

        .stadium-card {
          width: 100%; background: #FFF; border: 2px solid #1A4D2E;
          border-radius: 16px; padding: 20px;
          display: flex; align-items: center; gap: 16px;
          cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 4px 4px 0 #1A4D2E; text-align: left;
        }
        .stadium-card:hover, .stadium-card:active {
          transform: translate(2px, 2px); box-shadow: 2px 2px 0 #1A4D2E;
        }
        .stadium-emoji { font-size: 36px; }
        .stadium-info { flex: 1; }
        .stadium-name { font-size: 18px; font-weight: 900; }
        .stadium-sub { font-size: 12px; color: #6B5D4F; margin-top: 2px; }

        .coming-soon {
          margin-top: 24px; text-align: center; padding: 16px;
          background: rgba(26, 77, 46, 0.05); border-radius: 12px;
          font-size: 12px; color: #6B5D4F;
        }

        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 16px 8px; background: #FFFCF7;
          position: sticky; top: 0; z-index: 10;
        }
        .topbar-title { font-size: 16px; font-weight: 700; }
        .back-mini {
          width: 36px; height: 36px; border-radius: 50%; border: none;
          background: #F0EAE0; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #1A1A1A;
        }
        .back-mini:active { background: #E5DDD0; }

        .stadium-banner {
          display: inline-flex; align-items: center; gap: 8px;
          background: #1A4D2E; color: #FFD93D;
          padding: 8px 14px; border-radius: 100px;
          font-size: 13px; font-weight: 700; margin-bottom: 20px;
        }
        .stadium-banner-emoji { font-size: 16px; }

        .area-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .area-card {
          background: #FFF; border: 2px solid #E5DDD0;
          border-radius: 14px; padding: 24px 16px; cursor: pointer;
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; transition: all 0.15s;
        }
        .area-card:hover, .area-card:active {
          border-color: #1A4D2E; background: #1A4D2E; color: #FFD93D; transform: translateY(-2px);
        }
        .area-emoji { font-size: 32px; }
        .area-name { font-size: 14px; font-weight: 700; text-align: center; }
        .area-blocks { font-size: 9px; color: rgba(255,248,231,0.7); text-align: center; margin-top: 2px; line-height: 1.3; }

        .seat-input {
          width: 100%; padding: 18px;
          font-size: 18px; font-weight: 700;
          border: 2px solid #E5DDD0; border-radius: 12px;
          background: #FFF; font-family: inherit; letter-spacing: 0.05em;
        }
        .seat-input:focus { outline: none; border-color: #1A4D2E; }
        .gps-card {
          margin-top: 16px; display: flex; align-items: center; gap: 12px;
          padding: 14px 16px;
          background: linear-gradient(135deg, #FFF8E7, #FFEFD0);
          border-radius: 12px; border: 1px solid #FFD93D;
        }
        .gps-icon { font-size: 24px; }
        .gps-text { flex: 1; }
        .gps-title { font-size: 13px; font-weight: 700; }
        .gps-sub { font-size: 11px; color: #6B5D4F; margin-top: 2px; }
        .gps-check {
          width: 28px; height: 28px; border-radius: 50%;
          background: #1A4D2E; color: #FFD93D;
          display: flex; align-items: center; justify-content: center;
        }

        .primary-btn {
          width: 100%; padding: 18px;
          background: #1A4D2E; color: #FFD93D;
          border: none; border-radius: 12px;
          font-size: 16px; font-weight: 900;
          font-family: inherit; cursor: pointer;
          margin-top: 24px; letter-spacing: 0.02em; transition: all 0.15s;
        }
        .primary-btn:hover:not(:disabled) { background: #0F3D22; transform: translateY(-1px); }
        .primary-btn:disabled { background: #C7BDB0; color: #FFF; cursor: not-allowed; }
        .secondary-btn {
          width: 100%; padding: 14px;
          background: #FFF; color: #1A4D2E;
          border: 2px solid #1A4D2E; border-radius: 12px;
          font-size: 14px; font-weight: 700;
          font-family: inherit; cursor: pointer; margin-top: 8px;
        }

        .home-header {
          background: #1A4D2E; padding: 20px;
          display: flex; align-items: center; gap: 12px; color: #FFF8E7;
        }
        .home-header .back-mini { background: rgba(255, 217, 61, 0.2); color: #FFD93D; }
        .home-location { flex: 1; }
        .loc-label { font-size: 11px; color: #FFD93D; font-weight: 700; letter-spacing: 0.1em; }
        .loc-value { font-size: 15px; font-weight: 700; margin-top: 2px; }

        .welcome-title { font-size: 26px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 6px; }
        .welcome-sub { font-size: 13px; color: #6B5D4F; margin-bottom: 24px; }

        .method-card {
          width: 100%; background: #FFF;
          border: 2px solid transparent; border-radius: 16px; padding: 20px;
          display: flex; align-items: center; gap: 16px;
          cursor: pointer; margin-bottom: 12px;
          text-align: left; transition: all 0.15s;
          box-shadow: 0 2px 8px rgba(26, 77, 46, 0.06);
        }
        .method-card:hover, .method-card:active {
          border-color: #1A4D2E; transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(26, 77, 46, 0.12);
        }
        .method-icon-wrap {
          width: 56px; height: 56px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
        }
        .method-icon-beer { background: linear-gradient(135deg, #FFD93D, #FFB800); color: #1A4D2E; }
        .method-icon-seller { background: linear-gradient(135deg, #1A4D2E, #2D6B47); color: #FFD93D; }
        .method-text { flex: 1; }
        .method-title { font-size: 16px; font-weight: 900; margin-bottom: 4px; }
        .method-desc { font-size: 12px; color: #6B5D4F; line-height: 1.4; }
        .chevron { color: #C7BDB0; flex-shrink: 0; }

        .info-banner {
          margin-top: 24px; background: #FFF8E7;
          border: 1px dashed #FFD93D; border-radius: 10px;
          padding: 12px 16px;
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: #6B5D4F;
        }
        .info-banner strong { color: #1A4D2E; }
        .info-emoji { font-size: 18px; }

        .beer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .beer-card {
          background: #FFF; border: 2px solid #E5DDD0; border-radius: 14px;
          padding: 18px 12px 16px; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          transition: all 0.15s; position: relative; overflow: hidden;
        }
        .beer-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: var(--beer-color, #1A4D2E);
        }
        .beer-card:hover, .beer-card:active {
          transform: translateY(-3px);
          border-color: var(--beer-color, #1A4D2E);
          box-shadow: 0 6px 16px rgba(0,0,0,0.08);
        }
        .beer-emoji { font-size: 36px; margin-top: 4px; }
        .beer-name {
          font-size: 12px; font-weight: 700; text-align: center; line-height: 1.3;
          min-height: 32px; display: flex; align-items: center;
        }
        .beer-price {
          font-family: 'Bebas Neue', sans-serif; font-size: 20px;
          color: var(--beer-color, #1A4D2E); font-weight: 700; letter-spacing: 0.05em;
        }

        .selected-beer-banner {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px; border-radius: 12px;
          border: 2px solid; margin-bottom: 20px;
        }
        .selected-beer-emoji { font-size: 32px; }
        .selected-beer-name { font-size: 15px; font-weight: 900; }
        .selected-beer-price { font-family: 'Bebas Neue', sans-serif; font-size: 18px; margin-top: 2px; }

        .list-heading {
          font-size: 14px; font-weight: 900; margin-bottom: 12px;
          display: flex; align-items: center; gap: 8px;
        }
        .list-count {
          font-size: 11px; background: #1A4D2E; color: #FFD93D;
          padding: 2px 8px; border-radius: 100px; font-weight: 700;
        }
        .empty-msg {
          padding: 32px 16px; text-align: center;
          color: #6B5D4F; font-size: 13px;
          background: #F5F2EC; border-radius: 12px;
        }

        .seller-card {
          width: 100%; background: #FFF;
          border: 1px solid #E5DDD0; border-radius: 14px;
          padding: 14px;
          display: flex; align-items: center; gap: 12px;
          cursor: pointer; margin-bottom: 10px;
          text-align: left; transition: all 0.15s; position: relative;
        }
        .seller-card:hover, .seller-card:active {
          border-color: #1A4D2E; transform: translateX(2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .seller-rank {
          font-family: 'Bebas Neue', sans-serif; font-size: 14px;
          color: #FFD93D; background: #1A4D2E;
          padding: 2px 8px; border-radius: 6px;
          position: absolute; top: 10px; right: 10px; letter-spacing: 0.05em;
        }
        .seller-avatar {
          width: 48px; height: 48px; background: #FFF8E7;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 28px; flex-shrink: 0; border: 2px solid #FFD93D;
        }
        .seller-info { flex: 1; min-width: 0; }
        .seller-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .seller-name { font-size: 16px; font-weight: 900; }
        .seller-rating {
          font-size: 11px; color: #6B5D4F;
          display: inline-flex; align-items: center; gap: 2px; font-weight: 700;
        }
        .seller-meta {
          display: flex; gap: 10px; font-size: 11px;
          color: #6B5D4F; margin-bottom: 6px;
        }
        .seller-meta span { display: inline-flex; align-items: center; gap: 3px; }
        .seller-time { color: #1A4D2E !important; font-weight: 700; }
        .seller-products { display: flex; flex-wrap: wrap; gap: 4px; }
        .product-pill {
          font-size: 10px; background: #F5F2EC; color: #6B5D4F;
          padding: 2px 6px; border-radius: 4px;
          font-weight: 500; white-space: nowrap;
        }

        /* === お気に入り === */
        .seller-card { padding-right: 48px; }
        .seller-card-fav {
          border-color: #FFB3BA;
          background: linear-gradient(to right, #FFF, #FFF8F9);
        }
        .fav-heart {
          position: absolute;
          right: 12px;
          bottom: 12px;
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #FFF;
          border: 1px solid #E5DDD0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          z-index: 2;
        }
        .fav-heart:hover { transform: scale(1.08); box-shadow: 0 2px 8px rgba(230, 57, 70, 0.2); }
        .fav-heart:active { transform: scale(0.92); }
        .fav-heart-on {
          background: #FFF0F1;
          border-color: #FFB3BA;
          animation: heart-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes heart-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .fav-badge {
          position: absolute;
          top: 10px;
          right: 56px;
          background: #E63946;
          color: #FFF;
          font-size: 9px;
          font-weight: 900;
          padding: 3px 7px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          letter-spacing: 0.05em;
        }

        /* === お気に入り優先チェックボックス === */
        .fav-filter {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: #FFF;
          border: 1.5px solid #E5DDD0;
          border-radius: 12px;
          cursor: pointer;
          margin-bottom: 14px;
          transition: all 0.15s;
          user-select: none;
        }
        .fav-filter:hover { border-color: #FFB3BA; }
        .fav-filter-on {
          background: linear-gradient(135deg, #FFF0F1, #FFF8F9);
          border-color: #E63946;
          box-shadow: 0 2px 8px rgba(230, 57, 70, 0.12);
        }
        .fav-filter input { display: none; }
        .fav-filter-box {
          width: 22px; height: 22px;
          border: 2px solid #C7BDB0;
          border-radius: 6px;
          background: #FFF;
          display: flex; align-items: center; justify-content: center;
          color: #FFF;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .fav-filter-box.on {
          background: #E63946;
          border-color: #E63946;
        }
        .fav-filter-icon {
          display: inline-flex;
          align-items: center;
        }
        .fav-filter-label {
          flex: 1;
          font-size: 13px;
          font-weight: 700;
          color: #1A1A1A;
        }
        .fav-filter-count {
          font-size: 11px;
          background: #1A4D2E;
          color: #FFD93D;
          padding: 2px 8px;
          border-radius: 100px;
          font-weight: 700;
        }

        /* === 詳細画面のお気に入りボタン === */
        .detail-header {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .detail-fav {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: none;
          background: #FFF;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: transform 0.15s;
        }
        .detail-fav:hover { transform: scale(1.05); }
        .detail-fav:active { transform: scale(0.9); }
        .detail-fav-on {
          background: #FFF0F1;
          animation: heart-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .detail-back { background: #FFF; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .detail-hero {
          padding: 8px 24px 32px; text-align: center;
          background: linear-gradient(180deg, #FFFCF7 0%, #FFF8E7 100%);
          border-bottom: 1px solid #E5DDD0;
        }
        .detail-avatar {
          width: 80px; height: 80px; background: #FFF;
          border: 3px solid #FFD93D; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 48px; margin: 0 auto 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .detail-name { font-size: 24px; font-weight: 900; margin-bottom: 8px; }
        .detail-meta {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; font-size: 12px; color: #6B5D4F; flex-wrap: wrap;
        }
        .detail-meta span { display: inline-flex; align-items: center; gap: 3px; }
        .detail-meta .dot { color: #C7BDB0; }

        .menu-section { padding: 20px; }
        .menu-heading {
          font-size: 15px; font-weight: 900; margin-bottom: 12px;
          display: flex; align-items: center; gap: 8px;
          padding-bottom: 8px; border-bottom: 2px solid #1A4D2E;
        }
        .menu-heading-2 { margin-top: 20px; }
        .menu-heading-icon { font-size: 18px; }
        .menu-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 0; border-bottom: 1px solid #F0EAE0;
        }
        .menu-item:last-of-type { border-bottom: none; }
        .menu-emoji {
          width: 56px; height: 56px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; flex-shrink: 0;
        }
        .menu-info { flex: 1; }
        .menu-name { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
        .menu-price {
          font-family: 'Bebas Neue', sans-serif; font-size: 18px;
          color: #1A4D2E; letter-spacing: 0.05em;
        }
        .add-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 2px solid #1A4D2E; background: #FFF; color: #1A4D2E;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
        }
        .add-btn:hover { background: #1A4D2E; color: #FFD93D; }
        .qty-control {
          display: flex; align-items: center; gap: 10px;
          background: #1A4D2E; border-radius: 100px; padding: 4px;
        }
        .qty-btn {
          width: 28px; height: 28px; border-radius: 50%;
          border: none; background: #FFD93D; color: #1A4D2E;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-weight: 700;
        }
        .qty-num {
          color: #FFD93D; font-weight: 900; font-size: 14px;
          min-width: 16px; text-align: center;
        }
        .menu-spacer { height: 60px; }

        .checkout-bar {
          position: fixed; bottom: 16px; left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px); max-width: 448px;
          background: #1A4D2E; color: #FFD93D; border: none;
          border-radius: 14px; padding: 16px 20px;
          display: flex; align-items: center; gap: 12px;
          cursor: pointer; font-family: inherit;
          box-shadow: 0 8px 24px rgba(26, 77, 46, 0.35); z-index: 100;
        }
        .checkout-badge {
          background: #FFD93D; color: #1A4D2E;
          border-radius: 6px; padding: 2px 8px;
          font-size: 13px; font-weight: 900;
        }
        .checkout-label { flex: 1; text-align: left; font-size: 16px; font-weight: 900; }
        .checkout-price { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.05em; }

        .confirm-seller {
          display: flex; align-items: center; gap: 12px;
          padding: 14px; background: #FFF8E7;
          border-radius: 12px; margin-bottom: 20px;
        }
        .confirm-avatar {
          width: 48px; height: 48px; background: #FFF;
          border: 2px solid #FFD93D; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 28px;
        }
        .confirm-seller-name { font-size: 16px; font-weight: 900; }
        .confirm-seller-eta {
          font-size: 12px; color: #1A4D2E; margin-top: 2px; font-weight: 700;
          display: inline-flex; align-items: center; gap: 4px;
        }
        .confirm-heading { font-size: 14px; font-weight: 900; margin-bottom: 10px; }
        .confirm-items {
          background: #FFF; border-radius: 12px; border: 1px solid #E5DDD0;
          padding: 12px 16px; margin-bottom: 16px;
        }
        .confirm-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 0; border-bottom: 1px solid #F0EAE0;
        }
        .confirm-item:last-child { border-bottom: none; }
        .confirm-emoji { font-size: 20px; }
        .confirm-name { flex: 1; font-size: 13px; font-weight: 500; }
        .confirm-qty { font-size: 13px; color: #6B5D4F; font-weight: 700; }
        .confirm-sub {
          font-family: 'Bebas Neue', sans-serif; font-size: 15px;
          color: #1A4D2E; min-width: 60px; text-align: right; letter-spacing: 0.05em;
        }
        .confirm-deliver {
          background: #FFF; border-radius: 12px; border: 1px solid #E5DDD0;
          padding: 14px 16px; margin-bottom: 16px;
        }
        .confirm-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
        .confirm-row span:first-child { color: #6B5D4F; }
        .confirm-row span:last-child { font-weight: 700; }

        /* === 優先デリバリー説明 === */
        .priority-info {
          background: linear-gradient(135deg, #1A4D2E, #2D6B47);
          color: #FFF8E7;
          border-radius: 12px;
          padding: 14px 16px;
          margin: 16px 0;
          border: 1px solid #FFD93D;
        }
        .priority-info-head {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 900;
          color: #FFD93D;
          margin-bottom: 4px;
        }
        .priority-info-text {
          font-size: 12px;
          line-height: 1.5;
          opacity: 0.95;
        }
        .priority-info-text strong {
          color: #FFD93D;
          font-weight: 900;
        }

        /* === 注文オプションボタン (通常 / 優先) === */
        .order-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .order-option {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          position: relative;
          transition: transform 0.15s, box-shadow 0.15s;
          border: 2px solid;
        }
        .order-option:hover { transform: translateY(-2px); }
        .order-option:active { transform: translateY(0); }

        .order-normal {
          background: #FFF;
          color: #1A4D2E;
          border-color: #1A4D2E;
        }
        .order-normal:hover { box-shadow: 0 6px 16px rgba(26, 77, 46, 0.18); }

        .order-priority {
          background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%);
          color: #FFD93D;
          border-color: #FFD93D;
          box-shadow: 0 4px 12px rgba(26, 77, 46, 0.3);
        }
        .order-priority:hover {
          box-shadow: 0 8px 20px rgba(26, 77, 46, 0.4);
        }

        .priority-badge {
          position: absolute;
          top: -8px;
          right: 12px;
          background: #FFD93D;
          color: #1A4D2E;
          font-size: 10px;
          font-weight: 900;
          padding: 3px 10px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          letter-spacing: 0.05em;
          box-shadow: 0 2px 6px rgba(0,0,0,0.18);
        }

        .order-option-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .order-option-label {
          font-size: 15px;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .order-option-eta {
          font-size: 12px;
          font-weight: 700;
          opacity: 0.85;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .priority-eta {
          background: rgba(255, 217, 61, 0.2);
          padding: 3px 8px;
          border-radius: 100px;
          opacity: 1;
        }
        .order-option-price {
          display: flex;
          justify-content: flex-end;
          align-items: baseline;
          gap: 10px;
        }
        .order-option-fee {
          font-size: 11px;
          font-weight: 700;
          opacity: 0.85;
        }
        .order-priority .order-option-fee {
          background: rgba(255, 217, 61, 0.18);
          padding: 2px 8px;
          border-radius: 100px;
        }
        .order-option-price-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 0.05em;
        }

        .complete-screen {
          background: linear-gradient(180deg, #1A4D2E 0%, #2D6B47 100%);
          color: #FFF8E7;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 24px;
        }
        .complete-priority {
          background: linear-gradient(180deg, #1A4D2E 0%, #2D6B47 60%, #C9A227 100%);
        }
        .complete-priority-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #FFD93D;
          color: #1A4D2E;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          margin-bottom: 18px;
          box-shadow: 0 4px 12px rgba(255, 217, 61, 0.4);
          animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .complete-card-fee {
          border-top: 1px dashed rgba(255, 217, 61, 0.3);
          border-bottom: 1px dashed rgba(255, 217, 61, 0.3);
          margin: 4px 0;
          padding: 8px 0 !important;
          color: #FFD93D !important;
          font-weight: 700;
        }
        .complete-card-fee span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .complete-content { text-align: center; width: 100%; }
        .complete-check {
          width: 96px; height: 96px; background: #FFD93D;
          color: #1A4D2E; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes pop { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        .complete-title { font-size: 24px; font-weight: 900; margin-bottom: 8px; }
        .complete-sub { font-size: 14px; opacity: 0.9; margin-bottom: 28px; }
        .complete-eta {
          display: inline-flex; align-items: baseline; gap: 8px;
          background: rgba(255, 217, 61, 0.15);
          padding: 14px 24px; border-radius: 14px;
          margin-bottom: 24px; color: #FFD93D;
        }
        .complete-eta span { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 0.05em; }
        .complete-eta small { font-size: 13px; font-weight: 500; }
        .complete-card {
          background: rgba(255, 252, 247, 0.1);
          border: 1px solid rgba(255, 217, 61, 0.3);
          border-radius: 12px; padding: 16px; margin-bottom: 24px;
        }
        .complete-card-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
        .complete-card-row strong {
          font-family: 'Bebas Neue', sans-serif; font-size: 18px;
          color: #FFD93D; letter-spacing: 0.05em;
        }
        .complete-screen .primary-btn { background: #FFD93D; color: #1A4D2E; }

        /* === チップ（完了画面） === */
        .complete-tip-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 200, 100, 0.25);
          color: #FFD93D;
          border: 1px solid rgba(255, 217, 61, 0.5);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 16px;
          animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .complete-card-tip {
          color: #FFC864 !important;
          font-weight: 700;
        }
        .complete-card-tip span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        /* === チップセクション（確認画面） === */
        .tip-section {
          background: #FFF;
          border: 2px solid #FFD93D;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }
        .tip-section::before {
          content: '🎁';
          position: absolute;
          right: -8px;
          top: -8px;
          font-size: 56px;
          opacity: 0.06;
          transform: rotate(20deg);
        }
        .tip-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .tip-head-icon { color: #E67E22; flex-shrink: 0; }
        .tip-head-title { font-size: 15px; font-weight: 900; flex: 1; }
        .tip-head-amount {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          color: #E67E22;
          letter-spacing: 0.05em;
          animation: pop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .tip-head-sub {
          font-size: 12px;
          color: #6B5D4F;
          margin-bottom: 14px;
        }

        /* プリセットボタン */
        .tip-presets {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .tip-preset {
          flex: 1;
          padding: 12px 8px;
          border-radius: 12px;
          border: 2px solid #E5DDD0;
          background: #FFF;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 0.05em;
          color: #1A1A1A;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        .tip-preset:hover { border-color: #E67E22; color: #E67E22; }
        .tip-preset-on {
          background: #E67E22;
          border-color: #E67E22;
          color: #FFF;
          box-shadow: 0 4px 10px rgba(230, 126, 34, 0.3);
        }
        .tip-preset-none {
          font-family: 'Zen Kaku Gothic New', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #C7BDB0;
          max-width: 56px;
        }

        /* 任意入力ステッパー */
        .tip-custom {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: #F5F2EC;
          border-radius: 12px;
          border: 2px solid transparent;
          transition: all 0.15s;
        }
        .tip-custom-on {
          background: #FFF8EE;
          border-color: #E67E22;
        }
        .tip-custom-label {
          font-size: 12px;
          font-weight: 900;
          color: #6B5D4F;
          flex-shrink: 0;
        }
        .tip-custom-stepper {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          justify-content: center;
        }
        .tip-stepper-btn {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 2px solid #E67E22;
          background: #FFF;
          color: #E67E22;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.12s;
          flex-shrink: 0;
        }
        .tip-stepper-btn:hover:not(:disabled) { background: #E67E22; color: #FFF; }
        .tip-stepper-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .tip-stepper-val {
          min-width: 72px;
          text-align: center;
        }
        .tip-stepper-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          color: #E67E22;
          letter-spacing: 0.05em;
        }
        .tip-stepper-inactive { color: #C7BDB0; }
        .tip-custom-unit {
          font-size: 10px;
          color: #C7BDB0;
          font-weight: 700;
          flex-shrink: 0;
        }
        .order-tip-fee {
          background: rgba(230, 126, 34, 0.15) !important;
          color: #E67E22 !important;
          padding: 2px 7px;
          border-radius: 100px;
          font-size: 11px !important;
        }

        /* === 進行中オーダーバナー（ホーム上部） === */
        .active-orders-wrap {
          padding: 12px 16px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .active-order-banner {
          width: 100%;
          background: #FFF;
          border: 2px solid #1A4D2E;
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          box-shadow: 0 4px 12px rgba(26, 77, 46, 0.15);
          transition: transform 0.15s, box-shadow 0.15s;
          position: relative;
          overflow: hidden;
        }
        .active-order-banner:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(26, 77, 46, 0.22); }
        .active-order-banner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 217, 61, 0.12) 50%, transparent 100%);
          animation: shimmer 2.4s linear infinite;
          pointer-events: none;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .active-order-priority {
          background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%);
          color: #FFD93D;
          border-color: #FFD93D;
        }
        .active-order-priority .active-order-name { color: #FFD93D; }
        .active-order-priority .active-order-meta { color: #FFF8E7; }
        .active-order-priority .chevron { color: #FFD93D; }

        .active-order-icon {
          position: relative;
          flex-shrink: 0;
        }
        .active-order-avatar {
          width: 44px; height: 44px;
          background: #FFF8E7;
          border: 2px solid #FFD93D;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          position: relative;
          z-index: 2;
        }
        .active-order-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: rgba(255, 217, 61, 0.4);
          animation: pulse 1.6s ease-out infinite;
          z-index: 1;
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .active-order-body { flex: 1; min-width: 0; }
        .active-order-head {
          display: flex; align-items: center; gap: 6px;
          margin-bottom: 4px;
        }
        .active-order-name {
          font-size: 14px; font-weight: 900;
          color: #1A4D2E;
        }
        .active-order-priority-tag {
          background: #FFD93D;
          color: #1A4D2E;
          font-size: 9px;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }
        .active-order-meta {
          font-size: 12px;
          color: #6B5D4F;
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }
        .active-order-meta strong {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          color: inherit;
          letter-spacing: 0.05em;
          margin: 0 2px;
        }
        .active-order-arriving {
          color: #E63946;
          font-weight: 900;
        }
        .dot-sep { opacity: 0.5; }

        /* === 下部固定: オーダー履歴ボタン === */
        .history-fab {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: #1A1A1A;
          color: #FFF8E7;
          border: 2px solid #FFD93D;
          border-radius: 100px;
          padding: 12px 22px 12px 18px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(0,0,0,0.25);
          z-index: 50;
          transition: transform 0.15s;
        }
        .history-fab:hover { transform: translateX(-50%) translateY(-2px); }
        .history-fab-badge {
          background: #FFD93D;
          color: #1A4D2E;
          font-size: 11px;
          font-weight: 900;
          padding: 1px 7px;
          border-radius: 100px;
          margin-left: 2px;
        }

        /* === 進行中オーダー詳細画面 === */
        .active-detail-priority {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #FFD93D;
          color: #1A4D2E;
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }
        .active-detail-hero {
          background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%);
          color: #FFF8E7;
          border-radius: 16px;
          padding: 24px 20px;
          margin-bottom: 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .active-detail-avatar {
          width: 64px; height: 64px;
          background: #FFF;
          border: 3px solid #FFD93D;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
          margin: 0 auto 10px;
        }
        .active-detail-name { font-size: 15px; font-weight: 700; margin-bottom: 16px; }
        .active-detail-eta-block {
          background: rgba(255, 217, 61, 0.15);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 18px;
        }
        .active-detail-eta-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 56px;
          color: #FFD93D;
          line-height: 1;
          letter-spacing: 0.05em;
        }
        .active-detail-eta-num small {
          font-size: 20px;
          margin-left: 4px;
        }
        .active-detail-eta-label {
          font-size: 12px;
          color: #FFF8E7;
          opacity: 0.85;
          margin-top: 4px;
          font-weight: 500;
        }
        .active-detail-progress { padding: 0 4px; }
        .active-detail-progress-track {
          height: 6px;
          background: rgba(255, 248, 231, 0.2);
          border-radius: 100px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .active-detail-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #FFD93D, #FFB800);
          border-radius: 100px;
          transition: width 1s ease;
        }
        .active-detail-progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #FFF8E7;
          opacity: 0.7;
          font-weight: 700;
        }
        .confirm-row-total {
          border-top: 1px solid #E5DDD0;
          margin-top: 6px;
          padding-top: 10px !important;
          font-size: 15px !important;
        }
        .confirm-row-total span:last-child {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px !important;
          color: #1A4D2E;
          letter-spacing: 0.05em;
        }

        /* === オーダー履歴一覧 === */
        .empty-history {
          text-align: center;
          padding: 60px 20px;
          color: #6B5D4F;
        }
        .empty-history-icon {
          width: 80px; height: 80px;
          background: #F5F2EC;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          color: #C7BDB0;
        }
        .empty-history-title { font-size: 16px; font-weight: 900; margin-bottom: 4px; }
        .empty-history-sub { font-size: 12px; }

        .history-summary {
          background: linear-gradient(135deg, #1A4D2E 0%, #2D6B47 100%);
          color: #FFF8E7;
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 16px;
        }
        .history-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 4px 0;
        }
        .history-summary-row span { font-size: 12px; opacity: 0.85; }
        .history-summary-row strong { font-size: 16px; font-weight: 900; }
        .history-summary-total {
          font-family: 'Bebas Neue', sans-serif !important;
          font-size: 22px !important;
          color: #FFD93D;
          letter-spacing: 0.05em;
        }

        .history-card {
          width: 100%;
          background: #FFF;
          border: 1px solid #E5DDD0;
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 10px;
          font-family: inherit;
          text-align: left;
          cursor: default;
        }
        .history-card-active {
          cursor: pointer;
          border-color: #1A4D2E;
          box-shadow: 0 4px 12px rgba(26, 77, 46, 0.12);
        }
        .history-card-active:hover { transform: translateX(2px); }

        .history-card-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .history-card-date {
          font-size: 11px;
          color: #6B5D4F;
          font-weight: 700;
          flex: 1;
        }
        .history-status {
          font-size: 10px;
          font-weight: 900;
          padding: 2px 7px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .history-status-active {
          background: #1A4D2E;
          color: #FFD93D;
        }
        .history-status-active .status-dot {
          width: 6px; height: 6px;
          background: #FFD93D;
          border-radius: 50%;
          animation: dot-blink 1.2s ease-in-out infinite;
        }
        @keyframes dot-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .history-status-done {
          background: #F0EAE0;
          color: #6B5D4F;
        }
        .history-priority {
          background: #FFD93D;
          color: #1A4D2E;
          font-size: 9px;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }

        .history-card-seller {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .history-seller-avatar {
          width: 36px; height: 36px;
          background: #FFF8E7;
          border: 2px solid #FFD93D;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }
        .history-seller-name {
          font-size: 14px;
          font-weight: 900;
        }
        .history-seller-sub {
          font-size: 11px;
          color: #6B5D4F;
          margin-top: 1px;
        }
        .history-card-items {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 10px;
        }
        .history-item-pill {
          font-size: 11px;
          background: #F5F2EC;
          color: #1A1A1A;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 500;
        }
        .history-card-foot {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-top: 10px;
          border-top: 1px dashed #E5DDD0;
        }
        .history-qty {
          font-size: 11px;
          color: #6B5D4F;
          font-weight: 700;
        }
        .history-total {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          color: #1A4D2E;
          letter-spacing: 0.05em;
        }
      `}</style>
      {renderStep()}
    </div>
  );
}
