
import React, { useState } from 'react';
import type { Medicine } from '../types';
import AddMedicineForm from './AddMedicineForm';
import MedicineCard from './MedicineCard';

interface DashboardProps {
  medicines: Medicine[];
  addMedicine: (med: Omit<Medicine, 'id'>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ medicines, addMedicine }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Medication Schedule</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
        >
          {showForm ? 'Cancel' : 'Add New Medicine'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in-down">
          <AddMedicineForm
            onAddMedicine={med => {
              addMedicine(med);
              setShowForm(false);
            }}
          />
        </div>
      )}

      {medicines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map(med => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No medications added yet.</p>
            <p className="mt-2 text-gray-400">Click "Add New Medicine" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
