import React, { useState, useEffect, useRef } from 'react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

export default function App() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [scrollPct, setScrollPct] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [visible, setVisible] = useState({})
  const [hoveredCity, setHovCity] = useState(null)
  const [counts, setCounts] = useState({ years: 0, indictments: 0, stolen: 0, contracts: 0, families: 0 })
  const [modalOpen, setModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [carouselIdx, setCarousel] = useState(0)
  const observerRef = useRef(null)

  const timelineData = [
    { year: '1976', title: 'OPERATION DIMULAI', desc: 'Joseph Pistone, agen FBI berusia 37 tahun, memulai misi infiltrasi ke Bonanno crime family sebagai Donnie Brasco - penjual permata palsu dari California.', risk: 20, color: '#00d9ff' },
    { year: '1977', title: 'BERTEMU LEFTY RUGGIERO', desc: 'Pistone bertemu Benjamin Lefty Ruggiero, hitman veteran yang frustrasi tidak pernah naik jabatan. Lefty menjadi mentor dan pelindung Donnie di dunia mafia.', risk: 40, color: '#d4af37' },
    { year: '1978', title: 'MASUK INNER CIRCLE', desc: 'Donnie diterima dalam operasi pencurian senilai $1.2 juta. Ia mulai bertemu dengan boss tingkat tinggi termasuk Sonny Black dan Santo Trafficante Jr.', risk: 60, color: '#ff6b35' },
    { year: '1979', title: 'HAMPIR JADI MADE MAN', desc: 'Dominick Sonny Black Napolitano mengusulkan Donnie untuk menjadi made man resmi. FBI panik karena ini akan mengharuskan pembunuhan ritual.', risk: 85, color: '#c41e3a' },
    { year: '1980', title: 'YACHT & FLORIDA OPS', desc: 'Operasi meluas ke Florida. Donnie terlibat dalam perdagangan senjata dan narkotika. Ia merekam 200+ jam percakapan kriminal untuk bukti pengadilan.', risk: 90, color: '#8b0000' },
    { year: '1981', title: 'OPERATION SHUTDOWN', desc: 'Setelah 6 tahun, FBI menarik Pistone. 200+ mafia ditangkap. Lefty dan Sonny Black mendapat kontrak pembunuhan. Pistone hidup dalam perlindungan saksi selamanya.', risk: 100, color: '#4a0000' }
  ]

  const nycLocations = [
    { name: 'Mulberry St', x: 52, y: 18, desc: 'Little Italy - tempat Donnie pertama bertemu Lefty' },
    { name: 'Knickerbocker Ave', x: 56, y: 20, desc: 'Social club Bonanno family' },
    { name: 'Holiday Bar', x: 50, y: 22, desc: 'Markas Lefty Ruggiero' },
    { name: 'Motion Lounge', x: 58, y: 24, desc: 'Club milik Sonny Black' },
    { name: 'JFK Warehouse', x: 62, y: 22, desc: 'Operasi pencurian $1.2M' },
    { name: 'Brooklyn Navy Yard', x: 53, y: 30, desc: 'Penyimpanan senjata dan narkotika' },
    { name: 'Miami Ops', x: 52, y: 35, desc: 'Florida base: trafficking dan yacht operations' }
  ]

  const statsData = [
    { year: '1976', fbi: 95, mob: 5 },
    { year: '1977', fbi: 80, mob: 20 },
    { year: '1978', fbi: 60, mob: 40 },
    { year: '1979', fbi: 40, mob: 60 },
    { year: '1980', fbi: 25, mob: 75 },
    { year: '1981', fbi: 10, mob: 90 }
  ]

  const keyMoments = [
    { title: 'FIRST HANDSHAKE', quote: 'Forget about it - Lefty mengajarkan bahasa slang mafia', desc: 'Pertemuan pertama di bar Mulberry Street. Lefty mencurigai Donnie, tapi tertarik dengan pengetahuannya tentang permata.' },
    { title: 'THE CHRISTMAS GIFT', quote: 'You are like a son to me, Donnie', desc: 'Natal 1978, Lefty memberi Donnie cincin emas keluarganya. Pistone hampir breakdown.' },
    { title: 'YACHT INFILTRATION', quote: 'Recording 40+ bosses tanpa mereka tahu', desc: 'Operasi yacht di Florida Keys. Donnie menggunakan wire tersembunyi merekam pertemuan komisi mafia.' },
    { title: 'THE CONTRACT', quote: '$500,000 bounty untuk kepala Donnie Brasco', desc: 'Ketika identitas terungkap, mafia memasang kontrak pembunuhan. Lefty menangis ketika tahu.' },
    { title: 'FINAL GOODBYE', quote: 'I am sorry Lefty - kata terakhir yang tidak pernah didengar', desc: 'Juli 1981, Pistone ditarik dari operasi. Ia tidak bisa mengatakan goodbye.' }
  ]

  const decisionTabs = [
    { title: 'THE DILEMMA', content: [
      { label: 'Identitas Ganda', text: 'Pistone hidup sebagai 2 orang berbeda. Di rumah: suami dan ayah. Di jalanan: criminal associate.' },
      { label: 'Moral Gray Zone', text: 'Ia harus berpartisipasi dalam kejahatan untuk menjaga cover: membantu pencurian, menyaksikan pemukulan.' },
      { label: 'Psychological Toll', text: 'Setelah 6 tahun, Pistone mengaku hampir tidak ingat siapa dirinya sebenarnya.' }
    ]},
    { title: 'THE COST', content: [
      { label: 'Keluarga Hancur', text: 'Pernikahannya berakhir dengan perceraian. Anak-anaknya tidak mengenal ayahnya selama 6 tahun.' },
      { label: 'Lefty Fate', text: 'Benjamin Ruggiero ditangkap dan divonis 15 tahun. Meninggal di penjara karena kanker paru-paru.' },
      { label: 'Sonny Black Murdered', text: 'Napolitano dibunuh dengan 9 peluru oleh rekan mafianya. Tangannya dipotong sebagai simbol pengkhianatan.' },
      { label: 'Witness Protection', text: 'Pistone hidup dengan identitas baru selamanya. $500k bounty masih aktif.' }
    ]},
    { title: 'THE LEGACY', content: [
      { label: '200+ Indictments', text: 'Operasi ini menghasilkan 200+ penangkapan dari 5 crime families NYC.' },
      { label: 'RICO Revolution', text: 'Testimony Pistone membentuk dasar RICO Act prosecution terhadap boss mafia.' },
      { label: 'FBI Doctrine', text: 'Operasi ini membuat FBI menulis ulang seluruh manual undercover operations.' },
      { label: 'Cultural Impact', text: 'Buku 1988 dan film 1997 dengan Johnny Depp dan Al Pacino mengubah persepsi publik tentang mafia.' }
    ]}
  ]

  useEffect(() => {
    const handleMouse = (e) => setMouse({ x: e.clientX, y: e.clientY })
    const handleScroll = () => {
      const s = window.scrollY
      const t = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(t > 0 ? (s / t) * 100 : 0)
    }
    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('scroll', handleScroll)
    return () => { window.removeEventListener('mousemove', handleMouse); window.removeEventListener('scroll', handleScroll) }
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setVisible(p => ({ ...p, [e.target.id]: true })) })
    }, { threshold: 0.2 })
    setTimeout(() => {
      document.querySelectorAll('[data-animate]').forEach(el => observerRef.current?.observe(el))
    }, 100)
    return () => observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    if (!visible['stats-section']) return
    const targets = { years: 6, indictments: 200, stolen: 5, contracts: 500, families: 5 }
    Object.keys(targets).forEach(key => {
      let cur = 0
      const step = targets[key] / 60
      const timer = setInterval(() => {
        cur += step
        if (cur >= targets[key]) { setCounts(p => ({ ...p, [key]: targets[key] })); clearInterval(timer) }
        else setCounts(p => ({ ...p, [key]: Math.floor(cur) }))
      }, 33)
    })
  }, [visible['stats-section']])

  useEffect(() => {
    const iv = setInterval(() => setCarousel(p => (p + 1) % keyMoments.length), 5000)
    return () => clearInterval(iv)
  }, [])

  const anim = `
    @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.3);opacity:.3} }
    @keyframes float { 0%,100%{transform:translate(0,0)} 33%{transform:translate(30px,-30px)} 66%{transform:translate(-20px,20px)} }
    @keyframes rippleExpand { from{transform:scale(0);opacity:.6} to{transform:scale(4);opacity:0} }
    .gs{background:linear-gradient(135deg,#0a0a0f,#1a0a14,#0a0a0f,#0f1419);background-size:400% 400%;animation:gradientShift 8s ease infinite}
    .su{animation:slideUp .8s ease-out forwards}
    .pr{animation:pulse 2s ease-in-out infinite}
    .fp{animation:float 20s ease-in-out infinite}
  `

  return (
    <div className="bg-slate-950 text-slate-100 overflow-x-hidden">
      <style>{anim}</style>

      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 via-yellow-400 to-red-600 z-50 transition-all duration-300" style={{width:`${scrollPct}%`}} />

      {/* Cursor Glow */}
      <div className="fixed w-96 h-96 rounded-full pointer-events-none z-40 transition-all duration-200" style={{left:mouse.x-192,top:mouse.y-192,background:'radial-gradient(circle,rgba(0,217,255,0.15) 0%,transparent 70%)',filter:'blur(40px)'}} />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center gs overflow-hidden">
        {[...Array(15)].map((_,i)=>(<div key={i} className="absolute w-2 h-2 bg-yellow-400 rounded-full fp opacity-20" style={{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,animationDelay:`${i*.7}s`,animationDuration:`${15+Math.random()*10}s`}} />))}
        <div className="relative z-10 text-center px-8 max-w-7xl mx-auto">
          <h1 className="text-7xl md:text-8xl font-black mb-4 su" style={{animationDelay:'.1s'}}><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">DONNIE BRASCO</span></h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-8 su" style={{animationDelay:'.3s'}} />
          <h2 className="text-5xl md:text-6xl font-black mb-6 su" style={{animationDelay:'.5s'}}><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-red-500">JOSEPH PISTONE</span></h2>
          <p className="text-2xl md:text-3xl text-slate-300 font-light mb-6 su" style={{animationDelay:'.7s'}}>Infiltrasi FBI Terdalam dalam Sejarah Mafia Amerika</p>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed su" style={{animationDelay:'.9s'}}>Selama <span className="text-yellow-400 font-bold">6 tahun</span>, seorang agen federal hidup sebagai mobster. Ia menyaksikan pembunuhan. Ia menjadi keluarga mereka. Dan ketika operasi berakhir, <span className="text-cyan-400 font-bold">200+ mafia</span> ditangkap.</p>
          <div className="mt-20 su flex flex-col items-center gap-3" style={{animationDelay:'1.1s'}}><p className="text-slate-400 text-sm tracking-widest uppercase">Scroll untuk mengungkap kisahnya</p><div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center p-2"><div className="w-1 h-3 bg-cyan-400 rounded-full pr" /></div></div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-32 px-8 bg-gradient-to-b from-slate-950 to-slate-900 relative">
        <div className="absolute top-20 right-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto">
          <div id="tl-h" data-animate className={`text-center mb-20 ${visible['tl-h']?'su':'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-black mb-6"><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">6 TAHUN DI NERAKA</span></h2>
            <p className="text-2xl text-slate-400">Timeline Infiltrasi 1976-1981</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timelineData.map((item,idx)=>(
              <div key={idx} id={`tl-${idx}`} data-animate className={`relative backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 hover:scale-105 hover:border-yellow-400/50 transition-all duration-500 ${visible[`tl-${idx}`]?'su':'opacity-0'} ${idx===3?'lg:col-span-2':''} ${idx===5?'lg:col-span-3':''}`} style={{animationDelay:`${idx*.1}s`}}>
                <div className="absolute top-6 right-6 px-4 py-2 rounded-full text-xs font-bold" style={{backgroundColor:`rgba(${255-item.risk*2.55},${item.risk*2.55},0,0.2)`,border:`1px solid rgba(${255-item.risk*2.55},${item.risk*2.55},0,0.5)`}}>RISK: {item.risk}%</div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black" style={{backgroundColor:item.color+'20',color:item.color,border:`2px solid ${item.color}`}}>{item.year.slice(2)}</div>
                  <h3 className="text-2xl font-black" style={{color:item.color}}>{item.title}</h3>
                </div>
                <p className="text-slate-300 leading-relaxed text-lg">{item.desc}</p>
                <div className="mt-6 h-2 bg-slate-700/50 rounded-full overflow-hidden"><div className="h-full transition-all duration-1000" style={{width:visible[`tl-${idx}`]?`${item.risk}%`:'0%',backgroundColor:item.color}} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NYC MAP */}
      <section className="py-32 px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div id="map-h" data-animate className={`text-center mb-20 ${visible['map-h']?'su':'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-black mb-6"><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-yellow-400">JEJAK INFILTRASI NYC</span></h2>
          </div>
          <div id="map-c" data-animate className={`relative backdrop-blur-xl bg-slate-900/60 border-2 border-yellow-400/30 rounded-3xl p-8 md:p-12 ${visible['map-c']?'su':'opacity-0'}`}>
            <svg viewBox="0 0 100 50" className="w-full h-auto">
              <path d="M 30 5 L 70 5 L 80 15 L 80 40 L 60 45 L 40 45 L 20 40 L 20 15 Z" fill="rgba(30,41,59,0.3)" stroke="rgba(100,116,139,0.5)" strokeWidth="0.5" />
              {nycLocations.map((loc,i)=>(
                <g key={i} onMouseEnter={()=>setHovCity(loc)} onMouseLeave={()=>setHovCity(null)} className="cursor-pointer">
                  <circle cx={loc.x} cy={loc.y} r="1.2" fill="rgba(212,175,55,0.2)" stroke="#d4af37" strokeWidth="0.3" className="pr" style={{animationDelay:`${i*.3}s`}} />
                  <circle cx={loc.x} cy={loc.y} r="0.7" fill="#d4af37" />
                </g>
              ))}
            </svg>
            {hoveredCity && (
              <div className="absolute left-1/2 top-8 transform -translate-x-1/2 backdrop-blur-xl bg-slate-800/95 border-2 border-yellow-400 rounded-2xl p-6 max-w-md su z-20">
                <h4 className="text-2xl font-black text-yellow-400 mb-3">{hoveredCity.name}</h4>
                <p className="text-slate-300">{hoveredCity.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats-section" data-animate className="py-32 px-8 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 ${visible['stats-section']?'su':'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-black mb-6"><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-red-500">IDENTITAS GANDA</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-20">
            {[{k:'years',l:'Tahun Undercover',s:''},{k:'indictments',l:'Indictments',s:'+'},{k:'stolen',l:'Juta $ Barang Curian',s:'M+'},{k:'contracts',l:'Ribu $ Bounty',s:'K'},{k:'families',l:'Crime Families',s:''}].map((st,i)=>(
              <div key={st.k} className={`backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 text-center hover:border-cyan-400/50 transition-all duration-500 ${visible['stats-section']?'su':'opacity-0'}`} style={{animationDelay:`${i*.1}s`}}>
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-yellow-400 mb-3">{counts[st.k]}{st.s}</div>
                <div className="text-xs md:text-sm text-slate-400 uppercase tracking-wider">{st.l}</div>
              </div>
            ))}
          </div>
          <div className={`backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 md:p-12 ${visible['stats-section']?'su':'opacity-0'}`}>
            <h3 className="text-2xl md:text-3xl font-black text-center mb-12">Erosi Identitas: <span className="text-cyan-400">FBI</span> vs <span className="text-red-500">Mob</span></h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{backgroundColor:'rgba(15,23,42,0.95)',border:'1px solid rgba(148,163,184,0.3)',borderRadius:'12px'}} />
                <Line type="monotone" dataKey="fbi" stroke="#00d9ff" strokeWidth={3} name="FBI Identity %" dot={{r:6,fill:'#00d9ff'}} />
                <Line type="monotone" dataKey="mob" stroke="#c41e3a" strokeWidth={3} name="Mob Identity %" dot={{r:6,fill:'#c41e3a'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* CAROUSEL */}
      <section className="py-32 px-8 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div id="car-h" data-animate className={`text-center mb-20 ${visible['car-h']?'su':'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-black mb-6"><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400">MOMEN KRUSIAL</span></h2>
          </div>
          <div className="relative backdrop-blur-xl bg-slate-900/60 border-2 border-yellow-400/30 rounded-3xl overflow-hidden">
            <div className="relative h-[500px] md:h-[600px]">
              {keyMoments.map((m,i)=>(
                <div key={i} className={`absolute inset-0 transition-all duration-700 ${i===carouselIdx?'opacity-100 translate-x-0':'opacity-0 translate-x-full'}`}>
                  <div className="p-8 md:p-12 h-full flex flex-col justify-between">
                    <div>
                      <div className="text-sm text-yellow-400 font-bold mb-4 tracking-widest">MOMENT {i+1} / {keyMoments.length}</div>
                      <h3 className="text-4xl md:text-5xl font-black mb-6 text-yellow-400">{m.title}</h3>
                      <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-red-500 mb-8" />
                      <blockquote className="text-2xl md:text-3xl font-bold text-slate-300 mb-8 italic border-l-4 border-cyan-400 pl-6">{m.quote}</blockquote>
                      <p className="text-lg md:text-xl text-slate-400 leading-relaxed">{m.desc}</p>
                    </div>
                    <div className="flex justify-center gap-3 mt-8">
                      {keyMoments.map((_,di)=>(<button key={di} onClick={()=>setCarousel(di)} className={`h-3 rounded-full transition-all duration-300 ${di===carouselIdx?'bg-yellow-400 w-12':'bg-slate-600 w-3 hover:bg-slate-500'}`} />))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={()=>setCarousel((carouselIdx-1+keyMoments.length)%keyMoments.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 backdrop-blur-xl bg-slate-800/80 border border-slate-600 rounded-full flex items-center justify-center text-2xl text-yellow-400 hover:bg-slate-700 transition-all">&#8249;</button>
            <button onClick={()=>setCarousel((carouselIdx+1)%keyMoments.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 backdrop-blur-xl bg-slate-800/80 border border-slate-600 rounded-full flex items-center justify-center text-2xl text-yellow-400 hover:bg-slate-700 transition-all">&#8250;</button>
          </div>
        </div>
      </section>

      {/* DECISION THEATER */}
      <section className="py-32 px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div id="dec-h" data-animate className={`text-center mb-20 ${visible['dec-h']?'su':'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-black mb-6"><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-cyan-400">HARGA KEBENARAN</span></h2>
          </div>
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {decisionTabs.map((tab,i)=>(
              <button key={i} onClick={()=>setActiveTab(i)} className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${activeTab===i?'bg-gradient-to-r from-yellow-400 to-red-500 text-slate-900':'backdrop-blur-xl bg-slate-800/40 border border-slate-700 text-slate-300 hover:border-yellow-400/50'}`}>{tab.title}</button>
            ))}
          </div>
          <div className="backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {decisionTabs[activeTab].content.map((item,i)=>(
                <div key={i} className="backdrop-blur-xl bg-slate-900/60 border border-slate-600/50 rounded-2xl p-8 hover:border-yellow-400/50 hover:scale-105 transition-all duration-500 cursor-pointer" onClick={()=>{setModalContent(item);setModal(true)}}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center text-2xl font-black text-slate-900 shrink-0">{i+1}</div>
                    <h4 className="text-2xl font-black text-yellow-400">{item.label}</h4>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AFTERMATH */}
      <section className="py-32 px-8 bg-gradient-to-b from-slate-950 to-black relative overflow-hidden">
        {[...Array(20)].map((_,i)=>(<div key={i} className="absolute w-1 h-1 bg-yellow-400 rounded-full fp opacity-30" style={{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,animationDelay:`${i*.5}s`,animationDuration:`${20+Math.random()*15}s`}} />))}
        <div className="max-w-5xl mx-auto relative z-10">
          <div id="aft-h" data-animate className={`text-center mb-20 ${visible['aft-h']?'su':'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-black mb-6"><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-yellow-400 to-red-500">EPILOG</span></h2>
          </div>
          <div id="aft-c" data-animate className={`space-y-12 ${visible['aft-c']?'su':'opacity-0'}`}>
            <div className="backdrop-blur-xl bg-slate-900/60 border-l-4 border-cyan-400 rounded-2xl p-10">
              <blockquote className="text-2xl md:text-3xl font-bold text-slate-200 italic mb-4">Aku kehilangan 6 tahun hidupku. Kehilangan keluargaku. Kehilangan identitasku. Tapi kami menghancurkan mereka.</blockquote>
              <p className="text-lg text-cyan-400">- Joseph Pistone, 1988</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {t:'Bonanno Family',c:'text-yellow-400',d:'Kehilangan status di Komisi Mafia. Dianggap tidak kompeten karena membiarkan FBI masuk.'},
                {t:'Lefty Ruggiero',c:'text-red-400',d:'Ditangkap, divonis 15 tahun. Meninggal di penjara 1994 karena kanker paru-paru.'},
                {t:'Sonny Black',c:'text-red-400',d:'Dibunuh oleh rekan mafianya sendiri. 9 peluru. Tangannya dipotong sebagai simbol pengkhianatan.'},
                {t:'Joseph Pistone',c:'text-cyan-400',d:'Hidup dengan identitas baru selamanya. $500k bounty masih aktif. Tidak bisa menghadiri pemakaman orang tuanya.'}
              ].map((p,i)=>(
                <div key={i} className="backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
                  <h4 className={`text-2xl font-black ${p.c} mb-4`}>{p.t}</h4>
                  <p className="text-slate-300 leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
            <div className="backdrop-blur-xl bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-yellow-400/30 rounded-2xl p-12 text-center">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 mb-6">Was It Worth It?</p>
              <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">200+ mafia ditangkap. Ribuan nyawa diselamatkan. Tapi beberapa orang yang Pistone sayangi membayar dengan nyawa atau kebebasan mereka.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-8 bg-black border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-4 bg-gradient-to-r from-cyan-500 to-yellow-500 rounded-2xl mb-8">
            <p className="text-2xl font-black text-slate-900">DONNIE BRASCO</p>
          </div>
          <p className="text-slate-400 text-lg mb-4">Kisah nyata dari operasi undercover paling berbahaya dalam sejarah FBI.</p>
          <p className="text-slate-600 text-sm">Data dikompilasi dari testimony pengadilan, wawancara FBI, dan buku memoir Joseph Pistone.</p>
        </div>
      </footer>

      {/* MODAL */}
      {modalOpen && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm" onClick={()=>setModal(false)}>
          <div className="backdrop-blur-xl bg-slate-900/95 border-2 border-yellow-400 rounded-3xl p-12 max-w-2xl w-full su" onClick={e=>e.stopPropagation()}>
            <h3 className="text-3xl md:text-4xl font-black text-yellow-400 mb-6">{modalContent.label}</h3>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8">{modalContent.text}</p>
            <button onClick={()=>setModal(false)} className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-red-500 rounded-2xl font-bold text-lg text-slate-900 hover:scale-105 transition-all duration-300">Tutup</button>
          </div>
        </div>
      )}
    </div>
  )
}
