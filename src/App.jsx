import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

/* ============================================================
   GLOBAL CSS
============================================================ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap');

  :root {
    --bg:        #050505;
    --bg2:       #0a0a0a;
    --card:      #111111;
    --card2:     #161616;
    --border:    #222222;
    --border2:   #2a2a2a;
    --pink:      #FF2D78;
    --pink-soft: #ff5c95;
    --pink-dim:  rgba(255,45,120,0.10);
    --pink-glow: rgba(255,45,120,0.30);
    --white:     #f8f8f8;
    --gray:      #666;
    --gray-lt:   #999;
    --nav-h:     68px;
    --radius:    20px;
    --radius-sm: 12px;
    --radius-lg: 28px;
    --display:   'Playfair Display', Georgia, serif;
    --body:      'Inter', system-ui, sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body {
    background: var(--bg);
    color: var(--white);
    font-family: var(--body);
    line-height: 1.65;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--pink); border-radius: 2px; }
  :focus-visible { outline: 2px solid var(--pink); outline-offset: 3px; border-radius: var(--radius-sm); }
  img { display: block; max-width: 100%; height: auto; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; color: inherit; }
  a { text-decoration: none; color: inherit; }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:none} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes pulse   { 0%,100%{opacity:.3} 50%{opacity:.8} }
  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes popIn   { 0%{opacity:0;transform:scale(0.7)} 70%{transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
  @keyframes orbDrift { 0%{transform:translate(0,0)} 50%{transform:translate(40px,-30px)} 100%{transform:translate(0,0)} }

  .reveal { opacity:0; transform:translateY(28px); transition:opacity .75s ease,transform .75s ease; }
  .reveal.vis { opacity:1; transform:none; }
  .d1{transition-delay:.08s}.d2{transition-delay:.18s}.d3{transition-delay:.28s}.d4{transition-delay:.38s}

  @media(prefers-reduced-motion:reduce){
    *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
    .reveal{opacity:1!important;transform:none!important}
  }
`;

/* ============================================================
   DATA
============================================================ */
const ME = {
  name:     "Aiman Shafiq",
  role:     "Frontend Web Developer",
  phone:    "+923191080021",
  email:    "aimanmalik3447@gmail.com",
  location: "Lahore, Pakistan",
  summary:  "I'm a frontend developer from Lahore who likes making interfaces feel alive — smooth scroll reveals, little hover details, animations that actually mean something. My toolkit is React, Tailwind, GSAP, Framer Motion and Three.js, and I'm still learning something new on every project I ship.",
  education: [
    { degree:"BSIT (Affiliated)", year:"Ongoing" },
    { degree:"Intermediate",      year:"2024" },
    { degree:"Matriculation",     year:"2022" },
  ],
  skills: ["HTML5","CSS3","Bootstrap","JavaScript","GSAP","Responsive Design","Tailwind CSS","React Vite","Three.js","Framer Motion","Zustand","Git / GitHub","Debugging"],
  experience: [
    {
      title:"Front-End Development Training",
      place:"Corvit Network",
      period:"6 months",
      points:[
        "Developed responsive websites using HTML, CSS, JavaScript, DOM, Bootstrap, Tailwind, React.",
        "Implemented UI/UX improvements for better user experience and accessibility.",
        "Gained hands-on experience in debugging, testing, and cross-browser compatibility.",
        "Collaborated with a team to deliver real-world web projects on time.",
      ],
    },
  ],
  goals: [
    "Dedicated to building strong technical and professional skills through real-world experience.",
    "Enthusiastic fresher seeking opportunities to grow, innovate, and make an impact.",
  ],
};

// Contact form delivery — powered by Formspree (free, no backend needed).
// 1. Go to https://formspree.io and sign up free with aimanmalik3447@gmail.com
// 2. Create a new form, it will give you an endpoint like https://formspree.io/f/xxxxxxx
// 3. Paste that endpoint below. Until you do, the form falls back to opening
//    the visitor's email app with the message pre-filled, so it never breaks.
const FORM_ENDPOINT = "https://formspree.io/f/mdaryvrp";

const PROJECTS = [
  {
    id:1, title:"AI Resume Maker", category:"AI Tool",
    tech:["React","Zustand","jsPDF","Framer Motion"],
    desc:"Built this after getting tired of clunky resume builders — live preview as you type, drag-and-drop sections, one-click PDF export. Runs on Zustand so nothing ever feels laggy.",
    img:"https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
    color:"#130820", accent:"#7B2FFF", link:"https://airesumemaker-xi.vercel.app/",
  },
  {
    id:2, title:"Food Cart", category:"E-Commerce",
    tech:["React","Tailwind","Context API"],
    desc:"A food ordering app I designed around a moody, restaurant-at-night feel. The cart updates totals live as you add items, and category filters make browsing fast on mobile.",
    img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    color:"#1a0800", accent:"#FF6B2B", link:"https://foodcart-mu.vercel.app/",
  },
  {
    id:3, title:"Weather App", category:"Live API",
    tech:["React","OpenWeather API","Geolocation"],
    desc:"Pulls live data from the OpenWeather API and auto-detects your location, so you get an hourly forecast, humidity and wind without typing a single city name.",
    img:"https://images.unsplash.com/photo-1601134467661-3d775b999c8b?w=800&auto=format&fit=crop&q=80",
    color:"#001420", accent:"#00C6FF", link:"https://weather-5nje.vercel.app/",
  },
  {
    id:4, title:"E-Commerce Store", category:"Full Store",
    tech:["React","Tailwind","Zustand","Stripe UI"],
    desc:"A full storefront in black and pink — product grid, filters, wishlist, a slide-out cart drawer, and a checkout flow that doesn't feel like an afterthought.",
    img:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    color:"#1a000d", accent:"#FF2D78", link:"https://ecommerce-store-five-orpin.vercel.app/",
  },
  {
    id:5, title:"Job Portal", category:"Platform",
    tech:["React","Role Auth","REST API"],
    desc:"NexusHire — a job portal with separate seeker and employer logins, a match score for each application, and a clean white-and-mint look that stays out of the way.",
    img:"https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=80",
    color:"#001a10", accent:"#00FF88", link:"https://job-rjn5.vercel.app/",
  },
  {
    id:6, title:"Hospital Dashboard", category:"Healthcare",
    tech:["React","Recharts","Framer Motion","Tailwind"],
    desc:"An admin panel for hospital staff — patient analytics, appointment scheduling, bed occupancy charts and a doctor roster, all in one dashboard.",
    img:"https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&auto=format&fit=crop&q=80",
    color:"#00101a", accent:"#00D4FF", link:"https://hospital-dashboard-delta-rose.vercel.app/",
  },
];

const SKILL_BARS = [
  { name:"HTML5",                    pct:99 },
  { name:"CSS / Bootstrap",          pct:94 },
  { name:"JavaScript / DOM",         pct:90 },
  { name:"React / Vite",             pct:92 },
  { name:"Zustand",                  pct:80 },
  { name:"Tailwind CSS",             pct:95 },
  { name:"Framer Motion / Three.js", pct:82 },
  { name:"Git / GitHub",             pct:88 },
];

/* ============================================================
   HOOKS
============================================================ */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("vis"); io.disconnect(); }
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function useTypewriter(words, speed = 75, pause = 2000) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx,   setWordIdx]   = useState(0);
  const [charIdx,   setCharIdx]   = useState(0);
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplayed(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(w => (w + 1) % words.length);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

/* ============================================================
   THREE.JS SIGNATURE — sparkle trail.
   No ambient drifting, no "antigravity" float — the scene stays
   still and quiet until someone actually touches or moves over
   it, and only then does it respond: little pink-white flecks
   bloom under the finger/cursor and dissolve, like glitter
   catching light for a second. Works with mouse AND touch.
============================================================ */
function makeSparkleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  grad.addColorStop(0,    "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,200,220,0.95)");
  grad.addColorStop(0.55, "rgba(255,45,120,0.45)");
  grad.addColorStop(1,    "rgba(255,45,120,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function ThreeHeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // this effect is purely decorative motion — skip it outright

    const isSmall = mount.clientWidth < 640;
    const POOL_SIZE = isSmall ? 40 : 90;

    let width = mount.clientWidth, height = mount.clientHeight;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const texture = makeSparkleTexture();

    // A reusable pool of sparkles — cheaper than creating/destroying
    // objects every time a finger moves across the screen.
    const pool = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(0, 0, 0);
      scene.add(sprite);
      pool.push({
        sprite, material,
        active: false, life: 0, maxLife: 1,
        vx: 0, vy: 0, vz: 0,
        peakScale: 1,
      });
    }

    // Raycast the pointer onto a flat plane in front of the camera so
    // sparkles land exactly where the cursor/finger visually is.
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const pointerNDC = new THREE.Vector2();
    const hitPoint = new THREE.Vector3();

    let poolCursor = 0;
    const spawnAt = (x, y, z) => {
      for (let tries = 0; tries < POOL_SIZE; tries++) {
        const p = pool[poolCursor];
        poolCursor = (poolCursor + 1) % POOL_SIZE;
        if (!p.active) {
          p.active = true;
          p.life = 0;
          p.maxLife = 0.6 + Math.random() * 0.5;
          p.sprite.position.set(
            x + (Math.random() - 0.5) * 2.5,
            y + (Math.random() - 0.5) * 2.5,
            z
          );
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 4;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed + 1.5; // slight upward twinkle, not a fall
          p.vz = 0;
          p.peakScale = 1.6 + Math.random() * 2.4;
          return;
        }
      }
    };

    let lastSpawn = 0;
    const spawnFromEvent = (clientX, clientY) => {
      const now = performance.now();
      if (now - lastSpawn < 26) return; // throttle so a fast swipe doesn't flood the pool
      lastSpawn = now;

      pointerNDC.x = (clientX / window.innerWidth) * 2 - 1;
      pointerNDC.y = -(clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointerNDC, camera);
      raycaster.ray.intersectPlane(plane, hitPoint);
      if (hitPoint) {
        spawnAt(hitPoint.x, hitPoint.y, hitPoint.z);
        if (Math.random() > 0.5) spawnAt(hitPoint.x, hitPoint.y, hitPoint.z);
      }
    };

    const onPointerMove = e => spawnFromEvent(e.clientX, e.clientY);
    const onTouchMove = e => {
      if (e.touches && e.touches[0]) spawnFromEvent(e.touches[0].clientX, e.touches[0].clientY);
    };

    mount.addEventListener("pointermove", onPointerMove, { passive: true });
    mount.addEventListener("touchmove", onTouchMove, { passive: true });

    const clock = new THREE.Clock();
    let raf = null;

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);

      for (const p of pool) {
        if (!p.active) continue;
        p.life += dt;
        const t = p.life / p.maxLife;

        if (t >= 1) {
          p.active = false;
          p.material.opacity = 0;
          p.sprite.scale.set(0, 0, 0);
          continue;
        }

        // pop in fast, hang, fade out — the "sparkle" curve
        const easeIn  = Math.min(t / 0.15, 1);
        const easeOut = 1 - Math.max((t - 0.55) / 0.45, 0);
        const alpha = Math.min(easeIn, easeOut);
        const scale = p.peakScale * easeIn * (0.85 + 0.15 * Math.sin(t * Math.PI * 5));

        p.vx *= 0.94; p.vy *= 0.94; // friction — sparkles settle, they don't drift forever
        p.sprite.position.x += p.vx * dt;
        p.sprite.position.y += p.vy * dt;

        p.material.opacity = alpha;
        p.sprite.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      width = mount.clientWidth; height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      pool.forEach(p => p.material.dispose());
      texture.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "auto", touchAction: "none" }}
    />
  );
}

/* ============================================================
   AMBIENT ORBS — replaces over-the-top particles
============================================================ */
function AmbientOrbs() {
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
      {[
        { w:500, h:500, top:"-15%", left:"-10%", dur:"20s" },
        { w:400, h:400, top:"60%",  right:"-12%", left:"auto", dur:"28s", delay:"8s" },
        { w:300, h:300, top:"30%",  left:"50%",  dur:"24s", delay:"4s" },
      ].map((o, i) => (
        <div key={i} style={{
          position:"absolute",
          width: o.w, height: o.h,
          top: o.top, left: o.left || "auto", right: o.right || "auto",
          borderRadius:"50%",
          background:"radial-gradient(circle, rgba(255,45,120,0.07) 0%, transparent 70%)",
          animation:`orbDrift ${o.dur} ${o.delay || "0s"} ease-in-out infinite`,
          filter:"blur(40px)",
        }} />
      ))}
    </div>
  );
}

/* ============================================================
   NAVBAR
============================================================ */
function Navbar({ onCV }) {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const [active,   setActive]   = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close  = () => { setOpen(false); document.body.style.overflow = ""; };
  const toggle = () => {
    const next = !open;
    setOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  const links = ["About","Projects","Skills","Contact"];

  return (
    <>
      <header style={{
        position:"fixed", top:0, left:0, right:0, height:"var(--nav-h)",
        zIndex:1000,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 clamp(1.25rem,4vw,3rem)",
        background: scrolled
          ? "rgba(5,5,5,0.92)"
          : "rgba(5,5,5,0.4)",
        backdropFilter:"blur(20px) saturate(180%)",
        WebkitBackdropFilter:"blur(20px) saturate(180%)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition:"background .4s, border-color .4s",
      }}>
        {/* Logo */}
        <a href="#hero" style={{
          fontFamily:"var(--display)",
          fontSize:"1.4rem", fontWeight:900,
          letterSpacing:"-.03em", color:"var(--white)",
          display:"flex", alignItems:"center", gap:"2px",
        }}>
          Aiman<span style={{
            color:"var(--pink)",
            display:"inline-block",
            width:7, height:7, borderRadius:"50%",
            background:"var(--pink)",
            marginLeft:3, marginBottom:14,
            boxShadow:"0 0 10px var(--pink)",
          }}/>
        </a>

        {/* Desktop nav */}
        <nav style={{ display:"flex", gap:"clamp(.8rem,2vw,2rem)", alignItems:"center" }} className="desktop-nav">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
               style={{
                 fontSize:".78rem", fontWeight:600,
                 letterSpacing:".08em", textTransform:"uppercase",
                 color: active === l ? "var(--white)" : "var(--gray-lt)",
                 position:"relative", paddingBottom:"4px",
                 transition:"color .25s",
               }}
               onMouseEnter={e => { e.target.style.color = "var(--white)"; setActive(l); }}
               onMouseLeave={e => { e.target.style.color = "var(--gray-lt)"; setActive(""); }}>
              {l}
              <span style={{
                position:"absolute", bottom:0, left:0,
                width: active === l ? "100%" : "0%",
                height:"2px", borderRadius:"2px",
                background:"var(--pink)",
                transition:"width .25s ease",
              }}/>
            </a>
          ))}
          <button onClick={onCV} style={{
            background:"var(--pink)",
            color:"#fff",
            fontSize:".75rem", fontWeight:700,
            letterSpacing:".08em", textTransform:"uppercase",
            padding:".55rem 1.4rem",
            borderRadius:"100px",
            boxShadow:"0 4px 20px rgba(255,45,120,0.25)",
            transition:"transform .2s, box-shadow .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 30px rgba(255,45,120,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 20px rgba(255,45,120,0.25)"; }}>
            View CV ↓
          </button>
        </nav>

        {/* Hamburger */}
        <button onClick={toggle} aria-label="Toggle menu" aria-expanded={open}
          style={{ display:"none", flexDirection:"column", gap:5, width:30, padding:"4px", zIndex:1100 }}
          className="hamburger-btn">
          {[0,1,2].map(i => (
            <span key={i} style={{
              display:"block", width:"100%", height:"1.5px",
              background:"var(--white)", borderRadius:"2px",
              transition:"all .35s cubic-bezier(.23,1,.32,1)",
              transform: open
                ? i===0 ? "translateY(6.5px) rotate(45deg)"
                : i===1 ? "scaleX(0)"
                : "translateY(-6.5px) rotate(-45deg)"
                : "none",
              opacity: open && i===1 ? 0 : 1,
            }}/>
          ))}
        </button>
      </header>

      {/* Mobile overlay */}
      <div onClick={close} style={{
        position:"fixed", inset:0,
        background:"rgba(0,0,0,.7)", backdropFilter:"blur(8px)",
        zIndex:1040, opacity:open?1:0,
        pointerEvents:open?"all":"none", transition:"opacity .4s",
      }}/>

      {/* Mobile drawer */}
      <div style={{
        position:"fixed", top:0, right:0,
        width:"min(320px,85vw)", height:"100dvh",
        background:"rgba(10,10,10,.98)", backdropFilter:"blur(30px)",
        borderLeft:"1px solid var(--border)",
        borderRadius:"var(--radius) 0 0 var(--radius)",
        zIndex:1050,
        transform:open?"translateX(0)":"translateX(105%)",
        transition:"transform .4s cubic-bezier(.23,1,.32,1)",
        display:"flex", flexDirection:"column",
        padding:"calc(var(--nav-h) + 2.5rem) 2.5rem 2.5rem",
      }}>
        <nav style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {["Home",...links].map((l, i) => (
            <a key={l} href={l==="Home"?"#hero":`#${l.toLowerCase()}`}
               onClick={close}
               style={{
                 fontFamily:"var(--display)",
                 fontSize:"2rem", fontWeight:900,
                 color:"var(--gray-lt)",
                 padding:".75rem 0",
                 borderBottom:"1px solid var(--border)",
                 borderTop: i===0 ? "1px solid var(--border)" : "none",
                 letterSpacing:"-.02em",
                 transition:"color .2s, padding-left .25s",
               }}
               onMouseEnter={e => { e.target.style.color="var(--white)"; e.target.style.paddingLeft=".5rem"; }}
               onMouseLeave={e => { e.target.style.color="var(--gray-lt)"; e.target.style.paddingLeft="0"; }}>
              {l}
            </a>
          ))}
        </nav>
        <button onClick={() => { close(); onCV(); }} style={{
          marginTop:"2rem",
          background:"var(--pink)", color:"#fff",
          padding:".9rem", borderRadius:"var(--radius)",
          fontWeight:700, fontSize:".85rem",
          letterSpacing:".06em", textTransform:"uppercase",
          boxShadow:"0 4px 24px rgba(255,45,120,0.3)",
        }}>View CV</button>
        <p style={{ marginTop:"auto", fontSize:".72rem", color:"var(--gray)", letterSpacing:".06em" }}>
          Built with <span style={{ color:"var(--pink)" }}>♥</span> by Aiman
        </p>
      </div>

      <style>{`
        @media(max-width:768px){
          .desktop-nav{display:none!important}
          .hamburger-btn{display:flex!important}
        }
      `}</style>
    </>
  );
}

/* ============================================================
   HERO
============================================================ */
function Hero({ onCV }) {
  const typed = useTypewriter(
    ["React Developer","UI Craftsman","Frontend Engineer","Tailwind Expert"],
    70, 2000
  );

  return (
    <section id="hero" style={{
      minHeight:"100dvh",
      display:"flex", alignItems:"center",
      padding:"calc(var(--nav-h) + 3rem) clamp(1.25rem,5vw,4rem) 5rem",
      position:"relative", overflow:"hidden",
    }}>
      {/* grid lines */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`
          linear-gradient(rgba(255,45,120,.018) 1px,transparent 1px),
          linear-gradient(90deg,rgba(255,45,120,.018) 1px,transparent 1px)`,
        backgroundSize:"64px 64px",
      }}/>
      {/* top glow */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,45,120,.12) 0%, transparent 65%)",
      }}/>

      <ThreeHeroCanvas />
      <AmbientOrbs />

      <div style={{ position:"relative", zIndex:1, maxWidth:1100, margin:"0 auto", width:"100%" }}>
        {/* eyebrow */}
        <p style={{
          display:"inline-flex", alignItems:"center", gap:".6rem",
          fontSize:".72rem", fontWeight:700,
          letterSpacing:".2em", textTransform:"uppercase",
          color:"var(--pink)",
          background:"rgba(255,45,120,0.08)",
          border:"1px solid rgba(255,45,120,0.2)",
          borderRadius:"100px",
          padding:".4rem 1rem",
          marginBottom:"clamp(1rem,2vw,1.5rem)",
          animation:"fadeUp .8s .1s both",
        }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--pink)", display:"inline-block", boxShadow:"0 0 8px var(--pink)" }}/>
          Frontend Web Developer · Lahore, PK
        </p>

        {/* name */}
        <h1 style={{
          fontFamily:"var(--display)",
          fontSize:"clamp(3rem,10vw,8rem)",
          fontWeight:900, lineHeight:.95,
          letterSpacing:"-.04em",
          marginBottom:".5rem",
          animation:"fadeUp .9s .25s both",
        }}>
          Aiman<br/>
          <em style={{ color:"var(--pink)", fontStyle:"italic", WebkitTextStroke:"0px" }}>Shafiq</em>
        </h1>

        {/* typewriter */}
        <p style={{
          fontFamily:"var(--display)",
          fontSize:"clamp(1.1rem,2.8vw,2rem)",
          fontStyle:"italic", color:"var(--gray-lt)",
          marginBottom:"clamp(1.25rem,2.5vw,1.75rem)",
          animation:"fadeUp .9s .38s both",
          minHeight:"2.4em",
        }}>
          {typed}
          <span style={{
            display:"inline-block", width:2.5, height:"1em",
            background:"var(--pink)", marginLeft:3,
            verticalAlign:"middle",
            animation:"blink .85s steps(1) infinite",
          }}/>
        </p>

        {/* summary */}
        <p style={{
          maxWidth:520, color:"var(--gray-lt)",
          fontSize:"clamp(.875rem,1.4vw,1rem)", lineHeight:1.9,
          marginBottom:"clamp(2rem,3vw,2.5rem)",
          animation:"fadeUp .9s .52s both",
        }}>
          {ME.summary}
        </p>

        {/* CTAs */}
        <div style={{
          display:"flex", flexWrap:"wrap", gap:"1rem",
          animation:"fadeUp .9s .66s both",
        }}>
          <a href="#projects" style={{
            display:"inline-flex", alignItems:"center", gap:".5rem",
            background:"var(--pink)", color:"#fff",
            fontSize:".82rem", fontWeight:700,
            letterSpacing:".06em", textTransform:"uppercase",
            padding:".9rem 2.2rem", borderRadius:"100px", minHeight:50,
            boxShadow:"0 6px 30px rgba(255,45,120,0.35)",
            transition:"transform .2s, box-shadow .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(255,45,120,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 6px 30px rgba(255,45,120,0.35)"; }}>
            See My Work →
          </a>
          <button onClick={onCV} style={{
            display:"inline-flex", alignItems:"center", gap:".5rem",
            border:"1px solid var(--border2)", color:"var(--gray-lt)",
            fontSize:".82rem", fontWeight:600,
            letterSpacing:".06em", textTransform:"uppercase",
            padding:".9rem 2.2rem", borderRadius:"100px", minHeight:50,
            background:"rgba(255,255,255,0.03)",
            backdropFilter:"blur(8px)",
            transition:"border-color .25s, color .25s, background .25s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="var(--pink)"; e.currentTarget.style.color="var(--white)"; e.currentTarget.style.background="var(--pink-dim)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.color="var(--gray-lt)"; e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}>
            View CV ↓
          </button>
        </div>

        {/* stats */}
        <div style={{
          display:"flex", flexWrap:"wrap", gap:"clamp(1.5rem,4vw,3rem)",
          marginTop:"clamp(3rem,5vw,4.5rem)",
          paddingTop:"clamp(1.5rem,3vw,2rem)",
          borderTop:"1px solid var(--border)",
          animation:"fadeUp .9s .85s both",
        }}>
          {[["6+","Projects Built"],["1+","Year Training"],["8+","Tech Skills"]].map(([n,l], i) => (
            <div key={l} style={{ animation:`popIn .6s ${1.05 + i*.15}s both` }}>
              <div style={{
                fontFamily:"var(--display)",
                fontSize:"clamp(2rem,4.5vw,3.2rem)",
                fontWeight:900, lineHeight:1,
                letterSpacing:"-.04em",
              }}>
                {n.replace("+","")}<span style={{ color:"var(--pink)" }}>+</span>
              </div>
              <div style={{
                fontSize:".68rem", fontWeight:600,
                letterSpacing:".14em", textTransform:"uppercase",
                color:"var(--gray)", marginTop:".3rem",
              }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* scroll hint */}
      <div style={{
        position:"absolute", bottom:"2rem", left:"50%",
        transform:"translateX(-50%)",
        display:"flex", flexDirection:"column", alignItems:"center", gap:".5rem",
        fontSize:".6rem", letterSpacing:".18em", textTransform:"uppercase",
        color:"var(--gray)", animation:"fadeIn 1.2s 2s both",
      }}>
        Scroll
        <span style={{
          width:1, height:32,
          background:"linear-gradient(to bottom,var(--gray),transparent)",
          animation:"pulse 2s ease-in-out infinite",
        }}/>
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT
============================================================ */
function About() {
  const r1 = useReveal(), r2 = useReveal();

  return (
    <section id="about" style={{
      background:"var(--bg2)",
      padding:"clamp(5rem,10vw,10rem) clamp(1.25rem,5vw,4rem)",
    }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,400px),1fr))",
          gap:"clamp(2.5rem,6vw,6rem)",
          alignItems:"center",
        }}>
          {/* Avatar */}
          <div ref={r1} className="reveal" style={{
            position:"relative", maxWidth:380, margin:"0 auto", width:"100%",
          }}>
            <div style={{
              width:"100%", aspectRatio:"3/4",
              borderRadius:"var(--radius-lg)", overflow:"hidden",
              border:"1px solid var(--border2)",
              boxShadow:"0 40px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,45,120,.12)",
              position:"relative",
            }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                alt="Aiman Shafiq"
                style={{
                  width:"100%", height:"100%",
                  objectFit:"cover", objectPosition:"top",
                  display:"block",
                }}
              />
              <div style={{
                position:"absolute", inset:0,
                background:"linear-gradient(to top, rgba(0,0,0,.7) 0%, rgba(255,45,120,.06) 60%, transparent 100%)",
                pointerEvents:"none",
              }}/>
              <div style={{
                position:"absolute", bottom:0, left:0, right:0,
                padding:"1rem 1.25rem",
                textAlign:"center",
              }}>
                <span style={{
                  fontSize:".65rem", fontWeight:700,
                  letterSpacing:".16em", textTransform:"uppercase",
                  color:"var(--pink)",
                  background:"rgba(255,45,120,0.12)",
                  border:"1px solid rgba(255,45,120,0.3)",
                  borderRadius:"100px", padding:".3rem .9rem",
                }}>
                  Frontend Developer
                </span>
              </div>
            </div>

            {/* decorative ring */}
            <div style={{
              position:"absolute",
              inset:"-12px",
              border:"1px solid rgba(255,45,120,.18)",
              borderRadius:"calc(var(--radius-lg) + 12px)",
              pointerEvents:"none", zIndex:-1,
            }}/>

            {/* available badge */}
            <div style={{
              position:"absolute", bottom:"-14px", right:"-14px",
              background:"var(--pink)", color:"#fff",
              fontSize:".68rem", fontWeight:800,
              letterSpacing:".1em", textTransform:"uppercase",
              padding:".5rem 1.1rem",
              borderRadius:"var(--radius-sm)",
              boxShadow:"0 6px 20px rgba(255,45,120,0.4)",
              border:"3px solid var(--bg2)",
            }}>
              ✦ Open to Work
            </div>
          </div>

          {/* Text */}
          <div ref={r2} className="reveal d2">
            <p style={{
              display:"inline-flex", alignItems:"center", gap:".5rem",
              fontSize:".72rem", fontWeight:700,
              letterSpacing:".18em", textTransform:"uppercase",
              color:"var(--pink)", marginBottom:".75rem",
            }}>
              <span style={{ width:16, height:1.5, background:"var(--pink)", display:"inline-block", borderRadius:1 }}/>
              About Me
            </p>

            <h2 style={{
              fontFamily:"var(--display)",
              fontSize:"clamp(1.8rem,4.5vw,3.2rem)",
              fontWeight:900, lineHeight:1.05,
              letterSpacing:"-.03em", marginBottom:"1.25rem",
            }}>
              Developer with an<br/>
              <em style={{ color:"var(--pink)", fontStyle:"italic" }}>eye for craft</em>
            </h2>

            <p style={{
              color:"var(--gray-lt)", lineHeight:1.9,
              marginBottom:".9rem",
              fontSize:"clamp(.875rem,1.4vw,.975rem)",
            }}>{ME.summary}</p>
            <p style={{
              color:"var(--gray-lt)", lineHeight:1.9,
              marginBottom:"1.75rem",
              fontSize:"clamp(.875rem,1.4vw,.975rem)",
            }}>
              Trained at <strong style={{ color:"var(--white)" }}>Corvit Network</strong>, currently pursuing <strong style={{ color:"var(--white)" }}>BSIT</strong>. I build things that feel as premium as they look — mobile-first, pixel-perfect, and buttery smooth.
            </p>

            {/* contact chips */}
            <div style={{
              display:"flex", flexDirection:"column", gap:".6rem",
              marginBottom:"1.75rem",
            }}>
              {[
                { icon:"📞", label:ME.phone },
                { icon:"✉",  label:ME.email },
                { icon:"📍", label:ME.location },
              ].map(c => (
                <div key={c.label} style={{
                  display:"flex", alignItems:"center", gap:".85rem",
                  background:"var(--card)", border:"1px solid var(--border)",
                  borderRadius:"var(--radius-sm)",
                  padding:".7rem 1.1rem",
                  fontSize:".82rem", color:"var(--gray-lt)",
                  transition:"border-color .2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor="var(--border2)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}>
                  <span style={{ fontSize:"1rem" }}>{c.icon}</span>
                  {c.label}
                </div>
              ))}
            </div>

            {/* skill chips */}
            <div style={{
              display:"flex", flexWrap:"wrap", gap:".45rem",
            }}>
              {ME.skills.map(s => (
                <div key={s} style={{
                  display:"flex", alignItems:"center", gap:".4rem",
                  background:"var(--card)", border:"1px solid var(--border)",
                  borderRadius:"100px",
                  padding:".4rem .85rem",
                  fontSize:".74rem", fontWeight:500, color:"var(--gray-lt)",
                  transition:"border-color .2s, color .2s, background .2s",
                  cursor:"default",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,45,120,.4)"; e.currentTarget.style.color="var(--white)"; e.currentTarget.style.background="var(--pink-dim)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--gray-lt)"; e.currentTarget.style.background="var(--card)"; }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:"var(--pink)", flexShrink:0, boxShadow:"0 0 5px var(--pink)" }}/>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PROJECT CARD
============================================================ */
function ProjectCard({ p, delay }) {
  const ref = useReveal();
  const [hov, setHov]       = useState(false);
  const [imgErr, setImgErr] = useState(false);

  return (
    <article
      ref={ref}
      className={`reveal d${delay}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:"var(--card)",
        border:`1px solid ${hov ? p.accent + "44" : "var(--border)"}`,
        borderRadius:"var(--radius)",
        overflow:"hidden",
        display:"flex", flexDirection:"column",
        transition:"border-color .3s, transform .35s cubic-bezier(.23,1,.32,1), box-shadow .35s",
        transform: hov ? "translateY(-8px)" : "none",
        boxShadow: hov
          ? `0 32px 64px rgba(0,0,0,.7), 0 0 0 1px ${p.accent}22, 0 0 40px ${p.accent}12`
          : "0 4px 20px rgba(0,0,0,.3)",
        willChange:"transform",
      }}>

      {/* image */}
      <div style={{
        position:"relative", aspectRatio:"16/10",
        overflow:"hidden",
        background:p.color,
        borderRadius:"var(--radius) var(--radius) 0 0",
      }}>
        {!imgErr ? (
          <img
            src={p.img} alt={p.title}
            style={{
              width:"100%", height:"100%", objectFit:"cover",
              transform: hov ? "scale(1.07)" : "scale(1)",
              transition:"transform .6s ease",
              opacity: .88,
            }}
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        ) : (
          <div style={{
            width:"100%", height:"100%",
            display:"flex", alignItems:"center", justifyContent:"center",
            background:p.color,
            fontFamily:"var(--display)", fontSize:"1.6rem",
            fontWeight:900, color:`${p.accent}55`,
            letterSpacing:"-.04em",
          }}>
            {p.title}
          </div>
        )}
        <div style={{
          position:"absolute", inset:0,
          background:`linear-gradient(to top, ${p.color}dd 0%, transparent 55%)`,
        }}/>

        {/* hover launch icon */}
        <div style={{
          position:"absolute", inset:0,
          background:"rgba(0,0,0,.4)",
          display:"flex", alignItems:"center", justifyContent:"center",
          opacity: hov ? 1 : 0,
          transition:"opacity .3s",
          backdropFilter: hov ? "blur(2px)" : "none",
        }}>
          <div style={{
            width:52, height:52, borderRadius:"50%",
            border:`2px solid ${p.accent}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            background:`${p.accent}20`, fontSize:"1.3rem",
            boxShadow:`0 0 24px ${p.accent}40`,
            animation: hov ? "float 2s ease-in-out infinite" : "none",
          }}>↗</div>
        </div>

        {/* category pill */}
        <div style={{
          position:"absolute", top:".85rem", left:".85rem",
          background:`${p.accent}18`,
          border:`1px solid ${p.accent}44`,
          backdropFilter:"blur(8px)",
          color:p.accent,
          fontSize:".62rem", fontWeight:700,
          letterSpacing:".12em", textTransform:"uppercase",
          padding:".28rem .7rem",
          borderRadius:"100px",
        }}>{p.category}</div>
      </div>

      {/* body */}
      <div style={{
        padding:"clamp(.9rem,2vw,1.4rem)",
        flex:1, display:"flex", flexDirection:"column", gap:".6rem",
      }}>
        <h3 style={{
          fontFamily:"var(--display)",
          fontSize:"clamp(1.05rem,1.8vw,1.3rem)",
          fontWeight:800, color:"var(--white)",
          lineHeight:1.2,
        }}>{p.title}</h3>
        <p style={{
          fontSize:".82rem", color:"var(--gray)",
          lineHeight:1.7, flex:1,
        }}>{p.desc}</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:".35rem", marginTop:".2rem" }}>
          {p.tech.map(t => (
            <span key={t} style={{
              fontSize:".66rem", padding:".22rem .6rem",
              border:"1px solid var(--border)",
              borderRadius:"100px",
              color:"var(--gray)", fontWeight:500,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* footer */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:".8rem clamp(.9rem,2vw,1.4rem)",
        borderTop:"1px solid var(--border)",
      }}>
        <a href={p.link} style={{
          fontSize:".72rem", fontWeight:700,
          letterSpacing:".08em", textTransform:"uppercase",
          color:p.accent,
          display:"flex", alignItems:"center", gap:".35rem",
          transition:"gap .2s",
        }}
          onMouseEnter={e => e.currentTarget.style.gap=".65rem"}
          onMouseLeave={e => e.currentTarget.style.gap=".35rem"}>
          View Project →
        </a>
        <span style={{ fontSize:".62rem", color:"var(--gray)" }}>2026</span>
      </div>
    </article>
  );
}

/* ============================================================
   PROJECTS SECTION
============================================================ */
function Projects() {
  const r = useReveal();
  return (
    <section id="projects" style={{
      background:"var(--bg)",
      padding:"clamp(5rem,10vw,10rem) clamp(1.25rem,5vw,4rem)",
    }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div ref={r} className="reveal" style={{ marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
          <p style={{
            display:"inline-flex", alignItems:"center", gap:".5rem",
            fontSize:".72rem", fontWeight:700,
            letterSpacing:".18em", textTransform:"uppercase",
            color:"var(--pink)", marginBottom:".75rem",
          }}>
            <span style={{ width:16, height:1.5, background:"var(--pink)", display:"inline-block", borderRadius:1 }}/>
            Selected Work
          </p>
          <h2 style={{
            fontFamily:"var(--display)",
            fontSize:"clamp(1.8rem,4.5vw,3.2rem)",
            fontWeight:900, lineHeight:1.05,
            letterSpacing:"-.03em",
          }}>
            Projects built with <em style={{ color:"var(--pink)", fontStyle:"italic" }}>intention</em>
          </h2>
        </div>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,320px),1fr))",
          gap:"clamp(1rem,2.5vw,1.75rem)",
        }}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} p={p} delay={(i % 3) + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SKILLS + EXPERIENCE
============================================================ */
function Skills() {
  const rH    = useReveal();
  const rBars = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = rBars.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnimated(true); io.disconnect(); }
    }, { threshold:.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="skills" style={{
      background:"var(--bg2)",
      padding:"clamp(5rem,10vw,10rem) clamp(1.25rem,5vw,4rem)",
    }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div ref={rH} className="reveal" style={{ marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
          <p style={{
            display:"inline-flex", alignItems:"center", gap:".5rem",
            fontSize:".72rem", fontWeight:700,
            letterSpacing:".18em", textTransform:"uppercase",
            color:"var(--pink)", marginBottom:".75rem",
          }}>
            <span style={{ width:16, height:1.5, background:"var(--pink)", display:"inline-block", borderRadius:1 }}/>
            Expertise
          </p>
          <h2 style={{
            fontFamily:"var(--display)",
            fontSize:"clamp(1.8rem,4.5vw,3.2rem)",
            fontWeight:900, lineHeight:1.05,
            letterSpacing:"-.03em",
          }}>
            Skills &amp; <em style={{ color:"var(--pink)", fontStyle:"italic" }}>Experience</em>
          </h2>
        </div>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,400px),1fr))",
          gap:"clamp(2.5rem,5vw,5rem)",
        }}>
          {/* skill bars */}
          <div ref={rBars} style={{
            background:"var(--card)",
            border:"1px solid var(--border)",
            borderRadius:"var(--radius)",
            padding:"clamp(1.5rem,3vw,2.25rem)",
          }}>
            <div style={{
              fontSize:".68rem", fontWeight:700,
              letterSpacing:".16em", textTransform:"uppercase",
              color:"var(--gray)", marginBottom:"1.5rem",
              paddingBottom:".75rem", borderBottom:"1px solid var(--border)",
            }}>Technical Skills</div>

            <div style={{ display:"flex", flexDirection:"column", gap:"1.2rem" }}>
              {SKILL_BARS.map(s => (
                <div key={s.name}>
                  <div style={{
                    display:"flex", justifyContent:"space-between",
                    fontSize:".82rem", fontWeight:500,
                    color:"var(--gray-lt)", marginBottom:".45rem",
                  }}>
                    <span>{s.name}</span>
                    <span style={{ color:"var(--gray)", fontVariantNumeric:"tabular-nums" }}>{s.pct}%</span>
                  </div>
                  <div style={{
                    width:"100%", height:4,
                    background:"rgba(255,255,255,0.06)",
                    borderRadius:"100px", overflow:"hidden",
                  }}>
                    <div style={{
                      height:"100%",
                      background:"linear-gradient(90deg, var(--pink) 0%, #ff6ba3 100%)",
                      borderRadius:"100px",
                      width: animated ? `${s.pct}%` : "0%",
                      transition:"width 1.4s cubic-bezier(.23,1,.32,1)",
                      boxShadow: animated ? "0 0 12px rgba(255,45,120,0.4)" : "none",
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* timeline */}
          <div>
            <div style={{
              fontSize:".68rem", fontWeight:700,
              letterSpacing:".16em", textTransform:"uppercase",
              color:"var(--gray)", marginBottom:"1.5rem",
              paddingBottom:".75rem", borderBottom:"1px solid var(--border)",
            }}>Journey</div>

            <div style={{ position:"relative" }}>
              {/* vertical line */}
              <div style={{
                position:"absolute", left:8, top:8, bottom:0, width:1,
                background:"linear-gradient(to bottom, var(--pink) 0%, rgba(255,45,120,.1) 80%, transparent 100%)",
              }}/>

              {/* experience */}
              {ME.experience.map((ex, i) => (
                <div key={i} style={{
                  paddingLeft:"2.5rem",
                  paddingBottom:"2rem",
                  position:"relative",
                }}>
                  <div style={{
                    position:"absolute", left:0, top:7,
                    width:17, height:17, borderRadius:"50%",
                    border:"2px solid var(--pink)",
                    background:"var(--pink)",
                    boxShadow:"0 0 12px rgba(255,45,120,0.4)",
                  }}/>
                  <div style={{
                    fontSize:".65rem", fontWeight:700,
                    letterSpacing:".12em", textTransform:"uppercase",
                    color:"var(--pink)", marginBottom:".2rem",
                  }}>{ex.period}</div>
                  <div style={{
                    fontFamily:"var(--display)",
                    fontSize:"clamp(.95rem,1.8vw,1.15rem)",
                    fontWeight:800, color:"var(--white)", marginBottom:".2rem",
                  }}>{ex.title}</div>
                  <div style={{ fontSize:".8rem", color:"var(--gray)", marginBottom:".6rem" }}>{ex.place}</div>
                  <ul style={{ paddingLeft:"1rem", display:"flex", flexDirection:"column", gap:".4rem" }}>
                    {ex.points.slice(0, 3).map((pt, j) => (
                      <li key={j} style={{
                        fontSize:".79rem", color:"var(--gray-lt)",
                        lineHeight:1.65, listStyle:"disc",
                      }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* education */}
              <div style={{
                paddingLeft:"2.5rem",
                paddingBottom:"2rem",
                position:"relative",
              }}>
                <div style={{
                  position:"absolute", left:0, top:7,
                  width:17, height:17, borderRadius:"50%",
                  border:"2px solid var(--pink)",
                  background:"var(--bg2)",
                }}/>
                <div style={{
                  fontSize:".65rem", fontWeight:700,
                  letterSpacing:".12em", textTransform:"uppercase",
                  color:"var(--pink)", marginBottom:".2rem",
                }}>Education</div>
                <div style={{
                  fontFamily:"var(--display)",
                  fontSize:"clamp(.95rem,1.8vw,1.15rem)",
                  fontWeight:800, color:"var(--white)", marginBottom:".75rem",
                }}>Academic Background</div>
                {ME.education.map((e, i) => (
                  <div key={i} style={{
                    display:"flex", justifyContent:"space-between",
                    fontSize:".81rem", color:"var(--gray-lt)",
                    padding:".38rem 0",
                    borderBottom: i < ME.education.length-1 ? "1px solid var(--border)" : "none",
                  }}>
                    <span>{e.degree}</span>
                    <span style={{ color:"var(--gray)" }}>{e.year}</span>
                  </div>
                ))}
              </div>

              {/* goals */}
              <div style={{ paddingLeft:"2.5rem", position:"relative" }}>
                <div style={{
                  position:"absolute", left:0, top:7,
                  width:17, height:17, borderRadius:"50%",
                  border:"2px solid var(--border2)",
                  background:"var(--bg2)",
                }}/>
                <div style={{
                  fontSize:".65rem", fontWeight:700,
                  letterSpacing:".12em", textTransform:"uppercase",
                  color:"var(--gray)", marginBottom:".35rem",
                }}>Goals</div>
                {ME.goals.map((g, i) => (
                  <p key={i} style={{
                    fontSize:".8rem", color:"var(--gray-lt)",
                    lineHeight:1.7, marginBottom:".45rem",
                  }}>— {g}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CONTACT
============================================================ */
function Contact() {
  const rL = useReveal(), rR = useReveal();
  const [form, setForm]       = useState({ name:"", email:"", msg:"" });
  const [status, setStatus]   = useState("idle"); // idle | sending | sent | error
  const [errMsg, setErrMsg]   = useState("");

  const openMailFallback = () => {
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
    const body = encodeURIComponent(`${form.msg}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${ME.email}?subject=${subject}&body=${body}`;
  };

  const handle = async () => {
    if (!form.name || !form.email || !form.msg || status === "sending") return;

    // Endpoint not set up yet — go straight to the mail app instead of failing silently.
    if (!FORM_ENDPOINT.includes("formspree.io/f/") || FORM_ENDPOINT.endsWith("YOUR_FORM_ID")) {
      openMailFallback();
      return;
    }

    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.msg,
          _subject: `New portfolio message from ${form.name}`,
        }),
      });

      if (res.ok) {
        setStatus("sent");
        setTimeout(() => { setStatus("idle"); setForm({ name:"", email:"", msg:"" }); }, 3600);
      } else {
        throw new Error("Delivery failed");
      }
    } catch {
      setStatus("error");
      setErrMsg("Couldn't reach the mail server — opening your email app instead.");
      setTimeout(openMailFallback, 900);
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const inputBase = {
    background:"var(--card2)",
    border:"1px solid var(--border)",
    borderRadius:"var(--radius-sm)",
    color:"var(--white)",
    fontFamily:"var(--body)",
    fontSize:".88rem",
    padding:".875rem 1.1rem",
    outline:"none",
    width:"100%",
    minHeight:50,
    transition:"border-color .2s, box-shadow .2s",
  };

  return (
    <section id="contact" style={{
      background:"var(--bg)",
      padding:"clamp(5rem,10vw,10rem) clamp(1.25rem,5vw,4rem)",
    }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,360px),1fr))",
          gap:"clamp(2.5rem,6vw,5.5rem)",
          alignItems:"start",
        }}>
          {/* left */}
          <div ref={rL} className="reveal">
            <p style={{
              display:"inline-flex", alignItems:"center", gap:".5rem",
              fontSize:".72rem", fontWeight:700,
              letterSpacing:".18em", textTransform:"uppercase",
              color:"var(--pink)", marginBottom:".75rem",
            }}>
              <span style={{ width:16, height:1.5, background:"var(--pink)", display:"inline-block", borderRadius:1 }}/>
              Get in Touch
            </p>
            <h2 style={{
              fontFamily:"var(--display)",
              fontSize:"clamp(1.8rem,4.5vw,3.2rem)",
              fontWeight:900, lineHeight:1.05,
              letterSpacing:"-.03em", marginBottom:"1.1rem",
            }}>
              Let's build something <em style={{ color:"var(--pink)", fontStyle:"italic" }}>beautiful</em>
            </h2>
            <p style={{
              color:"var(--gray-lt)",
              fontSize:"clamp(.875rem,1.4vw,.975rem)",
              lineHeight:1.9, marginBottom:"2rem",
            }}>
              Available for freelance projects, internships, and collaborations. I love working on ambitious projects with people who care about craft.
            </p>

            {[
              { icon:"✉",  label:"Email",    val:ME.email,    href:`mailto:${ME.email}` },
              { icon:"📞", label:"Phone",    val:ME.phone,    href:`tel:${ME.phone}` },
              { icon:"📍", label:"Location", val:ME.location, href:"#" },
            ].map(c => (
              <a key={c.label} href={c.href} style={{
                display:"flex", alignItems:"center", gap:"1rem",
                background:"var(--card)", border:"1px solid var(--border)",
                borderRadius:"var(--radius-sm)",
                padding:"1rem 1.25rem", marginBottom:".75rem",
                transition:"border-color .25s, transform .25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,45,120,.35)"; e.currentTarget.style.transform="translateX(5px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; }}>
                <span style={{
                  fontSize:"1.1rem", width:36, height:36,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background:"var(--pink-dim)",
                  border:"1px solid rgba(255,45,120,.2)",
                  borderRadius:10, flexShrink:0,
                }}>{c.icon}</span>
                <div>
                  <span style={{
                    fontSize:".62rem", fontWeight:700,
                    letterSpacing:".12em", textTransform:"uppercase",
                    color:"var(--gray)", display:"block",
                  }}>{c.label}</span>
                  <span style={{ fontSize:".84rem", color:"var(--gray-lt)" }}>{c.val}</span>
                </div>
              </a>
            ))}
          </div>

          {/* right: form */}
          <div ref={rR} className="reveal d2">
            {status === "sent" ? (
              <div style={{
                textAlign:"center", padding:"3.5rem 2rem",
                background:"var(--card)",
                border:"1px solid rgba(255,45,120,.25)",
                borderRadius:"var(--radius)",
                boxShadow:"0 24px 60px rgba(0,0,0,.4)",
              }}>
                <div style={{ fontSize:"3rem", marginBottom:"1.25rem" }}>🌸</div>
                <p style={{
                  fontFamily:"var(--display)", fontSize:"1.5rem",
                  fontWeight:700, color:"var(--white)", marginBottom:".6rem",
                }}>Message sent!</p>
                <p style={{ color:"var(--gray-lt)", fontSize:".9rem", lineHeight:1.7 }}>
                  Landed straight in my inbox at <strong style={{ color:"var(--pink)" }}>{ME.email}</strong> — I'll reply soon.
                </p>
              </div>
            ) : (
              <div style={{
                background:"var(--card)",
                border:"1px solid var(--border)",
                borderRadius:"var(--radius)",
                padding:"clamp(1.5rem,3vw,2.25rem)",
                display:"flex", flexDirection:"column", gap:"1.1rem",
              }}>
                {[
                  { id:"name",  label:"Your Name",    type:"text",  ph:"e.g. Sara Ahmed", val:form.name },
                  { id:"email", label:"Email Address", type:"email", ph:ME.email,          val:form.email },
                ].map(f => (
                  <div key={f.id}>
                    <label htmlFor={f.id} style={{
                      fontSize:".68rem", fontWeight:700,
                      letterSpacing:".1em", textTransform:"uppercase",
                      color:"var(--gray)", display:"block", marginBottom:".45rem",
                    }}>{f.label}</label>
                    <input
                      id={f.id} type={f.type} placeholder={f.ph} value={f.val}
                      onChange={e => setForm(p => ({ ...p, [f.id]:e.target.value }))}
                      style={inputBase}
                      onFocus={e => { e.target.style.borderColor="var(--pink)"; e.target.style.boxShadow="0 0 0 3px rgba(255,45,120,.1)"; }}
                      onBlur={e  => { e.target.style.borderColor="var(--border)"; e.target.style.boxShadow="none"; }}
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="msg" style={{
                    fontSize:".68rem", fontWeight:700,
                    letterSpacing:".1em", textTransform:"uppercase",
                    color:"var(--gray)", display:"block", marginBottom:".45rem",
                  }}>Message</label>
                  <textarea
                    id="msg"
                    placeholder="Tell me about your project…"
                    value={form.msg}
                    rows={5}
                    onChange={e => setForm(p => ({ ...p, msg:e.target.value }))}
                    style={{ ...inputBase, minHeight:130, resize:"vertical" }}
                    onFocus={e => { e.target.style.borderColor="var(--pink)"; e.target.style.boxShadow="0 0 0 3px rgba(255,45,120,.1)"; }}
                    onBlur={e  => { e.target.style.borderColor="var(--border)"; e.target.style.boxShadow="none"; }}
                  />
                </div>
                <button
                  onClick={handle}
                  disabled={status === "sending"}
                  style={{
                    background:"var(--pink)", color:"#fff",
                    fontSize:".82rem", fontWeight:700,
                    letterSpacing:".08em", textTransform:"uppercase",
                    padding:"1rem 2.5rem",
                    borderRadius:"100px", minHeight:52,
                    width:"100%",
                    opacity: status === "sending" ? .7 : 1,
                    cursor: status === "sending" ? "wait" : "pointer",
                    boxShadow:"0 6px 24px rgba(255,45,120,0.3)",
                    transition:"transform .2s, box-shadow .2s, opacity .2s",
                  }}
                  onMouseEnter={e => { if (status!=="sending") { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(255,45,120,0.5)"; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 6px 24px rgba(255,45,120,0.3)"; }}>
                  {status === "sending" ? "Sending…" : "Send Message →"}
                </button>
                {status === "error" && (
                  <p style={{ fontSize:".76rem", color:"var(--pink-soft)", textAlign:"center", marginTop:"-.4rem" }}>
                    {errMsg}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CV MODAL
============================================================ */
function CVModal({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const Section = ({ title, children }) => (
    <div style={{ marginBottom:"1.5rem" }}>
      <div style={{
        fontSize:".62rem", fontWeight:800,
        letterSpacing:".18em", textTransform:"uppercase",
        color:"var(--gray)", marginBottom:".7rem",
        paddingBottom:".45rem", borderBottom:"1px solid var(--border)",
      }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:"fixed", inset:0,
        background:"rgba(0,0,0,.85)", backdropFilter:"blur(16px)",
        zIndex:2000,
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"1.25rem",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "all" : "none",
        transition:"opacity .35s",
      }}>

      <div style={{
        background:"var(--card)",
        border:"1px solid var(--border2)",
        borderRadius:"var(--radius-lg)",
        width:"100%", maxWidth:600,
        maxHeight:"calc(100dvh - 2.5rem)", overflowY:"auto",
        transform: open ? "none" : "translateY(24px) scale(.96)",
        transition:"transform .4s cubic-bezier(.23,1,.32,1)",
        display:"flex", flexDirection:"column",
        boxShadow:"0 40px 80px rgba(0,0,0,.8)",
      }}>
        {/* header */}
        <div style={{
          background:"linear-gradient(135deg, #111 0%, #0e0e0e 100%)",
          padding:"2rem 2rem 1.75rem",
          borderBottom:"1px solid var(--border)",
          borderRadius:"var(--radius-lg) var(--radius-lg) 0 0",
          position:"relative", flexShrink:0,
        }}>
          <button onClick={onClose} style={{
            position:"absolute", top:"1.25rem", right:"1.25rem",
            width:36, height:36, borderRadius:"50%",
            border:"1px solid var(--border2)", color:"var(--gray-lt)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:".9rem",
            transition:"border-color .2s, background .2s, transform .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="var(--pink)"; e.currentTarget.style.background="var(--pink-dim)"; e.currentTarget.style.transform="rotate(90deg)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.background="none"; e.currentTarget.style.transform="none"; }}>
            ✕
          </button>
          <p style={{
            fontSize:".62rem", fontWeight:700,
            letterSpacing:".18em", textTransform:"uppercase",
            color:"var(--pink)", marginBottom:".5rem",
          }}>Curriculum Vitae</p>
          <h2 style={{
            fontFamily:"var(--display)",
            fontSize:"clamp(1.4rem,3vw,2.1rem)",
            fontWeight:900, letterSpacing:"-.025em",
          }}>AIMAN SHAFIQ</h2>
          <p style={{ color:"var(--gray)", fontSize:".85rem", marginTop:".3rem" }}>Frontend Web Developer</p>
        </div>

        {/* content */}
        <div style={{ padding:"1.75rem 2rem", flex:1 }}>
          {/* contact */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:".5rem", marginBottom:"1.75rem" }}>
            {[{icon:"📞",val:ME.phone},{icon:"✉",val:ME.email},{icon:"📍",val:ME.location}].map(c => (
              <div key={c.val} style={{
                display:"flex", alignItems:"center", gap:".45rem",
                background:"var(--bg2)", border:"1px solid var(--border)",
                borderRadius:"var(--radius-sm)",
                padding:".4rem .8rem",
                fontSize:".74rem", color:"var(--gray-lt)",
              }}>
                <span>{c.icon}</span>{c.val}
              </div>
            ))}
          </div>

          <Section title="Summary">
            <p style={{ fontSize:".84rem", color:"var(--gray-lt)", lineHeight:1.8 }}>{ME.summary}</p>
          </Section>

          <Section title="Education">
            {ME.education.map((e, i) => (
              <div key={i} style={{
                display:"flex", justifyContent:"space-between",
                fontSize:".84rem", color:"var(--gray-lt)",
                padding:".45rem 0",
                borderBottom: i < ME.education.length-1 ? "1px solid var(--border)" : "none",
              }}>
                <span>{e.degree}</span>
                <span style={{ color:"var(--gray)" }}>{e.year}</span>
              </div>
            ))}
          </Section>

          <Section title="Experience">
            {ME.experience.map((ex, i) => (
              <div key={i}>
                <div style={{ marginBottom:".6rem" }}>
                  <div style={{ fontSize:".9rem", fontWeight:700, color:"var(--white)" }}>{ex.title}</div>
                  <div style={{ fontSize:".78rem", color:"var(--pink)", marginTop:".15rem" }}>{ex.place} · {ex.period}</div>
                </div>
                <ul style={{ paddingLeft:"1.1rem" }}>
                  {ex.points.map((pt, j) => (
                    <li key={j} style={{
                      fontSize:".79rem", color:"var(--gray-lt)",
                      lineHeight:1.7, marginBottom:".35rem", listStyle:"disc",
                    }}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          <Section title="Skills">
            <div style={{ display:"flex", flexWrap:"wrap", gap:".4rem" }}>
              {ME.skills.map(s => (
                <span key={s} style={{
                  background:"var(--bg2)", border:"1px solid var(--border)",
                  borderRadius:"100px",
                  fontSize:".71rem", padding:".25rem .7rem",
                  color:"var(--gray-lt)", fontWeight:500,
                }}>{s}</span>
              ))}
            </div>
          </Section>

          <Section title="Goals">
            {ME.goals.map((g, i) => (
              <p key={i} style={{
                fontSize:".81rem", color:"var(--gray-lt)",
                lineHeight:1.75, marginBottom:".4rem",
              }}>— {g}</p>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FOOTER
============================================================ */
function Footer({ onCV }) {
  return (
    <footer style={{
      background:"var(--bg2)",
      borderTop:"1px solid var(--border)",
      padding:"1.75rem clamp(1.25rem,5vw,4rem)",
    }}>
      <div style={{
        maxWidth:1100, margin:"0 auto",
        display:"flex", alignItems:"center",
        justifyContent:"space-between",
        flexWrap:"wrap", gap:"1rem",
      }}>
        <p style={{ fontSize:".78rem", color:"var(--gray)" }}>
          © 2026 <span style={{ color:"var(--pink)" }}>Aiman Shafiq</span>.{" "}
          <span style={{ color:"var(--border2)" }}>All rights reserved.</span>
        </p>
        <div style={{ display:"flex", gap:".65rem", alignItems:"center" }}>
          {[
            { icon:"⌥", label:"GitHub",   href:"https://github.com/" },
            { icon:"◈", label:"LinkedIn", href:"https://linkedin.com/" },
            { icon:"✉", label:"Email",    href:`mailto:${ME.email}` },
          ].map(s => (
            <a key={s.label} href={s.href}
               aria-label={s.label}
               target="_blank" rel="noopener noreferrer"
               style={{
                 width:38, height:38, borderRadius:"50%",
                 border:"1px solid var(--border)",
                 display:"flex", alignItems:"center", justifyContent:"center",
                 fontSize:".88rem", color:"var(--gray-lt)",
                 transition:"border-color .2s, color .2s, background .2s, transform .2s",
               }}
               onMouseEnter={e => { e.currentTarget.style.borderColor="var(--pink)"; e.currentTarget.style.color="var(--white)"; e.currentTarget.style.background="var(--pink-dim)"; e.currentTarget.style.transform="translateY(-2px)"; }}
               onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--gray-lt)"; e.currentTarget.style.background="none"; e.currentTarget.style.transform="none"; }}>
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   APP ROOT
============================================================ */
export default function App() {
  const [cvOpen, setCVOpen] = useState(false);
  const openCV  = useCallback(() => setCVOpen(true),  []);
  const closeCV = useCallback(() => setCVOpen(false), []);

  useEffect(() => {
    const id = "aiman-global-css";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <>
      <Navbar onCV={openCV} />
      <main>
        <Hero    onCV={openCV} />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer onCV={openCV} />
      <CVModal open={cvOpen} onClose={closeCV} />
    </>
  );
}