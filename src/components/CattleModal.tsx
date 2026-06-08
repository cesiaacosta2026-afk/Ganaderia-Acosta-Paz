/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Livestock, Inquiry } from '../types';
import { X, Calendar, Scale, Award, ShieldAlert, HeartPulse, User, Phone, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface CattleModalProps {
  animal: Livestock | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitInquiry: (inquiry: Omit<Inquiry, 'id' | 'date'>) => void;
}

export const CattleModal: React.FC<CattleModalProps> = ({
  animal,
  isOpen,
  onClose,
  onSubmitInquiry,
}) => {
  if (!isOpen || !animal) return null;

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [message, setMessage] = useState(`Hola, me interesa solicitar cotización y programar una visita para ver el ejemplar ${animal.title} (ID de Arete: ${animal.tagId}).`);
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Llamada' | 'Correo'>('WhatsApp');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert('Por favor complete su nombre y número telefónico.');
      return;
    }
    onSubmitInquiry({
      livestockId: animal.id,
      livestockTitle: animal.title,
      clientName,
      clientPhone,
      clientEmail,
      message,
      preferredContact,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setMessage(`Hola, me interesa solicitar cotización y programar una visita para ver el ejemplar ${animal.title} (ID de Arete: ${animal.tagId}).`);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="animal-details-modal">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal box */}
        <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden transform transition-all flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image & Genetic specs */}
          <div className="w-full md:w-1/2 bg-slate-50 flex flex-col">
            <div className="h-64 sm:h-80 md:h-full relative shrink-0">
              <img 
                src={animal.image} 
                alt={animal.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/20" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-amber-600 font-semibold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {animal.breed}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold mt-1 drop-shadow-sm leading-tight">
                  {animal.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Specs, Forms */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[80vh] md:max-h-[85vh]">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-bounce mb-4" />
                <h3 className="text-xl font-bold text-slate-900">¡Consulta Registrada!</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-xs">
                  Su solicitud ha sido enviada exitosamente a nuestros asesores ganaderos de **Rancho El Porvenir**. Le contactaremos vía <strong className="text-emerald-800">{preferredContact}</strong> a la brevedad.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Animal Specs Grid */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ficha Técnica</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Número de Arete</span>
                      <strong className="text-slate-800 font-mono text-sm">{animal.tagId}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Propósito</span>
                      <strong className="text-slate-800 text-sm">{animal.purpose}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-800 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Peso</span>
                        <strong className="text-slate-800 font-mono text-sm">{animal.weightKg} Kgs</strong>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-800 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Edad</span>
                        <strong className="text-slate-800 text-sm">{animal.ageMonths} meses</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pedigree & Rancho Origin */}
                <div className="space-y-3">
                  <div className="border-l-2 border-emerald-800 pl-3">
                    <h4 className="text-xs font-bold text-slate-500 mb-0.5">Orígen / Rancho</h4>
                    <p className="text-sm text-slate-800">{animal.origin}</p>
                  </div>
                  <div className="border-l-2 border-amber-600 pl-3">
                    <h4 className="text-xs font-bold text-slate-500 mb-0.5">Genealogía</h4>
                    <p className="text-sm text-slate-800 font-medium italic">{animal.genealogy}</p>
                  </div>
                  <div className="border-l-2 border-teal-600 pl-3">
                    <h4 className="text-xs font-bold text-slate-500 mb-0.5">Estatus Sanitario</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{animal.healthStatus}</p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-xl border border-emerald-100/55">
                  <span className="text-emerald-950 font-semibold text-sm">Valor de Inversión:</span>
                  <span className="text-2xl font-black text-emerald-900 font-mono">
                    ${animal.price.toLocaleString()} <span className="text-xs font-sans font-normal text-emerald-700">USD</span>
                  </span>
                </div>

                {/* Form starts here */}
                <form onSubmit={handleSubmit} className="border-t border-slate-100 pt-5 space-y-3.5">
                  <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-800" />
                    <span>Inicie una Consulta Formal</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 font-bold uppercase block">Nombre Completo *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Don Juan Valdez"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-800 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 font-bold uppercase block">Teléfono / WhatsApp *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input 
                          type="tel" 
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="+504 9999-8888"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-800 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold uppercase block">Correo Electrónico (Opcional)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="comprador@ejemplo.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-800 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold uppercase block">Mensaje / Pregunta Específica</label>
                    <textarea 
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-800 focus:bg-white"
                    />
                  </div>

                  {/* Preferred contact channel */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-500 font-bold uppercase block">Contacto Preferido</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['WhatsApp', 'Llamada', 'Correo'] as const).map((channel) => (
                        <button
                          key={channel}
                          type="button"
                          onClick={() => setPreferredContact(channel)}
                          className={`py-1.5 px-2 rounded-md font-semibold text-[11px] transition-colors cursor-pointer border ${
                            preferredContact === channel 
                              ? 'bg-emerald-800 border-emerald-800 text-white' 
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {channel}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form actions */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-amber-800 hover:bg-amber-900 active:bg-amber-950 text-white font-bold py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Solicitud Ganadera</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
