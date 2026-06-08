/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Inquiry } from '../types';
import { MessageSquare, Phone, Mail, Calendar, Trash2, ShieldCheck, Clock } from 'lucide-react';

interface InquiryListProps {
  inquiries: Inquiry[];
  onRemoveInquiry: (id: string) => void;
}

export const InquiryList: React.FC<InquiryListProps> = ({
  inquiries,
  onRemoveInquiry,
}) => {
  if (inquiries.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-200">
        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h4 className="font-bold text-slate-800 text-sm">No tiene consultas pendientes</h4>
        <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto">
          Seleccione cualquier toro o vaca de nuestro catálogo y haga clic en **Consultar** para iniciar un diálogo de adquisición.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inq) => (
        <div 
          key={inq.id}
          className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-sm transition-shadow relative flex flex-col sm:flex-row justify-between gap-4"
        >
          <div className="space-y-2.5 flex-1">
            {/* Header info */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-50 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
                {inq.preferredContact}
              </span>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3" />
                {inq.date}
              </span>
            </div>

            {/* Interest target */}
            {inq.livestockTitle && (
              <p className="text-xs font-semibold text-slate-800">
                Interés en:{' '}
                <span className="text-emerald-950 font-bold underline">
                  {inq.livestockTitle}
                </span>
              </p>
            )}

            {/* Client Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
              <p className="font-medium text-slate-800">
                Contacto: <strong className="font-bold text-slate-900">{inq.clientName}</strong>
              </p>
              <p className="font-mono text-slate-500">{inq.clientPhone}</p>
              {inq.clientEmail && (
                <p className="sm:col-span-2 text-[11px] text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-300" />
                  {inq.clientEmail}
                </p>
              )}
            </div>

            {/* Original message */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-600 italic leading-relaxed font-sans">
                &ldquo;{inq.message}&rdquo;
              </p>
            </div>

            {/* Status updates */}
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-800 bg-amber-50/50 p-2 rounded-md border border-amber-100 max-w-max">
              <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
              <span>Estado: Validando disponibilidad en Corral</span>
            </div>
          </div>

          {/* Delete Action button */}
          <div className="flex sm:flex-col justify-end items-end shrink-0 pt-2 sm:pt-0">
            <button
              onClick={() => onRemoveInquiry(inq.id)}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors pointer-cursor"
              title="Cancelar Consulta"
              aria-label="Eliminar consulta"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2.5 text-slate-500 text-[11px]">
        <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
        <span>Garantizamos protección de datos. Sus datos de contacto solo serán usados para esta transacción pecuaria.</span>
      </div>
    </div>
  );
};
