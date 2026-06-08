/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BreedType = 'Angus' | 'Brahman' | 'Holstein' | 'Charolais' | 'Hereford' | 'Brangus';

export type LivestockPurpose = 'Registro' | 'Carne' | 'Leche' | 'Pie de Cría';

export type LivestockCategory = 'Toro' | 'Vaca' | 'Novillo' | 'Vaquilla';

export interface Livestock {
  id: string;
  title: string;
  breed: BreedType;
  category: LivestockCategory;
  ageMonths: number;
  weightKg: number;
  price: number;
  image: string;
  description: string;
  origin: string;
  genealogy: string;
  healthStatus: string;
  purpose: LivestockPurpose;
  tagId: string;
}

export interface Inquiry {
  id: string;
  livestockId?: string;
  livestockTitle?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  message: string;
  preferredContact: 'WhatsApp' | 'Llamada' | 'Correo';
  date: string;
}

export interface FilterState {
  breed: 'Todos' | BreedType;
  category: 'Todos' | LivestockCategory;
  purpose: 'Todos' | LivestockPurpose;
  priceMin: number;
  priceMax: number;
  weightMin: number;
  weightMax: number;
  searchQuery: string;
  sortBy: 'price-asc' | 'price-desc' | 'weight-desc' | 'age-desc';
}
