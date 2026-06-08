/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Livestock } from '../types';
import { Calendar, DollarSign, MapPin, Scale, Award, ClipboardCheck } from 'lucide-react';

interface CattleCardProps {
  animal: Livestock;
  onOpenDetails: (animal: Livestock) => void;
  onOpenInquiry: (animal: Livestock) => void;
}

export const CattleCard: React.FC<CattleCardProps> = ({
  animal,
  onOpenDetails,
  onOpenInquiry,
}) => {
  // Translate breeds and purpose for beautiful UI
  const getBreedLabel = (breed: string) => {
    switch (breed) {
      case 'Angus': return 'Angus Negro';
      case 'Brahman': return 'Brahman Gris/Rojo';
      case 'Holstein': return 'Holstein Lechero';
      case 'Charolais': return 'Charolais Blanco';
      case 'Hereford': return 'Hereford Pampa';
      case 'Brangus': return 'Brangus Adaptado';
      default: return breed;
    }
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case 'Registro': return 'bg-amber-100 text-amber-950 border-amber-200';
      case 'Carne': return 'bg-rose-100 text-rose-950 border-rose-200';
      case 'Leche': return 'bg-sky-100 text-sky-950 border-sky-200';
      case 'Pie de Cría': return 'bg-emerald-100 text-emerald-950 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <article 
      id={`animal-card-${animal.id}`}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
    >
      {/* Relative image block */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 group">
        <img 
          src={animal.image} 
          alt={animal.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <span className="bg-emerald-800/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs">
            {animal.category}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shadow-xs ${getPurposeColor(animal.purpose)}`}>
            {animal.purpose}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-mono px-2 py-0.5 rounded-md backdrop-blur-xs">
          ID: {animal.tagId}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>{getBreedLabel(animal.breed)}</span>
          </div>
          <h3 className="font-bold text-lg text-slate-900 leading-snug hover:text-emerald-800 transition-colors">
            {animal.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 font-sans">
            {animal.description}
          </p>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-2 my-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-600">
              <Scale className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Peso</span>
                <span className="text-xs font-bold font-mono text-slate-800">{animal.weightKg} kg</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Edad</span>
                <span className="text-xs font-bold text-slate-800">{animal.ageMonths} meses</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
            <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="truncate">{animal.origin}</span>
          </div>
        </div>

        {/* Footer Area */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Precio S/IVA</span>
            <div className="flex items-baseline text-amber-900 font-extrabold text-xl font-mono">
              <span className="text-xs font-semibold mr-0.5">$</span>
              {animal.price.toLocaleString()}
              <span className="text-xs text-slate-400 font-sans font-normal ml-1">USD</span>
            </div>
          </div>

          <div className="flex gap-1.5">
            <button
              id={`btn-details-${animal.id}`}
              onClick={() => onOpenDetails(animal)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
              title="Ver ficha técnica"
            >
              Ficha
            </button>
            <button
              id={`btn-inquire-${animal.id}`}
              onClick={() => onOpenInquiry(animal)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Consultar</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
