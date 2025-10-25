
export interface Schedule {
  days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  time: string; // HH:MM format
}

export type FoodInstruction = 'before' | 'after';

export interface Medicine {
  id: string;
  name: string;
  dosage: number;
  foodInstruction: FoodInstruction;
  schedules: Schedule[];
  imageUrl?: string;
  audioUrl?: string;
}

export interface Log {
  id: string;
  medicineId: string;
  timestamp: Date;
  status: 'taken' | 'missed';
}
