export type ThemeMode = 'purple' | 'emerald' | 'beige';

export interface ActiveSalt {
  name: string;
  amount: string;
  percentage: number;
  purpose: string;
  casNumber: string;
}

export interface Medicine {
  id: string;
  name: string;
  brand: string;
  category: 'Prescription (Rx)' | 'Over-The-Counter (OTC)' | 'Biotech Formulations' | 'Nutraceuticals';
  description: string;
  salts: ActiveSalt[];
  dosageForm: 'Capsule' | 'Tablet' | 'Syrup' | 'Injectable' | 'Ointment';
  digitalVerifiedId: string;
  googleIndexed: boolean;
  eCommerceReady: boolean;
  rating: number;
  reviewsCount: number;
  priceEstimate: string;
  availability: 'In Stock' | 'Prescription Required' | 'Limited Batch';
  imageGradient: string;
  molecularFormula: string;
  bioavailability: string;
  halfLife: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Pharmacy R&D' | 'Digital Operations' | 'Medical Advisory' | 'E-Commerce Logistics';
  experience: string;
  bio: string;
  avatar: string;
  credentials: string[];
  email: string;
}

export interface ECommercePayload {
  storeId: string;
  sku: string;
  medicineName: string;
  saltSignature: string;
  quantity: number;
  status: 'PENDING_SYNC' | 'VERIFIED' | 'DISPATCH_READY';
  timestamp: string;
}
