import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

// ==================== DATA CONSTANTS ====================
const TIMELINE_DATA = [
  { year: '1976', title: 'OPERASI DIMULAI', risk: 20, color: '#c9a84c',
    detail: 'September 1976. Joseph Pistone, agen FBI berusia 37 tahun, memulai misi infiltrasi ke keluarga mafia Bonanno. Identitas samaran: Donnie Brasco, penjual permata palsu asal California. Target awal: membangun kredibilitas di jalanan Brooklyn.',
    location: 'New York City' },
  { year: '1977', title: 'BERTEMU LEFTY', risk: 40, color: '#e67e22',
    detail: 'Pistone bertemu Benjamin "Lefty" Ruggiero di Toyland Social Club, Little Italy. Lefty adalah hitman veteran yang frustrasi karena tidak pernah naik jabatan. Lefty menjadi mentor dan pelindung Donnie di dunia mafia - sebuah ikatan yang kelak menjadi tragedi.',
    location: 'Little Italy, Manhattan' },
  { year: '1978', title: 'INNER CIRCLE', risk: 55, color: '#e74c3c',
    detail: 'Donnie diperkenalkan ke lingkaran dalam Bonanno. Ia terlibat operasi pencurian senilai $1.2 juta. Mulai bertemu boss tingkat tinggi termasuk Dominick "Sonny Black" Napolitano dan koneksi ke Santo Trafficante Jr. di Florida.',
    location: 'Brooklyn, NY' },
  { year: '1979', title: 'PEMBUNUHAN GALANTE', risk: 70, color: '#c0392b',
    detail: '12 Juli 1979. Boss Carmine Galante ditembak mati di Joe and Marys Restaurant, Bushwick. Pistone menyaksikan perebutan kekuasaan brutal. Sonny Black naik menjadi kapten. Pistone kini berada di tengah perang saudara mafia.',
    location: 'Bushwick, Brooklyn' },
  { year: '1980', title: 'FLORIDA OPS', risk: 85, color: '#8b1a1a',
    detail: 'Operasi meluas ke Florida. King\'s Court Bottle Club dibuka sebagai front bisnis di Holiday, FL. Donnie terlibat perdagangan senjata dan narkotika. FBI merekam ratusan bukti. Keluarganya di rumah menderita - istrinya hampir menceraikannya.',
    location: 'Holiday, Florida' },
  { year: '1981', title: 'PENARIKAN', risk: 100, color: '#ff0000',
    detail: '27 Juli 1981. FBI menarik Pistone setelah 5+ tahun. Sonny Black mengusulkan Donnie menjadi "made man" yang membutuhkan pembunuhan inisiasi. 200+ mafia ditangkap. Lefty berkata saat ditangkap: "Hit me in the head. My family will get the life insurance."',
    location: 'FBI HQ, New York' }
]

const PLAYERS_DATA = [
  { name: 'Joseph D. Pistone', alias: 'Donnie Brasco', role: 'Agen FBI Undercover', status: 'alive', statusColor: '#2ecc71',
    bio: 'Lahir 1939 di Erie, Pennsylvania. Agen FBI sejak 1969. Operasi infiltrasi terpanjang dalam sejarah FBI. Hidup dalam perlindungan saksi sejak 1981. Kontrak $500,000 di kepalanya.',
    faction: 'FBI', yearsActive: '1976-1981' },
  { name: 'Benjamin Ruggiero', alias: 'Lefty Two Guns', role: 'Soldier Bonanno / Mentor', status: 'dead', statusColor: '#e74c3c',
    bio: 'Hitman veteran yang menjadi mentor Donnie. 26 pembunuhan diklaim. Frustrasi seumur hidup karena tidak pernah dipromosikan. Dihukum 15 tahun penjara setelah operasi. Meninggal 1994 karena kanker paru-paru.',
    faction: 'Bonanno', yearsActive: '1960s-1981' },
  { name: 'Dominick Napolitano', alias: 'Sonny Black', role: 'Kapten Bonanno', status: 'dead', statusColor: '#e74c3c',
    bio: 'Kapten ambisius yang mempercayai Donnie sepenuhnya. Mengusulkan Donnie menjadi made man. Dibunuh 17 Agustus 1981 setelah identitas Donnie terungkap. Tubuhnya ditemukan setahun kemudian - tangannya dipotong sebagai hukuman.',
    faction: 'Bonanno', yearsActive: '1970s-1981' },
  { name: 'Anthony Mirra', alias: 'Mr. Mott Street', role: 'Soldier Bonanno', status: 'dead', statusColor: '#e74c3c',
    bio: 'Kontak pertama Pistone di mafia. Dikenal sangat berbahaya dan tidak bisa diprediksi. Dibunuh 18 Februari 1982 oleh keluarga sendiri karena membawa agen FBI ke dalam organisasi.',
    faction: 'Bonanno', yearsActive: '1960s-1982' },
  { name: 'Joseph Massino', alias: 'Big Joey', role: 'Boss Bonanno', status: 'alive', statusColor: '#f39c12',
    bio: 'Naik menjadi boss Bonanno setelah kekacauan akibat operasi Donnie Brasco. Menjadi boss mafia pertama yang menjadi informan FBI pada 2004. Hukuman seumur hidup diringankan.',
    faction: 'Bonanno', yearsActive: '1970s-2004' },
  { name: 'Carmine Galante', alias: 'Lilo / The Cigar', role: 'Boss Bonanno', status: 'dead', statusColor: '#e74c3c',
    bio: 'Boss brutal Bonanno yang menguasai perdagangan heroin. Ditembak mati 12 Juli 1979 di restoran saat makan siang. Foto terkenalnya: tergeletak dengan cerutu masih di mulut.',
    faction: 'Bonanno', yearsActive: '1950s-1979' }
]

const MAP_LOCATIONS = [
  { id: 'nyc', name: 'New York City', x: 580, y: 160, desc: 'Pusat operasi utama. Little Italy, Brooklyn, Manhattan.', importance: 'primary' },
  { id: 'miami', name: 'Miami', x: 560, y: 380, desc: 'Operasi Florida. Perdagangan senjata dan narkotika.', importance: 'primary' },
  { id: 'holiday', name: 'Holiday, FL', x: 530, y: 350, desc: "King's Court Bottle Club - front bisnis mafia.", importance: 'secondary' },
  { id: 'milwaukee', name: 'Milwaukee', x: 420, y: 140, desc: 'Koneksi Frank Balistrieri, boss Milwaukee.', importance: 'secondary' },
  { id: 'montreal', name: 'Montreal', x: 590, y: 80, desc: 'Koneksi mafia Kanada - Rizzuto family.', importance: 'secondary' },
  { id: 'tampa', name: 'Tampa', x: 535, y: 360, desc: 'Wilayah Santo Trafficante Jr.', importance: 'secondary' },
  { id: 'chicago', name: 'Chicago', x: 400, y: 155, desc: 'Koneksi Chicago Outfit.', importance: 'tertiary' },
  { id: 'erie', name: 'Erie, PA', x: 520, y: 150, desc: 'Kota kelahiran Joseph Pistone.', importance: 'tertiary' }
]

const MAP_CONNECTIONS = [
  { from: 'nyc', to: 'miami', label: 'Drug Route' },
  { from: 'nyc', to: 'milwaukee', label: 'Balistrieri' },
  { from: 'nyc', to: 'montreal', label: 'Rizzuto' },
  { from: 'miami', to: 'tampa', label: 'Trafficante' },
  { from: 'nyc', to: 'chicago', label: 'Outfit' },
  { from: 'nyc', to: 'holiday', label: "King's Court" }
]

const STATS_DATA = [
  { label: 'Tahun Undercover', value: 5, suffix: '+', icon: '⏱' },
  { label: 'Indictments', value: 200, suffix: '+', icon: '⚖' },
  { label: 'Convictions', value: 100, suffix: '+', icon: '🔒' },
  { label: 'Bounty ($)', value: 500, suffix: 'K', icon: '💀' },
  { label: 'Buku Ditulis', value: 6, suffix: '', icon: '📖' },
  { label: 'Film', value: 1, suffix: '', icon: '🎬' }
]

const RISK_CHART_DATA = [
  { year: '1976', risk: 20, trust: 10 },
  { year: '1977', risk: 40, trust: 35 },
  { year: '1978', risk: 55, trust: 60 },
  { year: '1979', risk: 70, trust: 75 },
  { year: '1980', risk: 85, trust: 90 },
  { year: '1981', risk: 100, trust: 95 }
]

const PIE_DATA = [
  { name: 'Bonanno', value: 120, color: '#c9a84c' },
  { name: 'Colombo', value: 30, color: '#e74c3c' },
  { name: 'Gambino', value: 25, color: '#3498db' },
  { name: 'Lainnya', value: 25, color: '#6a6a7a' }
]

const RADAR_DATA = [
  { skill: 'Acting', A: 95 },
  { skill: 'Street Smart', A: 88 },
  { skill: 'Gemology', A: 92 },
  { skill: 'Nerves', A: 97 },
  { skill: 'Memory', A: 90 },
  { skill: 'Loyalty Fake', A: 94 }
]

const FILM_VS_REALITY = {
  accurate: [
    { film: 'Donnie menyamar sebagai penjual permata', reality: 'Benar. Pistone belajar gemologi selama berbulan-bulan sebelum operasi.' },
    { film: 'Lefty menjadi mentor Donnie', reality: 'Benar. Lefty Ruggiero benar-benar menjadi mentor dan pelindungnya.' },
    { film: 'Adegan bandara - Lefty menyerahkan perhiasan', reality: 'Benar terjadi. Lefty memberikan cincin dan jam tangannya.' },
    { film: 'Sonny Black dibunuh setelah identitas terungkap', reality: 'Benar. Dibunuh 17 Agustus 1981, tubuh ditemukan tanpa tangan.' }
  ],
  inaccurate: [
    { film: 'Donnie menampar istrinya', reality: 'Tidak pernah terjadi. Pistone mengatakan ini murni fiksi Hollywood.' },
    { film: 'Lefty yang dibunuh di akhir film', reality: 'Salah. Lefty dipenjara 15 tahun, meninggal 1994 karena kanker.' },
    { film: 'Timeline dipadatkan drastis', reality: '6 tahun operasi dipadatkan menjadi sekitar 2 tahun di film.' },
    { film: 'Donnie hampir membunuh seseorang', reality: 'Pistone menyatakan FBI memiliki protokol ketat - ia tidak pernah membunuh.' }
  ]
}

const AFTERMATH_DATA = [
  { name: 'Sonny Black Napolitano', fate: 'DIBUNUH', date: '17 Agustus 1981', detail: 'Dipanggil ke pertemuan di Staten Island. Tahu ia akan mati. Meninggalkan kunci rumah dan perhiasan untuk kekasihnya. Ditembak dan tubuhnya dicor. Ditemukan setahun kemudian - tangannya dipotong sebagai simbol hukuman karena "memperkenalkan" agen FBI.', color: '#8b1a1a' },
  { name: 'Anthony Mirra', fate: 'DIBUNUH', date: '18 Februari 1982', detail: 'Ditembak oleh keponakannya sendiri, Joseph D\'Amico, atas perintah keluarga Bonanno. Mirra dihukum karena dialah yang pertama kali memperkenalkan Donnie ke organisasi. Tubuhnya ditemukan di mobil parkir di Lower East Side.', color: '#8b1a1a' },
  { name: 'Lefty Ruggiero', fate: 'DIPENJARA', date: '1982-1992', detail: 'Dihukum 15 tahun penjara. Saat ditangkap, Lefty berkata kepada istrinya: "Get my things ready. If Donnie is what I think he is, I won\'t be coming home." Meninggal 1994 karena kanker paru-paru, setahun setelah bebas.', color: '#e67e22' },
  { name: 'Keluarga Bonanno', fate: 'DIKELUARKAN', date: '1981-1991', detail: 'Bonanno dikeluarkan dari "The Commission" (dewan mafia New York) selama satu dekade. Dianggap tidak kompeten karena membiarkan agen FBI menyusup begitu dalam. Baru kembali di awal 1990an di bawah Joseph Massino.', color: '#c9a84c' },
  { name: 'Joseph Pistone', fate: 'PERLINDUNGAN SAKSI', date: '1981 - Sekarang', detail: 'Kontrak pembunuhan $500,000 di kepalanya. Menjalani operasi plastik. Pindah rumah berkali-kali. Bersaksi di 200+ persidangan. Menulis 6 buku. Menjadi konsultan FBI. Pernikahannya berakhir akibat tekanan operasi.', color: '#1e3a5f' }
]

const QUOTES = [
  { text: 'When you are living a lie every second of every day, at some point you gotta ask yourself: who am I really?', author: 'Joseph Pistone' },
  { text: 'Lefty trusted me with his life. And I betrayed that trust. That is something I carry with me every single day.', author: 'Joseph Pistone' },
  { text: 'If Donnie Brasco is what I think he is, I am not going to make it.', author: 'Benjamin "Lefty" Ruggiero' },
  { text: 'The hardest part was not the danger. It was watching what it did to my family.', author: 'Joseph Pistone' }
]

const PISTONE_RULES = {
  survival: ['Jangan pernah menulis apapun di depan mereka', 'Selalu bayar tagihan - pelit adalah tanda bahaya', 'Jangan bertanya terlalu banyak', 'Bangun reputasi di jalanan sebelum mendekati target'],
  identity: ['Pelajari setiap detail identitas samaran', 'Jadikan persona kedua sealami bernapas', 'Jangan pernah melanggar karakter walau sendirian', 'Bangun backstory yang bisa diverifikasi'],
  intelligence: ['Rekam percakapan hanya saat aman', 'Buat catatan mental, tulis nanti', 'Identifikasi hierarki dan hubungan kekuasaan', 'Fokus pada pola, bukan insiden individual'],
  exit: ['Selalu punya alasan untuk pergi', 'Jangan terlalu dekat secara emosional', 'FBI harus bisa menarik kapan saja', 'Tinggalkan jejak bukti yang cukup untuk dakwaan']
}

// ==================== MAIN COMPONENT ====================
export default function App() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [scrollPct, setScrollPct] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [visible, setVisible] = useState({})
  const [hoveredCity, setHoveredCity] = useState(null)
  const [counts, setCounts] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [ripples, setRipples] = useState([])
  const [playerFilter, setPlayerFilter] = useState('all')
  const [rulesTab, setRulesTab] = useState('survival')
  const [filmTab, setFilmTab] = useState('accurate')
  const [expandedTimeline, setExpandedTimeline] = useState(null)
  const [typewriterText, setTypewriterText] = useState('')
  const [stampVisible, setStampVisible] = useState(false)
  const observerRef = useRef(null)
  const countersStarted = useRef(false)

  // Typewriter effect
  useEffect(() => {
    const title = 'DONNIE BRASCO'
    let i = 0
    const timer = setInterval(() => {
      if (i <= title.length) {
        setTypewriterText(title.slice(0, i))
        i++
      } else {
        clearInterval(timer)
        setTimeout(() => setStampVisible(true), 300)
      }
    }, 120)
    return () => clearInterval(timer)
  }, [])

  // Mouse tracker
  useEffect(() => {
    const handler = (e) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  // Scroll progress
  useEffect(() => {
    const handler = () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      setScrollPct(Math.min(pct * 100, 100))
    }
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // IntersectionObserver for entrance animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(prev => ({ ...prev, [entry.target.id]: true }))
        }
      })
    }, { threshold: 0.15 })
    const sections = document.querySelectorAll('[data-animate]')
    sections.forEach(s => observerRef.current.observe(s))
    return () => observerRef.current?.disconnect()
  }, [])

  // Counter animation
  useEffect(() => {
    if (visible['stats-section'] && !countersStarted.current) {
      countersStarted.current = true
      STATS_DATA.forEach((stat, idx) => {
        let current = 0
        const step = Math.max(1, Math.floor(stat.value / 60))
        const timer = setInterval(() => {
          current += step
          if (current >= stat.value) {
            current = stat.value
            clearInterval(timer)
          }
          setCounts(prev => ({ ...prev, [idx]: current }))
        }, 30)
      })
    }
  }, [visible])

  // Carousel auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx(prev => (prev + 1) % QUOTES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Ripple effect handler
  const addRipple = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() }
    setRipples(prev => [...prev, ripple])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== ripple.id)), 600)
  }, [])

  const filteredPlayers = playerFilter === 'all' ? PLAYERS_DATA : PLAYERS_DATA.filter(p => p.faction === playerFilter)

  const getConnectionPath = (from, to) => {
    const f = MAP_LOCATIONS.find(l => l.id === from)
    const t = MAP_LOCATIONS.find(l => l.id === to)
    if (!f || !t) return ''
    const mx = (f.x + t.x) / 2
    const my = (f.y + t.y) / 2 - 30
    return `M${f.x},${f.y} Q${mx},${my} ${t.x},${t.y}`
  }

  return (
    <div className="relative min-h-screen bg-[#07070d] text-[#e8e4d9] overflow-x-hidden" onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}>

      {/* ===== GLOBAL STYLES ===== */}
      <style>{`
        @keyframes grain { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-5%,-10%)} 20%{transform:translate(-15%,5%)} 30%{transform:translate(7%,-25%)} 40%{transform:translate(-5%,25%)} 50%{transform:translate(-15%,10%)} 60%{transform:translate(15%,0%)} 70%{transform:translate(0%,15%)} 80%{transform:translate(3%,35%)} 90%{transform:translate(-10%,10%)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(60px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.5)} }
        @keyframes rippleAnim { to{transform:scale(4);opacity:0} }
        @keyframes float { 0%,100%{transform:translateY(0) translateX(0)} 25%{transform:translateY(-20px) translateX(10px)} 50%{transform:translateY(-10px) translateX(-5px)} 75%{transform:translateY(-30px) translateX(15px)} }
        @keyframes stampSlam { 0%{transform:scale(4) rotate(-20deg);opacity:0} 50%{transform:scale(1.1) rotate(3deg);opacity:1} 100%{transform:scale(1) rotate(-5deg);opacity:1} }
        @keyframes dashDraw { to{stroke-dashoffset:0} }
        @keyframes heartbeat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.05)} 28%{transform:scale(1)} 42%{transform:scale(1.05)} 70%{transform:scale(1)} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 5px rgba(201,168,76,0.3)} 50%{box-shadow:0 0 20px rgba(201,168,76,0.6)} }
        @keyframes typewriterCursor { 0%,100%{border-color:transparent} 50%{border-color:#c9a84c} }
        @keyframes sonar { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(3);opacity:0} }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
        .glass-hover:hover { background: rgba(255,255,255,0.07); border-color: rgba(201,168,76,0.3); transform: translateY(-4px); }
        .ripple-effect { position:absolute; border-radius:50%; background:rgba(201,168,76,0.3); animation:rippleAnim 0.6s linear; pointer-events:none; width:20px; height:20px; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #07070d; }
        ::-webkit-scrollbar-thumb { background: #c9a84c; border-radius: 3px; }
        * { scrollbar-width: thin; scrollbar-color: #c9a84c #07070d; }
      `}</style>

      {/* ===== CURSOR GLOW ===== */}
      <div className="fixed pointer-events-none z-50 w-[300px] h-[300px] rounded-full opacity-20 transition-all duration-100" style={{ left: mouse.x - 150, top: mouse.y - 150, background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)' }} />

      {/* ===== SCROLL PROGRESS BAR ===== */}
      <div className="fixed top-0 left-0 h-1 z-50 transition-all duration-150" style={{ width: `${scrollPct}%`, background: 'linear-gradient(90deg, #1e3a5f, #c9a84c, #8b1a1a)' }} />

      {/* ===== FILM GRAIN OVERLAY ===== */}
      <div className="fixed inset-0 z-40 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', animation: 'grain 0.5s steps(10) infinite' }} />

      {/* ===== FLOATING PARTICLES ===== */}
      {Array.from({ length: 20 }, (_, i) => (
        <div key={`p-${i}`} className="fixed rounded-full pointer-events-none z-30" style={{ width: Math.random() * 4 + 1, height: Math.random() * 4 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: i % 3 === 0 ? '#c9a84c' : i % 3 === 1 ? '#8b1a1a' : '#4a9eff', opacity: 0.3, animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`, animationDelay: `${Math.random() * 5}s` }} />
      ))}

      {/* ========== SECTION 1: HERO CINEMATIC ========== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: 'linear-gradient(180deg, #07070d 0%, #10111a 50%, #07070d 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(201,168,76,0.03) 50px, rgba(201,168,76,0.03) 51px)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }} />
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-wider" style={{ fontFamily: 'Impact, sans-serif', color: '#4a9eff', textShadow: '0 0 40px rgba(74,158,255,0.3)' }}>
          {typewriterText}<span className="border-r-4 ml-1" style={{ animation: 'typewriterCursor 0.8s infinite' }}>&nbsp;</span>
        </h1>
        <p className="text-2xl md:text-3xl mt-2 tracking-[0.3em] text-[#c9a84c] opacity-60">JOSEPH PISTONE</p>
        <p className="text-lg md:text-xl mt-6 max-w-2xl text-[#e8e4d9] opacity-80 leading-relaxed">
          Infiltrasi FBI Terdalam dalam Sejarah Mafia Amerika.<br/>
          Selama <span className="text-[#c9a84c] font-bold">6 tahun</span>, seorang agen federal hidup sebagai mobster.
          Ia menyaksikan pembunuhan. Ia menjadi keluarga mereka. Dan ketika operasi berakhir,
          <span className="text-[#4a9eff] font-bold"> 200+ mafia</span> ditangkap.
        </p>
        {stampVisible && (
          <div className="mt-8 border-4 border-[#8b1a1a] text-[#8b1a1a] px-8 py-3 text-2xl font-black tracking-widest" style={{ animation: 'stampSlam 0.5s ease-out forwards', fontFamily: 'Courier New, monospace' }}>
            DECLASSIFIED
          </div>
        )}
        <div className="mt-12 text-xs tracking-[0.5em] uppercase text-[#6a6a7a] animate-pulse">
          Scroll untuk mengungkap kisahnya
        </div>
        <div className="mt-4 w-6 h-10 border-2 border-[#4a9eff] rounded-full flex justify-center opacity-50">
          <div className="w-1.5 h-3 bg-[#4a9eff] rounded-full mt-2 animate-bounce" />
        </div>
      </section>

      {/* ========== SECTION 2: FBI DOSSIER (BENTO BOX) ========== */}
      <section id="dossier-section" data-animate className={`py-20 px-4 md:px-12 transition-all duration-1000 ${visible['dossier-section'] ? 'animate-slideUp' : 'opacity-0 translate-y-16'}`}>
        <h2 className="text-4xl md:text-5xl font-black text-center mb-2" style={{ color: '#c9a84c', fontFamily: 'Impact, sans-serif', letterSpacing: '0.1em' }}>DOKUMEN RAHASIA FBI</h2>
        <p className="text-center text-[#6a6a7a] mb-12 tracking-widest text-sm">OPERATION SUN-APPLE // CLASSIFIED LEVEL 5</p>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main profile card */}
          <div className="md:col-span-2 md:row-span-2 glass rounded-xl p-8 glass-hover transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-[#1e3a5f] text-[#4a9eff]">FBI AGENT</div>
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#4a9eff] flex items-center justify-center text-4xl flex-shrink-0">
                🕵️
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#4a9eff]">Joseph Dominick Pistone</h3>
                <p className="text-[#c9a84c] text-lg">a.k.a. "Donnie Brasco"</p>
                <p className="text-[#6a6a7a] text-sm mt-1">Lahir: 17 September 1939, Erie, Pennsylvania</p>
                <p className="text-[#6a6a7a] text-sm">FBI: 1969 - 1986 | Operasi: 1976 - 1981</p>
                <p className="mt-4 text-sm leading-relaxed text-[#e8e4d9] opacity-80">
                  Agen FBI yang menyamar sebagai penjual permata dan berhasil menyusup ke dalam keluarga mafia Bonanno selama lebih dari 5 tahun. Operasinya menghasilkan 200+ dakwaan dan lebih dari 100 vonis bersalah. Setelah operasi, ia hidup dalam perlindungan saksi dengan kontrak pembunuhan $500,000 di kepalanya.
                </p>
              </div>
            </div>
          </div>
          {/* Small cards */}
          <div className="glass rounded-xl p-6 glass-hover transition-all duration-300 text-center">
            <div className="text-3xl mb-2">🎭</div>
            <p className="text-xs text-[#6a6a7a] uppercase tracking-wider">Nama Samaran</p>
            <p className="text-xl font-bold text-[#c9a84c] mt-1">Donnie Brasco</p>
            <p className="text-xs text-[#6a6a7a] mt-1">Penjual permata California</p>
          </div>
          <div className="glass rounded-xl p-6 glass-hover transition-all duration-300 text-center">
            <div className="text-3xl mb-2">⏳</div>
            <p className="text-xs text-[#6a6a7a] uppercase tracking-wider">Durasi Operasi</p>
            <p className="text-xl font-bold text-[#e74c3c] mt-1">5 Tahun 4 Bulan</p>
            <p className="text-xs text-[#6a6a7a] mt-1">Sep 1976 - Jul 1981</p>
          </div>
          <div className="glass rounded-xl p-6 glass-hover transition-all duration-300 text-center">
            <div className="text-3xl mb-2">💀</div>
            <p className="text-xs text-[#6a6a7a] uppercase tracking-wider">Kontrak Pembunuhan</p>
            <p className="text-xl font-bold text-[#8b1a1a] mt-1">$500,000</p>
            <p className="text-xs text-[#6a6a7a] mt-1">Masih aktif hingga hari ini</p>
          </div>
          <div className="glass rounded-xl p-6 glass-hover transition-all duration-300 text-center">
            <div className="text-3xl mb-2">💼</div>
            <p className="text-xs text-[#6a6a7a] uppercase tracking-wider">Kode Operasi</p>
            <p className="text-xl font-bold text-[#1e3a5f] mt-1">SUN-APPLE</p>
            <p className="text-xs text-[#6a6a7a] mt-1">FBI Classified</p>
          </div>
          <div className="glass rounded-xl p-6 glass-hover transition-all duration-300 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-xs text-[#6a6a7a] uppercase tracking-wider">Target Infiltrasi</p>
            <p className="text-xl font-bold text-[#c9a84c] mt-1">Bonanno Family</p>
            <p className="text-xs text-[#6a6a7a] mt-1">Salah satu Five Families NYC</p>
          </div>
        </div>
      </section>

      {/* ========== SECTION 3: INTERACTIVE TIMELINE ========== */}
      <section id="timeline-section" data-animate className={`py-20 px-4 md:px-12 transition-all duration-1000 ${visible['timeline-section'] ? 'animate-slideUp' : 'opacity-0 translate-y-16'}`} style={{ background: 'linear-gradient(180deg, #07070d, #10111a, #07070d)' }}>
        <h2 className="text-4xl md:text-6xl font-black text-center mb-2" style={{ color: '#e74c3c', fontFamily: 'Impact, sans-serif', letterSpacing: '0.08em' }}>6 TAHUN DI NERAKA</h2>
        <p className="text-center text-[#6a6a7a] mb-16 tracking-widest text-sm">TIMELINE INFILTRASI 1976-1981</p>
        <div className="max-w-5xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#c9a84c] via-[#e74c3c] to-[#8b1a1a] hidden md:block" />
          {TIMELINE_DATA.map((item, idx) => (
            <div key={idx} className={`relative flex items-start mb-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              {/* Node */}
              <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-3 flex items-center justify-center text-lg font-black z-10 hidden md:flex cursor-pointer" style={{ borderColor: item.color, background: '#10111a', color: item.color, animation: expandedTimeline === idx ? 'heartbeat 1s infinite' : 'none' }} onClick={() => setExpandedTimeline(expandedTimeline === idx ? null : idx)}>
                {item.year.slice(2)}
              </div>
              {/* Content card */}
              <div className={`w-full md:w-[45%] ${idx % 2 === 0 ? 'md:pr-16' : 'md:pl-16'} ${idx % 2 !== 0 ? 'md:text-right' : ''}`}>
                <div className="glass rounded-xl p-6 glass-hover transition-all duration-500 cursor-pointer relative overflow-hidden" onClick={() => setExpandedTimeline(expandedTimeline === idx ? null : idx)} style={{ borderLeft: `3px solid ${item.color}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold md:hidden" style={{ color: item.color }}>{item.year}</span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${item.color}22`, color: item.color }}>RISK: {item.risk}%</span>
                  </div>
                  <h3 className="text-xl font-black mb-2" style={{ color: item.color }}>{item.title}</h3>
                  <p className="text-sm text-[#e8e4d9] opacity-70">{item.detail.slice(0, 100)}...</p>
                  {expandedTimeline === idx && (
                    <div className="mt-4 animate-fadeIn">
                      <p className="text-sm text-[#e8e4d9] opacity-90 leading-relaxed">{item.detail}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-[#6a6a7a]">
                        <span>📍 {item.location}</span>
                        <span>|</span>
                        <span>Risk Level: {item.risk}%</span>
                      </div>
                      {/* Risk bar */}
                      <div className="mt-2 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.risk}%`, background: `linear-gradient(90deg, #c9a84c, ${item.color})` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SECTION 4: KEY PLAYERS ========== */}
      <section id="players-section" data-animate className={`py-20 px-4 md:px-12 transition-all duration-1000 ${visible['players-section'] ? 'animate-slideUp' : 'opacity-0 translate-y-16'}`}>
        <h2 className="text-4xl md:text-5xl font-black text-center mb-2" style={{ color: '#c9a84c', fontFamily: 'Impact, sans-serif' }}>PARA PEMAIN</h2>
        <p className="text-center text-[#6a6a7a] mb-8 tracking-widest text-sm">THE KEY PLAYERS IN THE SHADOW GAME</p>
        {/* Filter buttons */}
        <div className="flex justify-center gap-3 mb-12">
          {['all', 'FBI', 'Bonanno'].map(f => (
            <button key={f} className={`relative overflow-hidden px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-300 ${playerFilter === f ? 'text-[#07070d]' : 'text-[#6a6a7a] border border-[#6a6a7a33] hover:border-[#c9a84c]'}`} style={playerFilter === f ? { background: 'linear-gradient(135deg, #c9a84c, #e67e22)' } : {}} onClick={(e) => { setPlayerFilter(f); addRipple(e) }}>
              {f === 'all' ? 'SEMUA' : f}
              {ripples.map(r => <span key={r.id} className="ripple-effect" style={{ left: r.x - 10, top: r.y - 10 }} />)}
            </button>
          ))}
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player, idx) => (
            <div key={player.name} className="glass rounded-xl p-6 glass-hover transition-all duration-500 cursor-pointer group" style={{ animationDelay: `${idx * 0.1}s` }} onClick={() => { setModalContent(player); setModalOpen(true) }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-3 py-1 rounded-full" style={{ background: player.faction === 'FBI' ? '#1e3a5f33' : '#8b1a1a33', color: player.faction === 'FBI' ? '#4a9eff' : '#e74c3c' }}>{player.faction}</span>
                <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full" style={{ background: player.statusColor }} />{player.status === 'alive' ? 'Hidup' : player.status === 'dead' ? 'Tewas' : 'Dipenjara'}</span>
              </div>
              <h3 className="text-lg font-bold text-[#e8e4d9] group-hover:text-[#c9a84c] transition-colors">{player.name}</h3>
              <p className="text-[#c9a84c] text-sm italic">"{player.alias}"</p>
              <p className="text-xs text-[#6a6a7a] mt-1">{player.role}</p>
              <p className="text-sm text-[#e8e4d9] opacity-60 mt-3 line-clamp-3">{player.bio}</p>
              <div className="mt-4 text-xs text-[#4a9eff] opacity-0 group-hover:opacity-100 transition-opacity">Klik untuk detail →</div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SECTION 5: STATISTICS & CHARTS ========== */}
      <section id="stats-section" data-animate className={`py-20 px-4 md:px-12 transition-all duration-1000 ${visible['stats-section'] ? 'animate-slideUp' : 'opacity-0 translate-y-16'}`} style={{ background: 'linear-gradient(180deg, #07070d, #0d0d18, #07070d)' }}>
        <h2 className="text-4xl md:text-5xl font-black text-center mb-2" style={{ color: '#4a9eff', fontFamily: 'Impact, sans-serif' }}>IDENTITAS GANDA</h2>
        <p className="text-center text-[#6a6a7a] mb-12 tracking-widest text-sm">DAMPAK OPERASI DALAM ANGKA</p>
        {/* Counter boxes */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {STATS_DATA.map((stat, idx) => (
            <div key={idx} className="glass rounded-xl p-5 text-center glass-hover transition-all duration-300" style={{ animation: visible['stats-section'] ? 'glowPulse 2s infinite' : 'none', animationDelay: `${idx * 0.3}s` }}>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-black" style={{ color: idx < 2 ? '#c9a84c' : idx < 4 ? '#e74c3c' : '#4a9eff' }}>
                {counts[idx] || 0}{stat.suffix}
              </div>
              <div className="text-xs text-[#6a6a7a] mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Charts grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Area Chart - Risk vs Trust */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-sm font-bold text-[#c9a84c] mb-4 tracking-wider">RISK vs TRUST LEVEL</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={RISK_CHART_DATA}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#e74c3c" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="trustGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                <XAxis dataKey="year" stroke="#6a6a7a" fontSize={11} />
                <YAxis stroke="#6a6a7a" fontSize={11} />
                <Tooltip contentStyle={{ background: '#10111a', border: '1px solid #c9a84c33', borderRadius: 8, color: '#e8e4d9' }} />
                <Area type="monotone" dataKey="risk" stroke="#e74c3c" fill="url(#riskGrad)" strokeWidth={2} name="Risk" />
                <Area type="monotone" dataKey="trust" stroke="#c9a84c" fill="url(#trustGrad)" strokeWidth={2} name="Trust" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Pie Chart - Indictments by Family */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-sm font-bold text-[#c9a84c] mb-4 tracking-wider">DAKWAAN PER KELUARGA</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#10111a', border: '1px solid #c9a84c33', borderRadius: 8, color: '#e8e4d9' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {PIE_DATA.map((d, i) => <span key={i} className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full" style={{ background: d.color }} />{d.name}</span>)}
            </div>
          </div>
          {/* Radar Chart - Pistone Skills */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-sm font-bold text-[#c9a84c] mb-4 tracking-wider">SKILL PISTONE</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#1a1a2e" />
                <PolarAngleAxis dataKey="skill" stroke="#6a6a7a" fontSize={10} />
                <PolarRadiusAxis stroke="#1a1a2e" />
                <Radar name="Pistone" dataKey="A" stroke="#4a9eff" fill="#4a9eff" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ========== SECTION 6: WORLD MAP SVG ========== */}
      <section id="map-section" data-animate className={`py-20 px-4 md:px-12 transition-all duration-1000 ${visible['map-section'] ? 'animate-slideUp' : 'opacity-0 translate-y-16'}`}>
        <h2 className="text-4xl md:text-5xl font-black text-center mb-2" style={{ color: '#e74c3c', fontFamily: 'Impact, sans-serif' }}>JEJAK INFILTRASI</h2>
        <p className="text-center text-[#6a6a7a] mb-12 tracking-widest text-sm">PETA OPERASI DONNIE BRASCO</p>
        <div className="max-w-4xl mx-auto glass rounded-xl p-4 relative">
          <svg viewBox="0 0 700 500" className="w-full">
            {/* US outline simplified */}
            <path d="M80,200 L180,180 L250,170 L350,160 L420,140 L500,130 L600,150 L650,170 L660,200 L640,250 L620,300 L600,320 L560,350 L540,380 L520,400 L480,420 L400,400 L300,380 L200,350 L120,300 L80,260 Z" fill="none" stroke="#1e3a5f" strokeWidth="1.5" opacity="0.4" />
            {/* Connection lines */}
            {MAP_CONNECTIONS.map((conn, idx) => {
              const path = getConnectionPath(conn.from, conn.to)
              return (
                <g key={idx}>
                  <path d={path} fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.3" strokeDasharray="200" strokeDashoffset="200" style={{ animation: visible['map-section'] ? `dashDraw 2s ease-out ${idx * 0.3}s forwards` : 'none' }} />
                  <circle r="3" fill="#c9a84c" opacity="0.7">
                    <animateMotion dur={`${3 + idx}s`} repeatCount="indefinite" path={path} />
                  </circle>
                </g>
              )
            })}
            {/* Location nodes */}
            {MAP_LOCATIONS.map(loc => (
              <g key={loc.id} onMouseEnter={() => setHoveredCity(loc.id)} onMouseLeave={() => setHoveredCity(null)} className="cursor-pointer">
                {/* Sonar pulse */}
                <circle cx={loc.x} cy={loc.y} r={loc.importance === 'primary' ? 8 : 5} fill="none" stroke={loc.importance === 'primary' ? '#e74c3c' : '#c9a84c'} strokeWidth="1" opacity="0.5">
                  <animate attributeName="r" from={loc.importance === 'primary' ? '8' : '5'} to="25" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* Main dot */}
                <circle cx={loc.x} cy={loc.y} r={loc.importance === 'primary' ? 6 : 4} fill={loc.importance === 'primary' ? '#e74c3c' : loc.importance === 'secondary' ? '#c9a84c' : '#6a6a7a'} stroke="#07070d" strokeWidth="2" />
                {/* Label */}
                <text x={loc.x} y={loc.y - 12} textAnchor="middle" fill="#e8e4d9" fontSize="9" fontWeight="bold">{loc.name}</text>
                {/* Tooltip on hover */}
                {hoveredCity === loc.id && (
                  <g>
                    <rect x={loc.x - 90} y={loc.y + 15} width="180" height="40" rx="6" fill="#10111a" stroke="#c9a84c" strokeWidth="0.5" opacity="0.95" />
                    <text x={loc.x} y={loc.y + 32} textAnchor="middle" fill="#e8e4d9" fontSize="8">{loc.desc.slice(0, 45)}</text>
                    <text x={loc.x} y={loc.y + 44} textAnchor="middle" fill="#6a6a7a" fontSize="7">{loc.desc.slice(45)}</text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
      </section>

      {/* ========== SECTION 7: THREE CAPOS MURDER ========== */}
      <section id="capos-section" data-animate className={`py-20 px-4 md:px-12 transition-all duration-1000 ${visible['capos-section'] ? 'animate-slideUp' : 'opacity-0 translate-y-16'}`} style={{ background: 'linear-gradient(180deg, #07070d, #150808, #07070d)', animation: visible['capos-section'] ? 'heartbeat 3s infinite' : 'none' }}>
        <h2 className="text-4xl md:text-6xl font-black text-center mb-2" style={{ color: '#8b1a1a', fontFamily: 'Impact, sans-serif' }}>PEMBUNUHAN TIGA KAPTEN</h2>
        <p className="text-center text-[#6a6a7a] mb-4 tracking-widest text-sm">5 MEI 1981 // 20/20 NIGHT CLUB, BROOKLYN</p>
        <p className="text-center text-[#e74c3c] mb-12 text-sm italic">Momen paling brutal yang disaksikan Pistone dari dekat</p>
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-xl p-8 border-l-4 border-[#8b1a1a]">
            <p className="text-[#e8e4d9] leading-relaxed opacity-80">
              Pada malam 5 Mei 1981, tiga kapten Bonanno - Alphonse "Sonny Red" Indelicato, Dominick "Big Trin" Trinchera, dan Philip "Phil Lucky" Giaccone - dipanggil ke pertemuan di 20/20 Night Club, Dyker Heights, Brooklyn. Mereka tidak pernah keluar hidup-hidup.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[
                { name: 'Alphonse Indelicato', alias: 'Sonny Red', detail: 'Kapten ambisius yang ingin menggulingkan kepemimpinan. Ditembak saat memasuki ruangan.' },
                { name: 'Dominick Trinchera', alias: 'Big Trin', detail: 'Sekutu Sonny Red. Dieksekusi di tempat yang sama. Tubuh baru ditemukan bertahun-tahun kemudian.' },
                { name: 'Philip Giaccone', alias: 'Phil Lucky', detail: 'Kapten ketiga yang terjebak. Ironi namanya - tidak beruntung malam itu.' }
              ].map((v, i) => (
                <div key={i} className="p-4 rounded-lg bg-[#8b1a1a11] border border-[#8b1a1a33]">
                  <h4 className="font-bold text-[#e74c3c]">{v.name}</h4>
                  <p className="text-xs text-[#c9a84c] italic">"{v.alias}"</p>
                  <p className="text-sm text-[#e8e4d9] opacity-60 mt-2">{v.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-[#6a6a7a] italic">Pembunuhan ini diperintahkan oleh Joseph Massino untuk mengkonsolidasi kekuasaan. Pistone memiliki informasi detail tentang peristiwa ini yang kemudian menjadi bukti kunci di pengadilan.</p>
          </div>
        </div>
      </section>

      {/* ========== SECTION 8: FILM vs REALITY ========== */}
      <section id="film-section" data-animate className={`py-20 px-4 md:px-12 transition-all duration-1000 ${visible['film-section'] ? 'animate-slideUp' : 'opacity-0 translate-y-16'}`}>
        <h2 className="text-4xl md:text-5xl font-black text-center mb-2" style={{ color: '#c9a84c', fontFamily: 'Impact, sans-serif' }}>FILM vs KENYATAAN</h2>
        <p className="text-center text-[#6a6a7a] mb-4 tracking-widest text-sm">DONNIE BRASCO (1997) - Akurasi 85%</p>
        <p className="text-center mb-12"><span className="text-[#c9a84c]">Johnny Depp</span> sebagai Donnie Brasco | <span className="text-[#4a9eff]">Al Pacino</span> sebagai Lefty Ruggiero</p>
        {/* Tab buttons */}
        <div className="flex justify-center gap-4 mb-10">
          <button className={`px-8 py-3 rounded-full font-bold tracking-wider transition-all duration-300 ${filmTab === 'accurate' ? 'bg-[#2ecc71] text-[#07070d]' : 'text-[#6a6a7a] border border-[#6a6a7a33] hover:border-[#2ecc71]'}`} onClick={() => setFilmTab('accurate')}>
            AKURAT ✓
          </button>
          <button className={`px-8 py-3 rounded-full font-bold tracking-wider transition-all duration-300 ${filmTab === 'inaccurate' ? 'bg-[#e74c3c] text-white' : 'text-[#6a6a7a] border border-[#6a6a7a33] hover:border-[#e74c3c]'}`} onClick={() => setFilmTab('inaccurate')}>
            TIDAK AKURAT ✗
          </button>
        </div>
        <div className="max-w-4xl mx-auto">
          {FILM_VS_REALITY[filmTab].map((item, idx) => (
            <div key={idx} className="glass rounded-xl p-6 mb-4 glass-hover transition-all duration-300 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-[#6a6a7a] uppercase tracking-wider mb-2">🎬 Film 1997</p>
                <p className="text-[#e8e4d9]">{item.film}</p>
              </div>
              <div className="border-l border-[#6a6a7a22] pl-6">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: filmTab === 'accurate' ? '#2ecc71' : '#e74c3c' }}>{filmTab === 'accurate' ? '✓ Faktual' : '✗ Fiksi'}</p>
                <p style={{ color: filmTab === 'accurate' ? '#e8e4d9' : '#e74c3c' }}>{item.reality}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SECTION 9: AFTERMATH ========== */}
      <section id="aftermath-section" data-animate className={`py-20 px-4 md:px-12 transition-all duration-1000 ${visible['aftermath-section'] ? 'animate-slideUp' : 'opacity-0 translate-y-16'}`} style={{ background: 'linear-gradient(180deg, #07070d, #10111a, #07070d)' }}>
        <h2 className="text-4xl md:text-5xl font-black text-center mb-2" style={{ color: '#e74c3c', fontFamily: 'Impact, sans-serif' }}>AFTERMATH</h2>
        <p className="text-center text-[#6a6a7a] mb-12 tracking-widest text-sm">APA YANG TERJADI SETELAH OPERASI BERAKHIR</p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {AFTERMATH_DATA.map((item, idx) => (
            <div key={idx} className="glass rounded-xl p-6 glass-hover transition-all duration-300 relative overflow-hidden" style={{ borderLeft: `4px solid ${item.color}` }}>
              <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }} />
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-[#e8e4d9]">{item.name}</h3>
                <span className="text-xs font-black px-3 py-1 rounded-full ml-2 shrink-0" style={{ background: `${item.color}22`, color: item.color }}>{item.fate}</span>
              </div>
              <p className="text-xs text-[#c9a84c] mb-3">{item.date}</p>
              <p className="text-sm text-[#e8e4d9] opacity-70 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SECTION 10: PISTONE'S RULES ========== */}
      <section id="rules-section" data-animate className={`py-20 px-4 md:px-12 transition-all duration-1000 ${visible['rules-section'] ? 'animate-slideUp' : 'opacity-0 translate-y-16'}`}>
        <h2 className="text-4xl md:text-5xl font-black text-center mb-2" style={{ color: '#4a9eff', fontFamily: 'Impact, sans-serif' }}>PISTONE'S RULES</h2>
        <p className="text-center text-[#6a6a7a] mb-8 tracking-widest text-sm">PANDUAN HIDUP SEBAGAI AGEN UNDERCOVER</p>
        {/* 4 tab buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {Object.keys(PISTONE_RULES).map(key => (
            <button key={key} className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-wider uppercase transition-all duration-300 ${rulesTab === key ? 'text-[#07070d]' : 'text-[#6a6a7a] border border-[#6a6a7a33]'}`} style={rulesTab === key ? { background: 'linear-gradient(135deg, #4a9eff, #1e3a5f)' } : {}} onClick={() => setRulesTab(key)}>
              {key === 'survival' ? '🔒 Survival' : key === 'identity' ? '🎭 Identity' : key === 'intelligence' ? '🔍 Intel' : '🚪 Exit'}
            </button>
          ))}
        </div>
        <div className="max-w-3xl mx-auto glass rounded-xl p-8">
          <h3 className="text-lg font-bold text-[#4a9eff] mb-6 uppercase tracking-wider">{rulesTab.charAt(0).toUpperCase() + rulesTab.slice(1)} Protocol</h3>
          <div className="space-y-4">
            {PISTONE_RULES[rulesTab].map((rule, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-[#4a9eff11] border border-[#4a9eff22] hover:border-[#4a9eff55] transition-colors">
                <span className="text-[#4a9eff] font-black text-xl shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                <p className="text-[#e8e4d9] opacity-80">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 11: QUOTES CAROUSEL ========== */}
      <section id="quotes-section" data-animate className={`py-20 px-4 md:px-12 transition-all duration-1000 ${visible['quotes-section'] ? 'animate-slideUp' : 'opacity-0 translate-y-16'}`} style={{ background: 'linear-gradient(180deg, #07070d, #10111a, #07070d)' }}>
        <h2 className="text-4xl md:text-5xl font-black text-center mb-12" style={{ color: '#c9a84c', fontFamily: 'Impact, sans-serif' }}>KATA-KATA YANG MEMBEKAS</h2>
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-10 text-center relative overflow-hidden" style={{ minHeight: 180 }}>
            <div className="text-6xl text-[#c9a84c] opacity-20 absolute top-4 left-6">&quot;</div>
            <div className="text-6xl text-[#c9a84c] opacity-20 absolute bottom-4 right-6">&quot;</div>
            <p className="text-xl md:text-2xl text-[#e8e4d9] italic leading-relaxed relative z-10 animate-fadeIn" key={carouselIdx}>
              {QUOTES[carouselIdx].text}
            </p>
            <p className="mt-6 text-[#c9a84c] font-bold">— {QUOTES[carouselIdx].author}</p>
          </div>
          {/* Carousel controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button className="w-8 h-8 rounded-full border border-[#6a6a7a33] flex items-center justify-center text-[#6a6a7a] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all" onClick={() => setCarouselIdx((carouselIdx - 1 + QUOTES.length) % QUOTES.length)}>&#8249;</button>
            {QUOTES.map((_, i) => <button key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === carouselIdx ? 'bg-[#c9a84c] scale-125' : 'bg-[#6a6a7a]'}`} onClick={() => setCarouselIdx(i)} />)}
            <button className="w-8 h-8 rounded-full border border-[#6a6a7a33] flex items-center justify-center text-[#6a6a7a] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all" onClick={() => setCarouselIdx((carouselIdx + 1) % QUOTES.length)}>&#8250;</button>
          </div>
        </div>
      </section>

      {/* ========== SECTION 12: LEGACY ========== */}
      <section id="legacy-section" data-animate className={`py-20 px-4 md:px-12 transition-all duration-1000 ${visible['legacy-section'] ? 'animate-slideUp' : 'opacity-0 translate-y-16'}`}>
        <h2 className="text-4xl md:text-5xl font-black text-center mb-2" style={{ color: '#4a9eff', fontFamily: 'Impact, sans-serif' }}>WARISAN DONNIE BRASCO</h2>
        <p className="text-center text-[#6a6a7a] mb-12 tracking-widest text-sm">DAMPAK YANG MENGUBAH SEJARAH FBI DAN MAFIA SELAMANYA</p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: '📚 Buku', items: ['Donnie Brasco: My Undercover Life in the Mafia (1988)', 'The Way of the Wiseguy (2004)', 'Donnie Brasco: Unfinished Business (2007)', 'Deep Cover (2010)'], color: '#c9a84c' },
            { title: '🎬 Film & TV', items: ['Donnie Brasco (1997) - Johnny Depp, Al Pacino', 'Donnie Brasco (1996) - film dokumenter CBS', 'Berbagai dokumenter National Geographic', 'Referensi di The Sopranos dan banyak serial mafia'], color: '#4a9eff' },
            { title: '⚖ Dampak Hukum', items: ['RICO Act enforcement baru diterapkan', 'Metodologi undercover FBI diperbarui', '200+ dakwaan, 100+ vonis bersalah', 'Bonanno family hancur selama satu dekade'], color: '#e74c3c' }
          ].map((cat, idx) => (
            <div key={idx} className="glass rounded-xl p-6 glass-hover transition-all duration-300" style={{ borderTop: `3px solid ${cat.color}` }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: cat.color }}>{cat.title}</h3>
              <ul className="space-y-3">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#e8e4d9] opacity-70">
                    <span className="text-[#c9a84c] mt-0.5">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* CTA Button */}
        <div className="text-center mt-16">
          <button className="relative overflow-hidden px-10 py-4 text-lg font-black tracking-widest rounded-full transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #c9a84c, #8b1a1a)' }} onClick={(e) => { addRipple(e); setModalContent({ isQuote: true }); setModalOpen(true) }}>
            BACA LEBIH LANJUT
            {ripples.map(r => <span key={r.id} className="ripple-effect" style={{ left: r.x - 10, top: r.y - 10 }} />)}
          </button>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-12 px-4 text-center" style={{ background: '#07070d', borderTop: '1px solid #1a1a2e' }}>
        <div className="text-[#c9a84c] text-2xl font-black tracking-widest mb-2">DONNIE BRASCO</div>
        <p className="text-[#6a6a7a] text-sm">Berdasarkan kisah nyata Joseph D. Pistone, FBI, 1976-1981</p>
        <p className="text-[#6a6a7a] text-xs mt-2">Built with React + Tailwind CSS + Recharts | Deployed on Vercel</p>
        <div className="mt-6 flex justify-center gap-6 text-xs text-[#6a6a7a]">
          <span>Operation Sun-Apple</span>
          <span>|</span>
          <span>Bonanno Crime Family</span>
          <span>|</span>
          <span>200+ Indictments</span>
        </div>
      </footer>

      {/* ========== MODAL POPUP ========== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="glass rounded-2xl p-8 max-w-lg w-full animate-slideUp relative">
            <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#6a6a7a] hover:text-[#e74c3c] transition-colors" onClick={() => setModalOpen(false)}>✕</button>
            {modalContent?.isQuote ? (
              <div>
                <h3 className="text-2xl font-black text-[#c9a84c] mb-4">Tentang Operasi Ini</h3>
                <p className="text-[#e8e4d9] opacity-80 leading-relaxed">Joseph Pistone menghabiskan lebih dari 5 tahun hidupnya untuk menjadi Donnie Brasco. Operasinya - Operation Sun-Apple - adalah operasi FBI undercover terpanjang dan tersukses dalam sejarah melawan kejahatan terorganisir di Amerika Serikat.</p>
                <p className="text-[#e8e4d9] opacity-80 leading-relaxed mt-4">Pistone berhasil naik dari seorang associate yang tidak dikenal menjadi hampir seorang "made man" resmi - sebuah pencapaian yang belum pernah dilakukan agen FBI manapun sebelum atau sesudahnya.</p>
                <p className="text-[#c9a84c] text-sm mt-4 italic">"I was Donnie Brasco. For six years, I was Donnie Brasco." - Joseph Pistone</p>
              </div>
            ) : modalContent ? (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ background: modalContent.faction === 'FBI' ? '#1e3a5f' : '#8b1a1a22' }}>{modalContent.faction === 'FBI' ? '🕵️' : '👑'}</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#e8e4d9]">{modalContent.name}</h3>
                    <p className="text-[#c9a84c]">"{modalContent.alias}"</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full" style={{ background: modalContent.statusColor }} />
                      <span className="text-xs text-[#6a6a7a]">{modalContent.status === 'alive' ? 'Masih Hidup' : modalContent.status === 'dead' ? 'Sudah Meninggal' : 'Dipenjara'}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#6a6a7a] mb-1 uppercase tracking-wider">{modalContent.role}</p>
                <p className="text-sm text-[#6a6a7a] mb-4">Aktif: {modalContent.yearsActive}</p>
                <p className="text-[#e8e4d9] opacity-80 leading-relaxed">{modalContent.bio}</p>
                <div className="mt-4 px-4 py-3 rounded-lg" style={{ background: `${modalContent.statusColor}11` }}>
                  <p className="text-xs" style={{ color: modalContent.statusColor }}>Fraksi: {modalContent.faction}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

    </div>
  )
}
