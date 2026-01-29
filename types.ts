
export interface Equipment {
  name: string;
  status: 'functional' | 'maintenance';
}

export interface Resource {
  id: string;
  name: string;
  type: 'lab' | 'classroom' | 'equipment' | 'parking';
  status: 'available' | 'occupied' | 'maintenance';
  gpuStatus?: string;
  imageUrl: string;
  capacity: number;
  location?: string;
  description?: string;
  equipment?: Equipment[];
  recommendationTag?: string;
}

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'student';
  isLoggedIn: boolean;
}
