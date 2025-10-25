
import React, { useEffect, useRef } from 'react';
import type { Medicine } from '../types';

interface AlarmModalProps {
  medicine: Medicine;
  onAcknowledge: () => void;
  onClose: () => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({ medicine, onAcknowledge, onClose }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
    }
    // Prevent scrolling on the body when the modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleTaken = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onAcknowledge();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto text-center p-8 shadow-2xl animate-fade-in-up">
        <h2 className="text-5xl font-bold text-blue-600 mb-4">{medicine.name}</h2>
        <p className="text-2xl text-gray-700 mb-2">{medicine.dosage}mg</p>
        <p className="text-xl text-yellow-600 bg-yellow-100 rounded-full px-4 py-1 inline-block mb-6 capitalize">
          Take {medicine.foodInstruction} Food
        </p>

        <img
          src={medicine.imageUrl || 'https://picsum.photos/400'}
          alt={medicine.name}
          className="w-48 h-48 rounded-full object-cover mx-auto mb-6 shadow-lg border-4 border-blue-200"
        />

        {medicine.audioUrl && (
          <audio ref={audioRef} src={medicine.audioUrl} loop controls className="hidden">
            Your browser does not support the audio element.
          </audio>
        )}
        
        <button
          onClick={handleTaken}
          className="w-full bg-green-500 text-white text-2xl font-bold py-4 rounded-xl hover:bg-green-600 transition-transform transform hover:scale-105 shadow-lg"
        >
          Taken
        </button>

        <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
            Dismiss
        </button>
      </div>
    </div>
  );
};

export default AlarmModal;
