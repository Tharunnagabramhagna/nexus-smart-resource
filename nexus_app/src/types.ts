export interface Equipment {
  id: string;
  name: string;
  status: 'functional' | 'maintenance';
}

export interface Resource {
  id: string;
  name: string;

  type: 'lab' | 'classroom' | 'equipment' | 'parking';

  status: 'available' | 'occupied' | 'maintenance';

  /** Only relevant for compute resources */
  gpuStatus?: 'idle' | 'busy' | 'offline';

  imageUrl: string;
  capacity: number;

  location?: string;
  description?: string;

  /** Sub-equipment for labs / rooms */
  equipment?: Equipment[];

  /** AI / system-generated tag */
  recommendationTag?: 
    | 'HIGH DEMAND'
    | 'AI OPTIMIZED'
    | 'RESTRICTED'
    | 'LOW USAGE';
}

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'student';
  isLoggedIn: boolean;
}