/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { LIVESTOCK_ITEMS } from './data';
import { Livestock, FilterState, Inquiry, BreedType, LivestockCategory, LivestockPurpose } from './types';
import { CattleCard } from './components/CattleCard';
import { CattleModal } from './components/CattleModal';
import { InquiryList } from './components/InquiryList';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Activity, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  SlidersHorizontal,
  FileCheck,
  ChevronDown,
  Sparkles,
  MessageSquare,
  Map,
  Clock,
  ShieldCheck,
  ArrowUpDown
} from 'lucide-react';

export default function App() {
  // --- INVENTARIO STATE ---
  const [items] = useState<Livestock[]>(LIVESTOCK_ITEMS);
  const [selectedAnimal, setSelectedAnimal] = useState<Livestock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- FILTERS STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBreed, setSelectedBreed] = useState<'Todos' | BreedType>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | LivestockCategory>('Todos');
  const [selectedPurpose, setSelectedPurpose] = useState<'Todos' | LivestockPurpose>('Todos');
  const [priceMax, setPriceMax] = useState<number>(6000);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'weight-desc' | 'age-desc'>('price-desc');
  
  // Responsive mobile filters state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // --- INQUIRIES STATE (with local persistence) ---
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('ganadera_elite_inquiries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('ganadera_elite_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // --- STICKY NAV EFFECT ---
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- FILTER & SORT LOGIC ---
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesQuery = 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesBreed = selectedBreed === 'Todos' || item.breed === selectedBreed;
        const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
        const matchesPurpose = selectedPurpose === 'Todos' || item.purpose === selectedPurpose;
        const matchesPrice = item.price <= priceMax;

        return matchesQuery && matchesBreed && matchesCategory && matchesPurpose && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'weight-desc') return b.weightKg - a.weightKg;
        if (sortBy === 'age-desc') return b.ageMonths - a.ageMonths;
        return 0;
      });
  }, [items, searchQuery, selectedBreed, selectedCategory, selectedPurpose, priceMax, sortBy]);

  // --- GENERAL INQUIRY HANDLER ---
  const [generalContact, setGeneralContact] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    type: 'Inseminación' as 'Inseminación' | 'Compra General' | 'Visita' | 'Otros'
  });
  const [generalSuccess, setGeneralSuccess] = useState(false);

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generalContact.name || !generalContact.phone) {
      alert('Por favor complete su nombre y teléfono.');
      return;
    }

    const newInq: Inquiry = {
      id: Math.random().toString(36).substring(2, 9),
      clientName: generalContact.name,
      clientPhone: generalContact.phone,
      clientEmail: generalContact.email,
      message: `[Interés: ${generalContact.type}] - ${generalContact.message || 'Solicitud de asesoría técnica corporativa.'}`,
      preferredContact: 'WhatsApp',
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setInquiries(prev => [newInq, ...prev]);
    setGeneralSuccess(true);
    
    setTimeout(() => {
      setGeneralSuccess(false);
      setGeneralContact({
        name: '',
        phone: '',
        email: '',
        message: '',
        type: 'Compra General'
      });
    }, 3000);
  };

  // --- INDIVIDUAL INQUIRY ADDER ---
  const handleAddInquiry = (newInquiryData: Omit<Inquiry, 'id' | 'date'>) => {
    const newInquiry: Inquiry = {
      ...newInquiryData,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  // --- INQUIRY DELETER ---
  const handleRemoveInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  };

  // --- RE-SET FILTERS ---
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBreed('Todos');
    setSelectedCategory('Todos');
    setSelectedPurpose('Todos');
    setPriceMax(6000);
    setSortBy('price-desc');
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-800 font-sans flex flex-col justify-between" id="ganadera-app">
      {/* Top Banner Accent */}
      <div className="bg-[#19321d] text-emerald-100/90 text-[11px] py-1.5 px-4 text-center border-b border-emerald-950 flex justify-between items-center max-w-7xl mx-auto w-full rounded-b-md">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
          <span className="font-semibold tracking-wider uppercase">Venta Directa de Registro 2026</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[10px] font-medium font-mono">
          <span>📍 Rancho El Porvenir, Sector 4</span>
          <span>📞 WhatsApp: +504 9999-8888</span>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header 
        className={`w-full transition-all duration-300 z-40 ${
          isSticky 
            ? 'sticky top-0 bg-[#fafaf9]/95 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-3' 
            : 'relative bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white shadow-md">
              <span className="font-serif font-black text-lg">G</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none uppercase">
                Ganadera <span className="text-emerald-800">Élite</span>
              </h1>
              <p className="text-[10px] font-bold text-amber-800 tracking-widest uppercase">Excelente Genética</p>
            </div>
          </div>

          {/* Simple Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#ganado-header" className="hover:text-emerald-800 transition-colors">Catálogo</a>
            <a href="#solicitudes-section" className="hover:text-emerald-800 transition-colors">Consultas</a>
            <a href="#rancho-garantias" className="hover:text-emerald-800 transition-colors">Garantías</a>
            <a href="#contacto-general" className="hover:text-emerald-800 transition-colors">Contacto</a>
          </nav>

          {/* Quick Stats Indicator */}
          <div className="flex items-center gap-2">
            <a 
              href="#solicitudes-section" 
              className="bg-emerald-55 bg-emerald-50 text-emerald-900 text-xs font-bold py-2 px-3.5 rounded-full border border-emerald-100 hover:border-emerald-300 transition-all flex items-center gap-2"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-800" />
              <span>Consultas Activas</span>
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-mono flex items-center justify-center text-[10px] font-extrabold shadow-xs">
                {inquiries.length}
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden max-w-7xl mx-auto w-full md:px-4 mt-1 mb-8" id="inicio-hero">
        <div 
          className="relative min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] rounded-2xl overflow-hidden bg-cover bg-center flex items-center"
          style={{ 
            backgroundImage: "linear-gradient(rgba(17, 34, 21, 0.72), rgba(15, 23, 42, 0.55)), url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1400&q=80')" 
          }}
        >
          {/* Subtle design grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl px-6 sm:px-12 py-12 text-white">
            <span className="bg-amber-600/95 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3.5 backdrop-blur-xs">
              ★ Genética Certificada de Registro
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight text-white mb-4 leading-tight">
              Ejemplares Ganaderos de Clase Mundial y Máxima Pureza
            </h2>
            <p className="text-slate-200 text-sm sm:text-base max-w-xl font-normal leading-relaxed mb-6">
              Venta de sementales, vacas de alta producción y vaquillas de reemplazo adaptadas al pastoreo tropical o engorda intensiva. Respaldados por estrictos protocolos del Rancho El Porvenir.
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap gap-3">
              <a 
                href="#ganado-header" 
                className="bg-emerald-75 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer inline-block"
              >
                Explorar Catálogo
              </a>
              <a 
                href="#contacto-general" 
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm py-3 px-6 rounded-xl transition-all cursor-pointer backdrop-blur-xs inline-block"
              >
                Visitas & Inseminación
              </a>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 sm:px-0 mt-4 md:mt-2.5">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-800 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Línea de Sangre</span>
              <span className="text-sm font-extrabold text-slate-800">100% Registro Puro</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-800 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Plan Sanitario</span>
              <span className="text-sm font-extrabold text-slate-800">Certificación SENASA</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-800 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Alto Rendimiento</span>
              <span className="text-sm font-extrabold text-slate-800">Ganancia de Peso Optima</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-800 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Atención Post-Venta</span>
              <span className="text-sm font-extrabold text-slate-800">Asesoría Profesional</span>
            </div>
          </div>
        </div>
      </section>

      {/* INVENTORY TRACKING & CATALOG */}
      <main className="max-w-7xl mx-auto w-full px-4 mb-16" id="catalogo-completo">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-6 pb-2 border-b border-slate-200" id="ganado-header">
          <div>
            <h3 className="text-xs font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
              <span>Inventario Disponible</span>
            </h3>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Remate Especial de Registro y Crías de Élite
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 md:mt-0 font-medium">
            Se muestran <strong className="text-emerald-800 text-sm font-bold">{filteredItems.length}</strong> de {items.length} ejemplares activos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT PANEL: Filters (Desktop static, mobile toggle drawer) */}
          <aside className="lg:col-span-1 space-y-6">
            
            {/* Mobile Filter Toggle Trigger button */}
            <div className="lg:hidden flex gap-2">
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-800 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:bg-slate-50"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-800" />
                <span>{showMobileFilters ? 'Ocultar Filtros' : 'Mostrar Filtros Ganaderos'}</span>
              </button>
            </div>

            {/* Desktop and Mobile drawer filter layout */}
            <div className={`space-y-5 lg:block ${showMobileFilters ? 'block' : 'hidden'}`}>
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Filtros de Búsqueda</span>
                  </h4>
                  <button 
                    onClick={handleResetFilters}
                    className="text-[11px] text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpiar</span>
                  </button>
                </div>

                {/* Term search */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500 font-bold uppercase block">Buscar por Arete o Palabra</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ej. Semental, ANG-204"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8.5 pr-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-800 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Filter by Breed */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500 font-bold uppercase block">Raza Predominante</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Todos', 'Angus', 'Brahman', 'Holstein', 'Charolais', 'Hereford', 'Brangus'].map((breed) => (
                      <button
                        key={breed}
                        onClick={() => setSelectedBreed(breed as any)}
                        className={`py-1 px-2 text-[10px] font-bold rounded-md transition-colors cursor-pointer text-left border ${
                          selectedBreed === breed
                            ? 'bg-emerald-800 border-emerald-800 text-white'
                            : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {breed}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter by Category */}
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-500 font-bold uppercase block">Categoría de Edad/Sexo</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-hidden"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Toro">Toros (Machos Adultos)</option>
                    <option value="Vaca">Vacas (Habilidades Maternas)</option>
                    <option value="Novillo">Novillos (Engordador Jovén)</option>
                    <option value="Vaquilla">Vaquillas (Madurez Próxima)</option>
                  </select>
                </div>

                {/* Filter by Purpose */}
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-500 font-bold uppercase block">Propósito Comercial</label>
                  <select
                    value={selectedPurpose}
                    onChange={(e) => setSelectedPurpose(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-hidden"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Registro">Registro Puro (Genética)</option>
                    <option value="Carne">Carne Comercial (Rinde)</option>
                    <option value="Leche">Lección Lechera</option>
                    <option value="Pie de Cría">Pie de Cría (Hato)</option>
                  </select>
                </div>

                {/* Max Price Range Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] text-slate-500 font-bold uppercase">
                    <span>Precio Máximo</span>
                    <span className="font-mono text-amber-800 text-xs">${priceMax.toLocaleString()} USD</span>
                  </div>
                  <input 
                    type="range"
                    min={1500}
                    max={6000}
                    step={100}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-emerald-800 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono font-medium">
                    <span>$1,500</span>
                    <span>$6,000 USD</span>
                  </div>
                </div>

                {/* Sorter selection */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <label className="text-[11px] text-slate-500 font-bold uppercase block flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    <span>Ordenar Por</span>
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-hidden"
                  >
                    <option value="price-desc">Precio: Mayor a Menor</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="weight-desc">Peso Corporal: Más Pesados</option>
                    <option value="age-desc">Edad: Mayor madurez</option>
                  </select>
                </div>
              </div>

              {/* Informative Help Card */}
              <div className="bg-emerald-950 text-emerald-100 p-5 rounded-2xl border border-emerald-900 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 bg-emerald-900/30 rounded-full translate-x-4 -translate-y-4 pointer-events-none" />
                <h5 className="font-bold text-xs uppercase tracking-wider mb-1.5 text-amber-500">¿Desea Verlos En Persona?</h5>
                <p className="text-xs text-emerald-200/90 leading-relaxed font-sans">
                  Nuestros asesores agendan recorridos presenciales directos de Lunes a Sábado en San Pedro Sula y Rancho El Porvenir.
                </p>
                <a 
                  href="#contacto-general" 
                  className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-white hover:underline uppercase tracking-wider"
                >
                  <span>Agendar Recorrido</span>
                  <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* RIGHT PANEL: Cattle Grid */}
          <section className="lg:col-span-3 space-y-8">
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-xs">
                <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-extrabold text-slate-800 text-base">No hay coincidencias en el inventario</h4>
                <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                  No logramos encontrar ejemplares con los filtros seleccionados. Intente ampliar el rango de precio o cambiar la raza preferida.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2 px-4 rounded-xl mt-4 cursor-pointer"
                >
                  Restablecer Todos los Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((animal) => (
                  <CattleCard
                    key={animal.id}
                    animal={animal}
                    onOpenDetails={(item) => {
                      setSelectedAnimal(item);
                      setIsModalOpen(true);
                    }}
                    onOpenInquiry={(item) => {
                      setSelectedAnimal(item);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* TRACKING INQUIRIES BOARD ("Mi Tablero De Consultas") */}
      <section className="bg-slate-100 border-y border-slate-200 py-12" id="solicitudes-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#24522d] bg-emerald-100 px-3 py-1 rounded-full">
              ★ Monitoreo Activo
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">
              Su Tablero de Consultas e Interés Ganadero
            </h2>
            <p className="text-slate-500 text-xs sm:text-xs.2 max-w-xl mt-1 leading-relaxed">
              Consulte el estatus de sus solicitudes registradas. Sus envíos quedan almacenados localmente para que revise en tiempo real el progreso de cotización física por parte de su asesor asignado.
            </p>
          </div>

          <div className="max-w-3xl">
            <InquiryList 
              inquiries={inquiries}
              onRemoveInquiry={handleRemoveInquiry}
            />
          </div>
        </div>
      </section>

      {/* DETAILED RANCH GARANTEES */}
      <section className="bg-white py-12 px-4 border-b border-slate-200" id="rancho-garantias">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-[#143119] mb-8 text-center uppercase tracking-wider">
            Garantías Exclusivas de Ganadera Élite
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100/80">
              <span className="text-amber-800 font-extrabold text-[#7c2d12] text-xs uppercase block mb-2 tracking-widest">01. Pruebas Reproductivas</span>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Todos los sementales cuentan con pruebas físicas veterinarias de aptitud reproductiva, motilidad y viabilidad seminal validadas por laboratorios certificados antes de la entrega formal.
              </p>
            </div>
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100/80">
              <span className="text-amber-800 font-extrabold text-[#7c2d12] text-xs uppercase block mb-2 tracking-widest">02. Trazabilidad Completa</span>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Cada ejemplar hereda una carpeta técnica completa conteniendo árbol genealógico del registro nacional de ganaderos, historial de pesaje y certificados de vacunación originales.
              </p>
            </div>
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100/80">
              <span className="text-amber-800 font-extrabold text-[#7c2d12] text-xs uppercase block mb-2 tracking-widest">03. Adaptación Climática</span>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Proporcionamos acompañamiento técnico post-venta durante los primeros 45 días del traslado, recomendando dietas y esquemas de aclimatación para garantizar que no sufra estrés térmico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GENERAL INQUIRY CONTACT FORM & GENERAL SERVICES */}
      <section className="max-w-7xl mx-auto w-full px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12" id="contacto-general">
        
        {/* Left Column: services info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-amber-800 font-bold text-xs uppercase tracking-widest">Servicios Agropecuarios</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              Inseminación Artificial & Asesoramiento Técnico
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Además del remate directo de ganado en pie, Rancho El Porvenir pone a su disposición venta directa de pajillas de semen importado de sementales campeones y consultoría para diseño de pasturas.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-xs flex gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-800 shrink-0">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-slate-800">Inseminación Artificial de Registro</h5>
                <p className="text-xs text-slate-500 mt-1 leading-normal font-sans">
                  Semen congelado de toros Angus Negros y Brahman Rojos importados de Estados Unidos con altos índices de facilidad de parto.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-xs flex gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-800 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-slate-800">Comisionistas & Compra Programada</h5>
                <p className="text-xs text-slate-550 text-slate-500 mt-1 leading-normal font-sans">
                  ¿Busca lotes grandes de novillos comerciales? Nuestro equipo de compradores busca y selecciona el ganado por usted al mejor precio de subasta.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: General form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-md">
          {generalSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center h-full">
              <CheckCircle2Icon className="w-12 h-12 text-emerald-600 animate-bounce mb-3" />
              <h4 className="font-bold text-lg text-slate-900">¡Mensaje General Registrado!</h4>
              <p className="text-xs text-slate-500 mt-2 max-w-xs">
                Su solicitud de asesoría agropecuaria ya está agregada a su Tablero de Monitoreo. Un despachador de Rancho El Porvenir se comunicará pronto.
              </p>
            </div>
          ) : (
            <form onSubmit={handleGeneralSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">¿Tiene Consultas Generales?</h3>
                <p className="text-xs text-slate-550 text-slate-500 mt-1">Escríbanos para cotizar lotes masivos o semen congelado.</p>
              </div>

              {/* Service Type selecting */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-500 font-bold uppercase block">Servicio Requerido</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Inseminación', 'Compra General', 'Visita', 'Otros'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setGeneralContact(prev => ({ ...prev, type: t }))}
                      className={`py-1.5 px-1.5 rounded-lg font-bold text-[10px] text-center border cursor-pointer transition-colors ${
                        generalContact.type === t 
                          ? 'bg-[#19321d] border-[#19321d] text-white' 
                          : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-150'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Name */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase block">Su Nombre Completo *</label>
                <input 
                  type="text" 
                  required
                  value={generalContact.name}
                  onChange={(e) => setGeneralContact(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Don Manuel Zelaya"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-805"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Client Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500 font-bold uppercase block">Teléfono de Contacto *</label>
                  <input 
                    type="tel" 
                    required
                    value={generalContact.phone}
                    onChange={(e) => setGeneralContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+504 9999-0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-805"
                  />
                </div>

                {/* Client Email */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500 font-bold uppercase block">Correo Electrónico</label>
                  <input 
                    type="email" 
                    value={generalContact.email}
                    onChange={(e) => setGeneralContact(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ranch_owner@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-805"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase block">Especifique Detalles (Cantidades / Edades)</label>
                <textarea 
                  rows={3}
                  value={generalContact.message}
                  onChange={(e) => setGeneralContact(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Busco lote de 20 novillos Brahman listos para engorda, destino Choluteca..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-805"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#19321d] hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer text-xs"
              >
                Enviar Mensaje Consultivo General
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#101f13] text-slate-200 py-12 px-4 shadow-inner" id="principal-footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                <span className="font-serif font-black text-sm">G</span>
              </div>
              <h4 className="text-base font-black tracking-wider text-white uppercase">
                Ganadera <span className="text-emerald-500">Élite</span>
              </h4>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Lideres en la cría y distribución nacional de ganado bovino registrado. Contamos con tecnología reproductiva avanzada y un compromiso inquebrantable de sanidad animal desde 1998.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3.5">
            <h5 className="font-bold text-xs uppercase tracking-widest text-amber-500">Oficina & Rancho</h5>
            <div className="space-y-2 text-xs text-slate-300 font-sans">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>📍 Rancho El Porvenir, km 42 Carretera al Norte, Sector 4, Honduras.</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>📞 Oficina: +504 3333-2222 / Sabana</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>✉️ ventas@ganaderaelite.com</span>
              </p>
            </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-3.5">
            <h5 className="font-bold text-xs uppercase tracking-widest text-amber-500">Compromiso Sustentable</h5>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Apoyamos técnicas de ganadería regenerativa y pastoreo rotacional intensivo (Voisin) para captar carbono orgánico en suelo y preservar los recursos hídricos locales.
            </p>
            <div className="bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-900 flex items-center gap-2.5 text-[10px] text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-55" />
              <span>Suministro verificado 100% legal contra deforestación.</span>
            </div>
          </div>
        </div>

        {/* Footer Base */}
        <div className="max-w-7xl mx-auto pt-6 text-center text-[11px] text-slate-500 font-sans flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>&copy; {new Date().getFullYear()} Ganadera Élite - Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#ganado-header" className="hover:underline">Políticas de Compra</a>
            <a href="#rancho-garantias" className="hover:underline">Términos de Garantía</a>
          </div>
        </div>
      </footer>

      {/* INDIVIDUAL MODAL DIALOG */}
      <CattleModal
        animal={selectedAnimal}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAnimal(null);
        }}
        onSubmitInquiry={handleAddInquiry}
      />
    </div>
  );
}

// Help sub-icon fallback to avoid missing compile exports
function CheckCircle2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
