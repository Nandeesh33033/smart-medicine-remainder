import type { Medicine, Log } from '../types';

// NOTE: This is a mock API. In a real application, you would replace this
// with actual calls to a backend service like Firebase Firestore.

const initialMedicines: Medicine[] = [];

const initialLogs: Log[] = [
    // Mock some logs for the past week
    { id: '101', medicineId: '1', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'taken' },
    { id: '102', medicineId: '2', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'taken' },
    { id: '103', medicineId: '1', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'missed' },
    { id: '104', medicineId: '2', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'taken' },
    { id: '105', medicineId: '1', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: 'taken' },
];

export const getMockMedicines = (): Medicine[] => {
  // In a real app, this would fetch from Firestore
  return initialMedicines;
};

export const getMockLogs = (): Log[] => {
  // In a real app, this would fetch from Firestore
  return initialLogs;
};