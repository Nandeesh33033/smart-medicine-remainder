
import React, { useState } from 'react';
import type { Medicine } from '../types';
import { getMedicineInfo } from '../services/geminiService';

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const [geminiInfo, setGeminiInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAskGemini = async () => {
    setIsLoading(true);
    setGeminiInfo(null);
    const info = await getMedicineInfo(medicine.name);
    setGeminiInfo(info);
    setIsLoading(false);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={medicine.imageUrl || 'https://picsum.photos/200'}
            alt={medicine.name}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{medicine.name}</h3>
            <p className="text-gray-600">{medicine.dosage}mg</p>
            <p className="text-sm text-gray-500 capitalize">Take {medicine.foodInstruction} Food</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-gray-700">Schedule:</h4>
          <ul className="space-y-1">
            {medicine.schedules.map((s, i) => (
              <li key={i} className="text-sm text-gray-600 flex justify-between items-center bg-gray-50 p-2 rounded-md">
                <span>{s.days.join(', ')}</span>
                <span className="font-bold text-blue-600">{s.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <button
            onClick={handleAskGemini}
            disabled={isLoading}
            className="w-full bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Thinking...' : 'Ask Gemini for Info'}
          </button>
          {geminiInfo && (
            <div className="mt-3 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-800 animate-fade-in">
              <p>{geminiInfo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
