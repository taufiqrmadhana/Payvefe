import { ArrowRight, Play, Zap, Clock, TrendingDown, Shield, ChevronRight, LogIn, Menu, X, Layers, KeyRound, Coins, FileCheck } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import createGlobe from "cobe";

// Cobe Globe Component
function Globe3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelCanvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<any>(null);
  const globeStateRef = useRef<any>(null);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.3);
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const autoRotateSpeed = 0.003;

  // Currency data with labels - focusing on 4 main currencies with accurate locations
  const currencies = [
    { lat: -4.2088, lon: 201.8456, label: 'IDR', color: '#10b981' },  // Jakarta, Indonesia
    { lat: 1.3521, lon: 190.8198, label: 'SGD', color: '#06b6d4' },   // Singapore
    { lat: 38.9072, lon: -10.0369, label: 'USD', color: '#3b82f6' },  // Washington DC, USA
    { lat: 50.8503, lon: 134.3517, label: 'EUR', color: '#8b5cf6' }     // Brussels, Belgium (EU capital)
  ];

  // Function to project 3D coordinates to 2D canvas
  const projectTo2D = (lat: number, lon: number, phi: number, theta: number, width: number, height: number) => {
    const scale = Math.min(width, height) / 2 * 1.1;
    const radius = scale;
    
    // Convert lat/lon to radians
    const latRad = lat * (Math.PI / 180);
    const lonRad = lon * (Math.PI / 180);
    
    // Calculate 3D position on sphere
    // Using standard spherical coordinates
    const x = radius * Math.cos(latRad) * Math.sin(lonRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.cos(lonRad);
    
    // Apply rotation transformations
    // Rotate around Y axis (phi - horizontal rotation)
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const x1 = x * cosPhi + z * sinPhi;
    const z1 = -x * sinPhi + z * cosPhi;
    
    // Rotate around X axis (theta - vertical rotation)
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const y2 = y * cosTheta - z1 * sinTheta;
    const z2 = y * sinTheta + z1 * cosTheta;
    
    // Check if point is visible (on the front hemisphere)
    const isVisible = z2 > 0;
    
    // Orthographic projection to 2D
    const screenX = width / 2 + x1;
    const screenY = height / 2 - y2;
    
    // Calculate depth for proper layering (closer points drawn last)
    const depth = z2;
    
    return { x: screenX, y: screenY, z: depth, isVisible };
  };

  // Draw currency labels on overlay canvas
  const drawLabels = () => {
    const canvas = canvasRef.current;
    const labelCanvas = labelCanvasRef.current;
    if (!canvas || !labelCanvas) return;
    
    const ctx = labelCanvas.getContext('2d');
    if (!ctx) return;
    
    const width = labelCanvas.width;
    const height = labelCanvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate positions for all currencies
    const labelData = currencies.map((currency) => {
      const pos = projectTo2D(currency.lat, currency.lon, phiRef.current, thetaRef.current, width, height);
      return { ...currency, ...pos };
    });
    
    // Sort by depth (draw far labels first, near labels last)
    labelData.sort((a, b) => a.z - b.z);
    
    // Draw each currency label
    labelData.forEach((currency) => {
      if (currency.isVisible) {
        // Draw label with background
        ctx.font = 'bold 16px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const textWidth = ctx.measureText(currency.label).width;
        const padding = 8;
        const bgWidth = textWidth + padding * 2;
        const bgHeight = 24;
        
        // Draw background with shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        ctx.roundRect(currency.x - bgWidth / 2, currency.y - bgHeight / 2, bgWidth, bgHeight, 6);
        ctx.fill();
        
        // Reset shadow for border
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw border
        ctx.strokeStyle = currency.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw text
        ctx.fillStyle = currency.color;
        ctx.fillText(currency.label, currency.x, currency.y);
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const labelCanvas = labelCanvasRef.current;
    if (!canvas || !labelCanvas) return;

    const initGlobe = () => {
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }

      const rect = canvas.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      const devicePixelRatio = window.devicePixelRatio || 1;
      const internalWidth = size * devicePixelRatio;
      const internalHeight = size * devicePixelRatio;

      canvas.width = internalWidth;
      canvas.height = internalHeight;
      
      // Setup label canvas
      if (labelCanvas) {
        labelCanvas.width = internalWidth;
        labelCanvas.height = internalHeight;
      }

      // Currency markers with real lat/lon coordinates
      const markers = currencies.map(c => ({
        location: [c.lat, c.lon],
        size: 0.06
      }));

      globeRef.current = createGlobe(canvas, {
        devicePixelRatio: devicePixelRatio,
        width: internalWidth,
        height: internalHeight,
        phi: phiRef.current,
        theta: thetaRef.current,
        dark: 1,
        scale: 1.1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.1, 0.2, 0.4],
        markerColor: [0.23, 0.82, 0.92],
        glowColor: [0.2, 0.6, 1],
        opacity: 1,
        offset: [0, 0],
        markers: markers,
        onRender: (state) => {
          globeStateRef.current = state;

          if (!isDragging.current) {
            phiRef.current += autoRotateSpeed;
          }

          state.phi = phiRef.current;
          state.theta = thetaRef.current;

          drawLabels(); // ⬅️ tetap di sini
        },
      });
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
      canvas.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - lastMouseX.current;
        const deltaY = e.clientY - lastMouseY.current;
        const rotationSpeed = 0.005;

        phiRef.current += deltaX * rotationSpeed;
        // Invert deltaY to make it follow natural scrolling (up = up, down = down)
        thetaRef.current = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, thetaRef.current + deltaY * rotationSpeed)
        );

        lastMouseX.current = e.clientX;
        lastMouseY.current = e.clientY;
        
        // Redraw labels immediately when dragging
        drawLabels();
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
      canvas.style.cursor = "grab";
    };

    const onMouseLeave = () => {
      if (isDragging.current) {
        isDragging.current = false;
        canvas.style.cursor = "grab";
      }
    };

    initGlobe();

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const handleResize = () => {
      initGlobe();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("mouseleave", onMouseLeave);
      }
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Globe Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[600px] max-h-[600px]"
        style={{
          aspectRatio: "1",
          cursor: "grab",
        }}
      />
      
      {/* Label Overlay Canvas */}
      <canvas
        ref={labelCanvasRef}
        className="absolute w-full h-full max-w-[600px] max-h-[600px] pointer-events-none"
        style={{
          aspectRatio: "1",
        }}
      />
    </div>
  );
}

interface PayveLandingProps {
  onNavigate: (page: string) => void;
}

export function PayveLanding({ onNavigate }: PayveLandingProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Handle scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const sections = document.querySelectorAll('[data-scroll-section]');
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-slate-900/95 backdrop-blur-xl border-b border-white/20 shadow-2xl shadow-black/20' 
          : 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center transition-all duration-300">
              {/* Clean Logo Image */}
              <img 
                src="/src/public/Payve-Logo.png" 
                alt="Payve Logo" 
                className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Payve
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-cyan-400 transition-all duration-300 font-medium relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#technology" className="text-slate-300 hover:text-cyan-400 transition-all duration-300 font-medium relative group">
              Technology
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            <Button 
              onClick={() => onNavigate('authentication')}
              variant="ghost"
              className="h-9 sm:h-10 px-4 sm:px-5 text-white hover:bg-white/10 border border-white/20 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:border-cyan-400/50"
            >
              <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="hidden sm:inline">Login</span>
            </Button>
            <Button 
              onClick={() => onNavigate('authentication')}
              className="h-9 sm:h-10 px-4 sm:px-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 text-sm sm:text-base transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-105"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Sign Up</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden w-10 h-10 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center hover:bg-slate-700/50 transition-all duration-300 hover:border-cyan-400/50"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-white transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="w-5 h-5 text-white transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`sm:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="px-4 py-4 space-y-2">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 font-medium">Features</a>
            <a href="#technology" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 font-medium">Technology</a>
            <div className="pt-2 flex flex-col gap-2">
              <Button 
                onClick={() => { setMobileMenuOpen(false); onNavigate('authentication'); }}
                variant="ghost"
                className="w-full h-11 text-white hover:bg-white/10 border border-white/20 rounded-lg font-semibold justify-center transition-all duration-300"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button 
                onClick={() => { setMobileMenuOpen(false); onNavigate('authentication'); }}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 justify-center transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20 bg-slate-950">
        {/* Deep Mesh Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[60%] h-[60%] bg-cyan-500/10 blur-[140px] rounded-full" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_85%)]" />
        </div>
        
        {/* Refined Perspective Grid */}
        <div 
          className="absolute inset-0 opacity-[0.15] z-0" 
          style={{
            backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }}
        />

        {/* Cinematic Grain */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none z-0 mix-blend-overlay" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold text-cyan-400 tracking-widest uppercase bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
              Powered by Base L2 • IDRX Integrated
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Cross-Border Payroll
              <br />
              in <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">Seconds</span>, Not Days
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-xl">
              Pay global teams with crypto rails. <span className="text-cyan-400 font-semibold">90% lower fees</span>. <span className="text-cyan-400 font-semibold">Instant settlement</span>.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Button 
                onClick={() => onNavigate('authentication')}
                className="h-10 sm:h-11 px-5 sm:px-7 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm sm:text-base font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto justify-center group"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                variant="ghost"
                className="h-10 sm:h-11 px-5 sm:px-7 text-white border-2 border-white/20 hover:bg-white/10 hover:border-cyan-400/50 backdrop-blur-sm text-sm sm:text-base font-semibold rounded-xl w-full sm:w-auto justify-center transition-all duration-300 group"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-white group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right - 3D Interactive Globe */}
          <div className="relative mt-8 lg:mt-0 h-[500px] sm:h-[600px]">
            <Globe3D />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        id="stats-section"
        data-scroll-section
        className="py-12 sm:py-16 bg-slate-900 border-t border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {[
              { label: 'Processed monthly', value: '$2.4M+' },
              { label: 'Global employees', value: '1,200+' },
              { label: 'Average savings', value: '90%' }
            ].map((stat, i) => (
              <div 
                key={i} 
                className={`text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 hover:-translate-y-2 transition-all duration-500 cursor-default group ${
                  visibleSections.has('stats-section') 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: `${i * 150}ms`,
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        data-scroll-section
        className="py-20 sm:py-32 bg-slate-950 relative overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className={`text-center mb-16 sm:mb-24 transition-all duration-1000 ${
            visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Why Choose <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">Payve</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Traditional payroll systems were built for the 20th century. We built Payve for the global, on-chain future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { 
                icon: Zap, 
                title: 'Instant Settlement', 
                desc: 'Say goodbye to 3-day bank "holding" periods. Funds settle in your employees wallets in seconds.',
                color: 'cyan',
                border: 'group-hover:border-cyan-500/50'
              },
              { 
                icon: TrendingDown, 
                title: '90% Lower Fees', 
                desc: 'By skipping SWIFT and intermediary banks, we cut costs from 5-8% down to less than 0.5%.',
                color: 'blue',
                border: 'group-hover:border-blue-500/50'
              },
              { 
                icon: Shield, 
                title: 'Secure & Compliant', 
                desc: 'Smart contracts audited by industry leaders. Enterprise-grade security for your peace of mind.',
                color: 'indigo',
                border: 'group-hover:border-indigo-500/50'
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className={`group relative p-8 sm:p-10 bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 ${feature.border} transition-all duration-500 hover:-translate-y-2 cursor-default ${
                  visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: `${i * 200}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Spotlight Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]`} />
                
                <div className="relative z-10">
                  {/* Animated Icon Container */}
                  <div className="mb-8 relative">
                    <div className={`w-16 h-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:border-${feature.color}-500/30 group-hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)]`}>
                      <feature.icon className={`w-8 h-8 text-white group-hover:text-cyan-400 transition-colors`} />
                    </div>
                    {/* Pulsing ring behind icon on hover */}
                    <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse`} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-400 text-base leading-relaxed group-hover:text-slate-300 transition-colors">
                    {feature.desc}
                  </p>
                  
                  {/* Subtle bottom arrow that appears on hover */}
                  <div className="mt-6 flex items-center text-cyan-400 text-sm font-bold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    Learn more <ChevronRight className="ml-1 w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section 
        id="technology" 
        data-scroll-section
        className="py-16 sm:py-24 bg-slate-900 border-t border-b border-white/5 relative overflow-hidden"
      >
        {/* Subtle gradient overlays */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          {/* Section Header */}
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
            visibleSections.has('technology') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm text-slate-300 font-medium">Enterprise-Grade Technology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Built for Scale
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Powered by battle-tested blockchain infrastructure trusted by leading organizations worldwide.
            </p>
          </div>

          {/* Technology Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Base L2 Card */}
            <div 
              className={`group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 ${
                visibleSections.has('technology') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">Base L2</h3>
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">Ethereum</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Ethereum-level security with sub-second finality. Transaction fees under $0.01 enable cost-effective micro-payouts at any scale.
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* OnchainKit Card */}
            <div 
              className={`group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-violet-500/50 transition-all duration-500 ${
                visibleSections.has('technology') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">OnchainKit</h3>
                    <span className="px-2 py-0.5 text-xs font-medium bg-violet-500/20 text-violet-400 rounded-full">Coinbase</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Account Abstraction for frictionless onboarding. Employees access wallets via email—no seed phrases or crypto knowledge required.
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* IDRX Card */}
            <div 
              className={`group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 ${
                visibleSections.has('technology') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">IDRX Stablecoin</h3>
                    <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full">1:1 IDR</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Fully backed Indonesian Rupiah stablecoin. Instant settlement with zero conversion fees for your local workforce.
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Smart Contracts Card */}
            <div 
              className={`group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 ${
                visibleSections.has('technology') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">Audited Contracts</h3>
                    <span className="px-2 py-0.5 text-xs font-medium bg-cyan-500/20 text-cyan-400 rounded-full">OpenZeppelin</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Open-source smart contracts audited by industry leaders. Trustless, automated payroll distribution with full transparency.
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center">
            <div 
              className="flex items-center justify-center gap-2 sm:gap-3 mb-4 group cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center transition-all duration-300">
                <img 
                  src="/src/public/Payve-Logo.png" 
                  alt="Payve Logo" 
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Payve
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              Payve-ing the way for cross-border crypto payroll
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes rotateLatitude {
          from {
            transform: translateX(0) scaleX(1);
          }
          50% {
            transform: translateX(5%) scaleX(0.98);
          }
          to {
            transform: translateX(0) scaleX(1);
          }
        }

        @keyframes rotateLongitude {
          from {
            transform: translateY(0) scaleY(1);
          }
          50% {
            transform: translateY(5%) scaleY(0.98);
          }
          to {
            transform: translateY(0) scaleY(1);
          }
        }

        @keyframes rotateMeridian {
          from {
            transform: translateX(-50%) rotate(0deg);
          }
          to {
            transform: translateX(-50%) rotate(360deg);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Smooth scroll for anchor links */
        [id] {
          scroll-margin-top: 6rem;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgb(15 23 42);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgb(59 130 246), rgb(34 211 238));
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgb(37 99 235), rgb(6 182 212));
        }
      `}</style>
    </div>
  );
}