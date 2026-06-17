export interface Equipment {
  id: string;
  name: string;
  status: 'functional' | 'maintenance';
}

export interface Resource {
  id: string;
  name: string;
  type: 'lab' | 'classroom' | 'equipment' | 'parking' | 'room';
  category?: 'lab' | 'room' | 'equipment' | 'parking';
  status: 'available' | 'occupied' | 'maintenance';
  gpuStatus?: 'idle' | 'busy' | 'offline';
  imageUrl?: string;
  capacity: number;
  location?: string;
  zone?: string;
  maxLoad?: number;
  environment?: string;
  description?: string;
  equipment?: Equipment[];
  assets?: string[];
  specification?: string;
  preview?: string;
  recommendationTag?:
    | 'HIGH DEMAND'
    | 'AI OPTIMIZED'
    | 'RESTRICTED'
    | 'LOW USAGE';
  tag?: 'HIGH DEMAND' | 'AI OPTIMIZED' | 'RESTRICTED' | 'LOW USAGE';
}

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'student';
  isLoggedIn: boolean;
}
